import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const errors=[];
const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{
  url:'https://academy.example/#dept-QA',
  runScripts:'dangerously',
  pretendToBeVisual:true,
  virtualConsole,
  beforeParse(win){
    win.scrollTo=()=>{};
    win.HTMLElement.prototype.scrollIntoView=()=>{};
    win.confirm=()=>true;
  }
});
const {window:win}=dom,doc=win.document;
const tick=()=>new Promise(resolve=>setTimeout(resolve,30));
try {
  await tick();
  assert.ok(doc.querySelector('#page-cases').classList.contains('active'),'初始部门深链应进入案例页面');
  assert.equal(win.location.hash,'#dept-QA','初始部门深链不应被覆盖');
  assert.ok(doc.querySelector('#dept-QA'),'品保部门应存在');
  console.log('PASS 部门深链接');

  win.location.hash='#case-01'; await tick();
  assert.ok(doc.querySelector('#page-cases').classList.contains('active'),'案例链接应展示案例页');
  assert.ok(doc.getElementById('case-01').open,'指定案例应自动展开');
  console.log('PASS 单案例深链接与自动展开');

  win.location.hash='#home'; await tick();
  doc.getElementById('nextChapter').click();
  assert.ok(doc.querySelector('#page-desktop').classList.contains('active'),'下一章点击后应跳转');
  doc.getElementById('prevChapter').click();
  assert.ok(doc.querySelector('#page-home').classList.contains('active'),'上一章点击后应跳回');
  assert.ok(doc.getElementById('prevChapter').disabled,'首页上一章应禁用');
  console.log('PASS 讲师前后章节按钮');

  doc.getElementById('presentToggle').click();
  assert.ok(doc.body.classList.contains('large-text'),'打开大字模式应应用样式');
  assert.equal(doc.getElementById('presentToggle').getAttribute('aria-pressed'),'true');
  doc.getElementById('presentToggle').click();
  assert.ok(!doc.body.classList.contains('large-text'),'可关闭大字模式');
  console.log('PASS 投影大字模式切换');

  doc.getElementById('modeToggle').click();
  const event=new win.KeyboardEvent('keydown',{key:'PageDown',shiftKey:true,bubbles:true,cancelable:true});
  doc.dispatchEvent(event);
  assert.ok(event.defaultPrevented,'键盘快捷键应阻止浏览器默认滚动');
  assert.ok(doc.querySelector('#page-desktop').classList.contains('active'),'快捷键应切换章节');
  console.log('PASS 讲师快捷键');

  win.location.hash='#codex'; await tick();
  doc.getElementById('loadSample').click();
  doc.getElementById('runMerge').click();
  const counts=[...doc.querySelectorAll('#mergeResults .metric strong')].map(x=>x.textContent);
  assert.deepEqual(counts,['3','9','2'],'CSV合并器应处理3份文件9行2条异常');
  console.log('PASS 原有Codex CSV演示未回归');

  win.location.hash='#prompt'; await tick();
  doc.querySelector('[data-prompt-task="scm"]').click();
  assert.ok(doc.getElementById('promptInput').value.includes('缺料'));
  console.log('PASS 原有Prompt切换未回归');

  assert.deepEqual(errors,[], '页面初始化和交互不应出现JavaScript异常');
  console.log('ALL BROWSER SMOKE CHECKS PASSED');
} finally {
  win.close();
}
