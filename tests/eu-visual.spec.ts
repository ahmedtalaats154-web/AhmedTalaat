import { test, expect } from "@playwright/test";
import seed from "../src/data/eu-visual.json";
import { createEuProject, validateEuVisual, summarizeProjects } from "../src/lib/eu-visual";

test("landing is light, responsive and only fetches the cover",async({page},info)=>{
  const images:string[]=[];
  const errors:string[]=[];
  page.on("request",r=>{if(r.resourceType()==="image")images.push(r.url());});
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("/eu-visual");
  await expect(page.getByRole("heading",{name:"EU VISUAL",exact:false})).toBeVisible();
  await expect(page.getByRole("link",{name:"View North Pier Coffee & Bakehouse"})).toBeVisible();
  await expect(page.locator(".eu-cover img").first()).toHaveJSProperty("naturalWidth",1080);
  await expect(page.getByRole("link",{name:"View TRAMA",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Creative support built around your hospitality brand."})).toBeVisible();
  await expect(page.locator(".eu-capabilities-grid article")).toHaveCount(4);
  await expect(page.getByRole("link",{name:"Start a project ↗"})).toHaveAttribute("href","mailto:ahmedtalaats154@gmail.com?subject=Hospitality%20Visual%20Project");
  await expect(page.getByText("ahmedtalaats154@gmail.com",{exact:true})).toBeVisible();
  expect(images.filter(u=>u.includes("/north-pier/")).every(u=>u.includes("post-01.jpg"))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator(".eu-project-grid").evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(info.project.name==="mobile" ? 1 : 2);
  expect(await page.locator(".eu-capabilities-grid").evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(info.project.name==="mobile" ? 1 : 2);
  await page.screenshot({path:`test-results/eu-landing-${info.project.name}.png`,fullPage:true});
  expect(errors).toEqual([]);
});

test("viewer preserves scroll, traps focus, closes with Esc and browser Back",async({page})=>{
  await page.goto("/eu-visual");
  const card=page.getByRole("link",{name:"View North Pier Coffee & Bakehouse"});
  await card.scrollIntoViewIfNeeded();
  const y=await page.evaluate(()=>scrollY);
  await card.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/project=north-pier/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#eu-project-title")).toHaveText("NORTH PIER");
  await expect(page.locator("body")).toHaveCSS("position","fixed");
  await expect(page.getByRole("button",{name:"Next project",exact:true})).toHaveCount(1);
  await expect(page.locator('[data-section="ai"]')).toHaveCount(0);
  await expect(page.locator(".eu-close")).toBeFocused();
  await page.getByRole("button",{name:"Previous project",exact:true}).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button",{name:"Next Project →",exact:true})).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button",{name:"Previous project",exact:true})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);
  await expect(card).toBeFocused();
  await card.focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);
});

test("deep link refresh, artwork proportions, all chapters and responsive layout",async({page},info)=>{
  const errors:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("/eu-visual?project=north-pier");
  await expect(page.locator("#eu-project-title")).toHaveText("NORTH PIER");
  await page.reload();
  await expect(page.locator("#eu-project-title")).toHaveText("NORTH PIER");
  await expect(page.locator(".eu-social-figure")).toHaveCount(8);
  await expect(page.locator(".eu-full-grid figure")).toHaveCount(8);
  await expect(page.locator(".eu-section-chapter")).toHaveCount(4);
  await expect(page.getByText("Independent fictional concept. Not commissioned client work.")).toBeVisible();
  await expect(page.locator("[data-section='closing'] + .eu-project-cta")).toHaveCount(1);
  await expect(page.locator(".eu-project-cta").getByRole("link",{name:"Start a project ↗"})).toHaveAttribute("href","mailto:ahmedtalaats154@gmail.com?subject=Hospitality%20Visual%20Project");
  await expect(page.locator(".eu-project-cta + .eu-case-footer")).toHaveCount(1);
  for(const img of await page.locator(".eu-social-figure img").all()){
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("naturalWidth",1080);
    const metrics=await img.evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,fit:getComputedStyle(el).objectFit}));
    expect(metrics.w/metrics.h).toBeCloseTo(.8,2);expect(metrics.fit).toBe("contain");
  }
  expect(await page.locator(".eu-viewer-scroll").evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  if(info.project.name==="mobile"){
    const a=await page.locator(".eu-pair").first().locator("figure").first().boundingBox();
    const b=await page.locator(".eu-pair").first().locator("figure").nth(1).boundingBox();
    expect(b!.y).toBeGreaterThan(a!.y+a!.height);
  }
  await page.locator(".eu-viewer-scroll").evaluate(el=>el.scrollTo(0,0));
  await page.screenshot({path:`test-results/eu-project-${info.project.name}.png`});
  await page.getByRole("button",{name:"Close",exact:false}).first().click();
  await expect(page).toHaveURL(/\/eu-visual$/);
  expect(errors).toEqual([]);
});

test("project API protects drafts and all artwork files are present",async({request})=>{
  const response=await request.get("/api/eu-visual");
  expect(response.ok()).toBe(true);
  const landing=await response.json();
  expect(landing.projects.map((p: {slug:string})=>p.slug)).toEqual(["north-pier","trama"]);
  expect(landing.projects[0].socialDesigns).toBeUndefined();
  expect((await request.get("/api/eu-visual?mode=draft")).status()).toBe(401);
  expect((await request.get("/api/eu-visual?project=unknown")).status()).toBe(404);
  expect((await request.post("/api/site-config",{data:{config:{}}})).status()).toBe(401);
  for(let i=1;i<=8;i++)expect((await request.get(`/media/eu-visual/north-pier/post-0${i}.jpg`)).status()).toBe(200);
});

