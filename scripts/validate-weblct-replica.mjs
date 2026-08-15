import fs from "node:fs/promises";
import puppeteer from "puppeteer-core";

const destination = "/home/ubuntu/weblct_replica_validation";
await fs.mkdir(destination, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3000/weblct-v200r021-training", { waitUntil: "domcontentloaded" });

async function screenshot(name) {
  await page.screenshot({ path: `${destination}/${name}.png` });
}

async function clickByText(text) {
  const didClick = await page.evaluate((needle) => {
    const candidates = [...document.querySelectorAll("button")];
    const target = candidates.find((button) => button.textContent?.trim().includes(needle));
    if (!target) return false;
    target.click();
    return true;
  }, text);
  if (!didClick) throw new Error(`Could not find button: ${text}`);
  await new Promise((resolve) => setTimeout(resolve, 180));
}

await screenshot("01-alarms");
await clickByText("Open Radio Links");
await screenshot("02-hop-management");
await clickByText("Microwave Link Performance");
await screenshot("03-current-empty");
await clickByText("Query");
await screenshot("04-current-result");
await clickByText("History Performance");
await page.select("select", "24 Hour");
await new Promise((resolve) => setTimeout(resolve, 120));
await clickByText("Chart");
await clickByText("Query");
await screenshot("05-history-power-chart");
await page.evaluate(() => {
  const labels = [...document.querySelectorAll("label")];
  const target = labels.find((label) => label.textContent?.includes("Link Errors"));
  target?.querySelector("input")?.click();
});
await new Promise((resolve) => setTimeout(resolve, 120));
await screenshot("06-history-error-chart");

await browser.close();
console.log(`Saved validation screens to ${destination}`);
