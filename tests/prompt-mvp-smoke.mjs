import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const errors=[],consoleBus=new VirtualConsole();
consoleBus.on('jsdomError',error=>errors.push(error.message));
const dom=new JSDOM(read('index.html'),{
  url:'https://academy.example/#prompt',
  runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:consoleBus
});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.scrollTo=()=>{};
w.HTMLElement.prototype.scrollIntoView=()=>{};
w.ResizeObserver=class{observe(){}disconnect(){}};
w.navigator.clipboard={writeText:async value=>{w.copied=value;}};
for(const s of [...d.scripts]){
  if(s.src)w.eval(read(s.getAttribute('src')));
  else if(s.textContent.trim())w.eval(s.textContent);
}
const wait=()=>new Promise(resolve=>setTimeout(resolve,40));
await wait();

const mvp=$('prompt-quick-mvp'),full=$('prompt-full-course');
assert.ok(mvp,'Prompt MVP must exist');
assert.ok(full,'full course details must exist');
assert.equal(full.open,false,'full course should be collapsed in the classroom entry');
assert.equal(mvp.querySelectorAll('[data-qm-stage]').length,3);
assert.ok($('qm-prompt').value.includes('生产异常'));
assert.ok(d.querySelector('button[data-go="prompt"]'),'homepage direct classroom CTA');
assert.ok(d.querySelector('.course-stages'),'full M1/M2/M3 content preserved');

mvp.querySelector('[data-qm-variant="1"]').click();
assert.match($('qm-prompt').value,/虚构记录/);
$('qm-prompt').value='我的M1任务';
$('qm-prompt').dispatchEvent(new w.Event('input',{bubbles:true}));
mvp.querySelector('[data-qm-stage="m2"]').click();
assert.match($('qm-prompt').value,/肯定是最佳方案/);
mvp.querySelector('[data-qm-variant="1"]').click();
assert.match($('qm-prompt').value,/数据准确性/);
mvp.querySelector('[data-qm-stage="m1"]').click();
mvp.querySelector('[data-qm-variant="1"]').click();
assert.equal($('qm-prompt').value,'我的M1任务','edited stage prompt should not be lost');
$('qm-reset').click();
assert.match($('qm-prompt').value,/虚构记录/);

mvp.querySelector('[data-qm-stage="m3"]').click();
assert.equal(mvp.querySelectorAll('[data-qm-variant]').length,4);
mvp.querySelector('[data-qm-variant="2"]').click();
assert.match($('qm-prompt').value,/投入数960/);
assert.match($('qm-check').textContent,/94.79%/);
$('qm-copy').click();
await wait();
assert.match(w.copied,/计划产量1000/);
assert.match($('qm-copy-status').textContent,/已复制/);
$('qm-finish').click();
assert.deepEqual(JSON.parse(w.localStorage.getItem('academy.prompt.mvp.v1')),['m3']);
assert.match($('qm-progress').textContent,/1 \/ 3/);
assert.equal($('qm-next').disabled,true);

full.open=true;
assert.ok(d.getElementById('ap4e-context'),'M2 full lesson should remain available');
assert.ok($('prompt-m3').shadowRoot.querySelector('[data-panel="data"]'),'M3 full lesson should remain available');
full.open=false;
w.location.hash='#prompt-m3-data';
await wait();
assert.equal(full.open,true,'deep links into full M3 course must auto-expand');
assert.equal($('prompt-m3').shadowRoot.querySelector('[data-panel="data"]').hidden,false);
assert.deepEqual(errors,[]);
console.log('PASS MVP: M1/M2/M3 quick exercises, editable drafts, copy, reference checks, saved status, full lessons, deep links');
w.close();
