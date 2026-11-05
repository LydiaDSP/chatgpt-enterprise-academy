# ChatGPT Enterprise Academy · 企业AI实战学习平台

一套面向制造业多部门（FIN、RD、QA、SCM、MFG、HR）的**静态互动教学网站**。提供120分钟讲师培训路径与长期自学内容。第一版设计为无需依赖后端即可打开，不会自行连接ChatGPT、ERP、MES或其他企业系统。

## 快速使用

1. 解压整个站点文件夹，双击 `index.html` 可查看课程主体。
2. 通过左侧导航进入Prompt Lab、文件与数据分析、Skill/MCP/Plugin、Work、Codex、AI技巧或业务场景指南。
3. 右上角可切换**讲师模式**（额外显示授课提示）和自学模式；顶部提供“上一章/下一章”和“投影大字”按钮。讲师模式支持 `Shift + PageUp` / `Shift + PageDown` 切换章节（避开浏览器默认返回快捷键）。
4. 可复制Prompt、下载 `samples` 里的模拟CSV文件。在Codex部分可点击“载入内置模拟订单”并运行真正的浏览器本地CSV合并/检查工具。
5. “完成本章”和“课前检查”会使用当前浏览器的`localStorage`保存，不跨设备同步，不作为后台学员记录。

## V1.1 第一批开发（验收分支，尚未合并到main）

本批为课堂使用体验与基础功能修复，不改变原来的10章内容：
- 顶部新增上一章、下一章控制；首末章节自动禁用相应按钮。
- 新增投影大字模式，扩大正文、提示、表格与交互区文字；选择在当前浏览器中保存。
- 避免讲师快捷键与浏览器前进/后退冲突，改为 Shift + PageUp/PageDown，并阻止默认滚动。
- 支持通过 `#dept-QA` 等部门锚点直达章节，以及 `#case-01` 直达并展开具体场景。
- 将 HTML 内嵌的30条案例与 `scenario_data.json` 备份逐项统一。
- 新增 `tests/verify.mjs`（无需依赖的静态测试）和 `tests/browser-smoke.mjs`（浏览器DOM交互模拟测试）。
- 详细验收步骤见 `tests/V1.1-ACCEPTANCE.md`；在 GitHub Pull Request 看到绿色检查后仍需进行投影/移动端人工复验。

开发分支不影响 main 的1.0版本，先完成验收后再考虑合并。

## 已实现的核心功能

- **10个课程章节**：桌面端/企业版、Prompt Lab、文件与数据、Skill/MCP/Plugin、Work/Computer Use、Codex AI Coding、AI使用小技巧、部门未来场景、学习资源。
- **120分钟授课路线**：可从主页直接跳转课堂章节。
- **Prompt Lab 2.0（M1 / M2 已合并）**：六节互动课，涵盖新手与高手、模型知识/联网搜索/Deep Research、上下文管理、三轮头脑风暴、避免迎合与Rubric客观评价、渐进式写作；支持讲师提示、课堂互动和本地学习进度。原有三种业务Prompt练习仍保留在可展开区。所有演示为本地模拟，不代表AI实时运行结果。
- **文件分析**：内置MES模拟日报数据，可本地计算产量、达成率、直通率和异常分布；提供CSV和真实ChatGPT课堂分析Prompt。
- **Codex Lab**：提供3份模拟采购订单CSV、Codex自然语言开发Prompt和可运行的CSV合并工具。检查“订单号+料号”重复、缺失交期、非数字数量等，下载结果和异常清单。此工具**是网站内的JavaScript程序**，不代表网页直接调用或控制Codex。
- **AI效率技巧**：15张卡片，包含场景、可复制指令与注意事项。
- **30个未来业务场景**：与上传的《部門AIAgent适用場景盤點表.xlsx》一一对应，按原表顺序和优先级组织为6个部门章节。每个场景均提供“现在用Chat怎么做”和“未来Agent如何升级”，以及验证与权限说明。
- **官方资源**：链接OpenAI、DeepLearning.AI、GitHub官方资料。