test("future project filtering, navigation, independent data and AI opt-in",async({page},info)=>{
  test.skip(info.project.name!=="desktop");
  const p=structuredClone(seed.projects[0]);
  const future={...p,id:"test-future",slug:"test-future",title:"Test project",published:true,sortOrder:20};
  const hidden={...p,id:"hidden",slug:"hidden",published:false,sortOrder:0};
  expect(summarizeProjects({...seed,projects:[future,hidden,p]} as any).map(p=>p.slug)).toEqual(["north-pier","test-future"]);
  const fresh=createEuProject();expect(fresh.published).toBe(false);expect(fresh.socialDesigns).toEqual([]);
  expect(validateEuVisual({...seed,projects:[p,p]} as any)).toContain("unique ID");
  await page.route("**/api/eu-visual?mode=draft",route=>route.fulfill({json:{...seed,brand:"PLAY/EDIT",projects:[p,future]}}));
  await page.route("**/api/eu-visual?project=**",route=>{
    const slug=new URL(route.request().url()).searchParams.get("project");
    return route.fulfill({json:{project:slug==="test-future" ? {...future,show_ai_process:true} : p}});
  });
  await page.goto("/eu-visual?site_preview=draft&project=north-pier");
  await expect(page.locator("#eu-project-title")).toHaveText("NORTH PIER");
  await page.getByRole("button",{name:"Next project",exact:true}).click();
  await expect(page).toHaveURL(/project=test-future/);
  await expect(page.locator('[data-section="ai"]')).toHaveCount(1);
  await page.getByRole("button",{name:"Previous project",exact:true}).click();
  await expect(page).toHaveURL(/project=north-pier/);
  await expect(page.locator('[data-section="ai"]')).toHaveCount(0);
});

test("real admin login protects draft data and rejects invalid project slugs",async({request},info)=>{
  test.skip(info.project.name!=="desktop");
  expect((await request.post("/api/admin/login",{data:{password:"incorrect"}})).status()).toBe(401);
  const login=await request.post("/api/admin/login",{data:{password:"eu-visual-test"}});
  expect(login.ok()).toBe(true);
  // Production cookies are Secure. Forward the issued cookie explicitly on this HTTP-only localhost test.
  const headers={cookie:login.headers()["set-cookie"].split(";")[0]};
  expect((await request.get("/api/eu-visual?mode=draft",{headers})).ok()).toBe(true);
  const config=(await (await request.get("/api/site-config?mode=draft",{headers})).json()).config;
  config.euVisual.projects[0].slug="NOT A VALID SLUG";
  const rejected=await request.post("/api/site-config",{headers,data:{mode:"draft",config}});
  expect(rejected.status()).toBe(400);
  expect((await rejected.json()).error).toContain("slugs");
});

test("admin uses existing auth, edits, creates empty lists, reorders and saves without losing other content",async({page,request},info)=>{
  test.skip(info.project.name!=="desktop");
  const live=(await (await request.get("/api/site-config")).json()).config;
  let saved=structuredClone(live);
  await page.route("**/api/admin/session",route=>route.fulfill({json:{authenticated:true}}));
  await page.route("**/api/media",route=>route.fulfill({json:{blobs:[]}}));
  await page.route("**/api/site-config*",async route=>{
    if(route.request().method()==="POST"){
      saved=route.request().postDataJSON().config;
      return route.fulfill({json:{ok:true,config:saved}});
    }
    return route.fulfill({json:{config:saved}});
  });
  await page.route("**/api/eu-visual?mode=draft",route=>route.fulfill({json:{...saved.euVisual,brand:saved.identity.brand}}));
  await page.goto("/admin");
  await page.getByRole("button",{name:"EU Visual",exact:false}).first().click();
  await expect(page.getByRole("heading",{name:"EU Visual",exact:true})).toBeVisible();
  await page.locator('.eu-admin').getByLabel("Title",{exact:true}).nth(1).fill("North Pier revised");
  const socials=page.locator('[data-field="euVisual.projects.0.socialDesigns"]');
  await socials.locator(".array-item").nth(1).locator('button:has-text("FIRST")').click();
  await page.getByRole("button",{name:"SAVE DRAFT",exact:true}).first().click();
  await expect.poll(()=>saved.euVisual.projects[0].title).toBe("North Pier revised");
  expect(saved.euVisual.projects[0].socialDesigns[0].postNumber).toBe(2);
  expect(saved.hero).toEqual(live.hero);expect(saved.archive).toEqual(live.archive);
  await page.getByRole("button",{name:"+ NEW PROJECT",exact:true}).click();
  const fields=page.locator('[data-field="euVisual.projects.2.socialDesigns"]');
  await fields.getByRole("button",{name:"+ ADD ITEM",exact:true}).click();
  await expect(fields.locator(".array-item")).toHaveCount(1);
  await page.getByRole("button",{name:"SAVE DRAFT",exact:true}).first().click();
  await expect.poll(()=>saved.euVisual.projects.length).toBe(3);
  expect(saved.euVisual.projects[2].published).toBe(false);
  await page.reload();
  await page.getByRole("button",{name:"EU Visual",exact:false}).first().click();
  await expect(page.locator(".eu-admin-toolbar select option")).toHaveCount(3);
  page.once("dialog",dialog=>dialog.accept());
  await page.getByRole("button",{name:"PUBLISH LIVE",exact:true}).first().click();
  await expect(page.getByRole("status")).toContainText("Published");
});
