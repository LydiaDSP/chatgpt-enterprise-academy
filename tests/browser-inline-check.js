async page => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8766/index.html';
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const results=[];
  await page.goto(base);
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  for(const width of [360,390,1280]){
    await page.setViewportSize({width,height:900});
    for(const hash of ['prompt-m1','prompt-m2','prompt-m3-vision','prompt-m3-image','prompt-m3-data','prompt-m3-build','prompt-m3-project','dept-IE','dept-IT']){
      await page.goto(base+'#'+hash);
      await page.locator('#extended-cases').waitFor({state:'attached'});
      await page.screenshot({path:'output/playwright/'+width+'-'+hash+'.png',animations:'disabled'});
      const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      check(bounds.scroll<=bounds.width,'Horizontal overflow '+width+' '+hash);
      if(hash.startsWith('dept-')){
        const rects=await page.evaluate(code=>({nav:document.getElementById('deptJump').getBoundingClientRect().bottom,section:document.getElementById('extended-cases').shadowRoot.getElementById('role-'+code).getBoundingClientRect().top}),hash.slice(5));
        check(rects.section>=rects.nav-1,'Department obscured '+JSON.stringify(rects));
      }
    }
    results.push(width+'px: nine views, no horizontal overflow or covered department headings');
  }
  await page.goto(base+'#prompt-m3-data');
  await page.locator('#prompt-m3 #calculate').click();
  check((await page.locator('#prompt-m3 #data-result').innerText()).includes('5110'),'MES calculation');
  await page.locator('[data-m3-unit=build]').click();
  await page.locator('#prompt-m3 #device').fill('BROWSER-DEMO');
  await page.locator('#prompt-m3 #symptom').fill('offline');
  await page.locator('#prompt-m3 #add-record').click();
  await page.locator('#prompt-m3 #run-tests').click();
  check((await page.locator('#prompt-m3 #test-result').innerText()).includes('6/6'),'Prototype tests');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#prompt-m3 #export-records').click();
  const download=await downloadPromise;
  check(download.suggestedFilename()==='demo-records.json','JSON download');
  await download.saveAs('output/playwright/demo-records.json');
  await page.reload();
  check((await page.locator('#prompt-m3 #records').innerText()).includes('BROWSER-DEMO'),'Restored records');
  await page.locator('[data-m3-unit=project]').click();
  await page.locator('#prompt-m3 #project-question').fill('Review simulated offline events');
  const projectPromise=page.waitForEvent('download');
  await page.locator('#prompt-m3 #export-project').click();
  const project=await projectPromise;await project.saveAs('output/playwright/M3-project.md');
  await page.goto(base+'#it-01');
  await page.locator('#extended-cases #it-01 [data-role-tab=agent]').click();
  check(await page.locator('#extended-cases #it-01-panel-agent').isVisible(),'Agent panel');
  await page.locator('#extended-cases #it-01 [data-add-case]').click();
  check((await page.locator('#extended-cases #selectedCases').innerText()).includes('设备在线'),'Practice list');
  await page.locator('#deptJump a[href="#dept-QA"]').click();
  check(await page.locator('#dept-QA').isVisible(),'Original department');
  await page.goto(base+'#prompt-m3-vision');
  await page.locator('#presentToggle').click();
  await page.locator('#modeToggle').click();
  check(await page.locator('#prompt-m3 .teacher').first().isVisible(),'Instructor sync');
  check(await page.locator('#prompt-m3').evaluate(e=>e.classList.contains('large')),'Large text sync');
  await page.screenshot({path:'output/playwright/large-m3.png',animations:'disabled'});
  check(errors.length===0,errors.join('\n'));
  return {results,interactions:'MES, prototype, JSON/Markdown download, restore, Agent tab, exercise list, original department, instructor and large text passed',errors};
}