## Prompt Lab 2.0 教学预览与验收

正式网站访问 `index.html#prompt` 可查看 M1 + M2 共六节教学单元；另提供单文件 `preview-prompt-m2.html` 供离线讲师预览。模块配有 `PROMPT_M1_ACCEPTANCE.md` 与 `PROMPT_M2_ACCEPTANCE.md` 两份验收清单。教学实验只在网页本地生成或切换示例指令，复制后需在企业允许的 ChatGPT 中实测；并未调用真实 AI API、Deep Research 或生产数据系统。单文件预览不包含 `samples/` 下载素材。

## 上传/发布到 GitHub Pages

1. 新建一个GitHub仓库（例如`chatgpt-enterprise-academy`）。
2. 将`index.html`及`samples/`整个目录上传到仓库根目录。
3. `Settings → Pages → Build and deployment → Deploy from a branch`，选择`main`及`/(root)`，保存。
4. 网站部署后检查相对路径CSV下载、手机访问和所有导航。正式发布之前完成信息安全审查。

参考：[GitHub官方Pages文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

> **安全重点：** GitHub Pages通常是公开访问的网站，不是企业内网权限平台。这份培训网站保留了部门未来场景的标题和通用教学改写，因此即便未包含原Excel或真实人员/生产数据，也必须先经企业审查，确认这些场景名称与内部规划允许公开。不要上传原始盘点附件、内部链接、员工信息、客户/供应商敏感数据或真实MES/HR数据。

## V1.1 第二批｜专项教学实验室（独立开发分支）

为了与并行进行的 Prompt Lab 开发互不干扰，本次**没有修改 Prompt Lab 的HTML内容和脚本**。仅在主课程的以下章节增加专题入口，专题本身独立放在 `labs/`：

| 入口章节 | 新页面 | 能做什么 |
| --- | --- | --- |
| 文件与数据 | `labs/research.html` | Deep Research任务单编辑、4步研究计划、3项模拟证据判断、5项报告验收 |
| Skill/MCP/Plugin | `labs/skill.html` | 完整 `SKILL.md` 与输出规范、虚构SOP对比、5项变化实操 |
| Codex | `labs/codex.html` | 5轮Codex指令、带异常的CSV批处理、6项真实执行测试 |

公共样式位于 `labs/lab.css`，各页的业务逻辑分别位于 `labs/research.js`、`labs/skill.js`、`labs/codex.js`。所有功能默认在本机浏览器执行，不能将其误称为已接入Deep Research/Codex模型或企业数据库。

Skill学习素材在 `skills/sop-change-review/`，并配有 `samples/SOP_演示_旧版.md` 和 `samples/SOP_演示_新版.md`。

验收入口：`tests/V1.1-PHASE2-ACCEPTANCE.md`；Codex彩排：`tests/CODEX-LAB-ACCEPTANCE.md`；CI校验：`node tests/labs-smoke.mjs`（需先安装jsdom@26）。

本批不修改原120分钟课程时长；Deep Research完整执行、Skill安装和Codex实际开发需使用企业批准的账号与环境。

## V1.1 第三批｜Work / Computer Use 与 IE / IT岗位扩展（独立验收分支）

在主课程的“Work”和“业务场景指南”章节分别增加两个实验室入口：

| 页面 | 互动内容 | 范围说明 |
| --- | --- | --- |
| `labs/work.html` | 三个模拟任务的执行流程；四道权限判定；模拟人工审批状态与事件日志；交付自查 | 不调用真实Work、浏览器或电脑操作能力 |
| `labs/roles.html` | IE 6个案例、IT 6个案例；每个案例区分「阶段一：Chat人工协作」「阶段二：Agent流程自动化」，提供可复制Chat指令、6步自动化实施蓝图和个人练习清单 | 新增12案不是原Excel需求、也非已部署的Agent |

配套文件：
- `labs/work.js`, `labs/roles.js`, `labs/roles-blueprints.js`（12案独立实施方案）
- `examples/role-agent-mvp/`（IE、IT两套可运行、只读的Python示例及操作教程）
- `samples/IE_线平衡_模拟.csv`、`samples/IT_设备在线事件_模拟.csv`：均为虚构数据
- `tests/phase3-smoke.mjs`：场景、权限、审批和回归验证
- `tests/V1.1-PHASE3-ACCEPTANCE.md`：人工验收单
- `tests/WORK-LAB-INSTRUCTOR.md`：讲师现场演示流程与安全边界

第三批按反馈完善：IE/IT独立双阶段展示；Agent新增具体触发条件、字段、六步执行过程、脚本/接口路线、审批、异常处理和试点验收；完整回归测试见 `tests/phase3-smoke.mjs`。

本批不重写原始30条需求，也不触碰另一个窗口维护的 Prompt Lab 章节或 Prompt任务数据。第三批未验收前不合并到 `main`。

## 限制与后续可扩展范围

- 网页**没有AI API密钥或后端**。所谓“Agent步骤演练”只是可点击的静态教学流程；如需网页内直接执行模型任务，需另建经企业审批的API服务与登录鉴权。
- 浏览器中的CSV小工具只处理具有相同列结构的CSV，不支持直接读取 `.xlsx`；可先在Excel导出CSV。真实使用中还应增强字段校验、异常格式处理、测试覆盖、备份和操作日志。
- 企业端Skill/Plugin/Browser Use/Computer Use的可用性取决于组织管理员配置。正式授课应使用已获许可的测试环境。
- 讲师模式尚未接入投影遥控、视频素材或统一学员进度后台。这些可以在后续版本迭代。
- 对业务场景的实现路径属于**教学推演**，不是企业系统已完成部署或已验证接口的声明。

## 来源与内容维护

- 业务场景标题和优先级来自用户提供的Excel盘点表；本站没有收录原工作表的具体内部痛点叙述或源资料文件。
- Chat / Work / Codex：[OpenAI官方说明](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)
- Skills：[OpenAI帮助文档](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)
- Plugins：[OpenAI帮助文档](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- Browser / Computer Use：[企业管理说明](https://help.openai.com/en/articles/20001510-manage-browser-and-computer-use-in-your-enterprise-workspace)
- Prompt课程：[AI Prompting for Everyone](https://www.deeplearning.ai/courses/ai-prompting-for-everyone)
- 内容核对时间：2026年11月5日。

## 目录结构

```text
chatgpt-enterprise-academy/
├── index.html                  # 网站主体（HTML/CSS/JS）
├── README.md                   # 部署与使用说明
├── scenario_data.json          # 30个场景的教学数据备份（不需要在浏览器中加载）
└── samples/
    ├── MES_生产日报_模拟.csv
    ├── 采购订单_模拟_1.csv
    ├── 采购订单_模拟_2.csv
    └── 采购订单_模拟_3.csv
```

版权所有：教学内容为独立课程原型。ChatGPT、Codex等名称属于相应权利人。
## M3 多模态与应用教学闭环（第三批待验收）

从 Prompt、文件与数据、Work、Codex 四个模块进入 `labs/multimedia.html`，学习图片理解、图片生成任务设计、MES数字复核、Goal/Input/Output应用构建及综合项目。含讲师提示、五节导航、学习进度、预制异常登记原型、项目单保存与导出。主站与M3进度独立；所有演示为本地教学，不调用AI API。

下载完整分支ZIP并解压，打开 `index.html` → Prompt Lab → M3教学实验室；验收说明见 `PROMPT_M3_ACCEPTANCE.md`。只下载单个HTML无法带齐样式和脚本。
