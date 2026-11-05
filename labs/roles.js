'use strict';
const $=id=>document.getElementById(id);
const CASES=[
{id:'ie-01',dept:'IE',title:'标准工时与节拍差异核对',priority:'适合首批练习',target:'识别各工序实际节拍与目标节拍的差距，为改善排序提供依据。',inputs:'模拟工序节拍表、标准工时定义、测量条件和样本量。',chat:'请读取我上传的工序节拍表，先检查字段、测量时间及样本量，按工序比较目标节拍与实测节拍，标出超出目标的工序，列出计算公式、异常记录和待现场复测点。不要凭单次样本推断根因。',agent:'通过授权的时测数据来源自动更新，监测节拍波动、生成待核对清单，由IE确认测量口径后发布。',deliver:'节拍差异表、候选瓶颈清单、复测计划。',verify:'随机抽3道工序复算差值；确认目标节拍单位为秒/件，避免把标准工时等同实测节拍。',risk:'实测工况、设备暂停、工序合并与个人绩效敏感性均需人工确认。',steps:['上传模拟或授权时测表','核对测量条件和秒/件口径','复算差异并列出复测清单'],sample:'../samples/IE_线平衡_模拟.csv'},
{id:'ie-02',dept:'IE',title:'产线平衡与瓶颈工序分析',priority:'适合首批练习',target:'识别可能限制产能的工序并评估简单的工位调整方案。',inputs:'工序顺序、设备/人员配置、可用工作时间、节拍与工序依赖。',chat:'根据我提供的工序时间和产线约束，计算每道工序节拍，识别候选瓶颈，给出至少2种平衡思路；说明前提、计算过程和安全约束，不直接认定方案可实施。',agent:'定期汇总工位时测与节拍，形成改善候选单，由工艺/IE/安全负责人现场评审。',deliver:'瓶颈排序、平衡方案草案、现场验证指标。',verify:'确认工序先后约束；实际节拍与理论瓶颈节拍不能混用；调整后要核查质量和安全。',risk:'不可因提高节拍而省略防护动作、检验或法定休息安排。',steps:['标记工序顺序及约束','计算瓶颈并比较候选调整','现场测试质量、安全和产量影响'],sample:'../samples/IE_线平衡_模拟.csv'},
{id:'ie-03',dept:'IE',title:'换线损失与SMED改善',priority:'适合首批练习',target:'按内部/外部作业区分换线活动，找出可验证的时间改善机会。',inputs:'换线时间记录、各步骤起止、设备状态、作业安全要求。',chat:'请按步骤整理这份脱敏换线记录，区分停机后才能做的内部作业与可在安全条件下提前准备的外部作业，计算各类耗时和改善机会；列出假设和待现场确认事项。',agent:'自动汇总换线日志，生成改善候选卡和效果对比；所有程序修改或设备动作需技术审批。',deliver:'换线过程地图、时间分布、SMED候选清单。',verify:'用视频或原记录复核时间戳；改善前后须在可比条件下测量。',risk:'不能把需要停机锁定的安全作业错误归类为可提前执行。',steps:['梳理换线步骤和计时点','识别内外部作业假设','按安全流程做小范围验证']},
{id:'ie-04',dept:'IE',title:'设备OEE口径与损失Pareto',priority:'进阶',target:'对比可用率、性能效率、良品率，识别主要损失项。',inputs:'计划生产时间、停机明细、产量、理想节拍、合格数、指标口径。',chat:'请先确认OEE的计划生产时间和停机口径，再按可用率×性能效率×质量合格率计算，输出分项公式、损失Pareto和异常字段清单。缺少数据则写未能计算，不要补数。',agent:'只读采集设备状态和QMS/MES数据，自动生成指标草稿；指标定义版本化并由IE审核。',deliver:'OEE计算表、损失排序、疑点列表。',verify:'复核停机分类、理论节拍、返工/重测处理，不混淆良率与直通率。',risk:'数据缺失、断线和系统时间差可能导致损失率偏差。',steps:['统一OEE口径','核对源数据并计算三因子','抽样与原报表对账']},
{id:'ie-05',dept:'IE',title:'厂内物料搬运路线优化',priority:'进阶',target:'通过路线与频次估算搬运距离和等待损失，提出布局改善备选。',inputs:'工位位置、路线距离、搬运频次、物流安全限制、物流路径图。',chat:'根据我提供的模拟搬运路线表，计算各路线距离×频次的总搬运距离，识别高频长距离路径；提出2种布局改善假设并说明适用前提和安全边界。',agent:'在已授权的物流数据和布局图上定期更新搬运负担，产生供现场核查的优化建议。',deliver:'路线负担排序、布局方案草案、试点评估指标。',verify:'抽样复核实际行走距离及频次；验证通道宽度、消防与人机分流要求。',risk:'不能直接将未经安全、消防和物流确认的布局投入现场。',steps:['整理路线、频次与约束','识别高负担路线','核查安全条件与试点效果']},
{id:'ie-06',dept:'IE',title:'改善项目效益核算与复盘',priority:'适合首批练习',target:'量化改善前后节拍、工时、质量变化，给出可追溯收益估算。',inputs:'改进前后同口径数据、产量、人工费率、追加投入、观察周期。',chat:'请根据我提供的改善前后数据，按统一口径计算时间节省、产出变化和年度化收益估算，并分别列出实际已实现收益与待验证预测。注明公式、样本数、假设和成本。',agent:'定期抓取获授权的改善项目台账，生成阶段收益草稿和异常提醒，待财务及业务负责人确认。',deliver:'改善收益测算表、假设清单、复盘摘要。',verify:'核查样本可比性、产量基线、一次性投资和持续费用，避免重复计算收益。',risk:'收益估算不能直接等同财务入账结果；人员影响需遵守公司规定。',steps:['统一前后测量口径','计算可审计收益与假设','交业务/财务复核']},
{id:'it-01',dept:'IT',title:'设备在线异常的只读排查助手',priority:'适合首批练习',target:'整理设备在线/离线事件，形成有证据的排查路线。',inputs:'脱敏在线状态CSV、WinCC截图、时间范围、设备与网关对应台账。',chat:'请先检查这份模拟设备在线事件CSV，按设备与时间列出离线记录、重复事件和恢复情况，整理可核实事实、可能原因和下一步只读排查顺序；不猜测IP地址或未经验证的根因。',agent:'经审批的只读日志接入与状态巡检，发现异常形成工单草稿，由IT或设备人员接手。',deliver:'设备离线时间线、待核实原因、排查工单草稿。',verify:'与原始日志逐条比对时间与状态；无法仅凭状态码判断网关、WiFi或设备故障。',risk:'禁止自动修改PLC、WinCC、网关和生产设备连接配置。',steps:['加载模拟在线事件表','整理离线与恢复时间线','补充网关/网络证据后人工定位'],sample:'../samples/IT_设备在线事件_模拟.csv'},
{id:'it-02',dept:'IT',title:'无线网络掉线与覆盖问题分析',priority:'适合首批练习',target:'综合AP日志、信号记录和掉线时间，识别需要现场验证的网络问题。',inputs:'脱敏AP日志、RSSI/丢包率、建筑楼层信息、设备接入方式。',chat:'请结合授权的无线网络日志和设备掉线记录按时间对齐，统计离线频次及异常区间，区分信号弱、漫游、DHCP与终端故障等候选原因，并给出需要IT测量的指标，不编造覆盖热力图。',agent:'对合法日志进行周期性关联分析，异常超过阈值时生成巡检工单；网络策略变更由IT审批。',deliver:'掉线时间分布、关联证据、现场测量计划。',verify:'核对客户端与AP时间同步、漫游记录和信道环境；单次RSSI不足以定根因。',risk:'未经审批不得更改SSID、DHCP、路由器和生产设备无线配置。',steps:['对齐设备与AP日志时间','分析信号与掉线关联','安排现场复测及变更评审']},
{id:'it-03',dept:'IT',title:'网关与IP配置台账差异检查',priority:'适合首批练习',target:'将授权的现状导出与历史基线逐项比对，识别待确认差异。',inputs:'脱敏网关配置导出、历史台账、设备标识规则、变更记录。',chat:'请比较我上传的脱敏网关配置台账与历史版本，以设备ID和已确认字段为主键，找出地址/端口/关联关系变化、缺失和冲突；输出差异表及待IT确认清单，不生成自动修改配置脚本。',agent:'受控只读采集配置元数据，定期做差异预警；任何写回在变更管理系统中审批执行。',deliver:'配置差异表、缺失记录、审批建议。',verify:'用设备ID校验对应关系；同名网关不代表同设备，地址重用须核实。',risk:'不要展示真实内部IP、账号凭证，也不要直接下发配置。',steps:['确认台账版本与设备键','比对变更并标记冲突','由管理员检查变更记录']},
{id:'it-04',dept:'IT',title:'MES接口字段与采集数据对账',priority:'进阶',target:'定位源端与目标端字段缺失、格式错误和对账差异。',inputs:'模拟源系统导出、目标系统导出、接口映射表、时间口径。',chat:'依据附件字段字典和两份脱敏导出数据，按确认的业务主键与时间窗口做对账，输出未匹配、重复、类型不符和数量差异清单；标明源行号与规则，不直接写入MES。',agent:'在经批准的只读接口下执行定时对账，异常生成处理工单与复核报告。',deliver:'字段映射清单、未匹配行、数据质量报告。',verify:'核查工单号/批次主键、时区和延迟窗口，不能用模糊匹配替代业务主键。',risk:'生产控制、接口补数和数据回写必须走IT/业务审核。',steps:['核对字段字典和业务主键','执行只读对账并保留证据','复核异常与补数变更申请']},
{id:'it-05',dept:'IT',title:'终端安全拦截日志归因',priority:'进阶',target:'对获授权的安全日志进行事件分类，帮助IT安全人员复核误拦截。',inputs:'脱敏EDR/IOA事件、软件名与版本、策略编号、时间线。',chat:'请分析这份经批准脱敏的安全拦截日志，按事件时间、策略、终端与软件进程归类，列出证据、可能误拦截和待管理员确认项；不要提供绕过安全策略或解除管控的指令。',agent:'在受限权限下汇总安全告警，自动生成分级工单；策略例外须经安全管理员批准。',deliver:'安全事件摘要、异常分类、管理员复核清单。',verify:'核对原始告警与政策版本；未有证据前不判断为误报或恶意软件。',risk:'不得借分析结果关闭防护、绕过端点策略或暴露安全凭证。',steps:['脱敏整理终端告警','核对策略与进程时间线','交安全管理员复核']},
{id:'it-06',dept:'IT',title:'IT工单知识库与故障复盘',priority:'适合首批练习',target:'从历史处理记录中找相似事件、出处及已有验证步骤。',inputs:'经过授权的脱敏工单、版本化SOP、设备类别与故障标签。',chat:'请在这些脱敏IT工单中查找与“设备状态离线、网关采集失败”相似的已解决案例，按症状、排查证据、处理结果与适用条件归类；每条结论附工单出处，无法证明的步骤标注待核实。',agent:'构建按用户权限检索的IT运维知识Agent，通过知识引用给出只读排查建议，任何变更需要授权。',deliver:'相似案例清单、证据引用、排查步骤草稿。',verify:'随机抽查来源工单，检查适用环境与版本是否一致；避免过时解决方案误用。',risk:'历史工单可能包含账号、内部地址和员工信息，入库前必须脱敏和权限控制。',steps:['整理并脱敏知识来源','验证相似案例和有效期限','形成经审核的故障排查说明']}
];
const ROLE_MVP_FILES={
 'ie-01':{label:'查看IE节拍差异离线原型',script:'../examples/role-agent-mvp/ie_cycle_review.py'},
 'it-01':{label:'查看IT设备离线配对原型',script:'../examples/role-agent-mvp/it_offline_events.py'}
};
const selected=new Set();
function el(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n}
function makeField(title,text){const wrapper=el('div');const heading=el('strong',title);const p=el('p',text);p.className='small';wrapper.append(heading,p);return wrapper}
function addFields(container,fields){fields.forEach(([label,text])=>container.appendChild(makeField(label,text)))}
function setCaseTab(card,mode,moveFocus=false){
 if(mode!=='chat'&&mode!=='agent')return;
 card.querySelectorAll('[data-role-tab]').forEach(button=>{
  const active=button.dataset.roleTab===mode;
  button.setAttribute('aria-selected',String(active));
  button.setAttribute('tabindex',active?'0':'-1');
  if(active&&moveFocus)button.focus();
 });
 card.querySelectorAll('[data-role-panel]').forEach(panel=>{
  panel.hidden=panel.dataset.rolePanel!==mode;
 });
}
function renderCases(){
 for(const dept of ['IE','IT']){
  const root=$(dept==='IE'?'ieCases':'itCases');root.replaceChildren();
  CASES.filter(c=>c.dept===dept).forEach(c=>{
   const card=el('details');card.className='card';card.id=c.id;card.dataset.roleCase=c.id;card.setAttribute('data-role-case',c.id);
   const summary=el('summary');const title=el('span',c.title);title.style.fontSize='17px';
   const badge=el('span',c.priority);badge.className='pill';badge.style.marginLeft='10px';summary.append(title,badge);
   const target=el('p',c.target);target.className='small muted';
   const body=el('div');body.className='stack';body.style.marginTop='15px';
   const tabs=el('div');tabs.className='role-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',c.title+' 使用阶段');
   for(const [mode,label] of [['chat','阶段一：Chat人工协作'],['agent','阶段二：Agent流程自动化']]){
    const button=el('button',label);button.className='role-tab';button.type='button';
    button.id=c.id+'-tab-'+mode;button.dataset.roleTab=mode;
    button.setAttribute('role','tab');button.setAttribute('aria-controls',c.id+'-panel-'+mode);
    tabs.appendChild(button);
   }
   const plan=ROLE_PLANS[c.id];
   if(!plan||plan.steps.length!==6||plan.chatSteps.length<3)throw Error('案例实施方案不完整：'+c.id);
   const chat=el('section');chat.className='role-panel stack';chat.id=c.id+'-panel-chat';chat.dataset.rolePanel='chat';chat.setAttribute('role','tabpanel');chat.setAttribute('aria-labelledby',c.id+'-tab-chat');
   addFields(chat,[['这阶段由谁来执行','员工手动准备文件、发起Chat、逐项核对结果；AI负责辅助分析和撰写，不自动调用企业系统。'],['准备资料',c.inputs]]);
   const route=el('div');route.appendChild(el('strong','具体操作路线（照着做）'));
   const ordered=el('ol');ordered.className='role-steps';plan.chatSteps.forEach(t=>ordered.appendChild(el('li',t)));route.appendChild(ordered);chat.appendChild(route);
   const prompt=el('div');prompt.appendChild(el('strong','简短实用的Chat Prompt'));
   const code=el('div',c.chat);code.className='role-prompt';prompt.appendChild(code);chat.appendChild(prompt);
   addFields(chat,[['预期产物',c.deliver],['如何人工核对',c.verify]]);
   const chatControls=el('div');chatControls.className='row';
   const copy=el('button','复制此场景Chat Prompt');copy.className='btn primary';copy.type='button';copy.dataset.copyCase=c.id;chatControls.appendChild(copy);
   if(c.sample){const link=el('a','↓ 下载配套模拟CSV');link.className='btn';link.href=c.sample;link.setAttribute('download','');chatControls.appendChild(link)}
   chat.appendChild(chatControls);
   const agent=el('section');agent.className='role-panel stack';agent.id=c.id+'-panel-agent';agent.dataset.rolePanel='agent';agent.setAttribute('role','tabpanel');agent.setAttribute('aria-labelledby',c.id+'-tab-agent');
   const agentLevel=el('div');agentLevel.className='agent-badge-row';
   const badgeLevel=el('span',plan.level);badgeLevel.className='pill';agentLevel.appendChild(badgeLevel);
   const reminder=el('span','从已验证的Chat流程逐步固化成可调度、可复核的自动化，不等于使用桌面端。');reminder.className='micro';agentLevel.appendChild(reminder);agent.appendChild(agentLevel);
   addFields(agent,[['要自动完成什么',c.agent],['第一版最小可行试点（MVP）',plan.firstPilot]]);
   const overview=el('div');overview.className='agent-overview';
   addFields(overview,[['① 什么时候运行（触发器）',plan.trigger],['② 从哪里获取数据（只读）',plan.source],['③ 必须具备哪些字段',plan.fields],['④ 用什么搭建（建议技术路线）',plan.tooling]]);
   agent.appendChild(overview);
   const process=el('div');process.className='agent-process';
   process.appendChild(el('h4','⑤ 六步自动化实施清单'));
   const seq=el('ol');seq.className='agent-runbook';
   plan.steps.forEach(step=>seq.appendChild(el('li',step)));process.appendChild(seq);agent.appendChild(process);
   const verify=el('div');verify.className='agent-final-checks';
   addFields(verify,[['自动生成什么结果',plan.output],['什么情况要停止／转人工',plan.failure],['绝不能自动做什么（审批点）',plan.guard],['怎么验证试点成功',plan.acceptance]]);
   agent.appendChild(verify);
   const warning=el('div','以上是基于模拟资料的实施蓝图，尚未连接企业系统。不得把建议架构当作已经部署；真实数据来源、接口、触发频率、阈值和权限须由业务与IT共同确认。'+c.risk);warning.className='info warn';agent.appendChild(warning);
   const agentButtons=el('div');agentButtons.className='row';
   const copyAgent=el('button','复制Agent实施方案');copyAgent.className='btn primary';copyAgent.type='button';copyAgent.dataset.copyAgent=c.id;
   agentButtons.appendChild(copyAgent);
   if(ROLE_MVP_FILES[c.id]){
    const demo=ROLE_MVP_FILES[c.id];
    const script=el('a',demo.label+' ↗');script.className='btn';script.href=demo.script;script.target='_blank';script.rel='noopener';agentButtons.appendChild(script);
    const guide=el('a','按步骤运行离线MVP ↗');guide.className='btn';guide.href='../examples/role-agent-mvp/README.md';guide.target='_blank';guide.rel='noopener';agentButtons.appendChild(guide);
   }
   agent.appendChild(agentButtons);
   const after=el('div');after.className='role-shared stack';
   after.appendChild(makeField('结果验证与注意',c.verify));
   const add=el('button','加入我的练习清单');add.className='btn';add.type='button';add.dataset.addCase=c.id;after.appendChild(add);
   const footer=el('p','此案例为教学建议：Chat可先人工验证，Agent升级须另行完成权限、数据和上线验收。');footer.className='micro';
   body.append(tabs,chat,agent,after,footer);card.append(summary,target,body);root.append(card);
   setCaseTab(card,'chat');
  });
 }
 $('countIE').textContent=CASES.filter(c=>c.dept==='IE').length;
 $('countIT').textContent=CASES.filter(c=>c.dept==='IT').length;
}

