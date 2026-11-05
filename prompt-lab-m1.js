(function promptLabM1() {
"use strict";
const host = document.getElementById("page-prompt");
if (!host || host.querySelector("#ap4e-course")) return;

const style = document.createElement("style");
style.id = "ap4e-m1-styles";
style.textContent = `
#ap4e-course{--a:#aa2737;--a-deep:#7c2030;--a-rose:#fdf1f2;--a-ink:#272833;--a-muted:#687180;--a-border:#e9e3e5;font-size:14px;color:var(--a-ink)}
#ap4e-course *{box-sizing:border-box}
#ap4e-course button{font:inherit;cursor:pointer}
#ap4e-course .ap4e-hero{background:linear-gradient(125deg,#802034 0%,#aa2737 57%,#ca4555 100%);color:#fff;padding:clamp(22px,4vw,37px);border-radius:20px;position:relative;overflow:hidden}
#ap4e-course .ap4e-hero:after{content:"";width:280px;height:280px;border:45px solid rgba(255,255,255,.08);border-radius:50%;position:absolute;right:-130px;top:-155px;pointer-events:none}
#ap4e-course .ap4e-hero>*{position:relative;z-index:1}
#ap4e-course .ap4e-eyebrow{letter-spacing:2px;font-weight:800;color:#ffe0e3;font-size:11px;margin:0 0 12px}
#ap4e-course .ap4e-hero h1{font-size:clamp(27px,3vw,42px);line-height:1.22;margin:0 0 13px;letter-spacing:-.6px}
#ap4e-course .ap4e-hero p{font-size:14px;line-height:1.8;max-width:780px;color:#fbe6e9;margin:0}
#ap4e-course .ap4e-hero-meta{display:flex;gap:8px;margin:20px 0 0;flex-wrap:wrap}
#ap4e-course .ap4e-hero-meta span{padding:5px 10px;border:1px solid #ffffff52;border-radius:20px;font-size:11px}
#ap4e-course .ap4e-rail{display:flex;justify-content:space-between;align-items:center;gap:12px;border:1px solid var(--a-border);border-radius:14px;padding:12px 14px;margin:16px 0 21px;background:#fff;flex-wrap:wrap}
#ap4e-course .ap4e-rail-left{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#ap4e-course .ap4e-rail button{border:1px solid #e8dde0;border-radius:9px;background:#fff;color:#725d64;padding:9px 14px;font-weight:700;font-size:12px}
#ap4e-course .ap4e-rail button[aria-selected=true]{background:var(--a-rose);color:var(--a-deep);border-color:#ecc5cc}
#ap4e-course .ap4e-completion{display:flex;align-items:center;gap:9px;color:var(--a-muted);font-size:12px}
#ap4e-course .ap4e-track{display:block;width:86px;height:7px;border-radius:9px;background:#efe9eb;overflow:hidden}
#ap4e-course .ap4e-track i{display:block;height:100%;background:var(--a);width:0;transition:width .2s}
#ap4e-course .ap4e-panel[hidden]{display:none}
#ap4e-course .ap4e-header{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;flex-wrap:wrap;margin:0 0 17px}
#ap4e-course .ap4e-kicker{font-size:11px;letter-spacing:1.8px;font-weight:800;color:var(--a);margin:0 0 5px}
#ap4e-course .ap4e-title{font-size:clamp(22px,2.4vw,30px);letter-spacing:-.5px;line-height:1.3;margin:0 0 7px}
#ap4e-course .ap4e-lead{margin:0;color:var(--a-muted);font-size:13px;max-width:740px;line-height:1.8}
#ap4e-course .ap4e-pill{padding:5px 10px;border-radius:20px;background:#f5eeef;color:#815967;font-size:11px;font-weight:800;white-space:nowrap}
#ap4e-course .ap4e-card{background:#fff;border:1px solid var(--a-border);border-radius:15px;padding:20px;box-shadow:0 9px 25px #33212a07}
#ap4e-course .ap4e-card h3{font-size:16px;margin:0 0 8px}
#ap4e-course .ap4e-card p{font-size:13px;line-height:1.75;margin:0;color:#5b626f}
#ap4e-course .ap4e-card .ap4e-small{font-size:12px;color:var(--a-muted)}
#ap4e-course .ap4e-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;margin:15px 0}
#ap4e-course .ap4e-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
#ap4e-course .ap4e-tabs button{background:#f6f3f3;border:1px solid #e9e4e5;color:#756871;border-radius:9px;padding:9px 12px;font-size:12px;font-weight:700}
#ap4e-course .ap4e-tabs button[aria-pressed=true]{background:var(--a);color:#fff;border-color:var(--a)}
#ap4e-course .ap4e-compare-card{border:1px solid #eae3e6;border-radius:13px;padding:19px;background:#fdfcfc;min-height:190px}
#ap4e-course .ap4e-compare-card.good{background:#faf3f4;border-color:#efd0d5}
#ap4e-course .ap4e-compare-card .ap4e-label{font-size:11px;letter-spacing:.5px;font-weight:800;color:#8a6673;margin:0 0 11px}
#ap4e-course .ap4e-compare-card .ap4e-quote{font-size:14px;color:#262c36;line-height:1.8;white-space:pre-wrap;margin:0}
#ap4e-course .ap4e-compare-card .ap4e-caption{margin-top:12px;padding-top:11px;border-top:1px dashed #e7dbe0;color:#677080;font-size:12px;line-height:1.75}
#ap4e-course .ap4e-action{display:flex;align-items:center;gap:9px;justify-content:space-between;flex-wrap:wrap;margin-top:15px}
#ap4e-course .ap4e-btn{background:var(--a);color:#fff;border:1px solid var(--a);border-radius:10px;padding:10px 14px;font-weight:800;font-size:12px}
#ap4e-course .ap4e-btn:hover{background:var(--a-deep)}
#ap4e-course .ap4e-btn.secondary{background:#fff;color:var(--a-deep);border-color:#dfcbd0}
#ap4e-course .ap4e-btn:disabled{opacity:.43;cursor:not-allowed}
#ap4e-course .ap4e-callout{padding:14px 16px;border-left:3px solid var(--a);background:#fbf3f4;color:#5a4b51;border-radius:0 10px 10px 0;font-size:12px;line-height:1.8;margin:15px 0}
#ap4e-course .ap4e-callout strong{color:var(--a-deep)}
#ap4e-course .ap4e-methods{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:15px 0}
#ap4e-course .ap4e-method{padding:16px;border:1px solid #eae4e6;border-radius:13px;background:#fff}
#ap4e-course .ap4e-method .ap4e-method-icon{width:36px;height:36px;border-radius:10px;background:#f8e9eb;color:var(--a);display:grid;place-items:center;font-size:18px;margin-bottom:9px}
#ap4e-course .ap4e-method h3{font-size:14px;margin:0 0 5px}
#ap4e-course .ap4e-method p{font-size:12px;color:#69717c;line-height:1.7;margin:0}
#ap4e-course .ap4e-quiz-options{display:grid;gap:10px;margin:16px 0}
#ap4e-course .ap4e-choice{display:flex;align-items:center;gap:12px;text-align:left;background:#fff;border:1px solid #e9e3e5;border-radius:11px;padding:13px 15px;color:#434751}
#ap4e-course .ap4e-choice:hover{border-color:#c9949d}
#ap4e-course .ap4e-choice[aria-pressed=true]{border-color:var(--a);background:#fff3f4;color:var(--a-deep)}
#ap4e-course .ap4e-choice strong{width:25px;height:25px;border-radius:7px;background:#f4ecee;display:grid;place-items:center;font-size:11px;flex:none}
#ap4e-course .ap4e-choice[aria-pressed=true] strong{background:var(--a);color:#fff}
#ap4e-course .ap4e-feedback{padding:14px 16px;border-radius:10px;background:#f6f5f3;border:1px solid #e7e4e0;font-size:12px;line-height:1.8;margin:14px 0}
#ap4e-course .ap4e-feedback strong{color:#315f4a}
#ap4e-course .ap4e-feedback.is-wrong strong{color:#935b30}
#ap4e-course .ap4e-counter{font-weight:800;color:var(--a);font-size:12px}
#ap4e-course .ap4e-workflow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:15px 0}
#ap4e-course .ap4e-workflow button{border:1px solid #e8e1e3;background:#fff;color:#605d67;border-radius:10px;padding:11px 7px;font-size:12px;font-weight:800}
#ap4e-course .ap4e-workflow button[aria-pressed=true]{background:var(--a-rose);color:var(--a-deep);border-color:#dfb7be}
#ap4e-course .ap4e-workflow button span{display:block;font-size:10px;color:#9b7a82;margin-bottom:3px}
#ap4e-course .ap4e-stage{padding:15px;border-radius:11px;background:#faf8f7;border:1px solid #ece7e6;font-size:13px;line-height:1.8;min-height:95px}
#ap4e-course .ap4e-source-list{display:grid;gap:9px}
#ap4e-course .ap4e-source-list button{text-align:left;border:1px solid #e7e2e4;border-radius:10px;background:#fff;padding:12px 14px;color:#49505e;font-size:12px;line-height:1.7}
#ap4e-course .ap4e-source-list button[aria-pressed=true]{border-color:var(--a);background:#fff3f4}
#ap4e-course .ap4e-teacher-notes{display:none;background:#fff9f3;border:1px dashed #dec8ad;border-radius:12px;padding:14px 16px;font-size:12px;line-height:1.85;margin-top:16px;color:#735940}
body.teacher #ap4e-course .ap4e-teacher-notes{display:block}
#ap4e-course .ap4e-section-gap{height:18px}
#ap4e-course .ap4e-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;border-top:1px solid #eee5e8;margin-top:18px;padding-top:16px}
#ap4e-course .ap4e-bottom small{color:#7c818b;font-size:11px;max-width:650px}
#ap4e-course .ap4e-roadmap{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:20px 0 0;color:#88828a;font-size:12px}
#ap4e-course .ap4e-roadmap span{background:#f6f2f3;border-radius:8px;padding:8px 10px}
#ap4e-course .ap4e-roadmap .current{background:#f8e3e7;color:#8f2c3e;font-weight:800}
.ap4e-legacy{margin-top:25px;border:1px solid #e6dcdf;border-radius:13px;background:#fff}
.ap4e-legacy summary{padding:16px 18px;cursor:pointer;font-size:13px;color:#713c49;font-weight:800}
.ap4e-legacy .ap4e-legacy-inner{padding:0 18px 20px}
.ap4e-legacy .page-head{margin-top:12px}
#ap4e-course button:focus-visible,.ap4e-legacy summary:focus-visible{outline:3px solid #e7aeb5;outline-offset:2px}
body.large-text #ap4e-course{font-size:18px}body.large-text #ap4e-course .ap4e-card p,body.large-text #ap4e-course .ap4e-hero p,body.large-text #ap4e-course .ap4e-lead,body.large-text #ap4e-course .ap4e-compare-card .ap4e-quote{font-size:18px}
@media(max-width:900px){#ap4e-course .ap4e-methods{grid-template-columns:1fr}#ap4e-course .ap4e-workflow{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){#ap4e-course .ap4e-split{grid-template-columns:1fr}#ap4e-course .ap4e-rail{align-items:stretch}#ap4e-course .ap4e-completion{width:100%}#ap4e-course .ap4e-header{display:block}#ap4e-course .ap4e-pill{display:inline-block;margin-top:11px}#ap4e-course .ap4e-card{padding:15px}}
`;
document.head.appendChild(style);

const legacy = document.createElement("details");
legacy.className = "ap4e-legacy";
const legacySummary = document.createElement("summary");
legacySummary.textContent = "展开旧版 Prompt 练习 · 品质异常 / 缺料分析 / 培训计划";
const legacyInner = document.createElement("div");
legacyInner.className = "ap4e-legacy-inner";
Array.from(host.children).forEach(node => legacyInner.appendChild(node));
legacy.append(legacySummary, legacyInner);
const course = document.createElement("div");
course.id = "ap4e-course";
course.innerHTML = `
<header class="ap4e-hero">
  <p class="ap4e-eyebrow">PROMPT LAB 2.0 · 第一批 / M1</p>
  <h1>从会提问，到真正会用 AI 完成工作</h1>
  <p>参考吴恩达《AI Prompting for Everyone》M1：先理解 AI 高手与新手的区别，再学会判断何时使用模型已有知识、联网搜索或 Deep Research。通过课堂互动理解方法，不背万能提示词。</p>
  <div class="ap4e-hero-meta"><span>讲师教学优先</span><span>制造业改编案例</span><span>互动题与示范 Prompt</span><span>无需 API / 不读取企业系统</span></div>
</header>
<div class="ap4e-rail" aria-label="教学单元导航">
  <div class="ap4e-rail-left" role="tablist" aria-label="第一批课程">
    <button type="button" role="tab" id="ap4e-tab-expert" aria-controls="ap4e-expert" aria-selected="true" data-ap4e-lesson="expert">01 新手 vs 高手</button>
    <button type="button" role="tab" id="ap4e-tab-info" aria-controls="ap4e-info" aria-selected="false" data-ap4e-lesson="info">02 信息获取</button>
  </div>
  <div class="ap4e-completion"><span>已学 <b id="ap4e-done-count">0 / 2</b></span><span class="ap4e-track" aria-hidden="true"><i id="ap4e-track-fill"></i></span></div>
</div>
<section class="ap4e-panel" id="ap4e-expert" role="tabpanel" aria-labelledby="ap4e-tab-expert">
  <div class="ap4e-header">
    <div><p class="ap4e-kicker">LESSON 01 · M1 P3–9</p><h2 class="ap4e-title">同一个业务问题，AI 高手为什么能获得更大的价值？</h2><p class="ap4e-lead">吴恩达用五组“新手 vs 高手”行为进行对比。切换维度，看差别不在字数，而在任务价值、上下文、独立评价、研究和逐步创作。</p></div>
    <span class="ap4e-pill">课堂建议 3 分钟</span>
  </div>
  <div class="ap4e-card">
    <h3>实验 A · 选择一个改变结果质量的关键因素</h3>
    <p>以下是教学用途的制造业改编 Prompt，并非实时 AI 回答。</p>
    <div class="ap4e-tabs" role="group" aria-label="高手对比维度">
      <button type="button" data-ap4e-compare="0" aria-pressed="true">复杂任务</button>
      <button type="button" data-ap4e-compare="1" aria-pressed="false">高质量上下文</button>
      <button type="button" data-ap4e-compare="2" aria-pressed="false">客观审查</button>
      <button type="button" data-ap4e-compare="3" aria-pressed="false">研究取证</button>
      <button type="button" data-ap4e-compare="4" aria-pressed="false">渐进写作</button>
    </div>
    <div class="ap4e-split">
      <div class="ap4e-compare-card"><p class="ap4e-label">常见的新手问法</p><p class="ap4e-quote" id="ap4e-novice"></p><p class="ap4e-caption" id="ap4e-novice-note"></p></div>
      <div class="ap4e-compare-card good"><p class="ap4e-label">更成熟的 AI 协作方式</p><p class="ap4e-quote" id="ap4e-power"></p><p class="ap4e-caption" id="ap4e-power-note"></p></div>
    </div>
    <div class="ap4e-callout"><strong>讲课时要强调：</strong><span id="ap4e-compare-why"></span></div>
    <div class="ap4e-action"><span class="ap4e-counter" id="ap4e-compare-step">对比 1 / 5</span><div class="row"><button type="button" class="ap4e-btn secondary" id="ap4e-copy-expert">复制高手版 Prompt</button><button type="button" class="ap4e-btn" id="ap4e-next-compare">下一组对比 →</button></div></div>
  </div>
  <div class="ap4e-teacher-notes"><strong>讲师提示：</strong>先让学员口头回答：“哪一条更可能帮你解决实际工作问题？为什么？”再切换到上下文、客观审查、研究与渐进写作。强调不是越长越好；小问题一句话即可，复杂任务要提供相关资料并允许多轮协作。来源：M1 p3–9；当前页面案例为制造业教学改编。</div>
  <div class="ap4e-bottom"><small>来源：AP4E_M1 · The AI novice and the AI power user（第3–9页）</small><button type="button" class="ap4e-btn" id="ap4e-complete-expert">学完本节，进入信息获取 →</button></div>
</section>
<section class="ap4e-panel" id="ap4e-info" role="tabpanel" aria-labelledby="ap4e-tab-info" hidden>
  <div class="ap4e-header">
    <div><p class="ap4e-kicker">LESSON 02 · M1 P10–41</p><h2 class="ap4e-title">不是所有问题，都应该用同一种方式问 AI</h2><p class="ap4e-lead">课程区分三条主要信息路径：Pretrained Knowledge、Web Search、Deep Research。了解它们的用途、来源局限与人工核验责任。</p></div>
    <span class="ap4e-pill">课堂建议 7–9 分钟</span>
  </div>
  <div class="ap4e-methods">
    <div class="ap4e-method"><div class="ap4e-method-icon">◎</div><h3>模型已有知识</h3><p>解释通用、相对稳定的概念；不意味着掌握内部资料或最新变化。</p></div>
    <div class="ap4e-method"><div class="ap4e-method-icon">⌕</div><h3>Web Search 联网搜索</h3><p>查询最新、地区相关、冷门的公开信息；需要核查原始出处与日期。</p></div>
    <div class="ap4e-method"><div class="ap4e-method-icon">▤</div><h3>Deep Research 深度研究</h3><p>对多个问题和多份证据进行反复研究、权衡、综合；耗时一般更长。</p></div>
  </div>
  <div class="ap4e-split">
    <div class="ap4e-card">
      <h3>实验 B · 你会怎么选择？</h3>
      <p>先独立判断，再点击“公布解析”。不要因为题目提到技术标准就自动认为一定要深度研究。</p>
      <div class="ap4e-section-gap"></div>
      <span class="ap4e-counter" id="ap4e-question-count">第 1 / 5 题</span>
      <h3 id="ap4e-question-title" style="margin-top:10px"></h3>
      <div class="ap4e-quiz-options" role="group" aria-label="选择信息路径">
        <button type="button" class="ap4e-choice" data-ap4e-answer="0" aria-pressed="false"><strong>A</strong><span>直接利用模型知识</span></button>
        <button type="button" class="ap4e-choice" data-ap4e-answer="1" aria-pressed="false"><strong>B</strong><span>联网搜索并核实来源</span></button>
        <button type="button" class="ap4e-choice" data-ap4e-answer="2" aria-pressed="false"><strong>C</strong><span>使用 Deep Research 系统研究</span></button>
      </div>
      <div id="ap4e-answer-feedback" class="ap4e-feedback" role="status" hidden></div>
      <div class="ap4e-action"><button type="button" class="ap4e-btn secondary" id="ap4e-check-answer" disabled>公布解析</button><button type="button" class="ap4e-btn" id="ap4e-next-question">下一题 →</button></div>
    </div>
    <div class="ap4e-card">
      <h3>三种路径的选择原则</h3>
      <p><strong>先判断任务，而不是先选最强功能。</strong></p>
      <div class="ap4e-callout" style="margin:13px 0">模型已有知识可能过时或不包含企业专有信息；联网搜索结果不一定是可信、最新或完整的；深度研究的综合结论仍需核验引用。</div>
      <h3 style="margin-top:18px">搜索时，应该怎么指定来源？</h3>
      <p>以查询某设备最新公开技术规格为例，选一个优先核查的来源：</p>
      <div class="ap4e-source-list" style="margin-top:11px">
        <button type="button" data-ap4e-source="0" aria-pressed="false">论坛中三年前的用户转述</button>
        <button type="button" data-ap4e-source="1" aria-pressed="false">销售类资讯站的转载文章</button>
        <button type="button" data-ap4e-source="2" aria-pressed="false">制造商官方最新手册（核对型号、版本、发布日期）</button>
      </div>
      <div class="ap4e-feedback" id="ap4e-source-feedback" role="status" hidden></div>
    </div>
  </div>
  <div class="ap4e-card" style="margin-top:15px">
    <h3>Deep Research · 不是一次搜索，而是多步骤研究</h3>
    <p>点击四个环节，查看一份 AI 视觉质检方案研究在每个阶段需要做什么。</p>
    <div class="ap4e-workflow" role="group" aria-label="深度研究四步流程">
      <button type="button" data-ap4e-stage="0" aria-pressed="true"><span>STEP 01</span>制定计划</button>
      <button type="button" data-ap4e-stage="1" aria-pressed="false"><span>STEP 02</span>搜索与阅读</button>
      <button type="button" data-ap4e-stage="2" aria-pressed="false"><span>STEP 03</span>评价证据</button>
      <button type="button" data-ap4e-stage="3" aria-pressed="false"><span>STEP 04</span>综合与引用</button>
    </div>
    <div class="ap4e-stage" id="ap4e-stage-detail"></div>
    <div class="ap4e-action"><span class="ap4e-counter">课堂演示用模拟研究流程，不会自动联网</span><button type="button" class="ap4e-btn secondary" id="ap4e-copy-research">复制 Deep Research 示范任务</button></div>
  </div>
  <div class="ap4e-teacher-notes"><strong>讲师提示：</strong>先请学员判断 OQ、最新设备手册和多方案选型；不要先显示答案。强调 Web Search 可能只扫描页面局部，须打开原链接确认。深度研究是“计划→搜索/阅读→评价来源→综合附引用”的循环过程，不等于任何报告都可靠。来源：M1 p10–41，尤其 p23–32、p39–41。</div>
  <div class="ap4e-bottom"><small>来源：AP4E_M1 · Pretrained knowledge / Web Search / Web Search sources / Using deep research（第10–41页）</small><button type="button" class="ap4e-btn" id="ap4e-complete-info">完成本批课程 ✓</button></div>
</section>
<div class="ap4e-roadmap" aria-label="后续批次路线">
  <span class="current">第一批已开发：新手 vs 高手 / 信息获取</span>
  <span>第二批待开发：上下文 / 头脑风暴 / 迎合与评价 / 渐进写作</span>
  <span>第三批：与文件、Work、Codex 联动</span>
</div>
`;
host.append(course, legacy);

const comparisons = [
{ novice:"帮我分析一下这个质量问题。", power:"这里有同一工序近四周的缺陷记录、批次信息和工艺变更日志。请先核对数据质量，再分析异常集中在哪些批次或时段，列出至少三种可能解释、各自支持证据与验证计划；不要直接断定根因。", old:"停留在一句通用问题，通常只能得到通用建议。", good:"把真实业务任务交给 AI：分析文件、比较假设、规划验证步骤。", why:"高手会给 AI 更复杂、更有价值的任务，并提供完成任务所需资料，而不是只用它回答常识问题。"},
{ novice:"帮我写一份试产总结，要专业一点。", power:"请根据我上传的试产数据、异常记录、验证结论和未关闭问题清单，先整理试产总结的事实摘要。无法从资料核实的项目标记“待确认”，不要编造数值或负责人。", old:"没有资料，AI 不知道本次试产实际发生了什么。", good:"提供日志、文件、截图等相关上下文，减少凭空补全。", why:"决定结果质量的往往不是提示词的长度，而是所提供上下文的真实性和相关性。"},
{ novice:"我们这个 AI 质检项目很成功，你也觉得应该全面推广吧？", power:"请中立评价这个 AI 质检项目是否应扩大试点。分别检查误检率、漏检率、节拍、维护投入、投资回报和数据缺口，给出支持与反对意见，哪些结论尚不能从材料证实？", old:"诱导性提问可能让 AI 倾向于赞同你的观点。", good:"中立描述问题、明确评价标准、要求反面证据。", why:"AI 可能迎合用户。把“你觉得我对吧”改为“有哪些证据支持与反对”，才更有价值。"},
{ novice:"有哪些 AI 视觉质检方案？", power:"请研究公开可核验的工业视觉质检方案，优先查询制造商官方技术资料和真实实施案例。比较部署方式、接口能力、现场验证要求与潜在成本；标注来源发布日期和未核实信息。", old:"容易得到缺少出处、时效不明的罗列。", good:"针对需要新资料的问题主动检索，并评估证据可靠性。", why:"需要最新或细分领域的信息时，不应仅依赖模型的预训练知识。"},
{ novice:"直接写一份完整的 3Q 验证报告。", power:"根据上传的设备规格书、URS与测试记录，先提出 IQ/OQ/PQ 报告大纲及缺失证据清单。待我确认章节和试验依据后，再逐章撰写；所有验证结论必须能追溯到实际记录。", old:"一次成稿容易让错误结构或未经证实的内容被放大。", good:"先梳理材料和大纲，再批改结构，分段展开。", why:"先修改高层结构，比事后反复修改整篇报告更高效；验证结果不能凭 AI 生成。"}
];
const questions = [
{title:"什么是设备的 OQ（运行确认）？请先用通俗语言解释。", correct:0, reason:"相对稳定的概念可以从模型知识开始。但如果要据此编制受控的 3Q 验证文件，必须进一步核对企业程序与适用标准。"},
{title:"查询某品牌视觉检测设备目前公开发布的最新接口规格。", correct:1, reason:"具体产品技术规格可能变化，应该搜索制造商官方资料，核对产品型号、文档版本和发布日期。"},
{title:"为三条产线比较三种 AI 视觉质检方案的实施条件、投资风险和可维护性，形成选择建议。", correct:2, reason:"涉及多问题、多来源与权衡取舍，适合制定研究计划并多轮获取证据。仍需补充本厂节拍、图像、预算等真实数据。"},
{title:"查询本周某项公开发布的工业 AI 行业政策更新。", correct:1, reason:"涉及时间变化，必须核实最新的官方发布；发布单位、发布日期和适用范围均应检查。"},
{title:"系统梳理公开研究，比较不同工艺参数优化方法的证据、适用条件和局限。", correct:2, reason:"需要综合多个研究方向与证据，适合深度研究。需要识别证据等级、实验条件与是否可迁移到本企业。"}
];
const stages = [
"首先明确研究目标：评估 AI 视觉质检的可行性，而非预设“AI 一定更好”。确定产品、检验对象、节拍、质量指标、备选方案、来源范围及交付格式。",
"检索技术手册、研究论文和案例等多种资料，阅读与任务有关的原始内容。发现材料不足时继续搜索，不能只根据搜索摘要下结论。",
"比较来源的权威性、时间、适用产品、验证条件与数据口径；对供应商宣传效果和未经复现的指标标记“待核实”。",
"按部署条件、质量风险、节拍、维护和成本综合整理报告。每个关键结论引用可追溯来源，附上证据缺口、现场试点与验收建议。"
];
const researchPrompt = "请对适用于离散制造产线的 AI 视觉质检解决方案开展深度研究。先列出研究计划，覆盖检验任务、技术路线、部署方式、与设备及 MES 的集成条件、质量指标、节拍、维护和投资风险。优先使用制造商官方技术资料、可信的研究论文和可核验的真实案例，并核对发布日期。对每个关键结论给出原始来源链接，区分已证实事实、推断和待验证事项。最后给出可用于试点决策的对比表、数据缺口和验收清单。不要编造未公开的性能或成本数据。";
let compareIndex=0, questionIndex=0, choiceIndex=-1;
let finished=[false,false];
try {
 const saved=JSON.parse(localStorage.getItem("academy.prompt.m1.batch1")||"null");
 if(Array.isArray(saved) && saved.length===2) finished=saved.map(Boolean);
} catch (_) {}
function byId(id){ return document.getElementById(id); }
function displayCompare(){
 const c=comparisons[compareIndex];
 byId("ap4e-novice").textContent=c.novice;
 byId("ap4e-power").textContent=c.power;
 byId("ap4e-novice-note").textContent=c.old;
 byId("ap4e-power-note").textContent=c.good;
 byId("ap4e-compare-why").textContent=c.why;
 byId("ap4e-compare-step").textContent="对比 "+(compareIndex+1)+" / "+comparisons.length;
 course.querySelectorAll("[data-ap4e-compare]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.ap4eCompare===compareIndex)));
}
function lesson(name){
 const expert=name==="expert";
 byId("ap4e-expert").hidden=!expert;
 byId("ap4e-info").hidden=expert;
 course.querySelectorAll("[data-ap4e-lesson]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.ap4eLesson===name)));
 course.querySelectorAll('[role="tab"]').forEach(b=>b.tabIndex=b.dataset.ap4eLesson===name?0:-1);
 course.querySelector(".ap4e-rail").scrollIntoView({behavior:"smooth",block:"start"});
}
function finish(i){
 finished[i]=true;
 try { localStorage.setItem("academy.prompt.m1.batch1",JSON.stringify(finished)); } catch (_) {}
 byId("ap4e-done-count").textContent=finished.filter(Boolean).length+" / 2";
 byId("ap4e-track-fill").style.width=50*finished.filter(Boolean).length+"%";
 byId("ap4e-complete-expert").textContent=finished[0]?"✓ 已学本节 · 进入信息获取 →":"学完本节，进入信息获取 →";
 byId("ap4e-complete-info").textContent=finished[1]?"✓ 第一批已完成":"完成本批课程 ✓";
}
function showQuestion(){
 const q=questions[questionIndex];
 choiceIndex=-1;
 byId("ap4e-question-count").textContent="第 "+(questionIndex+1)+" / "+questions.length+" 题";
 byId("ap4e-question-title").textContent=q.title;
 byId("ap4e-answer-feedback").hidden=true;
 byId("ap4e-check-answer").disabled=true;
 course.querySelectorAll("[data-ap4e-answer]").forEach(b=>b.setAttribute("aria-pressed","false"));
 byId("ap4e-next-question").textContent=questionIndex===questions.length-1?"返回第一题 ↻":"下一题 →";
}
function showStage(i){
 byId("ap4e-stage-detail").textContent=stages[i];
 course.querySelectorAll("[data-ap4e-stage]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.ap4eStage===i)));
}
function copyValue(value){
 if(typeof window.copyText==="function"){ window.copyText(value); return; }
 if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(()=>alert("已复制"),()=>fallbackCopy(value));
 else fallbackCopy(value);
}
function fallbackCopy(value){
 const t=document.createElement("textarea");t.value=value;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();alert("已复制到剪贴板");
}
course.addEventListener("click",event=>{
 const b=event.target.closest("button"); if(!b) return;
 if(b.dataset.ap4eLesson){lesson(b.dataset.ap4eLesson);return;}
 if(b.dataset.ap4eCompare!==undefined){compareIndex=+b.dataset.ap4eCompare;displayCompare();return;}
 if(b.id==="ap4e-next-compare"){compareIndex=(compareIndex+1)%comparisons.length;displayCompare();return;}
 if(b.id==="ap4e-copy-expert"){copyValue(comparisons[compareIndex].power);return;}
 if(b.id==="ap4e-complete-expert"){finish(0);lesson("info");return;}
 if(b.dataset.ap4eAnswer!==undefined){choiceIndex=+b.dataset.ap4eAnswer;course.querySelectorAll("[data-ap4e-answer]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));byId("ap4e-check-answer").disabled=false;byId("ap4e-answer-feedback").hidden=true;return;}
 if(b.id==="ap4e-check-answer"){
   if(choiceIndex<0)return;
   const q=questions[questionIndex], right=choiceIndex===q.correct, box=byId("ap4e-answer-feedback");
   box.hidden=false;box.classList.toggle("is-wrong",!right);
   box.textContent=(right?"✓ 判断正确。":"建议再比较。推荐选择 "+["模型已有知识","联网搜索","Deep Research"][q.correct]+"。")+" "+q.reason;
   return;
 }
 if(b.id==="ap4e-next-question"){questionIndex=(questionIndex+1)%questions.length;showQuestion();return;}
 if(b.dataset.ap4eSource!==undefined){
   const i=+b.dataset.ap4eSource,box=byId("ap4e-source-feedback");
   course.querySelectorAll("[data-ap4e-source]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
   box.hidden=false;box.classList.toggle("is-wrong",i!==2);
   box.textContent=i===2?"✓ 优先查原始官方资料，并继续核查版本、型号、发布时间与现场适用性。官方来源也不意味着无需验证。":"作为线索可以参考，但正式技术选型优先查制造商原始技术文档，并核对日期、型号、版本和实际适用条件。";
   return;
 }
 if(b.dataset.ap4eStage!==undefined){showStage(+b.dataset.ap4eStage);return;}
 if(b.id==="ap4e-copy-research"){copyValue(researchPrompt);return;}
 if(b.id==="ap4e-complete-info"){finish(1);return;}
});
course.querySelectorAll('[role="tab"]').forEach(tab=>{
 tab.addEventListener("keydown",e=>{
   if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
   e.preventDefault();const target=tab.dataset.ap4eLesson==="expert"?"info":"expert";lesson(target);byId("ap4e-tab-"+target).focus();
 });
});
displayCompare(); showQuestion(); showStage(0); finish(0===1?0:0); 
// The previous line initializes the progress display; do not treat viewing the page as course completion.
finished[0]=false;try{const v=JSON.parse(localStorage.getItem("academy.prompt.m1.batch1")||"null");if(Array.isArray(v)&&v.length===2)finished=v.map(Boolean);}catch(_){}
function refreshProgress(){
 const count=finished.filter(Boolean).length;
 byId("ap4e-done-count").textContent=count+" / 2";
 byId("ap4e-track-fill").style.width=(count*50)+"%";
 byId("ap4e-complete-expert").textContent=finished[0]?"✓ 已学本节 · 进入信息获取 →":"学完本节，进入信息获取 →";
 byId("ap4e-complete-info").textContent=finished[1]?"✓ 第一批已完成":"完成本批课程 ✓";
}
refreshProgress();
})();
