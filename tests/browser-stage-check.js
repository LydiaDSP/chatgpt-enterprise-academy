async page=>{
 const check=(ok,message)=>{if(!ok)throw Error(message);};
 const results=[];
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:8766/index.html#prompt');
  for(const [stage,numbers] of [['m1',['01','02']],['m2',['03','04','05','06']],['m3',['07','08','09','10','11']]]){
   await page.locator('[data-course-stage='+stage+']').click();
   const buttons=page.locator('.ap4e-rail-left button:visible');
   check(JSON.stringify(await buttons.allTextContents()).includes(numbers[0]),'Stage units');
   check(await buttons.count()===numbers.length,'Visible unit count '+stage);
   for(let i=0;i<numbers.length;i++){
    await buttons.nth(i).click();
    const count=await page.locator('.ap4e-panel:visible, #prompt-m3 [data-panel]:visible').count();
    check(count===1,'Exactly one lesson '+stage+' '+i);
    check(await buttons.nth(i).getAttribute('aria-selected')==='true','Active unit state');
    check(await page.locator('[data-course-stage='+stage+']').getAttribute('aria-pressed')==='true','Active stage state');
   }
   await buttons.last().focus();await page.keyboard.press('ArrowRight');
   check(await buttons.first().getAttribute('aria-selected')==='true','Keyboard wraps within stage');
   await page.waitForFunction(()=>{const nav=document.querySelector('.course-stages').getBoundingClientRect().top,top=document.querySelector('.topbar').getBoundingClientRect().bottom;return nav>=top-1&&nav<top+120&&top<100;});
   await page.screenshot({path:'output/playwright/stage-'+width+'-'+stage+'.png',animations:'disabled'});
   const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,nav:document.querySelector('.course-stages').getBoundingClientRect().top,top:document.querySelector('.topbar').getBoundingClientRect().bottom}));
   check(bounds.scroll<=bounds.width,'Overflow');check(bounds.nav>=bounds.top-1,'Stage navigation obscured');
  }
  await page.locator('[data-course-stage=m1]').click();
  await page.locator('#ap4e-tab-info').click();await page.locator('#ap4e-complete-info').click();
  check(await page.locator('[data-course-stage=m2]').getAttribute('aria-pressed')==='true','Completion links M1 to M2');
  results.push(width+'px: all 11 units, stage switching, keyboard and completion passed');
 }
 return results;
}
