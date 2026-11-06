# Codex AI Coding 示范｜扩展版课堂验收说明

更新日期：2026-11-06  
分支：`feat/expand-codex-ai-coding`

## 1. 教学目标

Codex 不仅是代码补全工具，而是可以围绕项目目录执行代码理解、方案规划、代码编写、运行测试、问题修复和项目维护的 AI Coding Agent。

学员完成本模块后应能够：
- 识别 Codex 的常见任务类型，不把它局限为“写几行代码”。
- 用业务语言描述需求、输入输出、业务规则和验收标准。
- 理解 AI 辅助开发的基本生命周期，并在关键节点做人工确认。
- 了解 Superpowers 与 GStack 等辅助项目的定位、使用方式和成熟度差异。
- 通过采购订单CSV案例，观察需求拆解、开发、测试与交付的完整过程。

## 2. 新增教学内容

### 2.1 Codex 八类任务地图

页面以可点击任务卡片展示8类任务，每类都必须包含场景说明、典型业务任务、交付成果和可复制的起步指令：

1. Python 数据分析：清洗、统计、可视化、分析报告。
2. 开发办公小工具：批量重命名、文件归档、格式处理、CSV/PDF处理。
3. 开发网页应用：业务表单、查询、筛选、导出等交互功能。
4. 开发业务工作台：多个业务模块、看板、状态流转和统一入口。
5. 重构现有系统：代码理解、模块拆分、技术债治理和回归测试。
6. 调试与自动化测试：复现Bug、定位根因、修复与测试。
7. 开发流程自动化：授权数据读取、API调用、日志、失败重试与人工审批。
8. 开发AI Agent或工具接口：知识检索、工具定义、权限控制和可追溯日志。

### 2.2 非开发人员入门方法

- 展示AI辅助开发七步法：说清问题 → 定义需求 → 制定计划 → 分步开发 → 测试验证 → 审查优化 → 交付维护。
- 每一步明确学员需要提供或确认什么，强调业务人员负责业务口径和验收。
- 提供一段可复制的通用开发搭档指令，要求AI先澄清、先阅读和规划，得到确认后再修改文件。
- 明确不覆盖原文件、不上传真实敏感数据、不连接生产系统、不擅自部署等边界。

### 2.3 辅助项目

**Superpowers**
- 介绍其定位：为Coding Agent提供软件开发方法论与技能。
- 说明Brainstorming、Writing Plans、TDD、Review和Verification等关键流程。
- 提供Codex App和Codex CLI的官方安装路径。
- 定位为优先了解的辅助项目，但不宣称它可以替代人工确认。

**GStack**
- 介绍其定位：以产品/CEO、工程、设计、Review、QA和发布等专业角色视角辅助开发。
- 提供Codex CLI安装示例和体验入口。
- 明确当前Codex CLI适配为实验性支持，安装涉及Git、Bun等环境依赖；不作为所有初学者的必装工具。
- 明确部分安全约束在Codex环境中是提示性而非强制性，不建议直接用于生产项目。

### 2.4 Chat / Work / Codex 选型

- Chat：讨论、解释、一次性分析和代码片段。
- Work：跨文件、网页和应用的多步骤工作执行与交付。
- Codex：围绕项目目录和代码库开发、运行、测试、修复和重构。
- 说明三者有能力交集，具体可用能力受账号、工作区和权限配置影响。

## 3. 原有实验保留

不得删除或破坏原有采购订单CSV本地演示：
- 五阶段Codex开发教学脚本和复制按钮。
- 三份模拟订单CSV、挑战数据与本地文件读取。
- 标准数据9行、2行异常；挑战数据4行、3行异常。
- 原有6项真实执行测试、结果预览和CSV下载。
- 安全提示、讲师彩排说明和返回课程链接。

## 4. 自动化验收

运行：

```bash
node tests/labs-smoke.mjs
```

Codex新增验收至少包括：
- 任务卡片渲染8张。
- 点击“业务工作台”卡片，详情和起步指令同步切换。
- 选中状态正确反映在`aria-pressed`。
- 通用开发指令可见。
- Superpowers与GStack官方仓库链接存在。
- 原有五阶段、标准样例、挑战样例、6项测试继续通过。
- JSDOM无未捕获的页面脚本错误。

## 5. 课堂使用建议

建议20–25分钟：
- 4分钟：Codex八类任务地图，展示不止写代码。
- 5分钟：七步开发法与通用开发指令。
- 4分钟：Superpowers和GStack的定位、区别与使用门槛。
- 2分钟：Chat / Work / Codex任务选型。
- 5–10分钟：采购订单CSV案例，展示真实开发过程和测试。

## 6. 官方参考

- [OpenAI Academy：Codex](https://openai.com/academy/codex/)
- [OpenAI：How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)
- [Superpowers GitHub](https://github.com/obra/superpowers)
- [GStack GitHub](https://github.com/garrytan/gstack)

> 本模块的目标是让普通业务人员学会提出可验收的开发任务，并借助AI完成小步迭代；不是要求所有学员成为专业软件工程师。


## 7. pstack 辅助项目补充（2026-11-06）

在“Superpowers / pstack / GStack”辅助项目区新增 pstack 卡片：
- 说明 Lauren Tan（@poteto）创建的原版 pstack 位于 Cursor 官方插件仓库。
- 介绍 poteto-mode 任务路由、工程原则、Playbooks、Skills、Agent协作和验证能力。
- 提供 Codex 社区移植版 `michael-denyer/pstack-claude` 的仓库链接和官方 README 中的 Codex 安装命令。
- 明确社区移植版不是 OpenAI 或 Lauren 发布的官方 Codex 插件；提醒检查插件权限、Hook 和文件访问范围。
- 对比表更新为三个项目，并在桌面端采用三列布局，窄屏自动降列。

新增浏览器验收：
- Lauren 原版仓库链接存在。
- Codex 社区移植版链接存在。
- Codex marketplace / plugin add 命令存在。
- 页面明确区分原版 pstack 与社区移植版。
