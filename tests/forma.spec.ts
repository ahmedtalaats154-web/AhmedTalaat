import { test, expect } from "@playwright/test";
import seed from "../src/data/eu-visual.json";

test("FORMA is project 04 with a non-destructive portrait cover", async ({page}, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/eu-visual");
  const cards = page.locator(".eu-project-card");
  await expect(cards).toHaveCount(4);
  const formaCard = cards.nth(3);
  await formaCard.scrollIntoViewIfNeeded();
  await expect(formaCard.getByRole("heading", {name:"FORMA"})).toBeVisible();
  const cover = formaCard.locator("img");
  await expect(cover).toHaveAttribute("src", "/media/eu-visual/forma/cover.png");
  await expect(cover).toHaveJSProperty("naturalWidth", 1086);
  await expect(cover).toHaveJSProperty("naturalHeight", 1448);
  expect(await cover.evaluate(element => getComputedStyle(element).objectFit)).toBe("contain");
  await formaCard.getByRole("link", {name:"View FORMA"}).click();
  await expect(page).toHaveURL(/project=forma/);
  await expect(page.getByRole("dialog", {name:"FORMA"})).toBeVisible();
  await expect(page.locator("[data-section]")).toHaveCount(11);
  expect(await page.locator("[data-section]").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-section")))).toEqual([
    "hero","overview","campaign-idea","visual-system","selected-static","featured-motion","remaining-static","social-grid","supporting-motion","lifestyle-film","closing",
  ]);
  await expect(page.locator("[data-section='hero'] img")).toHaveAttribute("src", "/media/eu-visual/forma/cover.png");
  await expect(page.locator(".eu-campaign-showcase .eu-social-figure")).toHaveCount(6);
  await expect(page.locator(".eu-full-grid figure")).toHaveCount(6);
  await expect(page.locator(".eu-motion-story")).toHaveCount(3);
  await expect(page.getByText("Independent fictional concept. Not commissioned client work.")).toBeVisible();
  expect(await page.locator(".eu-viewer-scroll").evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  if (info.project.name === "mobile") {
    const pair = page.locator(".eu-campaign-pair").first().locator(".eu-social-figure");
    const first = await pair.first().boundingBox();
    const second = await pair.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height);
  }
  expect(errors).toEqual([]);
});

test("FORMA features Motion02 and loads all three approved videos", async ({page}) => {
  await page.goto("/eu-visual?project=forma");
  const featured = page.locator("[data-section='featured-motion'] video");
  await expect(featured).toHaveCount(1);
  await featured.scrollIntoViewIfNeeded();
  await expect(featured).toHaveAttribute("src", "/media/eu-visual/forma/motion/motion-02.mp4");
  await expect(featured).toHaveJSProperty("videoWidth", 1080);
  await expect(featured).toHaveJSProperty("videoHeight", 1920);
  await page.getByRole("button", {name:"Pause MOTION 02 — FEATURED", exact:true}).click();
  await expect(featured).toHaveJSProperty("paused", true);
  await page.getByRole("button", {name:"Play MOTION 02 — FEATURED", exact:true}).click();
  await expect(featured).toHaveJSProperty("paused", false);

  const supporting = page.locator("[data-section='supporting-motion'] video");
  await supporting.scrollIntoViewIfNeeded();
  await expect(supporting).toHaveAttribute("src", "/media/eu-visual/forma/motion/motion-01.mp4");
  await expect(supporting).toHaveJSProperty("videoWidth", 1080);
  await expect(supporting).toHaveJSProperty("videoHeight", 1920);

  const lifestyle = page.locator("[data-section='lifestyle-film'] video");
  await lifestyle.scrollIntoViewIfNeeded();
  await expect(lifestyle).toHaveAttribute("src", "/media/eu-visual/forma/lifestyle/lifestyle.mp4");
  await expect(lifestyle).toHaveJSProperty("videoWidth", 1080);
  await expect(lifestyle).toHaveJSProperty("videoHeight", 1920);
});

test("FORMA direct URL, browser history, navigation and assets remain stable", async ({page, request}, info) => {
  test.skip(info.project.name !== "desktop");
  const forma = seed.projects[3];
  const stories = forma.motionStories ?? [];
  expect(forma.slug).toBe("forma");
  expect(forma.socialDesigns).toHaveLength(6);
  expect(stories).toHaveLength(3);
  expect(stories[1].id).toBe("forma-motion-02");
  const media = [
    "/media/eu-visual/forma/cover.png",
    ...forma.socialDesigns.map(post => post.image),
    ...stories.map(story => story.src),
  ];
  expect(new Set(media).size).toBe(media.length);
  for (const path of media) expect((await request.get(path)).status()).toBe(200);

  await page.goto("/eu-visual");
  await page.getByRole("link", {name:"View FORMA"}).click();
  await expect(page).toHaveURL(/project=forma/);
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole("dialog", {name:"FORMA"})).toBeVisible();
  await page.getByRole("button", {name:"Previous project", exact:true}).click();
  await expect(page.getByRole("dialog", {name:"CASA LUME"})).toBeVisible();
  await page.getByRole("button", {name:"Next project", exact:true}).click();
  await expect(page.getByRole("dialog", {name:"FORMA"})).toBeVisible();
  await page.getByRole("button", {name:"Close", exact:false}).first().click();
  await expect(page).toHaveURL(/\/eu-visual$/);
});
