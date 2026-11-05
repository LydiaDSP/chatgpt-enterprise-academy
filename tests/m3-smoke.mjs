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
$('goal').value='异常记录';$('goal').dispatchEvent(new w.Event('input'));assert.match($('build-prompt').textContent,/异常记录/);
$('add-record').click();assert.match($('record-status').textContent,/不能为空/);
$('device').value=' <script>alert(1)</script> ';$('symptom').value='无数据';$('add-record').click();assert.equal(d.querySelectorAll('#records li').length,1);assert.equal(d.querySelector('#records script'),null);
$('device').value='设备A';$('symptom').value='离线';$('add-record').click();assert.equal(d.querySelectorAll('#records li').length,2);
$('run-tests').click();assert.match($('test-result').textContent,/6\/6/);
$('project-question').value='怎样减少排查时间？';$('project-question').dispatchEvent(new w.Event('input'));assert.match($('project-output').textContent,/怎样减少排查时间/);
$('complete').click();assert.match($('progress').textContent,/1 \/ 5/);
assert.equal(JSON.parse(w.localStorage.getItem('academy.m3.v1')).done.length,1);
assert.deepEqual(errors,[]);console.log('PASS M3 navigation, metrics, prompts, validation, XSS, prototype tests, project persistence');w.close();
const home=new JSDOM(readFileSync('index.html','utf8'),{url:'https://academy.example/#prompt',runScripts:'outside-only'});
home.window.HTMLElement.prototype.scrollIntoView=()=>{};
for(const path of ['prompt-lab-m1.js','prompt-lab-m2.js'])home.window.eval(readFileSync(path,'utf8'));
if(existsSync('prompt-lab-m3.js'))home.window.eval(readFileSync('prompt-lab-m3.js','utf8'));
const bridge=home.window.document.querySelector('#page-prompt a[href="labs/multimedia.html#vision"]');
assert.ok(bridge&&!bridge.closest('details'),'M3接续入口不能藏在折叠旧版练习中');home.window.close();
// Restore across a fresh page, malformed storage, storage denial, and exported bytes.
for(const mode of ['restore','corrupt','denied']){
const z=new JSDOM(readFileSync('labs/multimedia.html','utf8'),{url:'https://academy.example/labs/multimedia.html',runScripts:'outside-only'}),v=z.window;
v.HTMLElement.prototype.scrollIntoView=()=>{};
if(mode==='restore')v.localStorage.setItem('academy.m3.v1',JSON.stringify({done:['data'],records:[{device:'D1',symptom:'离线'}],project:['问题','证据','应用','实测'],checks:[true]}));
if(mode==='corrupt')v.localStorage.setItem('academy.m3.v1','{broken');
if(mode==='denied')Object.defineProperty(v,'localStorage',{get(){throw new Error('denied');}});
v.eval(readFileSync('labs/multimedia.js','utf8'));
const q=id=>v.document.getElementById(id);
if(mode==='restore'){
assert.equal(q('records').children.length,1);assert.equal(q('project-question').value,'问题');assert.match(q('progress').textContent,/1 \/ 5/);
let blob;v.URL.createObjectURL=b=>(blob=b,'blob:test');v.URL.revokeObjectURL=()=>{};v.HTMLAnchorElement.prototype.click=()=>{};
q('export-records').click();const readBlob=b=>new Promise(resolve=>{const reader=new v.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(b);});assert.deepEqual(JSON.parse(await readBlob(blob)),[{device:'D1',symptom:'离线'}]);
q('export-project').click();assert.match(await readBlob(blob),/## 2. 证据\n证据/);
}else{q('device').value='D2';q('symptom').value='离线';q('add-record').click();assert.equal(q('records').children.length,1);if(mode==='denied')assert.match(q('save-status').textContent,/不可用/);}
z.window.close();}
// Keep the copied teaching table aligned with the downloadable source.
const csv=readFileSync('samples/MES_生产日报_模拟.csv','utf8').trim().split(/\r?\n/).slice(1).map(r=>r.split(',').slice(0,6).map((v,i)=>i<2?v:Number(v)));
const code=readFileSync('labs/multimedia.js','utf8');const vm=await import('node:vm');assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext(code.match(/const rows=(\[[\s\S]*?\]);/)[1]))),csv);
console.log('PASS restore, corrupted/denied storage, JSON/Markdown export, CSV parity');
