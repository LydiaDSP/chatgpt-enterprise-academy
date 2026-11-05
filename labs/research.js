'use strict';
const $=id=>document.getElementById(id);
const SCENARIOS={
  vision:{focus:'比较用于离散制造产品表面缺陷检测的传统规则视觉与深度学习视觉方案。重点研究适用缺陷类型、标注数据要求、误检漏检、边缘部署成本和试点验收方法。',name:'视觉检测方案调研'},
  maintenance:{focus:'调研离散制造设备预测性维护的落地方法，对比基于阈值、统计特征和机器学习的方案。重点考察故障标签稀缺、采样频率、误报成本与维护闭环。',name:'设备预测性维护'},
  validation:{focus:'研究制造企业开展设备或软件系统IQ/OQ/PQ验证时常见的文档、风险评估、证据留存和变更控制实践。区分适用法规、行业指南与企业内部要求，不预设某标准对本企业强制适用。',name:'3Q验证资料研究'}
};
const STEPS=[
 {title:'第1步｜明确可决策的问题',html:'<p>先确定对象、技术问题和最终交付。不要求AI一开始生成长篇答案。</p><div class="info">讲师演示：让学员指出研究边界、目标读者、是否有内部资料。目标是产出“可用于技术选型或试点立项”的证据，而不是搜索结果拼贴。</div>'},
 {title:'第2步｜审阅Deep Research计划',html:'<p>在真实ChatGPT中选择 Deep Research，提交任务单后检查其计划。必要时缩小研究范围或补充比较指标。</p><div class="info">检查四点：①来源范围是否适合？②是否有反例与局限？③是否区分厂商宣称和第三方测试？④是否列出不能通过公开信息回答的问题？</div>'},
 {title:'第3步｜查证关键来源',html:'<p>对标准、论文、设备参数和产品能力分别选择合适来源。不能仅凭AI摘要判断技术方案可靠。</p><div class="info">对照原始页面：标题、发布机构、发布日期/版本、适用范围、测试条件。缺少证据时标注“待核实”，不要推断参数。</div>'},
 {title:'第4步｜验收研究报告',html:'<p>要求交付“比较矩阵 + 关键争议 + 风险与空白 + 最小试点验证计划”，保留可追溯来源。</p><div class="info">讲师提出反例：如果两个来源对准确率定义不同，报告应说明不可直接横比，并建议统一测试集、阈值和误报/漏报口径。</div>'}
];
const EVIDENCE=[
 {title:'材料A · 发布机构官网的规格文档',desc:'公开规格文档列出相机像素、接口、工作温度，并标有修订日期；未提供现场检测效果。',answer:'fact',why:'可支持“公开规格是什么”的基础事实，但不能直接证明在本企业缺陷检测任务中的实际效果。'},
 {title:'材料B · 宣传海报的准确率数字',desc:'宣传图写“识别准确率99.9%”，但没有测试样本、缺陷定义或误检漏检口径。',answer:'clue',why:'这只能作为进一步索取证据的线索。应要求样本量、测试集分布、FP/FN定义与第三方/现场复核。'},
 {title:'材料C · 匿名讨论帖的效果断言',desc:'匿名帖子说“装上以后完全不会误报”，无设备型号、记录或来源。',answer:'reject',why:'无法追溯、没有试验条件，不能据此作出技术选型、采购或质量决策。'}
];
const OPTIONS=[['fact','可证实有限事实'],['clue','仅作后续查证线索'],['reject','不能作为决策依据']];
const state={scenario:'vision',step:0,answers:new Map()};
function promptText(){
 const audience=$('audience').selectedOptions[0].textContent;
 const sources=$('sourcePolicy').value==='public'?'仅限公开可复核资料，不引用内部系统':'使用公开可复核资料；仅在我明确授权并上传文件后分析那些附件';
 return '研究任务：'+SCENARIOS[state.scenario].name+'\n研究目标：'+$('focus').value.trim()+'\n目标读者：'+audience+'\n来源限制：'+sources+'\n请先提出研究计划供我确认，并在计划中列出对比维度、信息缺口、优先来源和试点验证问题。\n研究时区分原始证据、厂商声明、第三方观点与推测；关键结论附来源链接及发布日期/版本，并标注无法核实或口径不一致之处。\n最终交付：一页管理摘要、证据比较矩阵、适用前提/风险、待验证清单、最小试点方案。不要编造数据或把相关性当作因果。';
}
function showPrompt(){$('researchPrompt').textContent=promptText()}
function selectScenario(id){if(!SCENARIOS[id])return;state.scenario=id;$('focus').value=SCENARIOS[id].focus;document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===id)));showPrompt()}
function showStep(){const v=STEPS[state.step];$('stepTitle').textContent=v.title;$('stepBody').innerHTML=v.html;document.querySelectorAll('[data-step]').forEach((b,i)=>{b.classList.toggle('active',i===state.step);b.setAttribute('aria-current',String(i===state.step?'step':'false'))});$('prevStep').disabled=state.step===0;$('nextStep').disabled=state.step===STEPS.length-1}
function renderEvidence(){
 $('evidenceExercises').innerHTML='';
 EVIDENCE.forEach((e,i)=>{
  const article=document.createElement('article');article.className='card';
  const head=document.createElement('h3');head.textContent=e.title;
  const p=document.createElement('p');p.textContent=e.desc;
  const line=document.createElement('div');line.className='row';
  OPTIONS.forEach(([value,label])=>{const btn=document.createElement('button');btn.className='btn';btn.type='button';btn.textContent=label;btn.dataset.evidence=String(i);btn.dataset.answer=value;btn.setAttribute('aria-pressed',String(state.answers.get(i)===value));btn.onclick=()=>{state.answers.set(i,value);renderEvidence()};line.appendChild(btn)});
  const feedback=document.createElement('p');feedback.className='micro';
  if(state.answers.has(i)){feedback.textContent=state.answers.get(i)===e.answer?'✓ 判断符合此练习的证据规则':'仍需核实：请查看下方“判定依据”';feedback.style.color=state.answers.get(i)===e.answer?'#207450':'#9a6728'}
  article.append(head,p,line,feedback);$('evidenceExercises').appendChild(article);
 });
 const correct=EVIDENCE.filter((e,i)=>state.answers.get(i)===e.answer).length;
 $('evidenceScore').textContent='已判断 '+state.answers.size+'/3 · 符合参考判断 '+correct+'/3';
 $('evidenceMeter').style.width=(100*state.answers.size/EVIDENCE.length)+'%';
}
function showRationale(){
 const out=EVIDENCE.map((e,i)=>e.title+'\n参考：'+OPTIONS.find(x=>x[0]===e.answer)[1]+'。'+e.why).join('\n\n');
 $('rationale').textContent=out;$('rationale').classList.toggle('hide');$('showRationale').textContent=$('rationale').classList.contains('hide')?'显示判定依据':'隐藏判定依据';
}
function updateAcceptance(){const checks=[...document.querySelectorAll('[data-accept]')];const count=checks.filter(c=>c.checked).length;$('acceptanceProgress').textContent='完成 '+count+'/5 项；'+(count===checks.length?'可以提交人工核查':'请逐项检查真实报告');try{localStorage.setItem('academy.research.accept',JSON.stringify(checks.map(x=>x.checked)))}catch{}}
async function copyResearch(){
 const value=promptText();
 try{if(!navigator.clipboard?.writeText)throw Error('clipboard missing');await navigator.clipboard.writeText(value);$('copyStatus').textContent='研究任务单已复制'}catch{const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.top='0';document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch{}t.remove();$('copyStatus').textContent=ok?'研究任务单已复制':'浏览器不允许自动复制，请手动选择上方任务单'}
}
function init(){
 document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>selectScenario(b.dataset.case)));
 ['focus','audience','sourcePolicy'].forEach(id=>$(id).addEventListener(id==='focus'?'input':'change',showPrompt));
 $('copyResearch').addEventListener('click',copyResearch);
 $('resetResearch').addEventListener('click',()=>selectScenario(state.scenario));
 document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{state.step=+b.dataset.step;showStep()}));
 $('prevStep').addEventListener('click',()=>{state.step=Math.max(0,state.step-1);showStep()});
 $('nextStep').addEventListener('click',()=>{state.step=Math.min(STEPS.length-1,state.step+1);showStep()});
 $('showRationale').addEventListener('click',showRationale);
 let prev=[];try{prev=JSON.parse(localStorage.getItem('academy.research.accept')||'[]')}catch{}
 document.querySelectorAll('[data-accept]').forEach((x,i)=>{x.checked=prev[i]===true;x.addEventListener('change',updateAcceptance)});
 selectScenario('vision');showStep();renderEvidence();updateAcceptance();
}
document.addEventListener('DOMContentLoaded',init);
