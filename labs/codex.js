'use strict';
const $=id=>document.getElementById(id);
const HEADERS=['订单号','料号','数量','交期','供应商'];
const STAGES=[
 {title:'阶段1 · 用业务语言说清楚“做什么”',description:'让学员定义输入、输出、异常规则和限制条件。明确“重复”不等于直接删除。',teacher:'讲师展示：第一次不要让Codex马上写代码，先看它是否理解了字段和验收要求。',prompt:'我要为采购同事开发一个本地CSV订单合并工具。输入：多份表头相同的CSV（订单号、料号、数量、交期、供应商）。输出：合并结果.csv与异常清单.csv。识别“订单号+料号”重复、缺失交期、非法数量。保留全部原始行并标记来源文件/原始行号，不覆盖源文件。请先复述需求并指出需要确认的业务口径，暂时不要修改文件。'},
 {title:'阶段2 · 先检查样例与运行环境',description:'让Codex读取独立练习目录，确认CSV字段、样例异常、运行环境和安全边界。',teacher:'讲师展示：让学员观察Codex是否先读文件，是否擅自访问网络或其他目录。',prompt:'请只读取当前练习目录的3份模拟采购订单CSV。列出表头、记录数、重复订单的判断方法、预期异常和拟采用的实现方案。确认不需要外网、不读取其他目录，先输出计划，不改动原数据。'},
 {title:'阶段3 · 实现最小可用程序',description:'让Codex选择当前环境可运行的方案，生成命令和使用说明。',teacher:'讲师展示：要求Codex报告创建的文件、执行命令和输出路径，而不只描述“已完成”。',prompt:'根据已确认的规则，在当前练习目录实现本地CSV合并工具。优先使用当前环境已有的Python标准库或等效本地工具，不引入额外服务。对缺失表头、格式错误给出明确提示。保留原文件，输出合并结果与异常清单，并写出最简使用说明。请实际运行一次。'},
 {title:'阶段4 · 用反例挑战并修复',description:'测试重复键、缺失字段、非法数量、引号包围的逗号和空文件，验证失败时的提示。',teacher:'讲师展示：看运行结果、失败用例、修复diff和再次测试，不把“模型说通过”当成证据。',prompt:'请先补充自动测试，再运行测试并展示结果。至少覆盖：①3份样例合计9行且2行异常；②有引号的逗号字段可读取；③缺失必需列明确报错；④数量为非数字时报错或标记；⑤原文件未被覆盖；⑥CSV导出避免表格公式注入。发现失败时修复后重跑。'},
 {title:'阶段5 · 交付给真正使用的人',description:'把运行方法、规则边界、失败处理、测试证据交给业务人员审核。',teacher:'讲师展示：交付不是一段代码，而是工具、输出文件、运行说明和可重复验收证据。',prompt:'请整理交付说明：项目文件列表、启动/使用步骤、输入格式、异常规则、测试通过情况及已知限制。生成一份给采购同事的简短使用说明。标注仅供模拟数据验证、未获批准前不可直接处理真实订单或接入ERP。'}
];
const DEMO=[
 {name:'采购订单_模拟_1.csv',text:'订单号,料号,数量,交期,供应商\nPO-001,MAT-A,100,2026-11-07,模拟供应商甲\nPO-002,MAT-B,80,2026-11-09,模拟供应商乙\nPO-003,MAT-C,60,2026-11-10,模拟供应商丙'},
 {name:'采购订单_模拟_2.csv',text:'订单号,料号,数量,交期,供应商\nPO-004,MAT-A,30,2026-11-12,模拟供应商甲\nPO-002,MAT-B,80,2026-11-09,模拟供应商乙\nPO-005,MAT-D,120,2026-11-14,模拟供应商丁'},
 {name:'采购订单_模拟_3.csv',text:'订单号,料号,数量,交期,供应商\nPO-006,MAT-B,90,2026-11-18,模拟供应商乙\nPO-007,MAT-C,45,2026-11-20,模拟供应商丙\nPO-008,MAT-E,70,,模拟供应商戊'}
];
const CHALLENGE=[{name:'挑战_含异常.csv',text:'订单号,料号,数量,交期,供应商\nPO-010,MAT-A,100,2026-12-07,示例供应商\nPO-010,MAT-A,20,2026-12-08,示例供应商\nPO-011,MAT-B,abc,,示例供应商\n,MAT-C,-8,2026-12-12,示例供应商'}];
let stage=0,inputs=[],lastResult=null;
function parseCSV(text){
 text=String(text).replace(/^\uFEFF/,'');let rows=[],row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(quoted){quoted=false}else if(cell===''){quoted=true}else throw Error('CSV引号位置不正确（第'+(rows.length+1)+'行）')}
  else if(c===','&&!quoted){row.push(cell);cell=''}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()!==''))rows.push(row);row=[];cell=''}
  else cell+=c;
 }
 if(quoted)throw Error('CSV存在未闭合的双引号');
 if(cell!==''||row.length){row.push(cell);if(row.some(x=>x.trim()!==''))rows.push(row)}
 return rows;
}
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number),v=new Date(Date.UTC(y,m-1,d));return v.getUTCFullYear()===y&&v.getUTCMonth()===m-1&&v.getUTCDate()===d}
function mergeAndValidate(files){
 if(!Array.isArray(files)||files.length===0)throw Error('请先选择CSV文件');
 const output=[],seen=new Map();
 files.forEach(file=>{
  const parsed=parseCSV(file.text);
  if(!parsed.length)throw Error(file.name+' 是空文件');
  const head=parsed[0].map(x=>x.trim());
  for(const name of HEADERS){if(!head.includes(name))throw Error(file.name+' 缺少必需列：'+name);if(head.filter(x=>x===name).length!==1)throw Error(file.name+' 的列名重复：'+name)}
  parsed.slice(1).forEach((row,index)=>{
   if(row.length!==head.length)throw Error(file.name+' 第'+(index+2)+'行列数不匹配（期待'+head.length+'列，实际'+row.length+'列）');
   const r={};HEADERS.forEach(h=>r[h]=row[head.indexOf(h)]);
   r['来源文件']=file.name;r['源行号']=index+2;
   const issues=[],order=r['订单号'].trim(),sku=r['料号'].trim(),q=r['数量'].trim(),date=r['交期'].trim();
   if(!order||!sku)issues.push('主键缺失');
   else{const key=JSON.stringify([order,sku]);if(seen.has(key))issues.push('重复订单（首次位置：'+seen.get(key)+'）');else seen.set(key,file.name+' 第'+(index+2)+'行')}
   if(!q||!Number.isFinite(Number(q))||Number(q)<=0)issues.push('数量无效');
   if(!date)issues.push('交期缺失');else if(!validDate(date))issues.push('交期格式或日期无效');
   r['检查结果']=issues.length?issues.join('；'):'正常';
   output.push(r);
  });
 });
 return {rows:output,errors:output.filter(r=>r['检查结果']!=='正常')};
}
function safeCSVCell(value){
 let s=String(value??'');
 if(/^[\s]*[=+\-@]/.test(s)||/^[\t\r]/.test(s))s="'"+s;
 return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
}
function encodeCSV(rows){return '\uFEFF'+rows.map(r=>r.map(safeCSVCell).join(',')).join('\r\n')}
function downloadRows(rows,name){const blob=new Blob([encodeCSV(rows)],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function showStage(){
 const v=STAGES[stage];$('stageTitle').textContent=v.title;$('stageDescription').textContent=v.description;$('stageTeacher').textContent=v.teacher;$('stagePrompt').textContent=v.prompt;
 document.querySelectorAll('[data-stage]').forEach((btn,i)=>{btn.classList.toggle('active',stage===i);btn.setAttribute('aria-pressed',String(stage===i))});
 $('stagePrev').disabled=stage===0;$('stageNext').disabled=stage===STAGES.length-1;
}
function loadFiles(list){inputs=list;lastResult=null;$('runMerge').disabled=false;$('sourceStatus').textContent='已载入 '+list.length+' 份：'+list.map(x=>x.name).join('、');$('mergeResults').replaceChildren()}
function cell(type,text){const e=document.createElement(type);e.textContent=String(text);return e}
function renderResult(res){
 const holder=$('mergeResults');holder.replaceChildren();const card=document.createElement('article');card.className='card';
 const head=document.createElement('h3');head.textContent='真实执行结果：'+res.rows.length+'行记录，'+res.errors.length+'行有异常';
 const p=document.createElement('p');p.className='small muted';p.textContent='每行保留原始数据和来源；重复不会自动删除。下方只预览前15行，下载保留全部行。';
 const buttons=document.createElement('div');buttons.className='row';
 const cols=[...HEADERS,'来源文件','源行号','检查结果'];
 const all=document.createElement('button');all.className='btn primary';all.textContent='↓ 下载合并结果';
 all.onclick=()=>downloadRows([cols,...res.rows.map(r=>cols.map(k=>r[k]))],'合并结果_本地.csv');
 const issues=document.createElement('button');issues.className='btn';issues.textContent='↓ 下载异常清单';
 issues.onclick=()=>downloadRows([cols,...res.errors.map(r=>cols.map(k=>r[k]))],'异常清单_本地.csv');
 buttons.append(all,issues);
 const wrap=document.createElement('div');wrap.className='table-wrap';wrap.style.marginTop='15px';
 const table=document.createElement('table');table.className='tbl';const tr=document.createElement('tr');cols.forEach(x=>tr.appendChild(cell('th',x)));const thead=document.createElement('thead');thead.appendChild(tr);table.appendChild(thead);
 const tbody=document.createElement('tbody');res.rows.slice(0,15).forEach(r=>{const row=document.createElement('tr');if(r['检查结果']!=='正常')row.style.background='#fff6f3';cols.forEach(k=>row.appendChild(cell('td',r[k])));tbody.appendChild(row)});table.appendChild(tbody);wrap.appendChild(table);
 card.append(head,p,buttons,wrap);holder.appendChild(card);
}
function runMerge(){try{lastResult=mergeAndValidate(inputs);renderResult(lastResult);$('sourceStatus').textContent='合并完成：'+lastResult.rows.length+' 行，'+lastResult.errors.length+' 行异常'}catch(e){lastResult=null;$('mergeResults').replaceChildren();const c=document.createElement('div');c.className='info warn';c.textContent='安全停止：'+e.message;$('mergeResults').appendChild(c);$('sourceStatus').textContent='输入检查未通过，请修正CSV后重试'}}
function updateCriteria(){const checks=[...document.querySelectorAll('[data-criteria]')];$('criteriaStatus').textContent='已自查 '+checks.filter(x=>x.checked).length+' / '+checks.length+' 条（仍以实际测试为准）'}
function assertCondition(ok,message){if(!ok)throw Error(message)}
function runTests(){
 const tests=[
 ['标准输入：9条记录/2条异常',()=>{let r=mergeAndValidate(DEMO);assertCondition(r.rows.length===9&&r.errors.length===2,'标准样本计数不符')}],
 ['引号中的逗号可正确解析',()=>{let r=mergeAndValidate([{name:'quoted.csv',text:'订单号,料号,数量,交期,供应商\nPO-X,M-A,3,2026-11-15,"示例,供应商"'}]);assertCondition(r.rows[0]['供应商']==='示例,供应商','CSV引号解析异常')}],
 ['缺失必需表头应拒绝',()=>{let thrown=false;try{mergeAndValidate([{name:'bad.csv',text:'订单号,料号,数量,供应商\nPO-X,M-A,4,示例'}])}catch{thrown=true}assertCondition(thrown,'未拦截缺失表头')}],
 ['非法数量应被标记',()=>{let r=mergeAndValidate(CHALLENGE);assertCondition(r.rows.length===4&&r.errors.length===3,'挑战数据异常计数不符');assertCondition(r.rows[2]['检查结果'].includes('数量无效'),'未识别非法数量')}],
 ['未闭合引号应拒绝',()=>{let thrown=false;try{parseCSV('订单号,料号\n"PO-X,M-A')}catch{thrown=true}assertCondition(thrown,'未拦截格式错误')}],
 ['导出的公式式文本应安全转义',()=>{let csv=encodeCSV([['供应商'],['=1+1'],['+SUM(A1)'],['@call']]);assertCondition(csv.includes("'=1+1")&&csv.includes("'+SUM(A1)")&&csv.includes("'@call"),'潜在公式未转义')}]
 ];
 const root=$('testResults');root.replaceChildren();let pass=0;
 for(const [name,fn] of tests){let ok=true,reason='';try{fn();pass++}catch(e){ok=false;reason=e.message}const div=document.createElement('div');div.className=ok?'info good':'info warn';div.textContent=(ok?'✓ PASS ':'✕ FAIL ')+name+(reason?'；'+reason:'');root.appendChild(div)}
 const final=document.createElement('strong');final.className='status';final.textContent='测试完成：'+pass+' / '+tests.length+' 通过';root.prepend(final);
 return {pass,total:tests.length};
}
async function copyCurrent(){
 const text=STAGES[stage].prompt;
 try{if(!navigator.clipboard?.writeText)throw Error('no clipboard');await navigator.clipboard.writeText(text);$('copyStatus').textContent='已复制'}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();let ok=false;try{ok=document.execCommand('copy')}catch{}area.remove();$('copyStatus').textContent=ok?'已复制':'请手动选择上方指令'}
}
async function onUpload(e){
 try{const files=[...e.target.files];if(!files.length)return;if(files.length>12)throw Error('最多12份CSV');
 const list=await Promise.all(files.map(async f=>{if(!f.name.toLowerCase().endsWith('.csv'))throw Error('仅支持CSV：'+f.name);if(f.size>2*1024*1024)throw Error('文件超过2MB：'+f.name);return {name:f.name,text:await f.text()}}));
 loadFiles(list);
 }catch(err){$('sourceStatus').textContent='读取失败：'+err.message}
}
function init(){
 document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{stage=+b.dataset.stage;showStage()}));
 $('stagePrev').onclick=()=>{stage=Math.max(0,stage-1);showStage()};
 $('stageNext').onclick=()=>{stage=Math.min(STAGES.length-1,stage+1);showStage()};
 $('stageCopy').onclick=copyCurrent;
 $('loadSample').onclick=()=>loadFiles(DEMO);
 $('loadChallenge').onclick=()=>loadFiles(CHALLENGE);
 $('fileInput').addEventListener('change',onUpload);
 $('runMerge').onclick=runMerge;$('runTests').onclick=runTests;
 document.querySelectorAll('[data-criteria]').forEach(c=>c.addEventListener('change',updateCriteria));
 showStage();updateCriteria();
}
document.addEventListener('DOMContentLoaded',init);
