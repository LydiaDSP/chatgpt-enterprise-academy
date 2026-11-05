import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {JSDOM,VirtualConsole} from 'jsdom';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const index=read('index.html');
for(const page of ['labs/work.html','labs/roles.html']){
  assert.ok(index.includes('href="'+page+'"'),'主课程缺少入口 '+page);
  assert.ok(existsSync(join(root,page)),'专题页不存在 '+page);
}
for(const path of ['labs/work.js','labs/roles-blueprints.js','labs/roles.js'])new vm.Script(read(path),{filename:path});
const plans=vm.runInNewContext(read('labs/roles-blueprints.js')+'\nROLE_PLANS;');
assert.equal(Object.keys(plans).length,12,'IE/IT 12个案例必须全部提供独立实施蓝图');
for(const [id,plan] of Object.entries(plans)){
  for(const key of ['trigger','source','fields','tooling','guard','failure','output','acceptance','firstPilot'])assert.ok(plan[key]&&plan[key].length>=20,id+' 自动化实施字段不完整：'+key);
  assert.equal(plan.steps.length,6,id+' 需要六步自动化流程');
  assert.ok(plan.chatSteps.length>=4,id+' 需要不少于4步可操作Chat指引');
  assert.ok(new Set(plan.steps).size===plan.steps.length,id+' 步骤有重复');
}
console.log('PASS 12个场景均有可执行的Chat步骤和Agent实施字段');
const backup=JSON.parse(read('scenario_data.json'));
assert.equal(backup.length,30,'原始30个Excel场景必须保留');
const inline=JSON.parse(index.match(/const SCENARIOS\s*=\s*(\[[\s\S]*?\]);\s*const /)[1]);
assert.equal(JSON.stringify(inline),JSON.stringify(backup),'原30场景数据不得出现漂移');
console.log('PASS 入口、脚本语法与原始30场景不变');

const ieCSV=read('samples/IE_线平衡_模拟.csv').trim().split(/\r?\n/);
const itCSV=read('samples/IT_设备在线事件_模拟.csv').trim().split(/\r?\n/);
assert.equal(ieCSV.length-1,5);
assert.equal(itCSV.length-1,8);
assert.ok(ieCSV[0].includes('目标节拍'));
assert.ok(itCSV[0].includes('设备编号'));
console.log('PASS IE与IT模拟CSV完整性');

