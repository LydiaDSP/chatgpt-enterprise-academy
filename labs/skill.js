'use strict';
const $=id=>document.getElementById(id);
const FILES={
 main:{title:'SKILL.md · 使用规则和执行步骤',explain:'主入口包含 name/description 元信息、触发条件、输入前检查、逐步审查方法、自检与不可越权动作。',excerpt:'---\nname: sop-change-review\ndescription: 对比授权的制造SOP新旧版本，输出有出处的变更清单\n---\n\n步骤：确认版本 → 对应章节 → 识别变化 → 记录出处 → 说明风险假设 → 输出待复核项\n限制：不得自动审批、发布或修改生产参数。',url:'../skills/sop-change-review/SKILL.md'},
 schema:{title:'references/output-schema.md · 统一交付格式',explain:'当输出结构较长或需要专业字段定义时，可将完整参考格式独立存放；主文件明确引用。',excerpt:'编号 | 章节/控制点 | 变化类型 | 旧版内容 | 新版内容 | 证据位置 | 潜在影响 | 责任方 | 验证动作 | 状态',url:'../skills/sop-change-review/references/output-schema.md'},
 old:{title:'SOP_演示_旧版.md · 输入A',explain:'虚构旧版，仅供练习。旧版参数：压力0.30±0.05 MPa、时间2.0±0.5 s、首件5件。',excerpt:'版本 V1.0\n压合压力：0.30 ± 0.05 MPa\n保压时间：2.0 ± 0.5 s\n首件抽取5件\n作业员签名，班组长复核',url:'../samples/SOP_演示_旧版.md'},
 new:{title:'SOP_演示_新版.md · 输入B',explain:'虚构新版，包含参数、抽样、校准与复核要求的变动。',excerpt:'版本 V1.1\n新增：压力传感器校准有效期核对\n压合压力：0.35 ± 0.05 MPa\n保压时间：3.0 ± 0.5 s\n首件抽取10件\n新增：质量工程师复核变更记录',url:'../samples/SOP_演示_新版.md'}
};
const CHOICES=[
 {key:'pressure',title:'压合压力数值',changed:true},
 {key:'time',title:'保压时间',changed:true},
 {key:'sampling',title:'首件抽样数量',changed:true},
 {key:'calibration',title:'开机前的校准有效期核对',changed:true},
 {key:'quality',title:'质量工程师的变更复核',changed:true},
 {key:'guard',title:'防护罩状态检查要求',changed:false},
 {key:'number',title:'文件编号 DEMO-SOP-01',changed:false}
];
const DIFFS=[
 ['工艺压力','修改','0.30 ± 0.05 MPa','0.35 ± 0.05 MPa','工艺验证范围、设备参数确认'],
 ['保压时间','修改','2.0 ± 0.5 s','3.0 ± 0.5 s','工艺试验和作业指导复核'],
 ['首件抽样','修改','每班首件5件','每班首件10件','检验资源与采样计划核对'],
 ['校准有效期','新增','未写明此项','每班开机前核对并记录','设备校准记录与培训复核'],
 ['质量复核','新增','班组长复核','新增质量工程师复核变更记录','受控文件签核流程确认']
];
function showFile(key){
 const f=FILES[key];if(!f)return;
 $('fileTitle').textContent=f.title;$('fileExplain').textContent=f.explain;$('fileExcerpt').textContent=f.excerpt;$('fileLink').href=f.url;
 document.querySelectorAll('[data-file]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.file===key)));
}
function renderQuiz(){
 const root=$('differenceQuiz');root.replaceChildren();
 CHOICES.forEach(choice=>{
  const label=document.createElement('label');label.className='check';
  const input=document.createElement('input');input.type='checkbox';input.dataset.diff=choice.key;
  const span=document.createElement('span');span.textContent=choice.title;label.append(input,span);root.appendChild(label);
 });
}
function checkQuiz(){
 const selected=new Set([...document.querySelectorAll('[data-diff]:checked')].map(x=>x.dataset.diff));
 const hits=CHOICES.filter(x=>selected.has(x.key)===x.changed).length;
 const found=CHOICES.filter(x=>x.changed&&selected.has(x.key)).length;
 $('quizScore').textContent='判断正确 '+hits+'/'+CHOICES.length+' 项，重要变更识别 '+found+'/5 项。'+(hits===CHOICES.length?'已达到本练习标准':'可查看参考答案核对漏项和误报');
 return {hits,total:CHOICES.length,important:found};
}
function buildAnswer(){
 const root=$('referenceAnswer');root.replaceChildren();
 const para=document.createElement('p');para.className='micro';para.textContent='参考变化仅来自提供的两份模拟SOP文本；不是AI输出，也不是对实际工艺的风险结论。';root.appendChild(para);
 const wrap=document.createElement('div');wrap.className='table-wrap',table=document.createElement('table');table.className='tbl';
 const head=document.createElement('tr');
 ['控制点','变化','旧版证据','新版证据','待确认影响'].forEach(name=>{const x=document.createElement('th');x.textContent=name;head.appendChild(x)});
 const thead=document.createElement('thead');thead.appendChild(head);table.appendChild(thead);
 const body=document.createElement('tbody');
 DIFFS.forEach(r=>{const row=document.createElement('tr');r.forEach(v=>{const x=document.createElement('td');x.textContent=v;row.appendChild(x)});body.appendChild(row)});
 table.appendChild(body);wrap.appendChild(table);root.appendChild(wrap);
 const conclusion=document.createElement('p');conclusion.className='micro';conclusion.textContent='应使用SKILL.md的输出规范补充证据位置、变化类型、复核责任、验证动作与状态；参数变化不自动等于不合格。';root.appendChild(conclusion);
}
function toggleAnswer(){const root=$('referenceAnswer');root.classList.toggle('hide');$('toggleAnswer').textContent=root.classList.contains('hide')?'查看参考答案':'收起参考答案'}
function updateProgress(){
 const a=[...document.querySelectorAll('[data-skill-check]')],count=a.filter(x=>x.checked).length;$('skillProgress').textContent='已核验 '+count+'/4 项';
 try{localStorage.setItem('academy.skill.accept',JSON.stringify(a.map(x=>x.checked)))}catch{}
}
async function copyTask(){
 const task='请使用 sop-change-review Skill 审查我提供的两份虚构SOP（V1.0与V1.1）。先确认版本与比较范围，按条款列出变更类型、旧版/新版证据位置、潜在影响（待验证）、责任方建议与人工确认清单。不能编造标准条款或自动审批；请把输出与两份原始文档逐项核对。';
 try{if(!navigator.clipboard?.writeText)throw Error('clipboard missing');await navigator.clipboard.writeText(task);$('copyStatus').textContent='已复制测试任务'}catch{const t=document.createElement('textarea');t.value=task;document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch{}t.remove();$('copyStatus').textContent=ok?'已复制':'复制失败，请手动选择此段说明'}
}
function init(){
 document.querySelectorAll('[data-file]').forEach(btn=>btn.addEventListener('click',()=>showFile(btn.dataset.file)));
 $('checkDiff').onclick=checkQuiz;
 $('resetDiff').onclick=()=>{document.querySelectorAll('[data-diff]').forEach(x=>x.checked=false);$('quizScore').textContent='已重置，请重新判断'};
 $('toggleAnswer').onclick=toggleAnswer;
 $('copySkillTask').onclick=copyTask;
 let saved=[];try{saved=JSON.parse(localStorage.getItem('academy.skill.accept')||'[]')}catch{}
 document.querySelectorAll('[data-skill-check]').forEach((x,i)=>{x.checked=saved[i]===true;x.addEventListener('change',updateProgress)});
 showFile('main');renderQuiz();buildAnswer();updateProgress();
}
document.addEventListener('DOMContentLoaded',init);
