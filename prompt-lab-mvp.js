/* 2026-11-05 Training MVP: three independent Prompt exercises, no AI API. */
(function promptTrainingMVP(){
  'use strict';
  const course=document.getElementById('ap4e-course');
  if(!course || document.getElementById('prompt-quick-mvp'))return;
  const hero=course.querySelector('.ap4e-hero');
  if(!hero)return;
  const get=id=>document.getElementById(id);
  const stages=[
    {
      id:'m1',title:'M1 · 把任务讲清楚',duration:'4 分钟',
      intro:'一句话能启动任务；复杂任务再补背景、必要数据与验证条件。',
      teacher:'先让学员看第一个模糊指令，再切到“补充背景”，问全班：AI现在多知道了什么？最后演示核验版。',
      variants:[
        {title:'① 一句话起步',prompt:'帮我分析一下生产异常。',check:'观察：此时没有具体异常记录，AI只能给通用框架。',risk:'不能把通用分析当成本次生产异常的真实原因。'},
        {title:'② 加上关键上下文',prompt:'这是教学用的虚构记录：A线08:30停机10分钟；当时显示E102报警；09:00员工发现传感器位置有变化；09:15设备恢复。请先按时间整理可确认事实，再列出可能影响因素和仍需现场核实的信息。不要直接断定根因。',check:'检查：时间线是否准确；“位置变化”是否被错误描述为已证实的停机原因。',risk:'记录只是教学样例，不能推出真实设备根因。'},
        {title:'③ 追加结果验收',prompt:'根据以下教学记录：A线08:30停机10分钟；显示E102报警；09:00发现传感器位置变化；09:15设备恢复。请输出“事实 / 推测 / 待核实”三列表格，每项说明对应原文；结尾给出下一步人工核查清单。禁止编造检修动作或根因。',check:'参考要点：08:30、E102、09:00、09:15应准确；“传感器导致停机”只能标为假设。',risk:'如模型作出确定性归因，追问“这项结论的证据是哪一条？”'}
      ]
    },
    {
      id:'m2',title:'M2 · 用追问获得更好的结果',duration:'5 分钟',
      intro:'把AI当思考伙伴：要求备选方案、中立评价、明确依据，再依据反馈迭代。',
      teacher:'先展示迎合性问法和中立问法的差别。让学员选择一个量表维度说明为什么重要，再示范二次追问。',
      variants:[
        {title:'① 识别迎合性提问',prompt:'我认为用AI自动生成所有生产日报肯定是最佳方案，你也同意吧？请支持我的观点。',check:'讨论：这条指令是否诱导模型赞同？它缺少哪些业务约束？',risk:'不能把可能出现的赞同回答当作项目立项证据。'},
        {title:'② 用Rubric客观评价',prompt:'请客观评价“用AI辅助生成生产日报”的方案，不预设结论。分别按数据准确性、实施难度、业务收益、安全与权限四个维度，各按1—5分评价并说明证据缺口；给出至少2个备选实现路线。缺少实际数据时只能给条件性判断。',check:'参考要点：至少4个维度、有反方考虑、无证据时不编造节约工时或投入产出比。',risk:'AI评分只是辅助思考，不能直接作为投资决策。'},
        {title:'③ 继续追问并修订',prompt:'继续上一步的分析。假设我们第一阶段只能用脱敏CSV、没有MES写入权限、必须由工程师确认后发布日报。请根据这些约束重新排序方案，并列出MVP需要的数据字段、实施步骤、验收方法和最大风险。指出与上一版方案的区别。',check:'检查：是否遵守只读、人工确认、脱敏条件；是否给出可测量的验收标准。',risk:'不要把尚未批准的系统接口当成已具备的条件。'}
      ]
    },
    {
      id:'m3',title:'M3 · 图片、数据与应用任务怎么描述',duration:'5 分钟',
      intro:'M3不要求在网页里做完整开发；重点是把不同输入和想要的输出说清楚，并检查结果。',
      teacher:'任选一个最贴近学员岗位的任务现场演示，不需要四个都做。图片练习请只使用模拟或已经授权的素材。',
      variants:[
        {title:'① 图片理解（上传合规截图）',prompt:'请观察我上传的模拟设备界面截图。先列出画面中可以直接看见的事实（文字、数值、位置）；再列出可能的解释；最后说明仅凭这张截图无法判断什么，以及下一步应该补充哪些日志。请勿把推测写成已确认根因。',check:'参考要点：明确区分“看见的文字/数值”和“推断”；遮挡信息应写“无法辨认”。',risk:'上传前遮盖设备身份、内部网络参数、人员和其他敏感信息。'},
        {title:'② 图片生成（培训配图）',prompt:'请为内部AI培训生成一张16:9的简洁插画：模拟制造车间里，工程师站在工位旁使用电脑核对一张质量数据表。干净明亮、写实插画风格、突出人与AI协作。画面不包含真实公司Logo、姓名、产品型号、敏感数据，也不要生成易误导的技术结论。生成后我会指出需要修改的地方。',check:'参考要点：主体、场景、构图比例、风格、排除内容均明确；可二次要求局部修改。',risk:'图片为示意，不能作为真实现场作业指导。'},
        {title:'③ 数据分析（自带虚构数据）',prompt:'分析以下教学用模拟数据：计划产量1000，实际产量930，投入数960，合格数910。请先说明“达成率=实际/计划”“直通率=合格/投入”的口径，再计算两项指标，保留两位小数，列出公式及原始数字。最后说明仅凭这四个数不能判断哪些根因。',check:'参考答案：达成率=930/1000=93.00%；直通率=910/960≈94.79%。不能仅凭指标推断工艺根因。',risk:'留意口径与四舍五入；不要混淆合格率与达成率。'},
        {title:'④ 应用构建（Goal/Input/Output）',prompt:'我想做一个只处理虚构数据的“设备异常登记”小工具。Goal：帮助工程师记录和查找异常。Input：设备编号、发生时间、症状描述。Output：异常记录表和按设备筛选结果。请先给出最小可行功能、输入校验、3条测试用例；不要连接真实设备或企业系统，不要先写复杂架构。等我确认后再实现一个本地原型。',check:'参考要点：目标、输入、输出清楚；有空值/非法日期/重复记录测试；先确认需求再编码。',risk:'原型不应修改任何生产设备或内部业务系统。'}
      ]
    }
  ];
  const style=document.createElement('style');
  style.id='prompt-quick-mvp-style';
  style.textContent=[
    '#prompt-quick-mvp{margin:20px 0 16px;border:1px solid #e5d1d5;border-radius:16px;background:#fff;overflow:hidden;box-shadow:0 6px 20px rgba(85,30,45,.04)}',
    '#prompt-quick-mvp .qm-head{padding:18px 22px;background:#fff5f6;border-bottom:1px solid #ecdce0}',
    '#prompt-quick-mvp .qm-head h2{margin:0 0 4px;font-size:21px;color:#84283a}',
    '#prompt-quick-mvp .qm-head p{margin:0;font-size:13px;color:#635a5f}',
    '#prompt-quick-mvp .qm-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;padding:16px 19px 0}',
    '#prompt-quick-mvp .qm-tabs button{padding:12px 9px;border-radius:10px;border:1px solid #e3d8db;background:white;color:#65404b;text-align:left;font-size:13px;font-weight:750;min-height:60px}',
    '#prompt-quick-mvp .qm-tabs button[aria-selected="true"]{background:#a9283d;color:#fff;border-color:#a9283d}',
    '#prompt-quick-mvp .qm-panel{padding:17px 21px 21px}',
    '#prompt-quick-mvp .qm-panel h3{margin:0 0 4px;font-size:19px}',
    '#prompt-quick-mvp .qm-panel p{margin:0 0 12px;font-size:13px;color:#5e626b}',
    '#prompt-quick-mvp .qm-variants{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}',
    '#prompt-quick-mvp .qm-variants button{border:1px solid #ddd1d5;border-radius:9px;padding:8px 11px;background:#fff;font-size:12px;font-weight:700}',
    '#prompt-quick-mvp .qm-variants button[aria-pressed="true"]{border-color:#a9283d;background:#faedef;color:#89243a}',
    '#prompt-quick-mvp textarea{display:block;min-height:155px;resize:vertical;width:100%;border:1px solid #dcd5d8;border-radius:10px;padding:13px;font-size:14px;line-height:1.8}',
    '#prompt-quick-mvp .qm-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin:12px 0}',
    '#prompt-quick-mvp .qm-actions button{min-height:40px;border-radius:9px;padding:9px 12px;border:1px solid #e3d8db;background:white;color:#6b3743;font-weight:700;font-size:13px}',
    '#prompt-quick-mvp .qm-actions .qm-primary{background:#a9283d;color:white;border-color:#a9283d}',
    '#prompt-quick-mvp .qm-insight{border-left:3px solid #a9283d;background:#fff7f7;padding:12px 14px;border-radius:0 8px 8px 0;margin:12px 0;font-size:13px;line-height:1.75}',
    '#prompt-quick-mvp .qm-insight strong{display:block;margin-bottom:4px}',
    '#prompt-quick-mvp .qm-insight span{display:block}',
    '#prompt-quick-mvp .qm-teacher{display:none;background:#f5f5f5;padding:12px;border-radius:8px;margin-top:12px;font-size:12px;color:#4b4e53}',
    'body.teacher #prompt-quick-mvp .qm-teacher{display:block}',
    '#prompt-quick-mvp .qm-status{color:#5b626b;font-size:12px;min-height:20px}',
    '#prompt-quick-mvp .qm-end{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center;margin-top:10px}',
    '#prompt-full-course{margin:15px 0 20px;border:1px solid #e3dedf;border-radius:12px;background:#fff;overflow:visible}',
    '#prompt-full-course>summary{padding:16px 18px;cursor:pointer;font-size:14px;font-weight:700;color:#863143}',
    '#prompt-full-course[open]>summary{border-bottom:1px solid #eadfe1}',
    '#prompt-full-course>.course-stages,#prompt-full-course>.ap4e-rail,#prompt-full-course>.ap4e-panel,#prompt-full-course>.inline-stage,#prompt-full-course>.ap4e-roadmap,#prompt-full-course>.ap4e-legacy{margin-left:18px;margin-right:18px}',
    'body.large-text #prompt-quick-mvp .qm-head h2{font-size:27px}',
    'body.large-text #prompt-quick-mvp .qm-head p,body.large-text #prompt-quick-mvp .qm-panel p,body.large-text #prompt-quick-mvp textarea,body.large-text #prompt-quick-mvp .qm-insight{font-size:18px}',
    '@media(max-width:600px){#prompt-quick-mvp .qm-tabs{grid-template-columns:1fr}#prompt-quick-mvp .qm-tabs button{min-height:42px}#prompt-quick-mvp .qm-panel{padding:14px}#prompt-full-course>.inline-stage{margin-left:8px;margin-right:8px}}'
  ].join('\n');
  document.head.append(style);
  const quick=document.createElement('section');quick.id='prompt-quick-mvp';quick.setAttribute('aria-label','Prompt Lab课堂MVP');
  quick.innerHTML=[
    '<div class="qm-head"><h2>课堂速讲 · M1 → M2 → M3</h2>',
    '<p>适合明天授课的14分钟主线：先看示例 → 复制到企业允许的ChatGPT → 判断结果。三个阶段独立练习，不依赖其他课程模块。</p></div>',
    '<div class="qm-tabs" role="tablist" aria-label="Prompt三阶段练习">',
    '<button type="button" role="tab" data-qm-stage="m1" aria-selected="true" aria-controls="qm-panel" id="qm-tab-m1">M1 · 基础（4分钟）</button>',
    '<button type="button" role="tab" data-qm-stage="m2" aria-selected="false" aria-controls="qm-panel" id="qm-tab-m2">M2 · 迭代（5分钟）</button>',
    '<button type="button" role="tab" data-qm-stage="m3" aria-selected="false" aria-controls="qm-panel" id="qm-tab-m3">M3 · 多模态（5分钟）</button></div>',
    '<div class="qm-panel" role="tabpanel" aria-labelledby="qm-tab-m1" id="qm-panel">',
    '<h3 id="qm-title"></h3><p id="qm-intro"></p>',
    '<div class="qm-variants" id="qm-variants" role="group" aria-label="本阶段练习选项"></div>',
    '<label for="qm-prompt" class="small"><strong>可编辑练习指令</strong>（网页不会调用AI，请复制到授权的ChatGPT）</label>',
    '<textarea id="qm-prompt" aria-label="课堂Prompt练习内容"></textarea>',
    '<div class="qm-actions"><button type="button" class="qm-primary" id="qm-copy">复制Prompt</button>',
    '<button type="button" id="qm-reset">还原示例</button>',
    '<span class="qm-status" id="qm-copy-status" role="status" aria-live="polite"></span></div>',
    '<div class="qm-insight"><strong>课堂验收：你应该检查什么？</strong><span id="qm-check"></span>',
    '<strong style="margin-top:7px">容易犯的错误</strong><span id="qm-risk"></span></div>',
    '<div class="qm-teacher" id="qm-teacher"></div>',
    '<div class="qm-end"><span class="qm-status" id="qm-progress" role="status"></span>',
    '<div class="qm-actions"><button type="button" id="qm-finish">标记已练习</button>',
    '<button type="button" class="qm-primary" id="qm-next">下一阶段 →</button></div></div>',
    '</div>'
  ].join('');
  const full=document.createElement('details');full.id='prompt-full-course';
  const summary=document.createElement('summary');
  summary.textContent='课后扩展 · 查看完整 M1/M2/M3 共11节互动课程（讲师可按需展开）';
  full.append(summary);
  const items=Array.from(course.children);
  const oldHeroIndex=items.indexOf(hero);
  const rest=items.slice(oldHeroIndex+1);
  hero.after(quick);
  course.append(full);
  rest.forEach(node=>full.append(node));
  const legacy=document.querySelector('.ap4e-legacy');
  if(legacy && legacy.parentNode===course.parentNode)full.append(legacy);
  const eyebrow=hero.querySelector('.ap4e-eyebrow');
  if(eyebrow)eyebrow.textContent='PROMPT LAB · 明日培训 MVP / M1 + M2 + M3';
  const headline=hero.querySelector('h1');
  if(headline)headline.textContent='三步练习，掌握与 AI 协作';
  const description=hero.querySelector('p:not(.ap4e-eyebrow)');
  if(description)description.textContent='M1 说清任务与背景 · M2 追问、比较与客观评价 · M3 对图片、数据和应用表达明确需求。每个阶段都可以单独练习，无需连接Work或Codex。';
  let stage=0,variant=0;
  const drafts=new Map();
  let done=[];
  try{const v=JSON.parse(localStorage.getItem('academy.prompt.mvp.v1')||'[]');if(Array.isArray(v))done=v.filter(x=>stages.some(s=>s.id===x));}catch(_){}
  function save(){try{localStorage.setItem('academy.prompt.mvp.v1',JSON.stringify(done));}catch(_){}}
  function key(){return stages[stage].id+':'+variant;}
  function render(){
    const item=stages[stage];
    quick.querySelectorAll('[data-qm-stage]').forEach(b=>{
      const selected=b.dataset.qmStage===item.id;
      b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;
    });
    get('qm-panel').setAttribute('aria-labelledby','qm-tab-'+item.id);
    get('qm-title').textContent=item.title+' · 建议'+item.duration;
    get('qm-intro').textContent=item.intro;
    const box=get('qm-variants');box.replaceChildren();
    item.variants.forEach((v,i)=>{
      const b=document.createElement('button');b.type='button';b.textContent=v.title;b.dataset.qmVariant=String(i);
      b.setAttribute('aria-pressed',String(i===variant));box.append(b);
    });
    const example=item.variants[variant];
    get('qm-prompt').value=drafts.has(key())?drafts.get(key()):example.prompt;
    get('qm-check').textContent=example.check;
    get('qm-risk').textContent=example.risk;
    get('qm-teacher').textContent='讲师提示：'+item.teacher;
    get('qm-progress').textContent='课堂已练习 '+done.length+' / 3 阶段（自记，不等于正式考核）';
    get('qm-finish').textContent=done.includes(item.id)?'✓ 本阶段已练习':'标记已练习';
    get('qm-next').disabled=stage===2;get('qm-next').textContent=stage===2?'三阶段已到最后一节':'下一阶段 →';
    get('qm-copy-status').textContent='';
  }
  function selectStage(id){
    const i=stages.findIndex(s=>s.id===id);if(i<0)return;
    drafts.set(key(),get('qm-prompt').value);
    stage=i;variant=0;render();
  }
  quick.addEventListener('click',async e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.qmStage){selectStage(t.dataset.qmStage);return;}
    if(t.dataset.qmVariant!==undefined){
      drafts.set(key(),get('qm-prompt').value);
      variant=Number(t.dataset.qmVariant);render();return;
    }
    if(t.id==='qm-reset'){drafts.delete(key());render();return;}
    if(t.id==='qm-finish'){
      if(!done.includes(stages[stage].id))done.push(stages[stage].id);
      save();render();get('qm-copy-status').textContent='已记录练习进度，请继续核验实际AI回答。';return;
    }
    if(t.id==='qm-next'){if(stage<2)selectStage(stages[stage+1].id);return;}
    if(t.id==='qm-copy'){
      const value=get('qm-prompt').value;
      try{
        if(!navigator.clipboard || !navigator.clipboard.writeText)throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(value);
        get('qm-copy-status').textContent='已复制，请粘贴到企业允许的ChatGPT。';
      }catch(_){
        get('qm-prompt').focus();get('qm-prompt').select();
        get('qm-copy-status').textContent='已选中文本，请按 ⌘C 或 Ctrl+C 复制。';
      }
    }
  });
  quick.addEventListener('input',e=>{if(e.target.id==='qm-prompt')drafts.set(key(),e.target.value);});
  quick.querySelector('[role="tablist"]').addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
    const items=[...quick.querySelectorAll('[data-qm-stage]')],i=items.indexOf(e.target);if(i<0)return;
    const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;
    e.preventDefault();selectStage(stages[next].id);items[next].focus();
  });
  function openFullForDeepLink(){
    const hash=decodeURIComponent(location.hash.slice(1));
    if(/^prompt-m[123](?:-|$)/.test(hash)){
      full.open=true;
      requestAnimationFrame(()=>{
        if(hash==='prompt-m1'||hash==='prompt-m2'||hash.startsWith('prompt-m3-')){
          course.querySelector('.course-stages')?.scrollIntoView({block:'start',behavior:'auto'});
        }
      });
    }
  }
  window.addEventListener('hashchange',openFullForDeepLink);
  openFullForDeepLink();
  render();
})();
