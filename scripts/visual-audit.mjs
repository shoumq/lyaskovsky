import {chromium} from '@playwright/test';
const browser=await chromium.launch();
const page=await browser.newPage();
const widths=[320,375,390,430,768,1024,1440,1920];
const paths=['/','/services','/services/it-consulting','/services/software-development','/services/business-automation','/services/system-integration','/about','/contacts','/privacy'];
const failures=[];
for(const width of widths){
 await page.setViewportSize({width,height:1000});
 for(const path of paths){
  await page.goto('http://localhost:3000'+path);await page.evaluate(()=>document.fonts.ready);
  const issues=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('.architecture-node strong')].filter(el=>el.scrollWidth>el.clientWidth).map(el=>el.textContent)}));
  if(issues.overflow||issues.clipped.length)failures.push({width,path,...issues});
  if([390,1440].includes(width)&&['/','/services','/contacts','/about'].includes(path)){
   await page.screenshot({path:`artifacts/redesign-${path==='/'?'home':path.slice(1)}-${width}.png`,fullPage:true});
  }
 }
 await page.goto('http://localhost:3000');
 for(const label of ['Корпоративная система','Веб-приложение','AI-решение','Автоматизация','Интеграция систем','Цифровая платформа','Нужно разобраться']){
  await page.getByRole('button',{name:label,exact:true}).click();
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))failures.push({width,state:label});
 }
 if([390,1440].includes(width)){
  await page.getByRole('button',{name:'AI-решение',exact:true}).click();
  await page.getByRole('button',{name:'AI-процесс',exact:true}).click();
  await page.screenshot({path:`artifacts/redesign-interaction-${width}.png`,fullPage:true});
 }
}
await browser.close();
console.log(JSON.stringify({pageViewportChecks:72,solutionStateChecks:56,failures},null,2));
if(failures.length)process.exitCode=1;
