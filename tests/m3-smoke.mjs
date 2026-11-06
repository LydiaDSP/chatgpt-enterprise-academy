import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
assert.ok(existsSync('labs/multimedia.html'),'M3教学实验室尚未实现');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(readFileSync('labs/multimedia.html','utf8'),{url:'https://academy.example/labs/multimedia.html#data',runScripts:'outside-only',virtualConsole:vc});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.HTMLElement.prototype.scrollIntoView=()=>{};
w.eval(readFileSync('labs/multimedia.js','utf8'));
assert.equal(d.querySelector('[data-panel="data"]').hidden,false);
$('next').click();assert.equal(d.querySelector('[data-panel="build"]').hidden,false);
$('prev').click();assert.equal(d.querySelector('[data-panel="data"]').hidden,false);
$('calculate').click();assert.match($('data-result').textContent,/5110/);assert.match($('data-result').textContent,/94.63/);assert.match($('data-result').textContent,/96.03/);
$('vision-safe').click();assert.match($('vision-result').textContent,/不能/);
$('style').value='线稿';$('style').dispatchEvent(new w.Event('change'));assert.match($('image-prompt').textContent,/线稿/);

// Source accuracy: the original M3 slide teaches three blocks; the two additional blocks are explicitly sourced as an extension.
const build=d.querySelector('[data-panel="build"]');
assert.match(build.textContent,/M3 原课/);
assert.match(build.textContent,/扩展课程/);
assert.match(build.textContent,/独立应用开发课/);
for(const id of ['goal','input','output','layout','features'])assert.ok($(id),'missing app-building block: '+id);
assert.equal(d.querySelectorAll('[data-build-mode]').length,2);
assert.match($('build-prompt').textContent,/Goal｜目标/);
$('goal').value='异常记录';$('input').value='设备编号、日期、点检人';$('layout').value='顶部表单、下方列表';$('features').value='筛选异常并导出';$('output').value='显示记录和异常数';
for(const id of ['goal','input','layout','features','output'])$(id).dispatchEvent(new w.Event('input'));
for(const value of ['异常记录','设备编号、日期、点检人','顶部表单、下方列表','筛选异常并导出','显示记录和异常数'])assert.ok($('build-prompt').textContent.includes(value),'generated prompt missing '+value);
d.querySelector('[data-build-mode="incremental"]').click();
assert.match($('build-prompt').textContent,/渐进式方式开发/);
assert.match($('build-prompt').textContent,/第1轮/);
d.querySelector('[data-build-mode="single"]').click();
assert.match($('build-prompt').textContent,/五个维度/);
for(const id of ['iteration-start','iteration-mvp','iteration-feature','iteration-debug','iteration-ideas'])assert.ok($(id),'missing iterative prompt: '+id);
assert.match($('iteration-debug').textContent,/预期结果/);
assert.match($('iteration-ideas').textContent,/不要直接修改代码/);

// Prototype: validation, normal/abnormal records, filtering, persistence and safe text rendering.
$('add-record').click();assert.match($('record-status').textContent,/必填/);
$('device').value='  ';$('inspection-date').value='2026-11-06';$('inspector').value='测试人员';$('check-result').value='正常';$('add-record').click();assert.match($('record-status').textContent,/必填/);
$('device').value='DEMO-01';$('inspection-date').value='2026-11-06';$('inspector').value='测试人员';$('check-result').value='正常';$('symptom').value='';$('add-record').click();
assert.equal(d.querySelectorAll('#records li.inspection-normal').length,1);
$('device').value='DEMO-02';$('inspection-date').value='2026-11-06';$('inspector').value='测试人员';$('check-result').value='异常';$('symptom').value='设备指示灯未亮';$('add-record').click();
assert.equal(d.querySelectorAll('#records li.inspection-abnormal').length,1);
assert.match($('record-summary').textContent,/共 2 条记录/);
$('record-filter').value='abnormal';$('record-filter').dispatchEvent(new w.Event('change'));
assert.equal(d.querySelectorAll('#records li.inspection-abnormal').length,1);
assert.equal(d.querySelectorAll('#records li.inspection-normal').length,0);
$('record-filter').value='all';$('record-filter').dispatchEvent(new w.Event('change'));
$('device').value=' <script>alert(1)</script> ';$('inspection-date').value='2026-11-06';$('inspector').value='测试人员';$('check-result').value='正常';$('symptom').value='';$('add-record').click();
assert.equal(d.querySelector('#records script'),null);
assert.ok([...d.querySelectorAll('#records li')].some(x=>x.textContent.includes('<script>alert(1)</script>')));
$('run-tests').click();assert.match($('test-result').textContent,/9\/9/);
$('project-question').value='怎样减少点检遗漏？';$('project-question').dispatchEvent(new w.Event('input'));assert.match($('project-output').textContent,/怎样减少点检遗漏/);
$('complete').click();assert.match($('progress').textContent,/1 \/ 5/);
assert.equal(JSON.parse(w.localStorage.getItem('academy.m3.v1')).done.length,1);
assert.equal(JSON.parse(w.localStorage.getItem('academy.m3.v1')).records.length,3);
assert.deepEqual(errors,[]);console.log('PASS M3 source attribution, five blocks, prompting modes, iteration prompts, inspection prototype, validation, filtering, XSS, persistence');
w.close();

