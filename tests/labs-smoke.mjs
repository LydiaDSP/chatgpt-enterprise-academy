import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {JSDOM,VirtualConsole} from 'jsdom';

const base=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(base,p),'utf8');
const index=read('index.html');
for(const [name,path] of [['Deep Research','labs/research.html'],['Codex','labs/codex.html'],['Skill','labs/skill.html']]){
 const entry=name==='Deep Research'?read('prompt-lab-m1.js'):index;
 assert.ok(entry.includes('href="'+path+'"'),(name==='Deep Research'?'Prompt M1':'主页')+'缺少'+name+'入口');
 assert.ok(existsSync(join(base,path)),name+'实验页面缺失');
}
assert.ok(read('labs/research.html').includes('#prompt-m1-info'),'研究实验室返回链接应指向M1信息获取');
for(const path of ['labs/research.js','labs/codex.js','labs/skill.js'])new vm.Script(read(path),{filename:path});
console.log('PASS 3个专题入口与脚本语法');

const skill=read('skills/sop-change-review/SKILL.md');
const schema=read('skills/sop-change-review/references/output-schema.md');
const old=read('samples/SOP_演示_旧版.md');
const newer=read('samples/SOP_演示_新版.md');
assert.ok(skill.replace(/\r\n/g,'\n').startsWith('---\nname: sop-change-review\n'));
assert.ok(skill.includes('references/output-schema.md'));
assert.ok(skill.includes('不自动审批'));
assert.ok(schema.includes('证据位置')&&schema.includes('变化类型'));
for(const [part,a,b] of [['压合压力','0.30','0.35'],['保压时间','2.0','3.0'],['首件抽样','抽取5件','抽取10件']]){
 assert.ok(old.includes(a)&&newer.includes(b),part+'模拟数据不一致');
}
assert.ok(newer.includes('校准有效期')&&newer.includes('质量工程师'));
console.log('PASS Skill目录、核心规则和5项模拟变化');

async function mount(htmlPath,jsPath){
 const errors=[],virtualConsole=new VirtualConsole();
 virtualConsole.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(read(htmlPath),{url:'https://academy.example/'+htmlPath,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
 const {window:w}=dom;
 w.addEventListener('error',e=>errors.push(e.message));
 w.scrollTo=()=>{};
 w.eval(read(jsPath));
 await new Promise(resolve=>setTimeout(resolve,25));
 return {dom,w,d:w.document,errors};
}
async function run(){
 {
  const {dom,d,errors}=await mount('labs/research.html','labs/research.js');
  assert.ok(d.querySelector('#researchPrompt').textContent.includes('视觉检测'));
  d.querySelector('[data-case="maintenance"]').click();
  assert.ok(d.querySelector('#researchPrompt').textContent.includes('预测性维护'));
  d.querySelector('[data-step="2"]').click();
  assert.ok(d.querySelector('#stepTitle').textContent.includes('查证'));
  d.querySelector('[data-evidence="0"][data-answer="fact"]').click();
  d.querySelector('[data-evidence="1"][data-answer="clue"]').click();
  d.querySelector('[data-evidence="2"][data-answer="reject"]').click();
  assert.ok(d.querySelector('#evidenceScore').textContent.includes('3/3'));
  d.querySelector('#showRationale').click();
  assert.ok(!d.querySelector('#rationale').classList.contains('hide'));
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS Deep Research 选题、动态任务、证据判定');
 }
 {
  const {dom,d,errors}=await mount('labs/codex.html','labs/codex.js');
  d.querySelector('[data-stage="4"]').click();
  assert.ok(d.querySelector('#stageTitle').textContent.includes('交付'));
  d.querySelector('#loadSample').click();
  d.querySelector('#runMerge').click();
  assert.ok(d.querySelector('#mergeResults h3').textContent.includes('9行记录，2行有异常'));
  d.querySelector('#runTests').click();
  assert.ok(d.querySelector('#testResults .status').textContent.includes('6 / 6 通过'));
  d.querySelector('#loadChallenge').click();
  d.querySelector('#runMerge').click();
  assert.ok(d.querySelector('#mergeResults h3').textContent.includes('4行记录，3行有异常'));
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS Codex 5阶段、标准/挑战样例、6项执行测试');
 }
 {
  const {dom,d,errors}=await mount('labs/skill.html','labs/skill.js');
  d.querySelector('[data-file="schema"]').click();
  assert.ok(d.querySelector('#fileTitle').textContent.includes('output-schema'));
  assert.ok(d.querySelector('#fileLink').getAttribute('href').includes('references/output-schema.md'));
  for(const key of ['pressure','time','sampling','calibration','quality'])d.querySelector('[data-diff="'+key+'"]').click();
  d.querySelector('#checkDiff').click();
  assert.ok(d.querySelector('#quizScore').textContent.includes('7/7'));
  d.querySelector('#toggleAnswer').click();
  assert.equal(d.querySelectorAll('#referenceAnswer tbody tr').length,5);
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log('PASS Skill 文件树、5项差异练习与标准答案');
 }
 console.log('ALL SPECIAL LAB SMOKE TESTS PASSED');
}
await run();
