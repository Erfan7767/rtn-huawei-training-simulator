import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("RTN950A link configuration training lab", () => {
  const source = readFileSync(resolve(projectRoot, "client/src/pages/Rtn950aLinkLab.tsx"), "utf8");
  const routes = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

  it("keeps the configured workflow scoped to the evidenced RTN950A 2+0 training reference", () => {
    expect(source).toContain("RTN950A 2+0 REFERENCE WORKFLOW");
    expect(source).toContain("Microwave Link Configuration");
    expect(source).toContain("IF Service Type");
    expect(source).toContain("RF Information");
    expect(routes).toContain("/rtn950a-link-lab");
  });

  it("requires staged completion, exposes the visible risk warning, and provides only a local rollback", () => {
    expect(source).toContain("أكمل المرحلة الحالية أولًا");
    expect(source).toContain("The operation may break links.");
    expect(source).toContain("Rollback training draft");
    expect(source).toContain("NO LIVE NE / NO DEVICE WRITE");
    expect(source).toContain("لم يُرسل أي أمر إلى Web LCT أو جهاز RTN");
  });

  it("requires separate Site A and Site B training labels before showing the shared draft summary", () => {
    expect(source).toContain("Site A / Near End (training label)");
    expect(source).toContain("Site B / Far End (training label)");
    expect(source).toContain("Site A ↔ Site B");
    expect(source).toContain("ملخص المقارنة وطلب تنفيذ تدريبـي");
    expect(source).toContain("Near/far-end comparison recorded");
  });

  it("registers a dedicated route rather than merging the RTN950A lab into another release-scoped replica", () => {
    expect(routes).toContain("/rtn950a-link-lab");
    expect(routes).toContain("component={Rtn950aLinkLab}");
  });
});
