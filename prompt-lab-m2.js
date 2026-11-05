(function promptLabM2(){
"use strict";
const course=document.getElementById("ap4e-course");
if(!course || document.getElementById("ap4e-context"))return;
const $=id=>document.getElementById(id);
const css=document.createElement("style");css.id="ap4e-m2-styles";
css.textContent=`
#ap4e-course .m2-intro{background:#fff;border:1px solid #e9e3e5;border-radius:14px;padding:16px 19px;margin:0 0 15px}
#ap4e-course .m2-intro strong{color:#8b2639}
#ap4e-course .m2-intro p{margin:5px 0 0;font-size:13px;color:#656a74;line-height:1.8}
#ap4e-course .m2-context-items{display:grid;gap:10px;margin:13px 0}
#ap4e-course .m2-context-item{display:flex;align-items:flex-start;gap:11px;border:1px solid #e8e3e5;border-radius:10px;padding:12px 13px;cursor:pointer}
#ap4e-course .m2-context-item:hover{border-color:#ca9ea6}
#ap4e-course .m2-context-item:has(input:checked){background:#fdf3f4;border-color:#daaeba}
#ap4e-course .m2-context-item input{accent-color:#aa2737;margin-top:4px}
#ap4e-course .m2-context-item strong{display:block;color:#30313a;font-size:13px;margin-bottom:2px}
#ap4e-course .m2-context-item span{display:block;font-size:11px;color:#747782}
#ap4e-course .m2-prompt{white-space:pre-wrap;overflow-wrap:anywhere;background:#28262a;color:#f6f2f4;border-radius:11px;padding:17px;font-size:12px;line-height:1.85;max-height:350px;overflow:auto}
#ap4e-course .m2-counter{font-size:12px;color:#8f2940;font-weight:800}
#ap4e-course .m2-hint{font-size:12px;color:#65727b;line-height:1.75;margin-top:8px}
#ap4e-course .m2-alert{color:#854c36;background:#fff8ef;border:1px solid #efdfc9;border-radius:10px;padding:12px 13px;font-size:12px;line-height:1.7;margin:10px 0}
#ap4e-course .m2-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin:13px 0}
#ap4e-course .m2-option{display:block;text-align:left;background:#fff;border:1px solid #e8e0e4;border-radius:11px;padding:16px;color:#4a4550;width:100%;min-height:116px}
#ap4e-course .m2-option strong{display:block;color:#2f313a;font-size:14px;margin-bottom:7px}
#ap4e-course .m2-option span{font-size:12px;line-height:1.65;color:#72737f}
#ap4e-course .m2-option[aria-pressed=true]{border-color:#aa2737;background:#fdf2f4;box-shadow:inset 0 0 0 1px #aa2737}
#ap4e-course .m2-path{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
#ap4e-course .m2-path button{border:1px solid #ded5d9;background:#fff;border-radius:10px;padding:10px 13px;color:#7c5964;font-size:12px;font-weight:700}
#ap4e-course .m2-path button[aria-current=step]{background:#aa2737;border-color:#aa2737;color:#fff}
#ap4e-course .m2-summary{padding:15px 17px;border-radius:11px;background:#faf7f6;border:1px solid #e7e1e3;font-size:13px;line-height:1.8}
#ap4e-course .m2-summary strong{color:#852c3e}
#ap4e-course .m2-summary ul{padding-left:19px;margin:9px 0 0}
#ap4e-course .m2-bias-prompt{font-size:14px;font-weight:600;line-height:1.8;white-space:pre-wrap}
#ap4e-course .m2-rubric{width:100%;border-collapse:collapse;background:#fff;font-size:12px;table-layout:fixed}
#ap4e-course .m2-rubric th,#ap4e-course .m2-rubric td{border-bottom:1px solid #e9e3e5;padding:12px 9px;text-align:left;vertical-align:top}
#ap4e-course .m2-rubric th{background:#f9f5f5;color:#653c47}
#ap4e-course .m2-rubric th:first-child{width:24%}
#ap4e-course .m2-rubric th:nth-child(2){width:11%}
#ap4e-course .m2-rubric th:nth-child(3){width:30%}
#ap4e-course .m2-rubric td strong{display:block}
#ap4e-course .m2-rubric td small{color:#6c747d}
#ap4e-course .m2-rubric select{width:100%;padding:8px 5px;border-radius:8px;border:1px solid #dfd6d9;background:#fff;color:#343b47;font:inherit}
#ap4e-course .m2-score{font-size:15px;font-weight:800;color:#9d263c;margin:10px 0}
#ap4e-course .m2-note{color:#647078;font-size:12px;line-height:1.8}
#ap4e-course .m2-writing-stage{padding:14px 16px;border:1px solid #ebe4e7;background:#fcf9f9;border-radius:11px;font-size:13px;line-height:1.85;min-height:75px}
#ap4e-course .m2-outline{display:grid;gap:8px;margin:13px 0}
#ap4e-course .m2-outline-row{display:flex;gap:9px;align-items:center;border:1px solid #e9e2e5;border-radius:10px;padding:10px;background:#fff}
#ap4e-course .m2-outline-row .m2-outline-label{flex:1;font-weight:650;font-size:13px}
#ap4e-course .m2-outline-row button{font-size:12px;background:#f8f2f4;color:#883247;border:1px solid #e5d5da;border-radius:7px;padding:6px 9px}
#ap4e-course .m2-outline-row button:disabled{opacity:.35;cursor:not-allowed}
#ap4e-course .m2-add-row{display:flex;align-items:center;gap:9px;margin:10px 0;flex-wrap:wrap}
#ap4e-course .m2-add-row input{flex:1;min-width:185px;border:1px solid #e3dce0;border-radius:9px;padding:11px 12px;font-size:12px}
#ap4e-course .m2-steps-bar{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}
#ap4e-course .m2-steps-bar button{font-size:12px;padding:9px 12px;border-radius:9px;border:1px solid #e3dadf;background:#fff;color:#735863;font-weight:700}
#ap4e-course .m2-steps-bar button[aria-pressed=true]{background:#a72a3c;color:#fff;border-color:#a72a3c}
#ap4e-course .m2-fact{font-size:11px;line-height:1.8;color:#66717c}
#ap4e-course .m2-complete{background:#f7efef;border:1px solid #ead5d8;color:#792839;border-radius:10px;padding:11px 13px;font-size:12px}
@media(max-width:1000px){#ap4e-course .m2-grid3{grid-template-columns:1fr}#ap4e-course .m2-option{min-height:auto}}
@media(max-width:680px){#ap4e-course .m2-rubric{font-size:11px}#ap4e-course .m2-rubric th,#ap4e-course .m2-rubric td{padding:8px 5px}#ap4e-course .m2-rubric select{font-size:11px;padding:6px 3px}#ap4e-course .m2-rubric th:first-child{width:23%}#ap4e-course .m2-rubric th:nth-child(2){width:11%}#ap4e-course .m2-rubric th:nth-child(3){width:33%}}
body.large-text #ap4e-course .m2-prompt,body.large-text #ap4e-course .m2-summary,body.large-text #ap4e-course .m2-writing-stage{font-size:16px}
`;
document.head.appendChild(css);
const tabbox=course.querySelector(".ap4e-rail-left");
if(!tabbox)return;
[
["context","03 上下文工程"],["brainstorm","04 多轮头脑风暴"],
["critique","05 客观评价"],["writing","06 渐进式写作"]
].forEach(([id,label])=>{
 const b=document.createElement("button"); b.type="button";b.setAttribute("role","tab");
 b.id="ap4e-tab-"+id;b.setAttribute("aria-controls","ap4e-"+id);b.setAttribute("aria-selected","false");b.tabIndex=-1;
 b.dataset.ap4eLesson=id;b.textContent=label;tabbox.appendChild(b);
});
const panels=document.createElement("div");
panels.id="ap4e-m2-panels";
panels.innerHTML=`
<section class="ap4e-panel" id="ap4e-context" role="tabpanel" aria-labelledby="ap4e-tab-context" hidden>
<div class="ap4e-header"><div><p class="ap4e-kicker">LESSON 03 · M2 P15–21, P23–27</p><h2 class="ap4e-title">Context：决定 AI 表现的，往往是你提供了什么信息</h2><p class="ap4e-lead">上下文包括当前问题、相关对话、附件及工具可读取的资料。选择真正相关的信息，观察同一个任务的指令如何变得更可执行。</p></div><span class="ap4e-pill">建议 5 分钟</span></div>
<div class="ap4e-intro m2-intro"><strong>模拟业务任务：设备数据采集间歇离线，如何排查？</strong><p>不提供真实企业数据。这里的设备日志、网关配置、变更记录只是教学材料标签。网页并没有读取任何文件。</p></div>
<div class="ap4e-split">
<div class="ap4e-card"><h3>实验 C · 选出值得给 AI 的上下文</h3><p>尝试勾选资料，再查看右侧的 Prompt 怎样变化。资料越多不一定越好。</p>
<div class="m2-context-items">
<label class="m2-context-item"><input type="checkbox" data-m2-context="logs"><span><strong>过去7天离线时间与报警日志</strong><span>相关：用于确定故障发生频率、时间规律</span></span></label>
<label class="m2-context-item"><input type="checkbox" data-m2-context="network"><span><strong>设备IP、网关和网络拓扑（脱敏）</strong><span>相关：用于检查网络路径与配置</span></span></label>
<label class="m2-context-item"><input type="checkbox" data-m2-context="changes"><span><strong>最近设备移动、配置变更记录</strong><span>相关：用于排查变更与异常的时间关联</span></span></label>
<label class="m2-context-item"><input type="checkbox" data-m2-context="unrelated"><span><strong>另外一场活动的宣传方案</strong><span>无关：对网络故障排查没有明显帮助</span></span></label>
</div>
<label class="m2-context-item"><input type="checkbox" id="m2-other-chat"><span><strong>同一对话里还讨论过无关的供应商谈判</strong><span>观察旧对话的无关信息如何影响上下文选择</span></span></label>
</div>
<div class="ap4e-card"><h3>根据选择形成任务指令</h3><div class="m2-counter" id="m2-context-count">相关资料：0 / 3</div><div class="m2-prompt" id="m2-context-output" aria-live="polite"></div><div class="m2-hint" id="m2-context-hint"></div><div class="ap4e-action"><span class="ap4e-pill">本地模拟 · 非 AI 实时回答</span><button type="button" class="ap4e-btn secondary" id="m2-context-copy">复制当前 Prompt</button></div></div>
</div>
<div class="ap4e-callout"><strong>课堂结论：</strong>优先提供相关、可信、可解释的上下文，不是无限追加文字。课件建议在切换到无关主题时另开对话；Agent 工具也可能按需读取文件，但必须控制授权范围。</div>
<div class="ap4e-teacher-notes"><strong>讲师提示：</strong>先让学员勾选无关材料，指出“更多资料”与“相关资料”的区别。再让学员选择故障日志和变更记录，强调它们只能帮助提出假设，不能直接证明根因。补充 M2 p17–21 的上下文窗口与新对话建议，以及 p25–27 的电脑文件权限风险。</div>
<div class="ap4e-bottom"><small>来源：M2 Context p15–21；Desktop Apps 与安全 p23–27。示例均为制造业教学改编。</small><button type="button" class="ap4e-btn" data-m2-complete="0">学完本节 → 头脑风暴</button></div>
</section>
<section class="ap4e-panel" id="ap4e-brainstorm" role="tabpanel" aria-labelledby="ap4e-tab-brainstorm" hidden>
<div class="ap4e-header"><div><p class="ap4e-kicker">LESSON 04 · M2 P3–13</p><h2 class="ap4e-title">Brainstorming：用多轮反馈，选出真正可行的方案</h2><p class="ap4e-lead">吴恩达的方法：Context + Options + Iteration。不是一句“帮我想办法”，而是先发散多个选项，再用真实约束逐步收敛。</p></div><span class="ap4e-pill">建议 7 分钟</span></div>
<div class="m2-intro"><strong>模拟业务背景</strong><p>某离散制造产线首件检测返工率约 3.1%（假设数据），希望开展一个两周内可验证、预算不超过 2 万元的改善试点。当前不允许更换主要设备。这里的方案均为教学模拟，不代表现场可行性结论。</p></div>
<div class="ap4e-card">
<div class="m2-path" role="group" aria-label="头脑风暴轮次"><button type="button" data-m2-round="0" aria-current="step">第1轮 · 产生方案</button><button type="button" data-m2-round="1">第2轮 · 反馈约束</button><button type="button" data-m2-round="2">第3轮 · 收敛试点</button></div>
<div class="m2-counter" id="m2-round-caption">第1轮 / 3</div><h3 id="m2-round-title"></h3><p id="m2-round-description"></p>
<div id="m2-round-zero">
  <div class="m2-grid3" role="group" aria-label="选择方案">
    <button type="button" class="m2-option" data-m2-plan="0" aria-pressed="true"><strong>方案A · 检测参数回顾</strong><span>核对标准、参数与现场记录，先分析是否存在一致性问题。</span></button>
    <button type="button" class="m2-option" data-m2-plan="1" aria-pressed="false"><strong>方案B · 异常预警看板</strong><span>整合现有异常记录，识别不良集中时间、机台及批次。</span></button>
    <button type="button" class="m2-option" data-m2-plan="2" aria-pressed="false"><strong>方案C · 抽检与反馈闭环</strong><span>明确复检节点、缺陷标签与反馈职责，减少重复判断。</span></button>
  </div>
</div>
<div id="m2-round-one" hidden><p class="m2-hint">假设你选中的方向遇到了什么限制？点击其中一项，生成下一轮反馈。</p><div class="ap4e-tabs" role="group" aria-label="选择约束反馈">
<button type="button" data-m2-feedback="0" aria-pressed="true">必须两周可试点</button>
<button type="button" data-m2-feedback="1" aria-pressed="false">不能停线改造</button>
<button type="button" data-m2-feedback="2" aria-pressed="false">漏检风险必须受控</button>
</div><div class="m2-summary" id="m2-iteration-preview" style="margin-top:15px"></div></div>
<div id="m2-round-two" hidden><div class="m2-summary" id="m2-final-preview"></div></div>
<div class="m2-hint" style="margin-top:15px"><strong>本轮可以复制到企业版 ChatGPT 的指令：</strong></div>
<div class="m2-prompt" id="m2-round-prompt"></div>
<div class="ap4e-action"><button type="button" class="ap4e-btn secondary" id="m2-copy-round">复制本轮 Prompt</button><button type="button" class="ap4e-btn" id="m2-next-round">进入下一轮 →</button></div>
</div>
<div class="ap4e-teacher-notes"><strong>讲师提示：</strong>让现场学员先选 A/B/C，再请一位学员提出新的实际约束，用第二轮修改方案，第三轮只留下一个可试点方向与验证措施。强调第一轮的三个方向是教学预制例子，真正的多轮产出应在 ChatGPT 中运行。参考 M2 p9–13 的多方案反复反馈过程。</div>
<div class="ap4e-bottom"><small>来源：M2 Brainstorming with AI p3–13。Context → Options → Iteration。</small><button type="button" class="ap4e-btn" data-m2-complete="1">学完本节 → 客观评价</button></div>
</section>
<section class="ap4e-panel" id="ap4e-critique" role="tabpanel" aria-labelledby="ap4e-tab-critique" hidden>
<div class="ap4e-header"><div><p class="ap4e-kicker">LESSON 05 · M2 P35–41, P52–60</p><h2 class="ap4e-title">Sycophancy 与 Rubric：防止 AI 只说你想听的话</h2><p class="ap4e-lead">模型可能顺着用户的立场回答。课件建议中立表述、明确要求批判性评价，用细化的评分标准逐项评估，最后汇总，而不是一开始就给总分。</p></div><span class="ap4e-pill">建议 6 分钟</span></div>
<div class="ap4e-split">
<div class="ap4e-card"><h3>实验 E · 诱导性 vs 中立提问</h3>
<div class="ap4e-tabs" role="group" aria-label="问题措辞"><button type="button" data-m2-bias="leading" aria-pressed="true">容易诱导同意</button><button type="button" data-m2-bias="neutral" aria-pressed="false">中立、要求证据</button></div>
<div class="m2-summary" style="margin-top:12px"><div id="m2-bias-prompt" class="m2-bias-prompt"></div></div><div class="m2-alert" id="m2-bias-explain"></div>
<div class="ap4e-action"><span class="ap4e-pill">切换后对比语气</span><button type="button" class="ap4e-btn secondary" id="m2-copy-bias">复制当前 Prompt</button></div>
</div>
<div class="ap4e-card"><h3>如何让 AI 的评价更可靠？</h3>
<p>1. 使用中立的提问，而不是先给结论。<br>2. 针对每个评价维度定义可观察的证据标准。<br>3. 分项评分后再合计，列出证据缺口。<br>4. 对重要工作可以让另一个模型独立复核。</p>
<div class="ap4e-callout"><strong>Rubric 不只是“质量 25 分、成本 25 分”。</strong>需要告诉模型每一项满足什么标准得几分。模糊、先给总分的量表，仍可能鼓励不客观的结果。</div>
</div>
</div>
<div class="ap4e-card"><h3>实验 F · 自己给项目建立评分规则</h3><p>以下是教学演示用的评分表。先选择每个维度的模拟“证据等级”，再查看分数如何变化。<strong>没有上传任何项目证据，不代表对某项目的真实评分。</strong></p>
<div style="overflow-x:auto;margin-top:12px"><table class="m2-rubric"><thead><tr><th>评价维度</th><th>权重</th><th>可观察的判定依据</th><th>模拟证据等级</th></tr></thead><tbody>
<tr><td><strong>质量效果</strong><small>误检/漏检</small></td><td>35</td><td>独立验证样本、误检/漏检统计及置信范围</td><td><select data-m2-score="0" aria-label="质量效果证据等级"><option value="-1">待评估</option><option value="0">不支持</option><option value="0.5">部分支持</option><option value="1">充分支持</option></select></td></tr>
<tr><td><strong>运行效率</strong><small>节拍/负载</small></td><td>25</td><td>典型/峰值工况下节拍、稳定运行记录</td><td><select data-m2-score="1" aria-label="运行效率证据等级"><option value="-1">待评估</option><option value="0">不支持</option><option value="0.5">部分支持</option><option value="1">充分支持</option></select></td></tr>
<tr><td><strong>维护成本</strong><small>人员/工时</small></td><td>20</td><td>部署、复标、故障处理工时及维护资源</td><td><select data-m2-score="2" aria-label="维护成本证据等级"><option value="-1">待评估</option><option value="0">不支持</option><option value="0.5">部分支持</option><option value="1">充分支持</option></select></td></tr>
<tr><td><strong>安全合规</strong><small>权限/追溯</small></td><td>20</td><td>权限控制、数据流、审计日志、人工复核流程</td><td><select data-m2-score="3" aria-label="安全合规证据等级"><option value="-1">待评估</option><option value="0">不支持</option><option value="0.5">部分支持</option><option value="1">充分支持</option></select></td></tr>
</tbody></table></div>
<details class="m2-intro" style="margin-top:12px"><summary style="cursor:pointer;font-weight:750;color:#862b3d">展开每个维度的具体评分分档标准</summary>
<p><strong>质量效果（35分）</strong>：充分支持＝通过独立验证，误检/漏检均达到事前约定的门槛且样本与批次覆盖明确；部分支持＝只验证部分产品/班次或缺少关键统计；不支持＝经验证不满足已约定关键门槛；待评估＝没有可用记录。</p>
<p><strong>运行效率（25分）</strong>：充分支持＝正常、峰值工况及连续运行均通过事前节拍与稳定性标准；部分支持＝只测试正常工况等部分条件；不支持＝记录显示关键工况不达标；待评估＝没有测试记录。</p>
<p><strong>维护成本（20分）</strong>：充分支持＝部署、运行、故障恢复、人员工时的全周期估算可追溯且满足事前预算；部分支持＝有报价但缺少维护/恢复估算；不支持＝可核算成本超出预先确定的承受范围；待评估＝未测算。</p>
<p><strong>安全合规（20分）</strong>：充分支持＝权限、敏感数据处理、日志、人工复核和回退均经过实际验证；部分支持＝只有方案文档或部分控制已验证；不支持＝关键控制有已知不满足的项；待评估＝无可核验证据。</p>
<p class="m2-fact">教学简化：不支持得0分、部分支持得对应权重的50%、充分支持得100%。正式项目还必须定义产品适用门槛、失败一票否决项，不能机械套用此演示权重或分级。</p></details>
<div class="m2-score" id="m2-score-result" role="status">尚未评价，不能计算总分</div>
<div class="m2-note" id="m2-score-evidence">先核查每个维度的证据，再根据统一规则评分。权重和分级是课程演示，不是企业批准的正式评价制度。</div>
<div class="ap4e-action"><button type="button" class="ap4e-btn secondary" id="m2-reset-score">重置评分表</button><button type="button" class="ap4e-btn" id="m2-copy-rubric">复制客观评价 Prompt</button></div>
</div>
<div class="ap4e-teacher-notes"><strong>讲师提示：</strong>先用诱导性句式提问学员“AI 会怎么答”，再切换中立版本。让学员给评分表随意打分，追问“这些分是从哪里来的？”指出真正的 Rubric 应提供每项的分档标准和实际证据，而不是漂亮的数字。M2 p56–58 展示了模糊 Rubric、过早总评分的风险；p59 为跨模型评价。</div>
<div class="ap4e-bottom"><small>来源：M2 Sycophancy p35–41；AI Critique / Cross-model Review p52–60。评分权重为本站教学示例。</small><button type="button" class="ap4e-btn" data-m2-complete="2">学完本节 → 渐进式写作</button></div>
</section>
<section class="ap4e-panel" id="ap4e-writing" role="tabpanel" aria-labelledby="ap4e-tab-writing" hidden>
<div class="ap4e-header"><div><p class="ap4e-kicker">LESSON 06 · M2 P42–54</p><h2 class="ap4e-title">Progressive Outlining：不要一开始就让 AI 写完全文</h2><p class="ap4e-lead">先根据资料提出大纲，修改结构、逐章扩展，再进行严谨复核。课堂先在大纲阶段发现问题，让修改影响整个章节，而不是只改变几个词。</p></div><span class="ap4e-pill">建议 4 分钟</span></div>
<div class="m2-intro"><strong>模拟任务：撰写一份试产异常复盘报告</strong><p>已知“试产期间发生过异常、存在未关闭事项”（教学假设），但尚未提供完整记录。必须保留未确认信息，不能让 AI 编造实际批次数据和验证结论。</p></div>
<div class="ap4e-split">
<div class="ap4e-card"><h3>实验 G · 调整报告大纲</h3><p>用 ↑ ↓ 调整章节顺序，或增加需要提前说明的证据缺口。每次变化都会更新右侧的 Prompt。</p>
<div class="m2-outline" id="m2-outline-list" aria-live="polite"></div>
<div class="m2-add-row"><input id="m2-add-title" type="text" maxlength="52" placeholder="增加章节，例如：未验证风险" aria-label="新章节标题"/><button type="button" id="m2-add-outline" class="ap4e-btn secondary">增加章节</button></div>
<div class="ap4e-action"><button type="button" id="m2-reset-outline" class="ap4e-btn secondary">恢复示例大纲</button></div>
</div>
<div class="ap4e-card"><h3>写作流程：先结构，后正文</h3>
<div class="m2-steps-bar" role="group" aria-label="选择写作阶段">
<button type="button" data-m2-write-stage="0" aria-pressed="true">① 整理证据</button>
<button type="button" data-m2-write-stage="1" aria-pressed="false">② 审阅大纲</button>
<button type="button" data-m2-write-stage="2" aria-pressed="false">③ 分章扩展</button>
<button type="button" data-m2-write-stage="3" aria-pressed="false">④ 批判性复核</button></div>
<div class="m2-writing-stage" id="m2-writing-guidance"></div>
<div class="m2-prompt" id="m2-writing-prompt" style="margin-top:12px"></div>
<div class="ap4e-action"><span class="ap4e-pill">基于当前大纲动态生成指令</span><button type="button" class="ap4e-btn secondary" id="m2-copy-writing">复制本阶段 Prompt</button></div>
</div>
</div>
<div class="ap4e-callout"><strong>课堂结论：</strong>在结构阶段改动一个章节，往往比全文完成后再返工更有效。原始证据、验证结果和批准责任仍由业务人员承担，不能凭提示词生成。</div>
<div class="ap4e-teacher-notes"><strong>讲师提示：</strong>先让学员观察“直接写完整报告”的风险，点击调整大纲，把“待确认事项”移至风险说明位置；引导学员解释为何缺失证据应在正文前明确。引用 M2 p46–51 的逐步写作与结构修改；p53–54 的逐段编辑。</div>
<div class="ap4e-bottom"><small>来源：M2 Writing with AI / AI Critique p42–54。示例报告未接入真实文件。</small><button type="button" class="ap4e-btn" data-m2-complete="3">完成第二批教学 ✓</button></div>
</section>`;
const roadmap=course.querySelector(".ap4e-roadmap");
if(!roadmap) return;
roadmap.before(panels);
roadmap.innerHTML='<span class="current">已开发：M1 新手高手、信息获取 + M2 上下文、头脑风暴、客观评价、渐进写作</span><span>第三批：多模态、数据分析、Work 与 Codex 贯通</span>';
const hero=course.querySelector(".ap4e-eyebrow");
if(hero)hero.textContent="PROMPT LAB 2.0 · 第一、二批 / M1 + M2";
const introduction=course.querySelector(".ap4e-hero > p:not(.ap4e-eyebrow)");
if(introduction)introduction.textContent="基于吴恩达《AI Prompting for Everyone》：从新手与高手、信息来源选择，到上下文管理、头脑风暴迭代、客观评价与渐进写作。适合讲师现场演示，也支持学员在企业版 ChatGPT 中实测。";
const currentTab=course.querySelector('[data-ap4e-lesson][aria-selected="true"]');
if(currentTab) currentTab.setAttribute("aria-selected","true");

const newTabs=[...tabbox.querySelectorAll("button")].slice(2);
newTabs.forEach(tab=>tab.addEventListener("keydown",e=>{
 if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
 e.preventDefault();
 const tabs=[...tabbox.querySelectorAll("[data-ap4e-lesson]")];
 const i=tabs.indexOf(tab),next=tabs[(i+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length];
 next.click(); next.focus();
}));

const contextEntries={
 logs:"过去7天设备离线时间、WinCC在线/离线状态和报警日志（已脱敏）",
 network:"设备IP、网关映射和网络拓扑（已脱敏，并注明与采集链路的关系）",
 changes:"最近设备移动、网络调整与配置变更记录"
};
let currentContextPrompt="";
function renderContext(){
 const selected=[...course.querySelectorAll("[data-m2-context]:checked")].map(x=>x.dataset.m2Context);
 const relevant=selected.filter(x=>x!=="unrelated");
 const unrelated=selected.includes("unrelated");
 const prior=$("m2-other-chat").checked;
 currentContextPrompt="请帮我分析以下模拟的设备数据采集间歇离线问题。先列出可能原因、需要核查的证据和排查顺序；在没有足够数据时不要直接判断根因。";
 if(relevant.length)currentContextPrompt+="\n\n我将提供的相关资料：\n"+relevant.map((v,i)=>(i+1)+". "+contextEntries[v]).join("\n")+"\n请先检查数据时间范围、字段完整性与互相矛盾之处。";
 if(unrelated)currentContextPrompt+="\n\n另附一份活动宣传方案（与当前设备排障任务无关，请忽略）。";
 if(prior)currentContextPrompt+="\n\n当前对话还混入了供应商谈判讨论。请不要把此前无关内容作为排障依据；如背景混乱，建议另起专用对话，并仅引用本次资料。";
 currentContextPrompt+="\n\n请输出：排查优先级、验证方式、待补数据清单。涉及配置修改时只提出建议，未经人工确认不得操作设备。";
 $("m2-context-count").textContent="相关资料："+relevant.length+" / 3";
 $("m2-context-output").textContent=currentContextPrompt;
 let msg=relevant.length===0?"当前没有实际日志与配置资料，AI 只能提出通用排查清单。":relevant.length===3?"相关资料类型较齐全，但仍需确认数据的准确性和具体内容。":"相关资料已有补充，但仍可能缺少其他关键证据。";
 if(unrelated)msg+=" 无关资料不应作为判断依据。";
 if(prior)msg+=" 对话转向新话题时可新建对话，减少旧背景干扰。";
 $("m2-context-hint").textContent=msg;
}

const plans=[
{name:"检测参数回顾",reason:"优先对照规格与历史变更，检查是否存在参数漂移或操作不一致。"},
{name:"异常预警看板",reason:"优先建立不良分布与时间序列，帮助提出高优先级假设。"},
{name:"抽检与反馈闭环",reason:"优先明确检测、复核和反馈职责，保证异常有记录与追踪。"}
];
const feedback=[
{title:"必须两周可试点",adjust:"先缩小到一台设备或一个班次，采用现有记录，不新增生产系统接口；设计两周验证窗口。"},
{title:"不能停线改造",adjust:"以离线资料分析或影子流程先验证，不改写生产设备参数，也不影响原操作流程。"},
{title:"漏检风险必须受控",adjust:"设置人工复核、样本抽查与回退条件，无法证明风险受控前不得替代现有质量放行。"}
];
let chosenPlan=0,chosenFeedback=0,round=0,currentRoundPrompt="";
function renderBrainstorm(){
 course.querySelectorAll("[data-m2-round]").forEach(b=>b.setAttribute("aria-current",+b.dataset.m2Round===round?"step":"false"));
 course.querySelectorAll("[data-m2-plan]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.m2Plan===chosenPlan)));
 course.querySelectorAll("[data-m2-feedback]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.m2Feedback===chosenFeedback)));
 for(let i=0;i<3;i++)$("m2-round-"+["zero","one","two"][i]).hidden=i!==round;
 const titles=["先展开多个不同方向","用现场约束否定或改进方案","把选定方案转为可核验的试点"];
 const texts=["基于同一背景生成选项，然后选中一个你更愿意继续研究的方向。","告诉 AI 哪个条件使原方案不合适，再要求调整，而不是重新开一个泛泛的话题。","明确评价指标、数据需求、风险、验证步骤和决策门槛，不能直接宣称方案有效。"];
 $("m2-round-caption").textContent="第 "+(round+1)+" 轮 / 3";
 $("m2-round-title").textContent=titles[round];
 $("m2-round-description").textContent=texts[round];
 $("m2-iteration-preview").textContent="已选方向："+plans[chosenPlan].name+"。反馈："+feedback[chosenFeedback].title+"。\n建议调整方式："+feedback[chosenFeedback].adjust;
 $("m2-final-preview").innerHTML="<strong>第三轮应明确：</strong><ul><li>选择方向："+escapeHTML(plans[chosenPlan].name)+"</li><li>新约束："+escapeHTML(feedback[chosenFeedback].title)+"</li><li>试点范围及两周计划</li><li>质量与效率指标、样本量和数据来源</li><li>失败条件、人工复核与回退动作</li><li>尚未获得的证据清单</li></ul><span class='m2-fact'>这是演示用结构，不是AI已验证的方案。</span>";
 const base="我们正在讨论一个模拟的制造业试点：首件检测返工率约3.1%，希望两周内验证，预算不超过2万元，不能更换主要设备。数字均为假设；请不要当作事实。";
 if(round===0)currentRoundPrompt=base+"\n请提出3种彼此不同的改善方向。每种都说明需要的资料、主要假设、实施难度和验证办法，不直接断定根因。";
 else if(round===1)currentRoundPrompt=base+"\n我比较关注“"+plans[chosenPlan].name+"”方向。新增约束："+feedback[chosenFeedback].title+"。请基于这一反馈重新产生3个可选变体，分别说明修改了哪些步骤、潜在风险及所需证据。";
 else currentRoundPrompt=base+"\n经过比较，我倾向“"+plans[chosenPlan].name+"”，但需满足“"+feedback[chosenFeedback].title+"”。请制定2周小范围试点计划，包含数据来源、验证指标、实验设计、风险控制、人工确认节点、退出条件和未确定事项。先列提纲，不要编造效果数据。";
 $("m2-round-prompt").textContent=currentRoundPrompt;
 $("m2-next-round").textContent=round===2?"返回第一轮 ↻":"进入下一轮 →";
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

let biasMode="leading",currentBiasPrompt="";
function renderBias(){
 const leading="我们的 AI 视觉质检项目明显能降低成本、提升质量，我认为应该全面推广。你是不是也同意？";
 const neutral="请客观评估是否应扩大 AI 视觉质检试点。根据已提供的独立验证数据，检查误检、漏检、产线节拍、维护成本、权限与追溯要求。分别提出支持与反对理由，指出证据不足之处，不要预设结论。";
 currentBiasPrompt=biasMode==="leading"?leading:neutral;
 $("m2-bias-prompt").textContent=currentBiasPrompt;
 $("m2-bias-explain").textContent=biasMode==="leading"?"这一问法在问题里给出了“应该推广”的期望结论，容易引发迎合。请比较模型实际回答是否充分提出反面证据。":"这一问法避免预设答案，并要求证据和反方意见；中立表述能降低偏差，但不能保证回答完全客观。";
 course.querySelectorAll("[data-m2-bias]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.m2Bias===biasMode)));
}
const rubric=[
{name:"质量效果",weight:35,criteria:"独立验证误检/漏检、样本覆盖及结果可追溯"},
{name:"运行效率",weight:25,criteria:"正常和峰值节拍、吞吐能力、停机影响"},
{name:"维护成本",weight:20,criteria:"人员工时、部署维护、异常恢复和总拥有成本"},
{name:"安全合规",weight:20,criteria:"权限、数据保护、操作审计、人工复核与回退"}
];
function renderScore(){
 const values=[...course.querySelectorAll("[data-m2-score]")].map(s=>Number(s.value));
 let assessed=0,sum=0;
 values.forEach((v,i)=>{if(v>=0){assessed+=rubric[i].weight;sum+=rubric[i].weight*v;}});
 $("m2-score-result").textContent=assessed===0?"尚未评价，不能计算总分":assessed<100?"已评价权重："+assessed+"/100；暂得："+Number(sum.toFixed(1))+"分。仍有未评估项，不形成总分。":"课堂模拟合计："+Number(sum.toFixed(1))+" / 100（根据人工选择的证据等级）";
 $("m2-score-evidence").textContent="评分前应定义各分档的可观察标准，并依据原始证据评价。当前只演示规则和汇总逻辑；"+"已评估 "+values.filter(x=>x>=0).length+"/4 项，"+"不是对任何真实供应商或项目的技术结论。";
}
function rubricPrompt(){
 return "请用中立、批判性的方式审查所附AI视觉质检项目。先逐项检查证据，再分项给出理由与评分，最后计算总分；不要一开始给总分。\n以下是课堂示范权重，并非公司正式标准：\n"+
 rubric.map(r=>r.name+"（"+r.weight+"分）："+r.criteria+"。先核对预先批准的量化验收标准、检测工况与原始证据；不支持=经验证不达标，部分支持=只满足部分工况或证据不完整，充分支持=全部约定工况均有独立验证证据。各档按0%、50%、100%权重演示，待评估不计总分，不能编造数据。").join("\n")+
 "\n输出：证据来源、每项得分与扣分原因、总分、反对意见、待验证事项。建议由独立人员或第二模型复核关键结论。";
}

const defaultOutline=["试产目标与范围","试产数据与质量结果","主要异常与证据","改善行动与责任","未关闭问题与下一步验证"];
let outline=defaultOutline.slice(),writingStage=0,currentWritingPrompt="";
const writeStages=[
{title:"先从资料中提取事实",info:"请核对实际试产批次、设备记录、质量检验结果、未关闭问题；无资料的指标必须标记“待确认”。"},
{title:"先审阅高层结构",info:"让 AI 给出多个大纲选项，与你一起调整章节结构。优先纠正缺失的关键部分，而非逐字修改正文。"},
{title:"经过批准，再逐章扩展",info:"按照确认后的大纲分章写作。每章应注明数据与原始证据出处，不要从假设自动推导为验证合格。"},
{title:"针对关键章节分段批判",info:"对异常归因、风险和结论分别审阅，要求指出逻辑漏洞、缺证据的判断，以及需要人工签核的内容。"}
];
function renderOutline(){
 const list=$("m2-outline-list");list.innerHTML="";
 outline.forEach((title,i)=>{
  const row=document.createElement("div");row.className="m2-outline-row";
  const n=document.createElement("span");n.className="m2-outline-label";n.textContent=(i+1)+". "+title;
  const up=document.createElement("button");up.type="button";up.textContent="↑";up.dataset.m2Move=i+":up";up.disabled=i===0;up.setAttribute("aria-label","上移："+title);
  const down=document.createElement("button");down.type="button";down.textContent="↓";down.dataset.m2Move=i+":down";down.disabled=i===outline.length-1;down.setAttribute("aria-label","下移："+title);
  row.append(n,up,down);list.appendChild(row);
 });
 renderWriting();
}
function renderWriting(){
 const st=writeStages[writingStage];
 course.querySelectorAll("[data-m2-write-stage]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.m2WriteStage===writingStage)));
 $("m2-writing-guidance").textContent=st.title+"：\n"+st.info;
 const headings=outline.map((x,i)=>(i+1)+". "+x).join("\n");
 const start="我准备撰写制造业试产异常复盘报告，尚未提供完整试产记录。请不要编造批次、数量、根因、3Q验证通过结论或审批状态。\n\n当前拟定大纲：\n"+headings+"\n\n";
 const endings=[
"先阅读我后续上传的原始资料，建立“事实/推断/缺失证据”三栏清单，并指出完成报告还需要哪些记录，暂不撰写正文。",
"请检查上述大纲：是否存在结构遗漏、重复或逻辑问题？给我3种修改方案，并标出需要验证的章节；等我确认后再继续。",
"大纲确认后，请按章节依次扩展，每次只处理一章。对引用的记录标注文件与位置，未提供的数据保持待确认，并在写下一个章节前请我审核。",
"请按已确认的大纲逐章批判性审阅这份报告，指出没有证据的断言、错误因果推断、遗漏的质量风险及需要进一步验证的事项。最后给出可执行的修订清单。"
 ];
 currentWritingPrompt=start+endings[writingStage];
 $("m2-writing-prompt").textContent=currentWritingPrompt;
}
function copyValue(s){
 if(typeof window.copyText==="function"){window.copyText(s);return;}
 if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(s).catch(()=>prompt("请复制以下内容：",s));}
 else prompt("请复制以下内容：",s);
}

let completed=[false,false,false,false];
try{const saved=JSON.parse(localStorage.getItem("academy.prompt.m2.batch2")||"null");if(Array.isArray(saved)&&saved.length===4)completed=saved.map(Boolean);}catch(_){}
function updateProgress(){
 let m1=0;
 try{const old=JSON.parse(localStorage.getItem("academy.prompt.m1.batch1")||"[]");if(Array.isArray(old))m1=old.filter(Boolean).length;}catch(_){}
 const n=m1+completed.filter(Boolean).length;
 $("ap4e-done-count").textContent=n+" / 6";
 $("ap4e-track-fill").style.width=100*n/6+"%";
 course.querySelectorAll("[data-m2-complete]").forEach((b)=>{
  const i=+b.dataset.m2Complete;
  const names=["头脑风暴","客观评价","渐进式写作",""];
  b.textContent=completed[i]?(i===3?"✓ 第二批已完成":"✓ 已学本节 → "+names[i]):(i===3?"完成第二批教学 ✓":"学完本节 → "+names[i]);
 });
}
function finish(i){
 completed[i]=true;
 try{localStorage.setItem("academy.prompt.m2.batch2",JSON.stringify(completed));}catch(_){}
 updateProgress();
 const next=["brainstorm","critique","writing",null][i];
 if(next){const b=$("ap4e-tab-"+next);if(b)b.click();}
}
course.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.m2Complete!==undefined){finish(+b.dataset.m2Complete);return;}
 if(b.id==="m2-context-copy"){copyValue(currentContextPrompt);return;}
 if(b.dataset.m2Plan!==undefined){chosenPlan=+b.dataset.m2Plan;renderBrainstorm();return;}
 if(b.dataset.m2Feedback!==undefined){chosenFeedback=+b.dataset.m2Feedback;renderBrainstorm();return;}
 if(b.dataset.m2Round!==undefined){round=+b.dataset.m2Round;renderBrainstorm();return;}
 if(b.id==="m2-next-round"){round=(round+1)%3;renderBrainstorm();return;}
 if(b.id==="m2-copy-round"){copyValue(currentRoundPrompt);return;}
 if(b.dataset.m2Bias!==undefined){biasMode=b.dataset.m2Bias;renderBias();return;}
 if(b.id==="m2-copy-bias"){copyValue(currentBiasPrompt);return;}
 if(b.id==="m2-reset-score"){course.querySelectorAll("[data-m2-score]").forEach(x=>x.value="-1");renderScore();return;}
 if(b.id==="m2-copy-rubric"){copyValue(rubricPrompt());return;}
 if(b.dataset.m2Move!==undefined){
  const [i,direction]=b.dataset.m2Move.split(":");const n=+i,j=n+(direction==="up"?-1:1);
  if(j>=0&&j<outline.length){[outline[n],outline[j]]=[outline[j],outline[n]];renderOutline();}
  return;
 }
 if(b.id==="m2-add-outline"){
   const input=$("m2-add-title"),v=input.value.trim();
   if(!v){input.focus();return;}if(outline.length>=10){input.value="";return;}
   outline.push(v);input.value="";renderOutline();return;
 }
 if(b.id==="m2-reset-outline"){outline=defaultOutline.slice();$("m2-add-title").value="";renderOutline();return;}
 if(b.dataset.m2WriteStage!==undefined){writingStage=+b.dataset.m2WriteStage;renderWriting();return;}
 if(b.id==="m2-copy-writing"){copyValue(currentWritingPrompt);return;}
});
course.querySelectorAll("[data-m2-context]").forEach(i=>i.addEventListener("change",renderContext));
$("m2-other-chat").addEventListener("change",renderContext);
course.querySelectorAll("[data-m2-score]").forEach(i=>i.addEventListener("change",renderScore));
$("m2-add-title").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("m2-add-outline").click();}});
renderContext();renderBrainstorm();renderBias();renderScore();renderOutline();updateProgress();
})();
