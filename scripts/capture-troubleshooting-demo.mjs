import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const baseUrl = process.env.RTN_DEMO_URL ?? "http://127.0.0.1:3000";
const outputDirectory = "/home/ubuntu/rtn_troubleshooting_frames";
const totalFrames = 500;

await fs.mkdir(outputDirectory, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 720, height: 1280, deviceScaleFactor: 1 });

for (let frame = 0; frame <= totalFrames; frame += 1) {
  await page.goto(`${baseUrl}/troubleshooting-demo?frame=${frame}`, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: path.join(outputDirectory, `frame-${String(frame).padStart(4, "0")}.png`) });
}

await browser.close();
process.stdout.write(`Captured ${totalFrames + 1} troubleshooting frames\n`);
