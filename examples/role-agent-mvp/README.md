# IE / IT 自动化原型：从可复制Chat任务到可运行的本地工作流

> **只用于培训。** 本目录包含两个离线、只读的Python入门原型：不访问互联网，不调用ChatGPT API，不接入 WinCC、MES、网关、PLC 或ERP，不发送工单/消息，也不会变更设备配置。输入的CSV全部是仓库中的虚构数据。

这些脚本用于理解“Agent流程自动化”的**最小确定性执行层**。它们还不是完整的企业Agent；只有在完成访问审批、接口验证、人工复核、稳定运行与日志审计之后，才能考虑接入经批准的系统或AI模型。

## 原型1：IE标准工时/节拍差异

数据：`samples/IE_线平衡_模拟.csv`

执行动作：只读CSV → 必需列/正数检查 → 计算“实测−目标”与“(实测−目标)/目标” → 标记候选复测 → 导出差异表和审核摘要。

### 运行（Windows PowerShell，需Python 3）

在仓库根目录执行：

```powershell
py -3 examples/role-agent-mvp/ie_cycle_review.py --input samples/IE_线平衡_模拟.csv --out-dir output/ie-demo-01
```

macOS/Linux也可使用：

```bash
python3 examples/role-agent-mvp/ie_cycle_review.py --input samples/IE_线平衡_模拟.csv --out-dir output/ie-demo-01
```

输出：
- `output/ie-demo-01/IE_节拍差异_演示.csv`
- `output/ie-demo-01/IE_审查摘要_演示.json`

模拟数据中“压合”的目标45秒/件、实测53秒/件，结果应为 **+8秒/件、+17.8%**。这个数据只代表测量差异，不证明工艺根因或产能瓶颈。

## 原型2：IT在线/离线事件配对

数据：`samples/IT_设备在线事件_模拟.csv`

执行动作：只读CSV → 验证字段与时间 → 按设备和时间配对离线/恢复事件 → 标记尚无恢复事件 → 导出事件表和审查摘要。**未出现恢复记录不代表当前设备一定离线**，还可能是数据窗口没有覆盖恢复时间。

### 运行（Windows PowerShell）

```powershell
py -3 examples/role-agent-mvp/it_offline_events.py --input samples/IT_设备在线事件_模拟.csv --out-dir output/it-demo-01
```

macOS/Linux：

```bash
python3 examples/role-agent-mvp/it_offline_events.py --input samples/IT_设备在线事件_模拟.csv --out-dir output/it-demo-01
```

输出：
- `output/it-demo-01/IT_离线事件_演示.csv`
- `output/it-demo-01/IT_审查摘要_演示.json`

预期结果：DEMO-01已完成离线12分钟、DEMO-02已完成离线22分钟、DEMO-03没有匹配的恢复记录（持续时长留空、待人工核实）。

## 如何从离线脚本变成真正可落地的Agent？

| 阶段 | 要做什么 | 最小验收证据 |
| --- | --- | --- |
| ① 人工启动 | 工程师上传批准的CSV并执行脚本 | 与原始Excel/日志的计算对账 |
| ② 定时运行 | IT批准任务运行账号和只读文件夹；使用Windows任务计划程序或受控调度器运行 | 有批次ID、运行时间、成功/失败日志；错误能提醒人 |
| ③ 数据接入 | 经权限审查后，用已批准的只读接口代替手工CSV | 接口版本、权限、刷新延迟与字段映射已验证 |
| ④ 智能解释 | 将规则计算后的**脱敏摘要**交给AI，生成复测问题/排查工单草稿 | 不改变已计算的数值，关键结论有来源 |
| ⑤ 审批与交付 | 人工核对并批准后，才允许创建正式工单或分发报告 | 有审批记录、处理责任人、失败回退和复盘 |
| ⑥ 闭环优化 | 记录误报、漏报、复测结果和数据缺口 | 可按版本重新运行，关键指标有基准值 |

**触发器和阈值要按试点确定**，不能把教学设定直接用于真实现场。特别是IT设备巡检：事件去重/时序配对可以由规则脚本执行，故障根因判断仍需结合网络、网关、设备历史和IT人员确认，不能让模型直接控制设备。

### 定时运行时的注意

- 先用手动任务验证数据路径和运行账号的只读权限，再申请自动调度。
- 每次使用新的输出目录或批次ID。脚本遇到同名报告将停止而不是覆盖。
- 成功不代表可以自动向外部发送；需要另行接入经过批准的通知和审批流程。
- 失败、字段缺失、设备来源不明确时必须停止，不能生成看似完整的生产结论。
- 若需要AI解释，**先明确企业已批准的模型、数据脱敏和权限机制**。

## 测试

无需第三方Python库。在仓库根目录运行：

```bash
python3 -m unittest discover -s tests -p "test_role_agent_mvp.py" -v
```

测试覆盖两个示例的计算结果、错误数据拒绝处理和旧报告不被覆盖。主站还有 `tests/phase3-smoke.mjs` 检查IE/IT页面的12套自动化蓝图是否完整。

## 范围限制

本演示不具备完整企业Agent的登录/鉴权、API连接、审批系统集成、工单持久化、监控告警、运行服务和安全评估。不得将原型部署到生产工控机或将示例中任何参数用于控制设备。
