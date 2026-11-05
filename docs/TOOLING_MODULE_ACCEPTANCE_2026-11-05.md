# Skill / MCP / Plugin / CLI 教学模块扩展：修订验收说明

更新日期：2026-11-06  
分支：`feat/enrich-skills-mcp-plugin-training`  
目标 PR：#11

## 0. 最新迭代：What / Why / How to Use / How to Build（2026-11-06）

在章节最前面将四张基础卡升级为“是什么、为什么、怎么用、如何开发”四问教学。针对普通学员突出使用，针对 AI 先锋/IT 增加开发入口；保持“先理解 → 再看公开推荐 → 最后认识企业自建”的教学顺序。

| 对象 | How to Use（使用现成能力） | How to Build（自主开发） |
| --- | --- | --- |
| Skill | Plugins → Skills → 安装或使用共享 Skill → 运行示例任务 | 选任务和规则 → 使用 Skill Creator 或编写 `SKILL.md` → 测试与共享 |
| MCP | 找到兼容的 MCP 客户端 → 配置现成 Server → 授权并测试 | 用官方 Python/TypeScript SDK 注册工具 → 测试权限、参数与异常 → 部署 |
| Plugin / App | Plugins 搜索 → 查看权限 → 安装连接 → 调用 | 用 Plugin Creator 组合 Skill 和 App → 测试 → 经批准共享 |
| CLI | 安装 CLI → 在终端进入练习目录 → 运行命令并检查结果 | 需要时才编写自定义 CLI，如 Python argparse / Node 命令程序 → 测试分发 |

每张卡保留 What / Why、提供两组独立的 How 步骤及简短应用例子。这里的示例不是新增“公开 Skill 推荐”，内部 SOP/质量/MES 等自建需求仍与 16 项可获得的公开工具推荐严格分开。

**本次验收项**：4 个概念、各有 What / Why / How to Use / How to Build / 体验示例；原 16 项公开目录不变；原 SOP 实验室及课程结构不变；移动端和投影模式无重大排版问题。

## 1. 关键纠正（修订版）

公开推荐目录 **只允许纳入确实已公开发布、拥有官方页面或仓库、可以根据官方说明安装或运行的现成工具**。不将“公司内部可考虑开发的功能”伪装成公开产品。

- **公开推荐目录**：6 款可在 ChatGPT 插件目录中查找的具体 App/插件；6 个现成 Skill；4 个可部署的 MCP Server；总数 **16 项**。
- **企业内部自建方向**：SOP 审查、MES 日报、8D/CAPA、3Q、供应链交期、培训及公司系统集成等仍可做业务举例，但明确放到推荐目录外，标注“非现成推荐，需要本企业开发与验收”。
- 原先误放入公开推荐的“MES 日报分析 Skill”“8D / CAPA 审查 Skill”“3Q 验证 Skill”“MES/QMS/ERP 只读 MCP”等自建方向已删除或移出推荐。
- 原先“企业文档 / 知识库连接”是泛化能力，不是具体产品，已改为真实存在的 **SharePoint** 插件。

## 2. 公开资源分类与真实使用平台

| 类型 | 数量 | 明确推荐 |
| --- | ---: | --- |
| ChatGPT Plugins / Apps | 6 | Google Drive、GitHub、Canva、Gmail、Google Calendar、SharePoint |
| 公开 Skill | 6 | ChatGPT Skill Creator、Anthropic PDF、DOCX、XLSX、PPTX、Webapp Testing |
| 公开 MCP Server | 4 | GitHub MCP Server、Filesystem MCP、Playwright MCP、Context7 MCP |

**重要：不同工具对应不同平台，不能互相冒充。**

- ChatGPT 插件：在 `Plugins` 目录按名称检索。是否能安装、连接和调用，受所在工作区、账号、权限以及服务提供商政策约束。
- ChatGPT Skill Creator：对符合条件的工作区，官方 Skills 文档说明可从 `Plugins → Skills` 查找或使用默认的 Skill Creator。
- Anthropic Skills：来自 [anthropics/skills](https://github.com/anthropics/skills)，可在受支持的 Claude / Claude Code 环境中直接使用；Claude Code 可通过公开插件市场安装 `document-skills` 或 `example-skills`。**不是 ChatGPT 内置插件**，迁移使用需要环境兼容性检查；部分文档 Skill 是源码可见、非开源授权。
- MCP Server：公开提供安装或连接方式，但必须具备兼容客户端及相应运行环境。支持 MCP 不意味着一定能在当前 ChatGPT 网页端一键部署。

## 3. 企业内部项目的正确定位

以下仅作为“业务需求 → 可选技术实现”示例，**不是现成资源推荐**：

| 业务需求 | 企业内部可能建设的能力 | 起点 |
| --- | --- | --- |
| SOP 版本差异审查 | 内部质量文档 Skill | 受控比对规则和脱敏样本 |
| MES 日报与 QCD 指标 | 内部数据分析 Skill | 统一指标口径与数据校验 |
| 8D / CAPA 审查 | 内部质量体系 Skill | 质量流程、证据和审批规则 |
| 3Q 验证材料核查 | 内部 IQ/OQ/PQ Skill | 受控验证方案与验收条件 |
| 供应链交期跟踪 | 内部风险分类 Skill + 获批准的外部连接 | 授权数据源、订单识别与复核 |
| HR 培训流程 | 内部培训内容 Skill | 企业政策与发布审批 |

需要读取企业真实系统时，再由 IT 评估 API / 自建 MCP；涉及多人分发时，经工作区批准可进一步封装内部插件。

## 4. 教学演示建议

本次修订不增加现场授课总时长，约 12 分钟：

1. 3 分钟：直观理解 Skill、MCP、Plugin、CLI 与任务选型。
2. 5 分钟：保留本站虚构 SOP 差异审查 Skill 实验室，作为**教学样例**，并不放入公开推荐目录。
3. 2 分钟：展开 Google Drive（ChatGPT 插件）、PDF Skill（Claude 平台）、Playwright MCP（MCP 客户端）三张公开资源卡，强调不同平台与安装方法。
4. 2 分钟：介绍自建场景与权限边界，不在课堂连接生产系统。

## 5. 验收要求

`tests/verify.mjs` 已更新为：

- 公开推荐卡 **16** 张，分布为 3 组；
- 全部公开推荐卡具备适用平台、实际使用路径和外部链接；
- 检查 MES 日报 Skill、CAPA 审查 Skill、3Q 验证 Skill、自建 MES MCP、泛化企业连接不再混入推荐目录；
- 原有 SOP 实验室、6 部门内部场景、120 分钟课程结构、关联文件链接不丢失；
- 仍需在浏览器与投影现场进行视觉与点击验收。

## 6. 主要来源

- [ChatGPT Skills 官方说明](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)
- [ChatGPT Plugins 官方说明](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- [ChatGPT 插件目录](https://chatgpt.com/plugins)
- [Anthropic Skills 公开仓库及使用路径](https://github.com/anthropics/skills)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Filesystem MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Context7 MCP](https://github.com/upstash/context7)

> 选型原则：**公开推荐只列真实可获取的工具；企业场景归入内部自建需求。** 二者不能混在同一个“推荐插件/Skill/MCP”清单中。

### 使用和开发的权威参考

- [OpenAI Skills：创建、安装与共享](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)
- [OpenAI Plugins：Plugin Creator 创建与组合](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- [MCP 官方教程：Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server)
