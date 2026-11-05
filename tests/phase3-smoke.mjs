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
for(const path of ['labs/work.js','labs/roles.js'])new vm.Script(read(path),{filename:path});
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
  doc.querySelector('[data-add-case="ie-01"]').click();
  doc.querySelector('[data-add-case="it-01"]').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,2);
  doc.querySelector('[data-remove-case="it-01"]').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,1);
  doc.querySelector('#clearPlan').click();
  assert.equal(doc.querySelectorAll('#selectedCases [data-remove-case]').length,0);
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS IE/IT各6案、单案深链、练习任务添加与删除');
}
console.log('ALL PHASE3 WORK / ROLE SMOKE TESTS PASSED');
