#!/usr/bin/env python3
"""培训专用：从本地只读IE节拍CSV生成差异表。无网络、无MES、无设备写入。"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path

HEADERS = ("工序", "目标节拍秒每件", "实测节拍秒每件", "样本数", "班别")
OUTPUT = "IE_节拍差异_演示.csv"
SUMMARY = "IE_审查摘要_演示.json"


def positive(value: str, label: str, line: int) -> Decimal:
    try:
        result = Decimal(value.strip())
    except (InvalidOperation, AttributeError):
        raise ValueError(f"第{line}行{label}不是有效数字") from None
    if not result.is_finite() or result <= 0:
        raise ValueError(f"第{line}行{label}必须为正数")
    return result


def spreadsheet_safe(value: object) -> str:
    """避免在Excel打开导出CSV时将不可信文本解释为公式。"""
    text = str(value)
    return "'" + text if text.lstrip().startswith(("=", "+", "-", "@")) else text


def evaluate(source: Path):
    if not source.is_file():
        raise ValueError(f"找不到输入文件：{source}")
    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames or any(field not in reader.fieldnames for field in HEADERS):
            raise ValueError("CSV缺少必需列：" + ",".join(HEADERS))
        if len(set(reader.fieldnames)) != len(reader.fieldnames):
            raise ValueError("CSV表头有重复字段")
        result = []
        for line, row in enumerate(reader, start=2):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"第{line}行的列数与表头不一致")
            if not row["工序"].strip() or not row["班别"].strip():
                raise ValueError(f"第{line}行工序或班别为空")
            target = positive(row["目标节拍秒每件"], "目标节拍", line)
            actual = positive(row["实测节拍秒每件"], "实测节拍", line)
            count = positive(row["样本数"], "样本数", line)
            if count != count.to_integral_value():
                raise ValueError(f"第{line}行样本数必须为整数")
            delta = actual - target
            percent = (delta / target * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
            result.append({
                **{key: row[key].strip() for key in HEADERS},
                "差值秒每件": str(delta),
                "相对差异百分比": str(percent),
                "候选复测": "是（需IE确认）" if delta > 0 else "否",
                "源文件行号": str(line),
            })
    if not result:
        raise ValueError("CSV没有有效数据行")
    payload = {
        "说明": "模拟节拍差异审查，不是已确认的工艺瓶颈或员工绩效评价",
        "输入文件": source.name,
        "输入SHA256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "记录数": len(result),
        "实测大于目标的候选复测记录数": sum(r["候选复测"].startswith("是") for r in result),
        "下一步": "由IE抽样复算和复测；不得自动调整标准工时或生产参数",
    }
    return result, payload


def run(input_path: Path, out_dir: Path) -> tuple[Path, Path]:
    rows, summary = evaluate(input_path)
    out_dir.mkdir(parents=True, exist_ok=True)
    report_path, summary_path = out_dir / OUTPUT, out_dir / SUMMARY
    if report_path.exists() or summary_path.exists():
        raise FileExistsError("输出已存在，避免覆盖：请先使用新的输出目录")
    fields = list(HEADERS) + ["差值秒每件", "相对差异百分比", "候选复测", "源文件行号"]
    with report_path.open("x", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: spreadsheet_safe(row[k]) for k in fields})
    with summary_path.open("x", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    return report_path, summary_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="只读模拟时测CSV")
    parser.add_argument("--out-dir", required=True, type=Path, help="全新输出目录，已有报告不覆盖")
    args = parser.parse_args()
    try:
        paths = run(args.input, args.out_dir)
        print("成功生成：", *(str(path) for path in paths), sep="\n  ")
        return 0
    except (ValueError, FileExistsError, OSError) as exc:
        print(f"执行已安全停止：{exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
