/* Connect the standalone M3 lab after M1/M2 have moved the legacy editor. */
(()=>{'use strict';
const host=document.getElementById('page-prompt'),course=document.getElementById('ap4e-course');if(!host||!course)return;
const entry=host.querySelector('a[href="labs/multimedia.html#vision"]');
if(entry){const card=entry.closest('.card');if(card)course.before(card);}
const roadmap=course.querySelector('.ap4e-roadmap');
if(roadmap){roadmap.textContent='下一步：M3 图片理解、图片生成、数据分析与应用构建。';const a=document.createElement('a');a.href='labs/multimedia.html#vision';a.textContent='进入第三批教学 →';roadmap.append(a);}
const writing=document.getElementById('ap4e-writing');if(writing){const p=document.createElement('p'),a=document.createElement('a');a.href='labs/multimedia.html#project';a.textContent='把已审阅的报告变成可验收应用 · 综合项目 →';p.append(a);writing.append(p);}
})();
