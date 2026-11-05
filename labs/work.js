'use strict';
const $=id=>document.getElementById(id);
const SCENARIOS={
 logistics:{
  title:'Work任务：公开物流服务资料对比',
  intro:'教学设想：只处理公开网页，比较三家物流服务商的公开服务范围与配送方式；最后交付带来源的核查清单。',
  goal:'请研究三家公开物流服务商，在不登录任何账号、不提交表单的前提下，比较公开服务区域、运输方式和可公开核查的服务特点。只使用能打开的公开资料；逐条附来源与日期，无法核实的内容标注“待核实”。输出对比表和人工复核清单。',
  scope:['公开网页读取；不能使用内部采购账号','对服务商宣传口径和第三方实测数据分别标注','不自动联系供应商、不提交询价'],
  steps:[
   ['整理目标','确定供应商和比较指标，识别尚未确定的信息。','检查点：研究对象、地区、来源时效是否足够清晰。','说明研究范围与输出字段','仅需任务描述，不需要外部网站授权'],
   ['准备检索计划','列出拟访问的公开网站及验证顺序，必要时向用户追问。','检查点：网站列表和字段能否实际核对？','创建可审阅的访问计划','真实网站访问还应遵守环境许可与管理员策略'],
   ['读取来源（模拟）','示意：记录网页标题、发布日期和页面链接；不展示虚构的真实物流结论。','检查点：访问失败或页面无信息时，是否写“无法核实”？','模拟读取公开网页','真实Browser Use可能需要网站访问审批'],
   ['制作比较表','将可核查内容填入同一张表，区分公开宣称与已验证事实。','检查点：字段统一、结论与来源一一对应。','生成草稿文件','真实工作模式、文件访问能力以组织配置为准'],
   ['提交复核','交付一页摘要、对比表、待核实项目；外发前停止并等待审批。','检查点：未获授权不得自动发送给供应商。','交付审阅草稿','向外部发送属于额外动作，需单独确认']
  ]
 },
 report:{
  title:'Work任务：模拟生产日报生成管理摘要',
  intro:'教学设想：分析公开模拟CSV，计算产量、达成率和异常类别；不访问真实MES系统。',
  goal:'请读取我授权上传的模拟MES生产日报CSV，先确认列名、分母和异常数据口径，再按产线统计计划与实际产量、达成率、直通率和异常类别；输出可追溯的晨会摘要及待现场核实问题。只处理模拟资料，不读取真实MES。',
  scope:['使用本课程的模拟生产日报CSV','重要指标说明分子、分母和缺失值','不得自动进入MES修改数据或发送晨会报告'],
  steps:[
   ['确认文件与目的','识别模拟日报、阅读字段定义和计算口径。','检查点：不得把某一列名称直接当成指标的真实业务定义。','拟读取批准的模拟CSV','文件来源应明确且具备用户授权'],
   ['检查数据质量','查重复、缺失、非数字和异常日期。','检查点：数据不足时列出缺口，不能虚构生产数量。','模拟本地数据质量校验','读文件不等于拥有生产系统的读取权限'],
   ['核算指标','按照已确认的口径计算达成率和直通率并抽样复核。','检查点：实际产量/计划产量、合格数/投入数口径均需说明。','模拟生成计算表','不执行真实MES查询'],
   ['整理输出','生成管理摘要、图表建议和现场待核实问题。','检查点：异常类别频数不代表根因。','模拟报告草稿','真实成果应保留源文件与计算方法'],
   ['人工复核','业务负责人核对关键指标；未经批准不发布任何结论。','检查点：结论和行动建议区分证据、假设与建议。','交付复核版本','发布/外发仍需人工审批']
  ]
 },
 inspection:{
  title:'Computer Use任务：模拟设备离线核查',
  intro:'教学设想：在获得许可的测试电脑上查看模拟设备状态及配置截图，整理排查线索；不会修改工控机配置、IP或现场设备。',
  goal:'仅在批准的测试环境中，依据我提供的脱敏设备在线状态截图和网关配置模拟文件，按“确认离线现象→查最近状态→对照网络配置→标记待核实原因→提交排查清单”整理事实与建议。不要登录真实WinCC、PLC、博图或修改IP、网关、生产设备参数。',
  scope:['仅使用脱敏截图及测试环境；不接入现场工控网络','将网络中断、重启、设备移动当作待排查假设，不下确定结论','任何IP、网关、PLC、WinCC修改均须专业人员审批且不在本演练中执行'],
  steps:[
   ['明确排查授权','确认测试电脑、数据范围和操作人员的权限。','检查点：读取和修改权限分开，未经批准不能继续真实操作。','模拟请求访问测试应用','真实Computer Use受应用许可与企业策略约束'],
   ['读取模拟状态','查看设备在线截图，记录时间、设备号（虚构）和离线状态。','检查点：截图日期与故障发生时间是否对应？','模拟只读屏幕识别','不访问真实WinCC、SCADA或PLC'],
   ['核对模拟配置','比较模拟网关记录、IP台账与历史版本。','检查点：配置差异可能源于多种因素，不能擅自修正网络。','模拟读取授权文档','修改系统参数属于高风险操作，不在课程范围内'],
   ['提出排查假设','按证据列出网络、网关、设备、数据链路等可能原因。','检查点：缺日志时必须标注无法判定，不伪造故障原因。','模拟整理原因与证据清单','所有假设需由IT/设备人员验证'],
   ['交付人工处理','输出待核查清单和责任分工建议，停止在修改动作之前。','检查点：不给出自动重启生产设备的操作指令。','模拟交付排查单','任何现场写入、重启必须走公司控制流程']
  ]
 }
};
const QUESTIONS=[
 {title:'访问不需要登录的公开物流官网',description:'研究任务需要读取公开服务说明，无账号或内部资料。',answer:'allow',reason:'属于允许范围内的只读教学活动，但真实浏览器访问仍可能受管理员网站规则与会话审批限制。'},
 {title:'上传未脱敏的供应商报价表到未批准网站',description:'拟将含供应商内部商业信息的Excel上传到第三方页面。',answer:'block',reason:'业务资料未脱敏且网站未经批准，不能通过个人点击“允许”越过组织信息安全规则。'},
 {title:'向外部供应商发送拟好的询价邮件',description:'已起草邮件但尚未得到有权人员的明确外发批准。',answer:'approval',reason:'发送属于对外动作，应核实收件人、内容和授权；教学演练仅模拟等待批准。'},
 {title:'自动重启生产线工控设备以恢复采集',description:'现场设备离线，未排查根因，未取得设备负责人与IT许可。',answer:'block',reason:'未经专业审批不能自动重启或修改设备；应停止在人工排查环节。'}
];
const ANSWERS=[['allow','可在权限范围内继续'],['approval','暂停，等待明确审批'],['block','禁止，停止操作']];
const state={scenario:'logistics',step:0,choices:new Map(),approval:'idle',events:[]};
function log(message){state.events.push(message);renderLog()}
function renderLog(){const root=$('eventLog');root.replaceChildren();if(!state.events.length){const empty=document.createElement('li');empty.textContent='暂无记录。选择任务、切换步骤或进行审批即可生成模拟事件。';root.appendChild(empty);return}state.events.forEach((x,i)=>{const li=document.createElement('li');li.textContent=(i+1)+'. '+x;root.appendChild(li)})}
function selectScenario(key,record=true){const v=SCENARIOS[key];if(!v)return;state.scenario=key;state.step=0;$('scenarioTitle').textContent=v.title;$('scenarioIntro').textContent=v.intro;$('businessGoal').value=v.goal;const root=$('scopeList');root.replaceChildren();v.scope.forEach(s=>{const p=document.createElement('p');p.className='small';p.textContent='✓ '+s;root.appendChild(p)});document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));showStep();if(record)log('切换模拟任务：'+v.title)}
function showStep(){const v=SCENARIOS[state.scenario],step=v.steps[state.step];$('flowTitle').textContent='第'+(state.step+1)+'步｜'+step[0];$('flowDescription').textContent=step[1];$('flowObservation').textContent=step[2];$('flowAction').textContent=step[3];$('flowPermission').textContent=step[4];$('flowProgress').textContent=(state.step+1)+' / '+v.steps.length;$('prevFlow').disabled=state.step===0;$('nextFlow').disabled=state.step===v.steps.length-1;const container=$('flowSteps');container.replaceChildren();v.steps.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='step'+(i===state.step?' active':'');b.textContent=(i+1)+'. '+s[0];b.setAttribute('aria-pressed',String(i===state.step));b.addEventListener('click',()=>changeStep(i));container.appendChild(b)})}
function changeStep(i){if(i<0||i>=SCENARIOS[state.scenario].steps.length||i===state.step)return;state.step=i;showStep();log('教学步骤：'+SCENARIOS[state.scenario].steps[i][0])}
function renderPermissions(){const root=$('permissionCases');root.replaceChildren();QUESTIONS.forEach((q,i)=>{const card=document.createElement('article');card.className='card';const title=document.createElement('h3');title.textContent=(i+1)+'. '+q.title;const desc=document.createElement('p');desc.className='small muted';desc.textContent=q.description;const buttons=document.createElement('div');buttons.className='row';ANSWERS.forEach(([key,label])=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=label;b.dataset.policy=String(i);b.dataset.answer=key;b.setAttribute('aria-pressed',String(state.choices.get(i)===key));b.addEventListener('click',()=>{state.choices.set(i,key);renderPermissions();log('完成权限判断练习第'+(i+1)+'题')});buttons.appendChild(b)});const feedback=document.createElement('p');feedback.className='micro';if(state.choices.has(i)){const correct=state.choices.get(i)===q.answer;feedback.textContent=correct?'✓ 符合本题参考规则':'请查看判定依据，复核哪些操作需要停止或审批';feedback.style.color=correct?'#207450':'#9a6728'}card.append(title,desc,buttons,feedback);root.appendChild(card)});const correct=QUESTIONS.filter((q,i)=>state.choices.get(i)===q.answer).length;$('policyProgress').textContent='已判断 '+state.choices.size+'/4 · 符合参考 '+correct+'/4';$('policyMeter').style.width=(state.choices.size/QUESTIONS.length*100)+'%'}
function toggleRationale(){const out=QUESTIONS.map((q,i)=>(i+1)+'. '+q.title+'\n参考：'+ANSWERS.find(a=>a[0]===q.answer)[1]+'\n'+q.reason).join('\n\n');$('policyRationale').textContent=out;$('policyRationale').classList.toggle('hide');$('showPolicyAnswer').textContent=$('policyRationale').classList.contains('hide')?'显示判定依据':'收起判定依据'}
function renderApproval(){const a=state.approval;const statuses={idle:'尚未请求（模拟）',requested:'等待人工确认（模拟）',approved:'已收到模拟人工批准，尚未模拟执行',completed:'模拟执行完成：未发送任何内容'};$('approvalStatus').textContent='状态：'+statuses[a];$('requestApproval').disabled=a!=='idle';$('approveAction').disabled=a!=='requested';$('executeAction').disabled=a!=='approved'}
function setApproval(next,message){state.approval=next;renderApproval();log(message)}
function resetApproval(){state.approval='idle';renderApproval();log('模拟审批流程已重置')}
function updateAcceptance(){const list=[...document.querySelectorAll('[data-accept]')],n=list.filter(x=>x.checked).length;$('acceptanceStatus').textContent='已核对 '+n+'/'+list.length+' 项'+(n===list.length?'（仍需真实项目人工验收）':'');try{localStorage.setItem('academy.work.accept',JSON.stringify(list.map(x=>x.checked)))}catch{}}
function makePrompt(){return SCENARIOS[state.scenario].title+'\n'+$('businessGoal').value.trim()+'\n请先提出计划和所需权限，明确可以读取的来源、不可执行的操作、人工审批节点和结果验收标准。无法访问的资源写“未核实”，未经批准不要外发、登录或修改企业系统。'}
async function copyText(text,id){try{if(!navigator.clipboard?.writeText)throw Error('unavailable');await navigator.clipboard.writeText(text);$(id).textContent='已复制'}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();let success=false;try{success=document.execCommand('copy')}catch{}area.remove();$(id).textContent=success?'已复制':'无法复制，请手动选择内容'}}
function init(){
 document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>selectScenario(btn.dataset.scenario)));
 $('prevFlow').onclick=()=>changeStep(state.step-1);$('nextFlow').onclick=()=>changeStep(state.step+1);
 $('resetTask').onclick=()=>{$('businessGoal').value=SCENARIOS[state.scenario].goal;log('任务目标恢复模拟示例')};
 $('copyTask').onclick=()=>copyText(makePrompt(),'copyStatus');
 $('showPolicyAnswer').onclick=toggleRationale;
 $('requestApproval').onclick=()=>setApproval('requested','请求模拟人工审批（未发起真实申请）');
 $('approveAction').onclick=()=>setApproval('approved','模拟人工确认（不构成企业授权）');
 $('executeAction').onclick=()=>setApproval('completed','模拟执行完成（未发送任何消息）');
 $('resetApproval').onclick=resetApproval;
 $('copyLog').onclick=async()=>{await copyText(state.events.map((v,i)=>(i+1)+'. '+v).join('\n'),'logCopyStatus')};
 $('clearLog').onclick=()=>{state.events=[];renderLog()};
 let stored=[];try{stored=JSON.parse(localStorage.getItem('academy.work.accept')||'[]')}catch{}
 document.querySelectorAll('[data-accept]').forEach((el,i)=>{el.checked=stored[i]===true;el.addEventListener('change',updateAcceptance)});
 selectScenario('logistics',false);renderPermissions();renderApproval();renderLog();updateAcceptance();
}
document.addEventListener('DOMContentLoaded',init);
