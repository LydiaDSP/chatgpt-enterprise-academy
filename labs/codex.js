'use strict';
const $=id=>document.getElementById(id);
const HEADERS=['订单号','料号','数量','交期','供应商'];

const CODEX_TASKS = [
 {id:'python',category:'数据分析',icon:'▤',title:'Python 数据分析',desc:'让 Codex 编写可重复运行的数据清洗、统计分析、可视化和报告脚本。',example:'例如：分析3个月设备停机记录，清洗重复和缺失数据，统计故障次数、停机时长、设备排名，生成 Pareto 图和趋势图。',deliverable:'Python脚本、清洗后的数据、统计结果、图表文件、分析说明和测试样例。',prompt:[
'请在当前独立练习目录中，使用Python帮助我分析设备停机记录CSV。',
'先读取文件并检查字段、编码、数据量、缺失值、重复记录和日期格式；先汇报发现，不要覆盖原始文件。',
'请向我确认故障分类、停机时长口径、重复记录处理方式等业务规则。',
'确认后再编写可重复运行的Python脚本，输出清洗结果、故障类别/设备排名、Pareto图、时间趋势图和简要分析报告。',
'请用模拟数据或脱敏副本运行，并提供测试结果、运行命令、输出文件清单和已知限制。不要把数据上传到外部服务。'
].join('\n')},
 {id:'tool',category:'办公小工具',icon:'⚙',title:'开发办公小工具',desc:'把重复、规则明确的手工操作封装成一个可重复使用的小程序。',example:'例如：批量重命名文件、按规则归档资料、合并CSV、批量提取PDF信息、检查文件命名是否符合规范。',deliverable:'可运行脚本或桌面小工具、操作说明、输入输出示例、异常提示和安全回滚方案。',prompt:[
'我想开发一个批量文件整理小工具，帮助同事按统一规则整理指定文件夹。',
'请先询问我文件类型、命名规则、目标目录、重名处理方式和是否需要保留目录结构。',
'第一版必须提供预览模式：先列出将要重命名/移动的文件及目标路径，未经我确认不得真正修改文件。',
'请在独立测试目录使用模拟文件实现，保留原文件或提供可回滚记录，处理重名、无权限和非法文件名等异常。',
'完成后请实际运行测试，并提供启动方式、操作步骤和注意事项。'
].join('\n')},
 {id:'webapp',category:'网页应用',icon:'▣',title:'开发网页应用',desc:'用自然语言描述页面和功能，让 Codex 创建可交互的网页应用。',example:'例如：开发一个班次交接记录网页，支持新增交接事项、按日期/班组筛选、状态跟踪和导出。',deliverable:'网页前端、必要的后端或本地数据层、交互页面、部署说明和测试记录。',prompt:[
'请帮我开发一个班次交接记录网页应用，供员工记录和查询交接事项。',
'第一版使用模拟数据，包含：交接事项新增/编辑、日期和班组筛选、待处理/已完成状态、关键词搜索和CSV导出。',
'请先给出页面结构、字段设计、用户操作流程和验收标准，暂时不要写代码。',
'经我确认后再开发一个最小可用版本，界面要适合普通员工使用，移动端也能正常浏览。',
'请验证新增、编辑、筛选、状态变更和导出功能；说明数据存储方式、部署要求及尚未实现的能力。'
].join('\n')},
 {id:'workbench',category:'业务工作台',icon:'▦',title:'开发业务工作台',desc:'把多个分散的业务动作整合成一个统一入口，而不是只做单一脚本。',example:'例如：质量异常工作台，集中展示异常清单、责任人、处理状态、逾期提醒、原因分类和趋势指标。',deliverable:'统一工作台页面、模块导航、数据看板、查询筛选、状态流转、权限与数据接口设计。',prompt:[
'我想把当前分散的质量异常跟踪表整合成一个简单的质量异常工作台。',
'请先基于模拟数据设计首页概览、异常列表、详情页、状态跟踪、责任人和逾期提醒等模块。',
'请梳理每个模块需要的字段、页面之间的关系、角色权限和验收标准，先输出方案，不修改文件。',
'确认方案后按模块逐步开发。第一版仅使用模拟数据，不连接QMS、MES或其他生产系统。',
'请测试列表筛选、详情查看、状态更新和数据导出，并说明未来接入正式系统所需的API、权限和安全评估。'
].join('\n')},
 {id:'refactor',category:'系统重构',icon:'⌘',title:'重构现有系统',desc:'让 Codex 先理解旧项目，再按边界拆分、优化和升级，尽量保持原有功能。',example:'例如：一个长期维护的网页包含大量重复代码，可以拆分模块、统一样式、清理无用代码并补充测试。',deliverable:'项目结构分析、重构计划、分阶段代码改动、回归测试、变更说明和回滚点。',prompt:[
'请先阅读当前项目，梳理目录结构、核心模块、依赖关系、入口文件和现有测试。',
'我希望改善代码结构和可维护性，但必须保持现有用户功能、页面路由和数据格式不变。',
'第一步只做分析：列出重复代码、耦合点、潜在风险和分阶段重构建议，不要修改任何文件。',
'得到我确认后，在独立分支或可回滚的工作区分批实施；每批改动前后都运行现有测试，并补充必要的回归测试。',
'请逐项报告修改文件、行为变化、测试证据、未解决问题和回滚方法。不要为了重构而重写整个项目。'
].join('\n')},
 {id:'testing',category:'调试与测试',icon:'✓',title:'定位 Bug 与自动化测试',desc:'让 Codex 读错误日志、复现问题、定位根因、编写测试并验证修复。',example:'例如：某个报表偶尔统计错误，让 Codex 检查计算逻辑，构造边界数据，补充自动化测试。',deliverable:'问题复现步骤、根因分析、修复代码、自动化测试、测试报告和剩余风险。',prompt:[
'我遇到一个程序问题：[粘贴错误信息或描述现象]。',
'请先阅读相关代码和日志，说明可能的原因，并设计一个可以稳定复现问题的最小测试用例。',
'先不要直接修改代码。请列出根因假设、需要检查的文件和验证步骤。',
'确认后再修复，并补充正常输入、空值、异常值和边界条件测试。',
'请实际运行测试，展示修复前后的差异和测试结果；如果无法复现或测试未通过，要明确说明，不要宣称已解决。'
].join('\n')},
 {id:'automation',category:'流程自动化',icon:'↗',title:'开发自动化流程',desc:'把固定规则的多步骤工作串联起来，减少人工重复操作。',example:'例如：定时读取授权的数据文件，生成日报、检查异常、输出待办清单，并记录执行日志。',deliverable:'自动化脚本/服务、任务调度配置、日志、失败重试、异常通知和人工确认节点。',prompt:[
'我希望将以下重复业务流程自动化：[描述流程和当前人工步骤]。',
'请先拆解触发条件、输入数据、处理规则、输出结果、失败处理和需要人工审批的节点。',
'第一版只使用模拟数据或获批的只读接口，不写入业务系统，不发送外部通知，不使用真实账号密钥。',
'请设计可重复运行的流程，包含日志、异常告警、重试限制、幂等处理和人工确认机制。',
'先输出方案和权限清单，待我确认后再实现，并用成功、失败、重复触发等场景测试。'
].join('\n')},
 {id:'agent',category:'Agent / 工具开发',icon:'✧',title:'开发 AI Agent 或工具接口',desc:'把业务规则、知识检索和获批工具封装成可调用的智能体或接口。',example:'例如：开发一个SOP查询助手，先检索受控的模拟SOP，再通过只读工具查询设备信息，并在给出建议时附证据来源。',deliverable:'Agent流程、工具定义/API接口、知识来源说明、权限控制、日志、测试集和人工审批设计。',prompt:[
'我想开发一个面向业务人员的AI助手：[描述它要解决的具体问题]。',
'请先区分哪些步骤由模型理解和生成，哪些步骤必须调用程序或API完成，哪些操作必须由人工确认。',
'第一版只使用模拟文档和只读工具，列出工具名称、输入参数、输出字段、权限范围和失败处理。',
'请先设计Agent流程、知识来源、工具接口和验收用例，不要连接生产系统或执行写入操作。',
'经确认后再实现最小可用版本。测试错误参数、无权限、找不到资料、工具超时和模型误判等情况，并保留可追溯日志。'
].join('\n')}
];

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

