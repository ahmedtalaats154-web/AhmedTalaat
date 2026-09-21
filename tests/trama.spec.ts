import { test, expect } from "@playwright/test";
import seed from "../src/data/eu-visual.json";
import { validateEuVisual, type EuVisualConfig } from "../src/lib/eu-visual";

test("TRAMA preserves locked groups, original dimensions and the shared viewer", async ({page}, info) => {
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", e=>errors.push(e.message));
  page.on("request", r=>{if(r.url().includes(".mp4")) videos.push(r.url());});
  await page.goto("/eu-visual");
  const card = page.getByRole("link", {name:"View TRAMA",exact:true});
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  const y = await page.evaluate(()=>scrollY);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/project=trama/);
  await expect(page.getByRole("dialog",{name:"TRAMA",exact:true})).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("position","fixed");
  await expect(page.locator(".eu-viewer")).toHaveCSS("background-color","rgb(242, 231, 207)");
  await expect(page.locator(".eu-hero-meta").getByText("Restaurant / Social Media / Campaign System",{exact:true})).toBeVisible();
  await expect(page.locator("[data-section]")).toHaveCount(8);
  expect(await page.locator("[data-section]").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("data-section")))).toEqual(["hero","overview","system","four-moods","main-campaign","grid","motion","closing"]);
  expect(videos).toEqual([]);
  await page.screenshot({path:`test-results/trama-hero-${info.project.name}.png`,animations:"disabled"});
  await expect(page.locator('[data-section="four-moods"] .eu-social-figure')).toHaveCount(4);
  await expect(page.locator('[data-section="main-campaign"] .eu-social-figure')).toHaveCount(6);
  await expect(page.locator(".eu-full-grid figure")).toHaveCount(10);
  const trama = seed.projects[1];
  for (let i=0;i<10;i++) {
    const img=page.locator(".eu-social-figure img").nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute("src",trama.socialDesigns[i].image);
    await expect(img).toHaveJSProperty("naturalWidth",i<4 ? 1792 : 1080);
    const ratio=await img.evaluate(el=>el.getBoundingClientRect().width/el.getBoundingClientRect().height);
    expect(ratio).toBeCloseTo(i<4 ? 1792/2400 : .8,2);
    await expect(img).toHaveCSS("object-fit","contain");
  }
  for (const id of ["system","four-moods","main-campaign","grid"]) {
    await page.locator(`[data-section="${id}"]`).evaluate(el=>el.scrollIntoView({block:"start"}));
    await page.screenshot({path:`test-results/trama-${id}-${info.project.name}.png`,animations:"disabled"});
  }
  expect(await page.locator(".eu-viewer-scroll").evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await expect(page.locator(".eu-close")).toBeInViewport();
  await expect(page.locator("[data-section='closing'] + .eu-project-cta")).toHaveCount(1);
  await expect(page.locator(".eu-project-cta")).toHaveCSS("color","rgb(23, 23, 19)");
  await expect(page.locator(".eu-project-cta").getByRole("link",{name:"Start a project ↗"})).toHaveAttribute("href","mailto:ahmedtalaats154@gmail.com?subject=Hospitality%20Visual%20Project");
  await expect(page.locator(".eu-project-cta + .eu-case-footer")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);
  await expect(card).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);
  await page.goForward();
  await expect(page.locator("#eu-project-title")).toHaveText("TRAMA");
  await page.reload();
  await expect(page.locator("#eu-project-title")).toHaveText("TRAMA");
  await page.getByRole("button",{name:"Previous project",exact:true}).click();
  await expect(page.locator("#eu-project-title")).toHaveText("NORTH PIER");
  await expect(page.locator(".eu-motion-story")).toHaveCount(0);
  await expect(page.locator(".eu-viewer")).toHaveCSS("background-color","rgb(241, 235, 221)");
  expect(errors).toEqual([]);
});

