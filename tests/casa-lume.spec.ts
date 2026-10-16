import { test, expect } from "@playwright/test";
import seed from "../src/data/eu-visual.json";

test("CASA LUME is project 03 with approved assets and editorial sections", async ({page}, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/eu-visual");
  const cards = page.locator(".eu-project-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(2).getByRole("heading", {name:"CASA LUME"})).toBeVisible();
  await expect(cards.nth(2).locator("img")).toHaveAttribute("src", "/media/eu-visual/casa-lume/cover.png");
  await cards.nth(2).getByRole("link", {name:"View CASA LUME"}).click();
  await expect(page).toHaveURL(/project=casa-lume/);
  await expect(page.getByRole("dialog", {name:"CASA LUME"})).toBeVisible();
  await expect(page.locator("[data-section]")).toHaveCount(11);
  expect(await page.locator("[data-section]").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-section")))).toEqual([
    "hero","overview","challenge","system","campaign-system","selected-social","reel-weekend","reel-season","ai-direction","grid","closing",
  ]);
  await expect(page.locator("[data-section='hero'] img")).toHaveAttribute("src", "/media/eu-visual/casa-lume/cover.png");
  await expect(page.locator(".eu-casa-showcase .eu-social-figure")).toHaveCount(6);
  await expect(page.locator(".eu-full-grid figure")).toHaveCount(8);
  await expect(page.locator(".eu-ai-gallery figure")).toHaveCount(5);
  await expect(page.locator(".eu-motion-story")).toHaveCount(2);
  await expect(page.getByText("Independent fictional concept. Not commissioned client work.")).toBeVisible();
  await expect(page.locator(".eu-project-cta + .eu-case-footer")).toHaveCount(1);
  expect(await page.locator(".eu-viewer-scroll").evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  if (info.project.name === "mobile") {
    const pair = page.locator(".eu-casa-pair").first().locator(".eu-social-figure");
    const first = await pair.first().boundingBox();
    const second = await pair.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height);
  }
  expect(errors).toEqual([]);
});

test("CASA LUME reels load only their approved final files and remain playable", async ({page}) => {
  await page.goto("/eu-visual?project=casa-lume");
  const videos = page.locator(".eu-motion-story video");
  await expect(videos).toHaveCount(2);
  await expect(videos.first()).not.toHaveAttribute("src");
  await videos.first().scrollIntoViewIfNeeded();
  await expect(videos.first()).toHaveAttribute("src", "/media/eu-visual/casa-lume/reels/weekend-escape.mp4");
  await expect(videos.first()).toHaveJSProperty("videoWidth", 1080);
  await expect(videos.first()).toHaveJSProperty("videoHeight", 1920);
  await page.getByRole("button", {name:"Pause WEEKEND ESCAPE", exact:true}).click();
  await expect(videos.first()).toHaveJSProperty("paused", true);
  await page.getByRole("button", {name:"Play WEEKEND ESCAPE", exact:true}).click();
  await expect(videos.first()).toHaveJSProperty("paused", false);
  await videos.nth(1).scrollIntoViewIfNeeded();
  await expect(videos.nth(1)).toHaveAttribute("src", "/media/eu-visual/casa-lume/reels/softer-season.mp4");
  await expect(videos.nth(1)).toHaveJSProperty("videoWidth", 1080);
  await expect(videos.nth(1)).toHaveJSProperty("videoHeight", 1920);
});

test("CASA LUME deep link, project navigation and approved source mapping remain stable", async ({page, request}, info) => {
  test.skip(info.project.name !== "desktop");
  const casa = seed.projects[2];
  expect(casa.socialDesigns).toHaveLength(8);
  expect(casa.aiProcess.visuals).toHaveLength(5);
  expect(casa.motionStories).toHaveLength(2);
  for (let index=1; index<=8; index++) {
    expect((await request.get(`/media/eu-visual/casa-lume/static/post-${String(index).padStart(2,"0")}.jpg`)).status()).toBe(200);
  }
  for (const path of [
    "/media/eu-visual/casa-lume/cover.png",
    "/media/eu-visual/casa-lume/reels/weekend-escape.mp4",
    "/media/eu-visual/casa-lume/reels/softer-season.mp4",
  ]) expect((await request.get(path)).status()).toBe(200);
  await page.goto("/eu-visual?project=casa-lume");
  await expect(page.getByRole("dialog", {name:"CASA LUME"})).toBeVisible();
  await page.getByRole("button", {name:"Previous project", exact:true}).click();
  await expect(page.locator("#eu-project-title")).toHaveText("TRAMA");
  await page.getByRole("button", {name:"Next project", exact:true}).click();
  await expect(page.getByRole("dialog", {name:"CASA LUME"})).toBeVisible();
  await page.getByRole("button", {name:"Close", exact:false}).first().click();
  await expect(page).toHaveURL(/\/eu-visual$/);
});
