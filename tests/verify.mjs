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
const toolsView = html.match(/<section class="view" id="page-tools">([\s\S]*?)<\/section>/);
assert.ok(toolsView, '缺少 Skill/MCP/Plugin 课程区块');
const course = toolsView[1];
// 3W 首屏教学：四个概念各自具备 What / Why / How 与可体验实例
const threeWStart = course.indexOf('3W 入门');
const threeWEnd = course.indexOf('把它们放到同一条工作流中理解');
assert.ok(threeWStart >= 0 && threeWEnd > threeWStart, '3W 入门应放在课程最前面');
const threeW = course.slice(threeWStart, threeWEnd);
const threeWCards = [...threeW.matchAll(/<article class="card tool-3w-card">([\s\S]*?)<\/article>/g)];
assert.equal(threeWCards.length, 4, 'Skill / MCP / Plugin / CLI 应各有一张 3W 教学卡');
for (const [i, keyword] of ['Skill','MCP','Plugin / App','CLI'].entries()) {
  const card = threeWCards[i][1];
  assert.ok(card.includes(keyword), '3W 教学顺序缺少 ' + keyword);
  for(const label of ['What｜是什么','Why｜为什么用','How｜怎么用','体验示例']) {
    assert.ok(card.includes(label), keyword + ' 缺少 ' + label);
  }
}
assert.ok(threeW.includes('Plugins → Skills'), 'Skill 上手路径必须可操作');
assert.ok(threeW.includes('选择支持 MCP 的客户端'), 'MCP 安装不应被描述为直接在聊天中完成');
assert.ok(threeW.includes('ChatGPT') && threeW.includes('Codex CLI'), '应区分插件与命令行的操作入口');

const publicStart = course.indexOf('公开推荐 01');
const customStart = course.indexOf('企业内部自建方向');
assert.ok(publicStart >= 0 && customStart > publicStart, '公开推荐和企业自建必须分为不同区块');
const publicCatalog = course.slice(publicStart, customStart);
const publicGroups = [...publicCatalog.matchAll(/<div class="grid3 tool-catalog" data-public-catalog="true">/g)];
assert.equal(publicGroups.length, 3, '应区分现成 ChatGPT 插件、公开 Skill、公开 MCP');
const recommendationCards = [...publicCatalog.matchAll(/<details class="tool-entry">([\s\S]*?)<\/details>/g)];
assert.equal(recommendationCards.length, 16, '仅保留16项可获得的现成公开资源');
for (const term of ['Skill Creator（ChatGPT）','PDF Skill','DOCX Skill','XLSX Skill','PPTX Skill','Webapp Testing Skill','Filesystem MCP Server','Playwright MCP','Context7 MCP','GitHub MCP Server','Google Drive','Canva','Gmail','Google Calendar','SharePoint']) {
  assert.ok(publicCatalog.includes(term), '公开资源目录遗漏：' + term);
}
for (const term of ['MES 日报分析 Skill','8D / CAPA 评审 Skill','3Q 验证资料检查 Skill','MES / QMS / ERP 只读 MCP','企业文档 / 知识库连接']) {
  assert.ok(!publicCatalog.includes(term), '自建或泛化能力误入公开推荐：' + term);
}
for (const match of recommendationCards) {
  assert.ok(match[1].includes('适用平台：') && match[1].includes('使用路径：'), '公开工具缺少平台或安装路径');
  assert.ok(/href="https:\/\/[^"]+"/.test(match[1]), '公开工具必须提供明确对外链接');
}
assert.ok(course.includes('不是现成推荐') && course.includes('自建需求'), '必须明确内部场景不属于公开工具推荐');
for (const dept of ['品保','制造','财务','人资','研发','供应链']) {
  assert.ok(course.includes(dept), '缺少部门内部自建需求案例：' + dept);
}
assert.ok(course.includes('MCP 是工具接入可选的技术协议'), '不应误导 MCP 为必备组件');
assert.ok(course.includes('不能直接配置'), '缺少高风险操作的教学判断');
assert.ok(course.includes('人工') && course.includes('脱敏'), '缺少安全边界说明');
const openDetails = (course.match(/<details\b/g) || []).length;
const closeDetails = (course.match(/<\/details>/g) || []).length;
assert.equal(openDetails, closeDetails, '折叠卡标签未闭合');
for (const link of [...course.matchAll(/href="([^"]+)"/g)].map(m => m[1])) {
  if (/^https?:\/\//.test(link)) assert.ok(/^https:\/\/[^\s]+$/.test(link), '外部链接必须使用 https 地址：' + link);
  else assert.ok(readFileSync(new URL('../' + link, import.meta.url)), '内部参考文件缺失：' + link);
}
console.log('PASS 16项真实公开资源、独立企业自建区、6部门案例、平台/链接/安全说明');

console.log('ALL STATIC ACCEPTANCE CHECKS PASSED');
