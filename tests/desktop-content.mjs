import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const section = html.split('id="page-desktop"')[1].split('<section class="view"')[0];
assert.equal((section.match(/class="desktop-shot"/g) || []).length, 8);
for (let n = 1; n <= 8; n++) {
  assert.ok(section.includes(`id="desktop-shot-0${n}"`));
}
const images = [...section.matchAll(/<img src="([^"]+)" alt="([^"]+)"/g)];
assert.equal(images.length, 11);
assert.equal(new Set(images.map(image => image[1])).size, 11);
assert.ok(!section.includes('chat-思考.png'));
assert.ok(!/<strong>截图\s*\d/.test(section));
assert.ok(section.includes('id="desktop-model-guide"'));
assert.ok(section.includes('id="desktop-reasoning-guide"'));
for (const [, path, alt] of images) {
  assert.ok(existsSync(new URL('../' + path, import.meta.url)), path);
  assert.ok(alt.length > 5);
  assert.ok(section.includes(`href="${path}"`), 'Full-size image link missing');
}
assert.ok(!section.includes('待补：'));
assert.ok(section.includes('用户提供的桌面端真实截图'));
assert.ok(section.includes('不是课堂推荐配置'));
assert.ok(section.includes('专业可靠'));
assert.ok(section.includes('不是软件强制要求'));
assert.ok(section.includes('并非已经替你修改设置'));
assert.ok(html.includes("desktop:'桌面端快速上手'"));
assert.ok(!html.includes('桌面端与Enterprise'));
for (const topic of ['models', 'projects', 'personalize', 'app/settings']) {
  assert.ok(section.includes(`https://learn.chatgpt.com/docs/${topic}`));
}
console.log('PASS desktop title, 11 real images in eight sections, links, evidence boundaries and sources');
