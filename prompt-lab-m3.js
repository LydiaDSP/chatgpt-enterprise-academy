/* Reuse standalone lesson sources with isolated styles and IDs, not iframes. */
(()=>{'use strict';
const course=document.getElementById('ap4e-course');
if(!course||!window.ACADEMY_INLINE)return;
const style=document.createElement('style');
style.textContent=`
 .course-stages{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0;padding:12px 0;border-block:1px solid var(--line);scroll-margin-top:90px}
 .course-stages button{flex:1 1 180px;min-height:44px;border-radius:8px}
 .course-stages button[aria-pressed=true]{background:var(--red);color:white;border-color:var(--red)}
 #ap4e-course [hidden]{display:none!important}
 #ap4e-course .ap4e-rail{scroll-margin-top:90px}
 #prompt-m3{margin-top:0}
 .stage-progress{white-space:nowrap;font-size:13px;color:var(--muted)}
 @media(max-width:560px){.course-stages{gap:6px}.course-stages button{flex:1 1 0;padding:9px 5px;font-size:12px}}
 .inline-stage{display:block;margin-top:32px;scroll-margin-top:100px}
 #deptJump{position:sticky;top:var(--academy-top,76px);z-index:9;background:#fcfbf9;padding:12px 0;border-bottom:1px solid var(--line);gap:8px}
 .department,#page-cases details{scroll-margin-top:var(--academy-anchor,160px)}
`;
document.head.append(style);
const sharedCSS=`
 :host{display:block;font:15px/1.72 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:#20242c;--red:#aa2737;--dark:#81202e;--ink:#20242c;--text:#39424f;--muted:#69727c;--line:#e8e2e4;--wash:#fcf0f2;--green:#207450;--academy-anchor:160px}
 [hidden]{display:none!important}*{letter-spacing:0!important}section,details{scroll-margin-top:var(--academy-anchor)}
 h2{font-size:23px}h3{font-size:17px}.card,.output,.info,.role-tabs,.role-tab,.role-prompt{border-radius:8px;box-shadow:none}
 .grid{grid-template-columns:repeat(2,minmax(0,1fr))}.grid>*{min-width:0}.btn{border-radius:8px;overflow-wrap:anywhere}
 .steps{position:static;background:none}.toolbar{margin-top:0}.card .card{border:0;padding:0;box-shadow:none}
 :host(.large){font-size:19px}:host(.large) .small,:host(.large) .micro,:host(.large) .output,:host(.large) .role-panel p{font-size:17px}
 @media(max-width:850px){.grid,.agent-overview,.agent-final-checks{grid-template-columns:1fr}.card{padding:15px}h2{font-size:21px}}
`;
function mount(id,name,parent){
 const host=document.createElement('section');host.id=id;host.className='inline-stage';parent.append(host);
 const root=host.attachShadow({mode:'open'}),source=window.ACADEMY_INLINE[name];
 root.innerHTML='<style>'+source.css+sharedCSS+'</style>'+source.html;
 root.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(href?.startsWith('index.html#')){e.preventDefault();location.hash=href.slice('index.html'.length);routeFromHash();}});
 return root;
}
const nav=document.createElement('nav');nav.className='course-stages';nav.setAttribute('aria-label','Prompt Lab阶段');
nav.innerHTML='<button class="btn btn-ghost" data-course-stage="m1" aria-pressed="true">M1 · 基础与信息获取</button><button class="btn btn-ghost" data-course-stage="m2" aria-pressed="false">M2 · 协作与写作</button><button class="btn btn-ghost" data-course-stage="m3" aria-pressed="false">M3 · 图片、数据与应用</button>';
course.querySelector('.ap4e-hero').after(nav);
course.querySelector('.ap4e-eyebrow').textContent='PROMPT LAB 2.0 · M1 / M2 / M3';
const multimedia=mount('prompt-m3','multimedia',course);
const m3Controller=window.initMultimedia(multimedia,true);
const rail=course.querySelector('.ap4e-rail'),units=course.querySelector('.ap4e-rail-left');
rail.after(multimedia.host);
multimedia.getElementById('steps').hidden=true;
multimedia.getElementById('progress').hidden=true;
multimedia.querySelector('.toolbar').style.margin='0';
course.querySelector('.ap4e-completion').hidden=true;
const progress=document.createElement('span');progress.className='stage-progress';progress.setAttribute('role','status');rail.append(progress);
const groups={m1:['expert','info'],m2:['context','brainstorm','critique','writing'],m3:['vision','image','data','build','project']};
function navigatePrompt(hash){if(location.hash!=='#'+hash)history.pushState(null,'','#'+hash);routeFromHash();}
for(const [i,name] of groups.m3.entries()){
 const b=document.createElement('button');b.type='button';b.dataset.m3Unit=name;b.id='ap4e-tab-'+name;
 b.setAttribute('role','tab');b.setAttribute('aria-controls','prompt-m3');b.setAttribute('aria-selected','false');
 b.textContent=['07 图片理解','08 图片生成','09 数据分析','10 应用构建','11 综合项目'][i];units.append(b);
 b.onclick=()=>navigatePrompt('prompt-m3-'+name);
}
let activeStage='m1';
function refreshStageProgress(){
 let saved=[];try{saved=JSON.parse(localStorage.getItem(activeStage==='m3'?'academy.m3.v1':activeStage==='m1'?'academy.prompt.m1.batch1':'academy.prompt.m2.batch2')||'null');}catch{}
 const total=groups[activeStage].length;
 const count=activeStage==='m3'?(saved?.done||[]).filter(x=>groups.m3.includes(x)).length:(Array.isArray(saved)?saved.slice(0,total).filter(Boolean).length:0);
 progress.textContent=activeStage.toUpperCase()+' · 已学 '+count+' / '+total;
}
function showStage(stage,name){
 activeStage=stage;
 nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.courseStage===stage)));
 units.setAttribute('aria-label',stage.toUpperCase()+'课程单元');
 units.querySelectorAll('button').forEach(b=>{const unit=b.dataset.ap4eLesson||b.dataset.m3Unit;b.hidden=!groups[stage].includes(unit);b.setAttribute('aria-selected',String(unit===name));b.tabIndex=unit===name?0:-1;});
 multimedia.host.hidden=stage!=='m3';
 course.querySelectorAll('.ap4e-panel').forEach(p=>p.hidden=stage==='m3'||p.id!=='ap4e-'+name);
 if(stage==='m3')m3Controller.show(name);
 const roadmap=course.querySelector('.ap4e-roadmap');if(roadmap)roadmap.hidden=stage==='m3';
 refreshStageProgress();
}
nav.addEventListener('click',e=>{const stage=e.target.closest('[data-course-stage]')?.dataset.courseStage;if(stage)navigatePrompt(stage==='m3'?'prompt-m3-vision':'prompt-'+stage);});
course.addEventListener('academy-lesson-change',e=>{const stage=groups.m1.includes(e.detail)?'m1':'m2';showStage(stage,e.detail);history.replaceState(null,'','#prompt-'+stage);});
course.addEventListener('click',refreshStageProgress);
// Intercept legacy arrow handlers so keyboard navigation stays within the active stage.
units.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const buttons=[...units.querySelectorAll('button')].filter(b=>!b.hidden);const i=buttons.indexOf(e.target);if(i<0)return;e.preventDefault();e.stopImmediatePropagation();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:buttons.length-1))%buttons.length;buttons[next].click();buttons[next].focus();},true);
showStage('m1','expert');
const roadmap=course.querySelector('.ap4e-roadmap');if(roadmap){roadmap.replaceChildren();const a=document.createElement('a');a.href='#prompt-m3-vision';a.textContent='继续 M3 · 图片、数据与应用 →';roadmap.append(a);}
const cases=document.getElementById('page-cases');
const roles=mount('extended-cases','roles',document.getElementById('departmentSections'));
window.initRoleCases(roles);
roles.querySelectorAll('a[href^="../"]').forEach(a=>a.setAttribute('href',a.getAttribute('href').slice(3)));
roles.querySelectorAll('[id^="role-"]').forEach(section=>section.style.removeProperty('scroll-margin-top'));
roles.querySelectorAll('[data-role-case]').forEach(card=>{card.style.padding='0';card.style.margin='0';const target=card.querySelector(':scope > p');if(target)target.hidden=true;const body=card.querySelector(':scope > .stack');body.style.padding='0 20px 20px';card.querySelector('summary').style.padding='18px 20px';});
const jump=document.getElementById('deptJump');jump.setAttribute('role','navigation');jump.setAttribute('aria-label','八部门案例快速导航');
for(const [code,title] of [['IE','IE 工业工程'],['IT','IT 信息技术']]){const a=document.createElement('a');a.className='btn btn-ghost btn-sm';a.href='#dept-'+code;a.dataset.dept=code;a.textContent=title+' ↓';jump.append(a);}
cases.querySelector('.page-title').textContent='业务场景指南 · 42个案例';
cases.querySelector('.page-intro').textContent='FIN、RD、QA、SCM、MFG、HR保留原表30项需求及优先级；IE、IT各6项为教学扩展示例，不代表已部署或已验证。';
const label=document.querySelector('[data-page="cases"]');for(const node of label.childNodes)if(node.nodeType===3)node.textContent='业务场景指南';
cases.querySelector('.notes').textContent='讲师时间约10分钟：选取1个场景演示Chat与Agent两条路径；全部42个案例可按部门选学。';
document.querySelectorAll('.hero-chip').forEach(x=>{if(x.textContent.includes('30个'))x.textContent='42个业务场景'});
function syncSettings(){
 const teacher=document.body.classList.contains('teacher'),large=document.body.classList.contains('large-text');
 multimedia.getElementById('teacher').checked=teacher;multimedia.getElementById('teacher').onchange();
 multimedia.host.classList.toggle('large',large);roles.host.classList.toggle('large',large);
}
new MutationObserver(syncSettings).observe(document.body,{attributes:true,attributeFilter:['class']});syncSettings();
function offsets(){const top=document.querySelector('.topbar').getBoundingClientRect().height;document.documentElement.style.setProperty('--academy-top',top+'px');const margin=top+jump.getBoundingClientRect().height+20;document.documentElement.style.setProperty('--academy-anchor',margin+'px');roles.host.style.setProperty('--academy-anchor',margin+'px');}
new ResizeObserver(offsets).observe(document.querySelector('.topbar'));new ResizeObserver(offsets).observe(jump);offsets();
window.routeInlineCourse=hash=>{
 let target;
 if(hash.startsWith('prompt-m3-')){go('prompt',{updateHash:false});const name=hash.slice('prompt-m3-'.length);showStage('m3',groups.m3.includes(name)?name:'vision');target=nav;}
 else if(hash==='prompt-m1'||hash==='prompt-m2'){go('prompt',{updateHash:false});const stage=hash.slice(7);showStage(stage,groups[stage][0]);target=nav;}
 else if(hash==='dept-IE'||hash==='dept-IT'){go('cases',{updateHash:false});target=roles.getElementById('role-'+hash.slice(5));}
 else if(/^(ie|it)-0[1-6]$/.test(hash)){go('cases',{updateHash:false});target=roles.getElementById(hash);target.open=true;}
 else return false;
 offsets();requestAnimationFrame(()=>target?.scrollIntoView({block:'start',behavior:'instant'}));return true;
};
routeFromHash();
})();
