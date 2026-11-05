#!/usr/bin/env python3
"""培训专用：用本地只读CSV配对设备离线/恢复事件，不进行远控、重启或告警发送。"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

REQUIRED = ("设备编号", "事件时间", "状态", "采集方式", "备注")
OUTPUT = "IT_离线事件_演示.csv"
SUMMARY = "IT_审查摘要_演示.json"


def spreadsheet_safe(value: object) -> str:
    text = str(value)
    return "'" + text if text.lstrip().startswith(("=", "+", "-", "@")) else text


def evaluate(source: Path):
    if not source.is_file():
        raise ValueError(f"找不到输入文件：{source}")
    by_device = defaultdict(list)
    issues = []
    duplicate_events = set()
    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames or any(field not in reader.fieldnames for field in REQUIRED):
            raise ValueError("CSV缺少必要列：" + ",".join(REQUIRED))
        if len(set(reader.fieldnames)) != len(reader.fieldnames):
            raise ValueError("CSV表头有重复字段")
        for line, row in enumerate(reader, start=2):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"第{line}行字段数量不匹配")
            device = row["设备编号"].strip()
            status = row["状态"].strip()
            if not device or status not in ("在线", "离线"):
                raise ValueError(f"第{line}行设备ID或状态无效")
            try:
                event_time = datetime.strptime(row["事件时间"].strip(), "%Y-%m-%d %H:%M")
            except ValueError:
                raise ValueError(f"第{line}行事件时间无效（格式YYYY-MM-DD HH:MM）") from None
            key = (device, event_time, status)
            if key in duplicate_events:
                issues.append(f"第{line}行重复事件：{device} {event_time} {status}")
                continue
            duplicate_events.add(key)
            by_device[device].append((event_time, status, line))
    if not by_device:
        raise ValueError("CSV没有有效事件")
    incidents = []
    for device, events in by_device.items():
        events.sort(key=lambda x: (x[0], x[2]))
        start = None
        for event_time, status, line in events:
            if status == "离线":
                if start is None:
                    start = (event_time, line)
                else:
                    issues.append(f"第{line}行重复离线状态：{device}，当前事件待人工复核")
                continue
            if start is not None:
                began, origin_line = start
                minutes = int((event_time - began).total_seconds() / 60)
                if minutes < 0:
                    issues.append(f"第{line}行恢复时刻早于离线：{device}")
                    continue
                incidents.append({
                    "设备编号": device,
                    "离线开始": began.strftime("%Y-%m-%d %H:%M"),
                    "恢复时间": event_time.strftime("%Y-%m-%d %H:%M"),
                    "持续分钟": str(minutes),
                    "状态": "已恢复（待人工核实）",
                    "离线源行号": str(origin_line),
                })
                start = None
        if start is not None:
            began, origin_line = start
            incidents.append({
                "设备编号": device,
                "离线开始": began.strftime("%Y-%m-%d %H:%M"),
                "恢复时间": "",
                "持续分钟": "",
                "状态": "未恢复/未知（需核对数据完整性）",
                "离线源行号": str(origin_line),
            })
    incidents.sort(key=lambda x: (x["离线开始"], x["设备编号"]))
    summary = {
        "说明": "模拟状态日志，仅用于教学；未恢复可能是数据截止，不能断定设备当前离线",
        "输入文件": source.name,
        "输入SHA256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "设备数": len(by_device),
        "已配对离线事件数": sum("已恢复" in x["状态"] for x in incidents),
        "无恢复事件数": sum("未恢复" in x["状态"] for x in incidents),
        "需人工核查的数据异常": issues,
        "后续动作": "由IT确认日志完整性及计划检修记录；本脚本不创建工单、不发送通知、不执行设备修改",
    }
    return incidents, summary


def run(input_path: Path, out_dir: Path):
    rows, summary = evaluate(input_path)
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path, json_path = out_dir / OUTPUT, out_dir / SUMMARY
    if csv_path.exists() or json_path.exists():
        raise FileExistsError("目标报告已经存在，不覆盖；请为新批次使用新目录")
    columns = ("设备编号", "离线开始", "恢复时间", "持续分钟", "状态", "离线源行号")
    with csv_path.open("x", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: spreadsheet_safe(row[key]) for key in columns})
    with json_path.open("x", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    return csv_path, json_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="本地模拟设备在线事件CSV")
    parser.add_argument("--out-dir", type=Path, required=True, help="新输出目录")
    args = parser.parse_args()
    try:
        paths = run(args.input, args.out_dir)
        print("成功生成：", *(str(x) for x in paths), sep="\n  ")
        return 0
    except (ValueError, FileExistsError, OSError) as exc:
        print(f"执行已安全停止：{exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
