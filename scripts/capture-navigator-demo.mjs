import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const baseUrl = process.env.RTN_DEMO_URL ?? "http://127.0.0.1:3000";
const outputRoot = "/home/ubuntu/rtn_demo_frames";
const lessons = [1, 2, 3];
const framesPerLesson = 300;

await fs.mkdir(outputRoot, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 720, height: 1280, deviceScaleFactor: 1 });

for (const lesson of lessons) {
  const directory = path.join(outputRoot, `lesson${String(lesson).padStart(2, "0")}`);
  await fs.mkdir(directory, { recursive: true });
  for (let frame = 0; frame <= framesPerLesson; frame += 1) {
    const target = `${baseUrl}/navigator-demo?lesson=${lesson}&frame=${frame}`;
    await page.goto(target, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(directory, `frame-${String(frame).padStart(4, "0")}.png`) });
  }
  process.stdout.write(`Captured lesson ${lesson}: ${framesPerLesson + 1} frames\n`);
}

await browser.close();