function renderSelected(){
 const root=$('selectedCases');root.replaceChildren();
 if(!selected.size){const p=el('p','暂未加入任务。请展开IE或IT案例，点击“加入我的练习清单”。');p.className='muted small';root.append(p);return}
 [...selected].forEach(id=>{const c=CASES.find(x=>x.id===id);const row=el('div');row.className='row between';const name=el('span',c.dept+' · '+c.title);name.className='small';const remove=el('button','移除');remove.className='btn';remove.dataset.removeCase=id;row.append(name,remove);root.append(row)});
}
function formatAgentPlan(c){
 const p=ROLE_PLANS[c.id];
 return c.dept+'｜'+c.title+'\n阶段二：Agent流程自动化（待试点）\n自动化目标：'+c.agent+'\n首版MVP：'+p.firstPilot+'\n技术层级：'+p.level+'\n触发条件：'+p.trigger+'\n只读数据来源：'+p.source+'\n必需字段：'+p.fields+'\n技术路线：'+p.tooling+'\n实施步骤：\n'+p.steps.join('\n')+'\n输出结果：'+p.output+'\n异常与回退：'+p.failure+'\n人工审批及安全边界：'+p.guard+'\n试点验收：'+p.acceptance+'\n说明：这是教学建议，具体权限和接口需经企业批准。';
}
function formatCase(c){
 const p=ROLE_PLANS[c.id];
 return c.dept+'｜'+c.title+'\n业务目标：'+c.target+'\n阶段一：Chat人工协作\n准备资料：'+c.inputs+'\n操作步骤：\n'+p.chatSteps.map((x,i)=>(i+1)+'. '+x).join('\n')+'\nChat指令：'+c.chat+'\n交付：'+c.deliver+'\n核验：'+c.verify+'\n\n'+formatAgentPlan(c);
}
async function copyText(text){let ok=false;try{if(!navigator.clipboard?.writeText)throw Error('no clipboard');await navigator.clipboard.writeText(text);ok=true}catch{const area=el('textarea');area.value=text;document.body.append(area);area.select();try{ok=document.execCommand('copy')}catch{}area.remove()}$('copyStatus').textContent=ok?'已复制练习内容':'复制受浏览器限制，可从案例详情手动选取文本'}
function updateChecks(){const boxes=[...document.querySelectorAll('[data-check]')];$('checkStatus').textContent='已确认 '+boxes.filter(x=>x.checked).length+'/'+boxes.length;try{localStorage.setItem('academy.roles.checks',JSON.stringify(boxes.map(x=>x.checked)))}catch{}}
function init(){
 renderCases();renderSelected();
 document.addEventListener('click',e=>{
  const tab=e.target.closest('[data-role-tab]');if(tab){const card=tab.closest('[data-role-case]');if(card)setCaseTab(card,tab.dataset.roleTab);return}
  const agentCopy=e.target.closest('[data-copy-agent]');if(agentCopy){const c=CASES.find(x=>x.id===agentCopy.dataset.copyAgent);if(c)copyText(formatAgentPlan(c));return}
  const cp=e.target.closest('[data-copy-case]');if(cp){const c=CASES.find(x=>x.id===cp.dataset.copyCase);if(c)copyText(c.chat);return}
  const add=e.target.closest('[data-add-case]');if(add){selected.add(add.dataset.addCase);renderSelected();$('copyStatus').textContent='已加入个人练习清单';return}
  const remove=e.target.closest('[data-remove-case]');if(remove){selected.delete(remove.dataset.removeCase);renderSelected();return}
 });
 document.addEventListener('keydown',e=>{
  const tab=e.target.closest?.('[data-role-tab]');if(!tab)return;
  const modes=['chat','agent'];const current=modes.indexOf(tab.dataset.roleTab);
  let next=null;if(e.key==='ArrowRight')next=modes[(current+1)%2];else if(e.key==='ArrowLeft')next=modes[(current+1)%2];else if(e.key==='Home')next='chat';else if(e.key==='End')next='agent';
  if(next){e.preventDefault();setCaseTab(tab.closest('[data-role-case]'),next,true)}
 });
 $('clearPlan').onclick=()=>{selected.clear();renderSelected();$('copyStatus').textContent='已清空'};
 $('copyPlan').onclick=()=>{if(!selected.size){$('copyStatus').textContent='请先加入一个案例';return}copyText('IE/IT岗位AI学习计划（教学建议）\n\n'+[...selected].map(id=>formatCase(CASES.find(c=>c.id===id))).join('\n\n---\n\n')+'\n\n实际执行须先批准数据访问并复核验收结论。')};
 let prev=[];try{prev=JSON.parse(localStorage.getItem('academy.roles.checks')||'[]')}catch{}
 document.querySelectorAll('[data-check]').forEach((box,i)=>{box.checked=prev[i]===true;box.onchange=updateChecks});updateChecks();
 const hash=location.hash.slice(1);if(CASES.some(c=>c.id===hash)){const item=$(hash);item.open=true;requestAnimationFrame(()=>item.scrollIntoView?.({block:'start'}))}
}
document.addEventListener('DOMContentLoaded',init);