async function mount(htmlPath,jsPath,hash=''){
  const errors=[],virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(read(htmlPath),{url:'https://academy.example/'+htmlPath+hash,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
  const w=dom.window;
  w.scrollTo=()=>{};
  w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.addEventListener('error',e=>errors.push(e.message));
  if(jsPath==='labs/roles.js')w.eval(read('labs/roles-blueprints.js'));
  w.eval(read(jsPath));
  await new Promise(resolve=>setTimeout(resolve,35));
  return {dom,w,doc:w.document,errors};
}
{
  const {dom,doc,errors}=await mount('labs/work.html','labs/work.js');
  assert.ok(doc.querySelector('#scenarioTitle').textContent.includes('公开物流'));
  assert.equal(doc.querySelectorAll('#flowSteps button').length,5);
  doc.querySelector('#nextFlow').click();
  assert.ok(doc.querySelector('#flowTitle').textContent.includes('第2步'));
  doc.querySelector('[data-scenario="inspection"]').click();
  assert.ok(doc.querySelector('#scenarioTitle').textContent.includes('设备离线'));
  assert.ok(doc.querySelector('#businessGoal').value.includes('不要登录真实WinCC'));
  const answers=['allow','block','approval','block'];
  answers.forEach((a,i)=>doc.querySelector('[data-policy="'+i+'"][data-answer="'+a+'"]').click());
  assert.ok(doc.querySelector('#policyProgress').textContent.includes('符合参考 4/4'));
  assert.equal(doc.querySelector('#executeAction').disabled,true,'未获模拟审批之前不能执行');
  doc.querySelector('#requestApproval').click();
  assert.equal(doc.querySelector('#executeAction').disabled,true);
  doc.querySelector('#approveAction').click();
  assert.equal(doc.querySelector('#executeAction').disabled,false);
  doc.querySelector('#executeAction').click();
  assert.ok(doc.querySelector('#approvalStatus').textContent.includes('未发送任何内容'));
  assert.ok(doc.querySelectorAll('#eventLog li').length>3);
  doc.querySelector('#resetApproval').click();
  assert.equal(doc.querySelector('#executeAction').disabled,true);
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS Work任务切换、权限判断4/4、审批前置与日志');
}
{
  const {dom,doc,errors}=await mount('labs/roles.html','labs/roles.js','#it-01');
  assert.equal(doc.querySelectorAll('#ieCases details').length,6);
  assert.equal(doc.querySelectorAll('#itCases details').length,6);
  assert.ok(doc.querySelector('#it-01').open,'深链接应展开对应案例');
  assert.ok(doc.querySelector('#ie-01').textContent.includes('标准工时'));
  assert.ok(doc.querySelector('#it-05').textContent.includes('终端安全'));
  assert.equal(doc.querySelector('#countIE').textContent,'6');
  assert.equal(doc.querySelector('#countIT').textContent,'6');
  // 全部12个IE/IT案例必须是双选项卡，不得把两种路径堆在一个界面
  const cards=[...doc.querySelectorAll('[data-role-case]')];
  assert.equal(cards.length,12);
  for(const card of cards){
    assert.equal(card.querySelectorAll('[role="tab"]').length,2,card.id+' 缺少Chat或Agent选项卡');
    assert.equal(card.querySelectorAll('[role="tabpanel"]').length,2,card.id+' 缺少独立面板');
    const chat=card.querySelector('[data-role-panel="chat"]'),agent=card.querySelector('[data-role-panel="agent"]');
    assert.equal(chat.hidden,false,card.id+' 默认应展示Chat');
    assert.equal(agent.hidden,true,card.id+' 默认应隐藏Agent');
    assert.ok(chat.textContent.includes('准备资料')&&chat.textContent.includes('操作路线')&&chat.textContent.includes('Chat Prompt'),card.id+' Chat缺少业务练习');
    assert.ok(!chat.textContent.includes('上线前提 / 技术配套'),card.id+' Agent内容不应混入Chat');
    assert.ok(agent.textContent.includes('六步自动化实施清单')&&agent.textContent.includes('从哪里获取数据')&&agent.textContent.includes('怎么验证试点成功'),card.id+' Agent缺少具体实施步骤');
    assert.equal(agent.querySelectorAll('.agent-runbook li').length,6,card.id+' 需要展示6步自动化实施');
    assert.ok(agent.textContent.includes('什么时候运行')&&agent.textContent.includes('必须具备哪些字段'),card.id+' 缺少触发器或字段');
    assert.ok(agent.textContent.includes('什么情况要停止')&&agent.textContent.includes('绝不能自动做什么'),card.id+' 缺少异常处理及权限边界');
    assert.ok(agent.textContent.includes('第一版最小可行试点'),card.id+' 缺少首版实施顺序');
    assert.equal(agent.querySelectorAll('[data-copy-agent]').length,1,card.id+' 缺少复制Agent方案按钮');
    assert.ok(!agent.textContent.includes('简短实用的Chat Prompt'),card.id+' Chat内容不应混入Agent');
    assert.ok(card.querySelector('[data-role-tab="chat"]').textContent.includes('Chat人工协作'));
    assert.ok(card.querySelector('[data-role-tab="agent"]').textContent.includes('Agent流程自动化'));
    assert.equal(card.querySelectorAll('[data-copy-case]').length,1,card.id+' 必须保留复制Chat指令');
  }
  const ie=doc.querySelector('#ie-01'),it=doc.querySelector('#it-01');
  ie.open=true;
  const ieChat=ie.querySelector('[data-role-panel="chat"]'),ieAgent=ie.querySelector('[data-role-panel="agent"]');
  const itChat=it.querySelector('[data-role-panel="chat"]'),itAgent=it.querySelector('[data-role-panel="agent"]');
  ie.querySelector('[data-role-tab="agent"]').click();
  assert.equal(ieChat.hidden,true,'IE切换Agent后应隐藏Chat');
  assert.equal(ieAgent.hidden,false,'IE切换Agent后应显示Agent');
  assert.equal(ie.querySelector('[data-role-tab="agent"]').getAttribute('aria-selected'),'true');
  assert.equal(itChat.hidden,false,'IE切换不能影响IT默认Chat');
  assert.equal(itAgent.hidden,true);
  // Agent与Chat来回切换、键盘切换及独立卡片状态
  ie.querySelector('[data-role-tab="chat"]').click();
  assert.equal(ieChat.hidden,false);
  assert.equal(ieAgent.hidden,true);
  const keyboard=new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true});
  ie.querySelector('[data-role-tab="chat"]').dispatchEvent(keyboard);
  assert.ok(keyboard.defaultPrevented,'选项卡键盘导航必须阻止默认滚动');
  assert.equal(ieChat.hidden,true);
  assert.equal(ieAgent.hidden,false);
  it.querySelector('[data-role-tab="agent"]').click();
  assert.equal(itChat.hidden,true);
  assert.equal(itAgent.hidden,false);
  assert.equal(ieAgent.hidden,false,'不同案例选项卡状态应独立');
  console.log('PASS 全部12个IE/IT案例双模式切换、隐藏与键盘访问');

  doc.querySelector('[data-add-case="ie-01"]').click();
  doc.querySelector('[data-add-case="it-01"]').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,2);
  doc.querySelector('[data-remove-case="it-01"]').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,1);
  // 两个核心示范应能作为可复现教学案例
  assert.ok(doc.querySelector('#it-01 [data-role-panel="agent"]').textContent.includes('只读CSV导出'));
  assert.ok(doc.querySelector('#it-01 [data-role-panel="agent"]').textContent.includes('DEMO-01离线12分钟'));
  assert.ok(doc.querySelector('#ie-01 [data-role-panel="agent"]').textContent.includes('压合为+8秒/件'));
  assert.ok(doc.querySelector('#it-04 [data-role-panel="agent"]').textContent.includes('主键'));
  assert.ok(doc.querySelector('#it-05 [data-role-panel="agent"]').textContent.includes('安全管理员'));
  doc.querySelector('#clearPlan').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,0);
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS IE/IT各6案、单案深链、练习任务添加与删除');
}
console.log('ALL PHASE3 WORK / ROLE SMOKE TESTS PASSED');
