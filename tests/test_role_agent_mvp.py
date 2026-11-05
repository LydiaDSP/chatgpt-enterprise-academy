"""第三批离线自动化MVP回归：不依赖第三方包，不访问网络。"""
import csv
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples" / "role-agent-mvp"
SAMPLES = ROOT / "samples"


def invoke(script, source, dest):
    return subprocess.run(
        [sys.executable, str(EXAMPLES / script), "--input", str(source), "--out-dir", str(dest)],
        text=True, capture_output=True, check=False
    )


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


class OfflineAgentPrototypeTests(unittest.TestCase):
    def test_ie_takt_results_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as temp:
            dest = Path(temp) / "ie"
            source = SAMPLES / "IE_线平衡_模拟.csv"
            first = invoke("ie_cycle_review.py", source, dest)
            self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
            rows = read_csv(dest / "IE_节拍差异_演示.csv")
            self.assertEqual(len(rows), 5)
            pressure = next(x for x in rows if x["工序"] == "压合")
            self.assertEqual(pressure["差值秒每件"], "8")
            self.assertEqual(pressure["相对差异百分比"], "17.8")
            self.assertEqual(pressure["候选复测"], "是（需IE确认）")
            summary = json.loads((dest / "IE_审查摘要_演示.json").read_text("utf-8"))
            self.assertEqual(summary["记录数"], 5)
            second = invoke("ie_cycle_review.py", source, dest)
            self.assertNotEqual(second.returncode, 0, "脚本必须拒绝覆盖同名已存在报告")
            self.assertEqual(read_csv(dest / "IE_节拍差异_演示.csv"), rows)

    def test_ie_bad_input_stops(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            inp = root / "bad.csv"
            inp.write_text("工序,目标节拍秒每件,实测节拍秒每件,样本数,班别\n测试,0,4,10,演示\n", encoding="utf-8")
            cmd = invoke("ie_cycle_review.py", inp, root / "out")
            self.assertNotEqual(cmd.returncode, 0)
            self.assertIn("必须为正数", cmd.stdout)
            self.assertFalse((root / "out" / "IE_节拍差异_演示.csv").exists())

    def test_it_pairing_and_no_fabricated_recovery(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = SAMPLES / "IT_设备在线事件_模拟.csv"
            cmd = invoke("it_offline_events.py", source, root)
            self.assertEqual(cmd.returncode, 0, cmd.stdout + cmd.stderr)
            rows = read_csv(root / "IT_离线事件_演示.csv")
            self.assertEqual(len(rows), 3)
            by_id = {row["设备编号"]: row for row in rows}
            self.assertEqual(by_id["DEMO-01"]["持续分钟"], "12")
            self.assertEqual(by_id["DEMO-02"]["持续分钟"], "22")
            self.assertEqual(by_id["DEMO-03"]["恢复时间"], "")
            self.assertEqual(by_id["DEMO-03"]["持续分钟"], "")
            self.assertIn("未恢复", by_id["DEMO-03"]["状态"])
            summary = json.loads((root / "IT_审查摘要_演示.json").read_text("utf-8"))
            self.assertEqual(summary["无恢复事件数"], 1)
            again = invoke("it_offline_events.py", source, root)
            self.assertNotEqual(again.returncode, 0, "脚本必须拒绝覆盖旧报告")

    def test_it_bad_status_stops_and_no_false_event(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            inp = root / "invalid.csv"
            inp.write_text("设备编号,事件时间,状态,采集方式,备注\nDEMO,2026-11-02 08:00,不确定,模拟,待查\n", encoding="utf-8")
            result = invoke("it_offline_events.py", inp, root / "report")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("状态无效", result.stdout)
            self.assertFalse((root / "report" / "IT_离线事件_演示.csv").exists())


if __name__ == "__main__":
    unittest.main()