function renderCodexTaskMap(){
 const grid=$('codexTaskGrid');if(!grid)return;grid.replaceChildren();
 CODEX_TASKS.forEach(task=>{
  const btn=document.createElement('button');btn.type='button';btn.className='codex-task-card';btn.dataset.task=task.id;btn.setAttribute('aria-pressed','false');
  const kicker=document.createElement('span');kicker.className='codex-task-kicker';kicker.textContent=task.category;
  const icon=document.createElement('span');icon.className='codex-task-icon';icon.setAttribute('aria-hidden','true');icon.textContent=task.icon;
  const title=document.createElement('span');title.className='codex-task-title';title.textContent=task.title;
  const desc=document.createElement('span');desc.className='codex-task-desc';desc.textContent=task.desc;
  btn.append(kicker,icon,title,desc);btn.addEventListener('click',()=>selectCodexTask(task.id));grid.appendChild(btn);
 });
 selectCodexTask(CODEX_TASKS[0].id);
}
function selectCodexTask(id){
 const task=CODEX_TASKS.find(x=>x.id===id);if(!task)return;
 $('codexTaskTitle').textContent=task.title;
 $('codexTaskDescription').textContent=task.desc;
 $('codexTaskExample').textContent=task.example;
 $('codexTaskDeliverable').textContent=task.deliverable;
 $('codexTaskPrompt').textContent=task.prompt;
 document.querySelectorAll('[data-task]').forEach(btn=>{const active=btn.dataset.task===id;btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('active',active)});
 const status=$('codexTaskCopyStatus');if(status)status.textContent='';
}
async function copyCodexText(text,statusId){
 const status=$(statusId);if(!status)return;
 try{
  if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);status.textContent='已复制，可以粘贴到Codex';return;}
  throw Error('clipboard unavailable');
 }catch{
  const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
  let ok=false;try{ok=document.execCommand('copy')}catch{}area.remove();
  status.textContent=ok?'已复制，可以粘贴到Codex':'复制受浏览器限制，请手动选择并复制指令';
 }
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
 renderCodexTaskMap();
 $('copyCodexTaskPrompt').onclick=()=>copyCodexText($('codexTaskPrompt').textContent,'codexTaskCopyStatus');
 $('copyCodexBeginnerPrompt').onclick=()=>copyCodexText($('codexBeginnerPrompt').textContent,'codexBeginnerCopyStatus');
 showStage();updateCriteria();
}
document.addEventListener('DOMContentLoaded',init);
