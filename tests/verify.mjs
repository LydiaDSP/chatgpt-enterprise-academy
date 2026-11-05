import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const cases = JSON.parse(read('scenario_data.json'));
const block = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(block, '内联脚本必须存在');
new vm.Script(block[1], {filename:'academy-inline.js'});
console.log('PASS JavaScript语法');

const inline = block[1].match(/const SCENARIOS\s*=\s*(\[[\s\S]*?\]);\s*const /);
assert.ok(inline, '案例内嵌数据必须存在');
assert.equal(JSON.stringify(JSON.parse(inline[1])), JSON.stringify(cases), '页面场景与备份数据必须完全一致');
assert.equal(cases.length,30);
assert.equal(cases.filter(c=>c.priority==='高').length,17);
assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);
assert.equal(new Set(cases.map(c=>c.department)).size,6);
console.log('PASS 30个场景、优先级、唯一性、数据源一致');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.includes('$'));
assert.equal(new Set(ids).size,ids.length, '静态HTML ID不应重复');
for(const m of block[1].matchAll(/\bel\('([^']+)'\)/g)) {
  assert.ok(ids.includes(m[1]), '脚本使用了不存在的HTML ID: '+m[1]);
}
for(const id of ['prevChapter','nextChapter','presentToggle','chapterCount']) {
  assert.ok(ids.includes(id), '缺少讲师工具栏元素: '+id);
}
for(const feature of ['function routeFromHash()', 'function setLargeText(', 'function navigateChapter(']) {
  assert.ok(block[1].includes(feature), '缺少教学体验能力: '+feature);
}
assert.ok(block[1].includes("e.preventDefault();navigateChapter("),'快捷键需阻止浏览器默认操作');
console.log('PASS UI绑定、章节导航、投影字号和快捷键静态检查');

const csvPaths=['samples/MES_生产日报_模拟.csv','samples/采购订单_模拟_1.csv','samples/采购订单_模拟_2.csv','samples/采购订单_模拟_3.csv'];
for(const path of csvPaths) {
  const data=read(path);
  assert.ok(data.trim().split(/\r?\n/).length>=2,'模拟CSV内容缺失: '+path);
  assert.ok(html.includes('href="'+path+'"'),'页面缺少CSV下载入口: '+path);
}
const orders=csvPaths.slice(1).flatMap(path=>read(path).trim().split(/\r?\n/).slice(1).map(x=>x.split(',')));
assert.equal(orders.length,9);
assert.equal(orders.filter(x=>!x[3]).length,1);
assert.equal(orders.length-new Set(orders.map(x=>x[0]+'|'+x[1])).size,1);
console.log('PASS 模拟CSV文件、9条订单及预设异常');

const chapterBlock=block[1].match(/const LESSONS=(\[[\s\S]*?\]);\s*const /);
assert.ok(chapterBlock,'缺少课程计划');
const lessonData=vm.runInNewContext('('+chapterBlock[1]+')');
assert.equal(lessonData.length,10);
assert.ok(lessonData[0][0].startsWith('00')&&lessonData.at(-1)[0].endsWith('120'));
console.log('PASS 120分钟10段课程结构');
console.log('ALL STATIC ACCEPTANCE CHECKS PASSED');