test("motion defers until visible, plays and loops naturally, pauses offscreen", async ({page},info) => {
  await page.goto("/eu-visual?project=trama");
  const videos=page.locator(".eu-motion-story video");
  await expect(videos).toHaveCount(2);
  await expect(videos.first()).not.toHaveAttribute("src");
  const first=videos.first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveJSProperty("videoWidth",1080);
  await expect(first).toHaveJSProperty("videoHeight",1920);
  await expect(first).toHaveJSProperty("paused",false);
  for (const video of await videos.all()) {
    const box=await video.boundingBox();
    expect(box!.width/box!.height).toBeCloseTo(9/16,3);
    await expect(video).toHaveJSProperty("muted",true);
    await expect(video).toHaveJSProperty("loop",true);
    await expect(video).toHaveJSProperty("playsInline",true);
    await expect(video).toHaveJSProperty("controls",false);
  }
  await first.evaluate(el=>{
    const v=el as HTMLVideoElement;
    let last=v.currentTime;
    v.addEventListener("timeupdate",()=>{if(v.currentTime<last)v.dataset.looped="true";last=v.currentTime;});
  });
  await expect(first).toHaveAttribute("data-looped","true",{timeout:10000});
  await page.getByRole("button",{name:"Pause PEPPER IN MOTION",exact:true}).click();
  await expect(first).toHaveJSProperty("paused",true);
  await page.getByRole("button",{name:"Play PEPPER IN MOTION",exact:true}).click();
  await expect(first).toHaveJSProperty("paused",false);
  await videos.nth(1).scrollIntoViewIfNeeded();
  await expect(videos.nth(1)).toHaveJSProperty("paused",false);
  await expect(videos.nth(1)).toHaveJSProperty("videoWidth",1080);
  if(info.project.name==="mobile") {
    const boxes=await page.locator(".eu-motion-story").evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
    expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom);
  }
  await page.locator('[data-section="motion"]').evaluate(el=>el.scrollIntoView({block:"start"}));
  await page.screenshot({path:`test-results/trama-motion-${info.project.name}.png`,animations:"disabled"});
  await page.locator(".eu-viewer-scroll").evaluate(el=>el.scrollTo(0,0));
  await expect(first).toHaveJSProperty("paused",true);
  await expect(videos.nth(1)).toHaveJSProperty("paused",true);
  await page.emulateMedia({reducedMotion:"reduce"});
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveJSProperty("paused",true);
  await page.getByRole("button",{name:"Play PEPPER IN MOTION",exact:true}).click();
  await expect(first).toHaveJSProperty("paused",false);
  await page.getByRole("button",{name:"Pause PEPPER IN MOTION",exact:true}).click();
  await expect(first).toHaveJSProperty("paused",true);
  await page.getByRole("button",{name:"Play PEPPER IN MOTION",exact:true}).click();
  await expect(first).toHaveJSProperty("paused",false);
});

test("TRAMA admin edits and reorders independent static and motion data", async ({page,request},info)=>{
  test.skip(info.project.name!=="desktop");
  const initial=(await (await request.get("/api/site-config")).json()).config;
  let saved=structuredClone(initial);
  await page.route("**/api/admin/session",r=>r.fulfill({json:{authenticated:true}}));
  await page.route("**/api/media",r=>r.fulfill({json:{blobs:[]}}));
  await page.route("**/api/site-config*",r=>{
    if(r.request().method()==="POST")saved=r.request().postDataJSON().config;
    return r.fulfill({json:{ok:true,config:saved}});
  });
  await page.goto("/admin");
  await page.getByRole("button",{name:"EU Visual",exact:false}).first().click();
  await page.locator(".eu-admin-toolbar select").selectOption("trama");
  await page.locator(".eu-admin").getByLabel("Title",{exact:true}).nth(1).fill("TRAMA edited");
  const motion=page.locator('[data-field="euVisual.projects.1.motionStories"]');
  await motion.locator(".array-item").nth(1).getByRole("button",{name:"FIRST",exact:true}).click();
  await motion.locator(".array-item").first().getByLabel("Title",{exact:true}).fill("Focaccia revised");
  await motion.getByRole("button",{name:"+ ADD ITEM",exact:true}).click();
  await expect(motion.locator(".array-item")).toHaveCount(3);
  await motion.locator(".array-item").last().getByRole("button",{name:"REMOVE",exact:true}).click();
  await page.getByRole("button",{name:"SAVE DRAFT",exact:true}).first().click();
  await expect.poll(()=>saved.euVisual.projects[1].title).toBe("TRAMA edited");
  expect(saved.euVisual.projects[1].motionStories[0].id).toBe("trama-focaccia-motion");
  expect(saved.euVisual.projects[1].motionStories[0].title).toBe("Focaccia revised");
  expect(saved.euVisual.projects[1].socialDesigns).toEqual(initial.euVisual.projects[1].socialDesigns);
  expect(saved.euVisual.projects[0]).toEqual(initial.euVisual.projects[0]);
  expect(saved.hero).toEqual(initial.hero);
  expect(validateEuVisual(saved.euVisual as EuVisualConfig)).toBeNull();
  await page.reload();
  await page.getByRole("button",{name:"EU Visual",exact:false}).first().click();
  await page.locator(".eu-admin-toolbar select").selectOption("trama");
  await expect(page.locator(".eu-admin").getByLabel("Title",{exact:true}).nth(1)).toHaveValue("TRAMA edited");
});
