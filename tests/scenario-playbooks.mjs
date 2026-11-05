import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const source=read('scenario_data.json');
const raw=JSON.parse(source);
const sandbox={window:{}};
new vm.Script(read('scenario-playbooks.js'),{filename:'scenario-playbooks.js'}).runInNewContext(sandbox);
const guides=sandbox.window.SCENARIO_PLAYBOOKS;
assert.equal(raw.length,30,'The original dataset must contain exactly 30 requests');
assert.equal(Object.keys(guides).length,30,'All original requests must have a guide');
assert.deepEqual(Object.keys(guides).sort(),raw.map(x=>x.id).sort(),'Guide IDs must match the original requests');
const statuses=new Set(['direct','conditional','pilot']);
for(const c of raw){
 const p=guides[c.id];assert.ok(p,'Missing guide: '+c.id);
 for(const key of ['t','verdict','data','access','deliver'])assert.ok(typeof p[key]==='string'&&p[key].length>=12,c.id+' missing '+key);
 assert.ok(statuses.has(p.status),c.id+' invalid feasibility status');
 assert.ok(Array.isArray(p.steps)&&p.steps.length>=5,c.id+' needs at least 5 actionable Chat steps');
 assert.ok(Array.isArray(p.upgrade)&&p.upgrade.length>=3,c.id+' needs an explicit improvement path');
 assert.ok(Array.isArray(p.check)&&p.check.length>=2,c.id+' needs acceptance and safety checks');
 assert.ok(p.steps.every(x=>x.length>=18),c.id+' contains a vague Chat step');
 assert.ok(p.upgrade.every(x=>x.length>=15),c.id+' contains a vague upgrade step');
 assert.ok(!/[當彙檢歸維週異資關離發動預報務]/.test(p.t),c.id+' title has suspected traditional characters');
}
const indexScript=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(indexScript&&indexScript[1].includes('function renderCases()'));
assert.ok(html.includes('<script src="scenario-playbooks.js"></script>'),'Detailed guides must load on the main page');
assert.ok(indexScript[1].includes('p.steps')&&indexScript[1].includes('p.upgrade'),'Both Chat and advanced steps must render');
assert.ok(indexScript[1].includes('p.access')&&indexScript[1].includes('p.check'),'Requirements and acceptance checks must render');
const course=read('prompt-lab-m3.js');
assert.ok(!course.includes("mount('extended-cases'"),'IE/IT teaching demos must be hidden from the main training page');
assert.ok(!course.includes('42个业务场景'),'Unrequested examples must not appear in the main case count');
assert.ok(/\['FIN','财务/.test(html),'Original six-department navigation must remain');
console.log('PASS 30 complete Simplified Chinese case guides, six original departments, no added IE/IT demonstrations');
