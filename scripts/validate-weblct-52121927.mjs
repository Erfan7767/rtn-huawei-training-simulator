import fs from "node:fs/promises";
import puppeteer from "puppeteer-core";

const destination = "/home/ubuntu/weblct_52121927_validation";
await fs.mkdir(destination, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3000/weblct-reference-52121927", { waitUntil: "domcontentloaded" });
const shot = (name) => page.screenshot({ path: `${destination}/${name}.png` });
const button = async (text) => {
  const clicked = await page.evaluate((needle) => {
    const target = [...document.querySelectorAll("button")].find((item) => item.textContent?.trim().includes(needle));
    if (!target) return false;
    target.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Missing button: ${text}`);
  await new Promise((resolve) => setTimeout(resolve, 150));
};

await shot("01-history-chart");
await button("Current Performance");
if (!(await page.$eval(".lct521-view-tabs .active", (node) => node.textContent?.trim())).includes("Current Performance")) throw new Error("Current view did not activate");
await shot("02-current-view");
await button("History Performance");
await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[type="radio"]')];
  const errors = inputs.find((input) => input.parentElement?.textContent?.includes("Link Errors"));
  errors?.click();
});
if (!(await page.$eval(".lct521-error-chart", (node) => node.textContent?.trim())).includes("No live error counters")) throw new Error("Error chart did not activate");
await shot("03-history-errors");
await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[type="radio"]')];
  const power = inputs.find((input) => input.parentElement?.textContent?.includes("Link TX/RX Power"));
  power?.click();
});
await button("Legend");
if (await page.$(".lct521-legend")) throw new Error("Legend was not hidden after toggle");
await shot("04-history-power-no-legend");
await browser.close();
console.log(`Saved evidence-bound validation screenshots to ${destination}`);