const home=new JSDOM(readFileSync('index.html','utf8'),{url:'https://academy.example/#prompt',runScripts:'outside-only'});
home.window.HTMLElement.prototype.scrollIntoView=()=>{};
for(const path of ['prompt-lab-m1.js','prompt-lab-m2.js'])home.window.eval(readFileSync(path,'utf8'));
assert.equal(home.window.document.querySelectorAll('a[href^="labs/multimedia.html"]').length,0,'主站不应再有独立M3入口卡片');home.window.close();

// Restore legacy records, malformed storage, storage denial, and exported bytes.
for(const mode of ['restore','corrupt','denied']){
 const z=new JSDOM(readFileSync('labs/multimedia.html','utf8'),{url:'https://academy.example/labs/multimedia.html',runScripts:'outside-only'}),v=z.window;
 v.HTMLElement.prototype.scrollIntoView=()=>{};
 if(mode==='restore')v.localStorage.setItem('academy.m3.v1',JSON.stringify({done:['data'],records:[{device:'D1',symptom:'离线'}],project:['问题','证据','应用','实测'],checks:[true]}));
 if(mode==='corrupt')v.localStorage.setItem('academy.m3.v1','{broken');
 if(mode==='denied')Object.defineProperty(v,'localStorage',{get(){throw new Error('denied');}});
 v.eval(readFileSync('labs/multimedia.js','utf8'));
 const q=id=>v.document.getElementById(id);
 if(mode==='restore'){
  assert.equal(q('records').querySelectorAll('li.inspection-abnormal').length,1);
  assert.equal(q('project-question').value,'问题');assert.match(q('progress').textContent,/1 \/ 5/);
  assert.match(q('records').textContent,/历史记录/,'旧版异常记录应迁移为可见历史记录');
  let blob;v.URL.createObjectURL=b=>(blob=b,'blob:test');v.URL.revokeObjectURL=()=>{};v.HTMLAnchorElement.prototype.click=()=>{};
  q('export-records').click();
  const readBlob=b=>new Promise(resolve=>{const reader=new v.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(b);});
  const exported=JSON.parse(await readBlob(blob));assert.equal(exported[0].device,'D1');assert.equal(exported[0].result,'异常');
  q('export-project').click();assert.match(await readBlob(blob),/## 2. 证据\n证据/);
 }else{
  q('device').value='D2';q('inspection-date').value='2026-11-06';q('inspector').value='测试';q('check-result').value='异常';q('symptom').value='离线';q('add-record').click();
  assert.equal(q('records').querySelectorAll('li.inspection-abnormal').length,1);
  if(mode==='denied')assert.match(q('save-status').textContent,/不可用/);
 }
 z.window.close();
}

// Keep the copied teaching table aligned with the downloadable source.
const csv=readFileSync('samples/MES_生产日报_模拟.csv','utf8').trim().split(/\r?\n/).slice(1).map(r=>r.split(',').slice(0,6).map((v,i)=>i<2?v:Number(v)));
const code=readFileSync('labs/multimedia.js','utf8');const vm=await import('node:vm');assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext(code.match(/const rows=(\[[\s\S]*?\]);/)[1]))),csv);
console.log('PASS legacy restore, corrupted/denied storage, JSON/Markdown export, CSV parity');
