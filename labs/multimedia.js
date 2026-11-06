'use strict';
window.initMultimedia=function(root=document,embedded=false){
const $=id=>root.getElementById(id),names=['vision','image','data','build','project'],key='academy.m3.v1';
let state={done:[],records:[],project:[],checks:[]},storageOK=true,current=0;
try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s==='object'){
state.done=Array.isArray(s.done)?[...new Set(s.done.filter(x=>names.includes(x)))]:[];
state.records=Array.isArray(s.records)?s.records.filter(x=>x&&typeof x.device==='string').slice(0,200).map(x=>({device:x.device,date:typeof x.date==='string'?x.date:'',inspector:typeof x.inspector==='string'?x.inspector:'历史记录',result:x.result==='正常'?'正常':'异常',symptom:typeof x.symptom==='string'?x.symptom:''})):[];
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
let buildMode='single';
function buildPrompt(){
 const fields=[
  ['Goal｜目标',$('goal').value.trim()],
  ['Input｜输入',$('input').value.trim()],
  ['Layout｜界面布局',$('layout').value.trim()],
  ['Features｜特殊功能',$('features').value.trim()],
  ['Output｜输出',$('output').value.trim()]
 ];
 const brief=fields.map(([label,value])=>'【'+label+'】\n'+(value||'待补充')).join('\n\n');
 const safety='【实施边界与交付要求】\n先检查需求是否完整；如有关键歧义先提问。仅在独立练习目录中开发，不连接 MES、QMS、生产数据库或真实设备，不调用未经批准的外部服务。将用户输入作为普通文本处理，不执行输入内容。完成后说明文件结构、启动方法、功能清单和测试结果。';
 if(buildMode==='single'){
  $('build-prompt').textContent='请作为一名耐心的 AI 应用开发搭档，帮我构建一个可以在浏览器中运行的小工具。请严格依据以下五个维度理解需求：\n\n'+brief+'\n\n'+safety+'\n\n【工作方式】先输出简短实现计划、文件清单和验收用例；确认没有关键歧义后再实现。完成后逐项运行正常输入、空值、空格、超长内容、特殊字符、刷新恢复和导出测试，不要只告诉我“理论上可行”。';
 }else{
  $('build-prompt').textContent='请与我采用渐进式方式开发，不要一次性完成所有工作。以下是已经整理的五要素需求：\n\n'+brief+'\n\n'+safety+'\n\n【请按轮次协作】\n第1轮：先复述需求，指出信息缺口，给出最小版本计划、文件清单和测试用例；暂时不要写代码。\n第2轮：我确认后，只实现最小可运行版本，并告诉我如何启动和操作。\n第3轮：根据我的反馈，逐项增加功能或调整布局；每次说明改动范围，保留已正常工作的功能。\n第4轮：根据我提供的操作、预期结果、实际现象和报错信息定位问题，先做最小修复，再运行原测试与回归测试。\n第5轮：总结已完成内容、未完成事项、风险和测试结果。每一轮等待我确认后再继续。';
 }
}
function setBuildMode(mode){
 buildMode=mode==='incremental'?'incremental':'single';
 root.querySelectorAll('[data-build-mode]').forEach(b=>{
  const selected=b.dataset.buildMode===buildMode;
  b.classList.toggle('selected',selected);
  b.setAttribute('aria-selected',String(selected));
 });
 $('build-mode-note').textContent=buildMode==='single'
  ?'适合需求已经比较明确：把五要素一次性告诉 AI，让它先给出计划，再生成第一版。'
  :'适合想法还不完整：先让 AI 澄清和规划，再按轮次实现、调整、排错；每轮确认后再继续。';
 buildPrompt();
}
['goal','input','layout','features','output'].forEach(id=>$(id).addEventListener('input',buildPrompt));
root.querySelectorAll('[data-build-mode]').forEach(b=>b.addEventListener('click',()=>setBuildMode(b.dataset.buildMode)));
buildPrompt();
function validateInspection(device,date,inspector,result,symptom){
 device=String(device||'').trim();date=String(date||'').trim();inspector=String(inspector||'').trim();symptom=String(symptom||'').trim();
 if(!device||!date||!inspector)return {error:'设备编号、点检日期和点检人员均为必填项'};
 if(device.length>40||inspector.length>40||symptom.length>200)return {error:'设备编号/点检人员最多40字，异常描述最多200字'};
 if(!['正常','异常'].includes(result))return {error:'请选择有效的点检结果'};
 if(result==='异常'&&!symptom)return {error:'点检结果为异常时，必须填写异常描述'};
 return {device,date,inspector,result,symptom};
}
function renderRecords(){
 $('records').replaceChildren();
 const filter=$('record-filter').value;
 const visible=state.records.filter(r=>filter==='abnormal'?r.result==='异常':true);
 visible.forEach((r,i)=>{
  const li=document.createElement('li');
  li.className=r.result==='异常'?'inspection-abnormal':'inspection-normal';
  const date=r.date||'历史记录';
  li.textContent=(i+1)+'. '+date+' · '+r.device+' · '+r.inspector+' · '+r.result+(r.symptom?'：'+r.symptom:'');
  $('records').append(li);
 });
 const total=state.records.length,abnormal=state.records.filter(r=>r.result==='异常').length;
 $('record-summary').textContent='共 '+total+' 条记录 · 正常 '+(total-abnormal)+' 条 · 异常 '+abnormal+' 条'+(filter==='abnormal'?' · 当前仅显示异常记录':'');
 if(!visible.length){const li=document.createElement('li');li.className='empty-record';li.textContent='暂无符合条件的点检记录';$('records').append(li);}
}
$('check-result').addEventListener('change',()=>{$('symptom').placeholder=$('check-result').value==='异常'?'异常时必填，例如：设备运行指示灯未亮':'正常时可留空；如有补充说明可填写';});
$('record-filter').addEventListener('change',renderRecords);
$('add-record').onclick=()=>{
 const r=validateInspection($('device').value,$('inspection-date').value,$('inspector').value,$('check-result').value,$('symptom').value);
 if(r.error){$('record-status').textContent=r.error;return;}
 if(state.records.length>=200){$('record-status').textContent='已达200条上限，请先导出备份';return;}
 state.records.push(r);save();renderRecords();
 $('record-status').textContent=storageOK?'已添加并保存到当前浏览器':'已添加到本次页面，但未持久保存，请导出备份';
 $('device').value='';$('inspector').value='';$('symptom').value='';
};
renderRecords();
$('run-tests').onclick=()=>{
 const valid=['DEMO-01','2026-11-06','测试人员','正常',''];
 const cases=[
  ['必填字段拒绝',!!validateInspection('','','','正常','').error],
  ['空白设备编号拒绝',!!validateInspection('  ',valid[1],valid[2],'正常','').error],
  ['缺少日期拒绝',!!validateInspection(valid[0],'',valid[2],'正常','').error],
  ['缺少点检人员拒绝',!!validateInspection(valid[0],valid[1],'','正常','').error],
  ['异常描述必填',!!validateInspection(valid[0],valid[1],valid[2],'异常','').error],
  ['超长字段拒绝',!!validateInspection('a'.repeat(41),valid[1],valid[2],'正常','').error],
  ['首尾空格清理',validateInspection(' DEMO-01 ',valid[1],' 测试人员 ','正常','').device==='DEMO-01'],
  ['正常记录可提交',!validateInspection(...valid).error],
  ['特殊字符按文本保留',validateInspection('<b>DEMO</b>',valid[1],valid[2],'正常','').device==='<b>DEMO</b>']
 ];
 $('test-result').textContent=cases.filter(x=>x[1]).length+'/9 项逻辑检查通过\n'+cases.map(x=>(x[1]?'✓ ':'✗ ')+x[0]).join('\n')+'\n这些检查运行本站验证函数；仍需对实际开发成果进行人工验收。';
};
const projectIDs=['project-question','project-evidence','project-app','project-check'];projectIDs.forEach((id,i)=>{$(id).value=state.project[i]||'';$(id).addEventListener('input',()=>{state.project=projectIDs.map(id=>$(id).value);save();project();});});
const checks=[...root.querySelectorAll('#checks input')];checks.forEach((x,i)=>{x.checked=!!state.checks[i];x.addEventListener('change',()=>{state.checks=checks.map(c=>c.checked);save();project();});});
function project(){const n=checks.filter(x=>x.checked).length,filled=projectIDs.filter(id=>$(id).value.trim()).length;$('project-score').textContent='自评 '+n+'/5 项；项目记录 '+filled+'/4 栏。'+(n===5&&filled===4?'可提交讲师复核，尚非验收通过。':'继续补充证据与实测记录。');$('project-output').textContent='# M3 综合项目单（教学练习）\n\n'+projectIDs.map((id,i)=>['## 1. 问题','## 2. 证据','## 3. 应用要求','## 4. 实测记录'][i]+'\n'+($(id).value.trim()||'待补充')).join('\n\n')+'\n\n## 自评清单\n'+checks.map(x=>'- ['+(x.checked?'x':' ')+'] '+x.parentElement.textContent.trim()).join('\n')+'\n\n自评不等于正式验收；请附可运行成果与原始证据，由讲师或同事复核。';}project();
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-records').onclick=()=>download('equipment-inspection-demo.json',JSON.stringify(state.records,null,2),'application/json');$('export-project').onclick=()=>download('M3-project.md',$('project-output').textContent,'text/markdown;charset=utf-8');
root.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const s=$(b.dataset.copy).textContent;try{await navigator.clipboard.writeText(s);$('copy-status').textContent='已复制，可粘贴到企业允许的AI工具中。';}catch(_){const range=document.createRange();range.selectNodeContents($(b.dataset.copy));window.getSelection().removeAllRanges();window.getSelection().addRange(range);$('copy-status').textContent='自动复制不可用，已选中文本，请按 Ctrl+C 或 ⌘C。';}}));
if(!storageOK)$('save-status').textContent='旧记录无法读取，当前可继续练习，请导出备份';show(location.hash.slice(1).replace(/^prompt-m3-/,''));
return {show};
};
if(document.getElementById('vision-result'))window.initMultimedia();
