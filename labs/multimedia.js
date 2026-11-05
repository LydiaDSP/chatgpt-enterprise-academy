'use strict';
window.initMultimedia=function(root=document,embedded=false){
const $=id=>root.getElementById(id),names=['vision','image','data','build','project'],key='academy.m3.v1';
let state={done:[],records:[],project:[],checks:[]},storageOK=true,current=0;
try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s==='object'){
state.done=Array.isArray(s.done)?[...new Set(s.done.filter(x=>names.includes(x)))]:[];
state.records=Array.isArray(s.records)?s.records.filter(x=>x&&typeof x.device==='string'&&typeof x.symptom==='string').slice(0,200):[];
state.project=Array.isArray(s.project)?s.project.slice(0,4).map(x=>typeof x==='string'?x:''):[];
state.checks=Array.isArray(s.checks)?s.checks.slice(0,5).map(Boolean):[];
}}catch(_){storageOK=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;}catch(_){storageOK=false;}$('save-status').textContent=storageOK?'已保存到当前浏览器':'浏览器存储不可用，请导出备份';}
function progress(){$('progress').textContent=state.done.length+' / 5 节已学（自记）';$('complete').textContent=state.done.includes(names[current])?'✓ 本节已学':'标记本节已学';}
function show(name){current=Math.max(0,names.indexOf(name));root.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==names[current]);root.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-current',b.dataset.step===names[current]?'step':'false'));$('prev').disabled=current===0;$('next').disabled=current===4;progress();}
function go(n){location.hash=(embedded?'prompt-m3-':'')+names[n];show(names[n]);if(!embedded)root.querySelector('[data-panel="'+names[n]+'"]').scrollIntoView({block:'start'});}
window.addEventListener('hashchange',()=>{if(!embedded||location.hash.startsWith('#prompt-m3-'))show(location.hash.slice(1).replace(/^prompt-m3-/,''));});root.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>go(names.indexOf(b.dataset.step))));
$('prev').onclick=()=>{if(current>0)go(current-1);};$('next').onclick=()=>{if(current<4)go(current+1);};$('complete').onclick=()=>{if(!state.done.includes(names[current]))state.done.push(names[current]);save();progress();};
$('teacher').onchange=()=>root.querySelectorAll('.teacher').forEach(x=>x.hidden=!$('teacher').checked);$('large').onchange=()=>(root.host||document.body).classList.toggle('large',$('large').checked);
$('vision-risk').onclick=()=>{$('vision-result').textContent='错误示例（预制）：这是E100网络故障，换网线并重启即可。\n为什么错：末位不可见；离线只是一种状态，可能来自采集服务、供电、网络或配置。图片没有给出根因证据。';};
$('vision-safe').onclick=()=>{$('vision-result').textContent='证据式示例（预制）：\n可见事实：中央设备编号POCT-07；右侧状态离线；最后数据08:42:10。\n无法确认：报警代码末位被遮挡，网关状态未知。\n假设：采集链路中断只是候选方向，不能仅凭截图确认网线损坏。\n下一步：补拍完整报警区域，核对同一时间的采集日志、供电与网络记录，再决定排查次序。';};$('vision-risk').click();
function imagePrompt(){$('image-prompt').textContent='第一轮：为内部AI培训制作16:9配图。主体：'+$('subject').value.trim()+'。环境：简洁、明亮的模拟制造车间。风格：'+$('style').value+'。突出观察与记录，不描绘维修或危险操作；设备结构为示意，不放品牌和真实参数；右侧留标题空白区，不生成精确文字。\n\n第二轮（先附上首轮实际图片）：'+$('revision').value.trim()+'。只修改指定部分，保留其他构图。\n\n生成后检查：人物结构、文字、设备细节与用途。图注标明AI生成的培训示意图，不是正式操作规程。';}
['subject','revision','style'].forEach(id=>$(id).addEventListener(id==='style'?'change':'input',imagePrompt));imagePrompt();
const rows=[['2026-10-26','A线',1000,960,990,948],['2026-10-27','A线',1000,980,1000,976],['2026-10-28','B线',800,720,760,710],['2026-10-29','A线',1000,910,940,900],['2026-10-30','B线',800,790,800,782],['2026-10-31','B线',800,750,775,740]];
rows.forEach(r=>{const tr=document.createElement('tr');r.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td);});$('data-rows').append(tr);});
const pct=(a,b)=>b>0?(100*a/b).toFixed(2)+'%':'不适用';
$('calculate').onclick=()=>{const sum=i=>rows.reduce((a,r)=>a+r[i],0),avg=rows.reduce((a,r)=>a+r[3]/r[2],0)/rows.length;
$('data-result').textContent='数据检查：6行；日期＋产线无重复；数值有效且合格≤投入。\n实际总产量：'+sum(3)+'件；计划总量：'+sum(2)+'件。\n汇总达成率：'+sum(3)+' / '+sum(2)+' = '+pct(sum(3),sum(2))+'。\n示例直通率：'+sum(5)+' / '+sum(4)+' = '+pct(sum(5),sum(4))+'。\n每天达成率直接平均：'+(avg*100).toFixed(2)+'%，把不同计划量的日子赋予相同权重，不能替代整体达成率。\n设备停机共2条记录，只说明出现频次，不代表停机时长或损失最大。';
$('chart').replaceChildren();['A线','B线'].forEach(line=>{const rs=rows.filter(r=>r[1]===line),a=rs.reduce((n,r)=>n+r[3],0),b=rs.reduce((n,r)=>n+r[2],0),div=document.createElement('div');div.className='chart-row';div.textContent=line+'：'+a+' / '+b+' = '+pct(a,b);const bar=document.createElement('div');bar.className='chart-bar';bar.style.width=(a/b*100)+'%';div.append(bar);$('chart').append(div);});};
function buildPrompt(){$('build-prompt').textContent='Goal：'+$('goal').value.trim()+'\nInput：'+$('input').value.trim()+'\nOutput：'+$('output').value.trim()+'\n\n先给出实施计划、文件清单和验收用例，待确认后构建独立本地网页。只操作练习目录，不接生产系统。设备编号1–40字、异常现象1–200字，去除首尾空格，拒绝空值。将输入当文本显示，保存到浏览器；存储不可用时明确提示并提供导出。最多200条；导出JSON，不执行输入内容。\n测试：正常输入、空值、全空格、超长、特殊字符；刷新保留；导出后逐条比对。反馈实际失败输入和报错，修复后重新执行测试。\n这是教学原型。若改动上方目标或字段，请同步调整数据结构和测试，不能假设右侧预制原型已经跟随变更。';}
['goal','input','output'].forEach(id=>$(id).addEventListener('input',buildPrompt));buildPrompt();
function validate(device,symptom){device=device.trim();symptom=symptom.trim();if(!device||!symptom)return {error:'设备编号与异常现象不能为空'};if(device.length>40||symptom.length>200)return {error:'设备编号最多40字，现象最多200字'};return {device,symptom};}
function renderRecords(){$('records').replaceChildren();state.records.forEach((r,i)=>{const li=document.createElement('li');li.textContent=(i+1)+'. '+r.device+'：'+r.symptom;$('records').append(li);});}
$('add-record').onclick=()=>{const r=validate($('device').value,$('symptom').value);if(r.error){$('record-status').textContent=r.error;return;}if(state.records.length>=200){$('record-status').textContent='已达200条上限，请导出备份';return;}state.records.push(r);save();renderRecords();$('record-status').textContent=storageOK?'已添加并保存':'已添加到本次页面，但未持久保存，请导出';$('device').value='';$('symptom').value='';};renderRecords();
$('run-tests').onclick=()=>{const cases=[['空值拒绝',!!validate('','离线').error],['空白拒绝',!!validate('  ','离线').error],['超长拒绝',!!validate('a'.repeat(41),'离线').error],['首尾空格清理',validate(' A ',' B ').device==='A'],['正常输入',!validate('A','离线').error],['特殊字符原样保留',validate('<b>A</b>','离线').device==='<b>A</b>']];$('test-result').textContent=cases.filter(x=>x[1]).length+'/6 项逻辑检查通过\n'+cases.map(x=>(x[1]?'✓ ':'✗ ')+x[0]).join('\n')+'\n这些检查运行本站验证函数，不是对Codex生成版本的验收。';};
const projectIDs=['project-question','project-evidence','project-app','project-check'];projectIDs.forEach((id,i)=>{$(id).value=state.project[i]||'';$(id).addEventListener('input',()=>{state.project=projectIDs.map(id=>$(id).value);save();project();});});
const checks=[...root.querySelectorAll('#checks input')];checks.forEach((x,i)=>{x.checked=!!state.checks[i];x.addEventListener('change',()=>{state.checks=checks.map(c=>c.checked);save();project();});});
function project(){const n=checks.filter(x=>x.checked).length,filled=projectIDs.filter(id=>$(id).value.trim()).length;$('project-score').textContent='自评 '+n+'/5 项；项目记录 '+filled+'/4 栏。'+(n===5&&filled===4?'可提交讲师复核，尚非验收通过。':'继续补充证据与实测记录。');$('project-output').textContent='# M3 综合项目单（教学练习）\n\n'+projectIDs.map((id,i)=>['## 1. 问题','## 2. 证据','## 3. 应用要求','## 4. 实测记录'][i]+'\n'+($(id).value.trim()||'待补充')).join('\n\n')+'\n\n## 自评清单\n'+checks.map(x=>'- ['+(x.checked?'x':' ')+'] '+x.parentElement.textContent.trim()).join('\n')+'\n\n自评不等于正式验收；请附可运行成果与原始证据，由讲师或同事复核。';}project();
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-records').onclick=()=>download('demo-records.json',JSON.stringify(state.records,null,2),'application/json');$('export-project').onclick=()=>download('M3-project.md',$('project-output').textContent,'text/markdown;charset=utf-8');
root.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const s=$(b.dataset.copy).textContent;try{await navigator.clipboard.writeText(s);$('copy-status').textContent='已复制，可粘贴到企业允许的AI工具中。';}catch(_){const range=document.createRange();range.selectNodeContents($(b.dataset.copy));window.getSelection().removeAllRanges();window.getSelection().addRange(range);$('copy-status').textContent='自动复制不可用，已选中文本，请按 Ctrl+C 或 ⌘C。';}}));
if(!storageOK)$('save-status').textContent='旧记录无法读取，当前可继续练习，请导出备份';show(location.hash.slice(1).replace(/^prompt-m3-/,''));
return {show};
};
if(document.getElementById('vision-result'))window.initMultimedia();
