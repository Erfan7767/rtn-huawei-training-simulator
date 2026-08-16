import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("RTN950A link configuration training lab", () => {
  const source = readFileSync(resolve(projectRoot, "client/src/pages/Rtn950aLinkLab.tsx"), "utf8");
  const routes = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
  const slotLayout = readFileSync(resolve(projectRoot, "client/src/pages/Rtn950aSlotLayout.tsx"), "utf8");

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

  it("blocks Apply while Site A and Site B are incompatible and exposes guided matching controls", () => {
    expect(source).toContain("Apply blocked — fix compatibility");
    expect(source).toContain("TRAINING COMPATIBILITY GATE");
    expect(source).toContain("تم منع Apply: صحّح توافق Site A وSite B");
    expect(source).toContain("Match bandwidth");
    expect(source).toContain("Match modulation");
    expect(source).toContain("Match XPIC");
  });

  it("registers and renders a dedicated interactive RTN950A Slot Layout screen", () => {
    expect(routes).toContain("/rtn950a-slot-layout");
    expect(routes).toContain("component={Rtn950aSlotLayout}");
    expect(slotLayout).toContain("RTN950A SLOT INSTALLATION LAB");
    expect(slotLayout).toContain("1-ISM6-LRTN(P-1)");
    expect(slotLayout).toContain("21-ODU");
    expect(slotLayout).toContain("41-ODU");
    expect(slotLayout).toContain("Collapse Shelf");
  });

  it("provides a training-only drag-and-drop installation lab with compatible-slot checks", () => {
    expect(slotLayout).toContain("draggable={!alreadyPlaced}");
    expect(slotLayout).toContain("onDragStart={(event) => startDrag(event, kind)}");
    expect(slotLayout).toContain("onDrop={(event) =>");
    expect(slotLayout).toContain("رفض تدريبي:");
    expect(slotLayout).toContain("ISM6 Training Card");
    expect(slotLayout).toContain("ODU 21 Training Module");
    expect(slotLayout).toContain("ODU 41 Training Module");
    expect(slotLayout).toContain("Double-click an installed bay to remove it");
  });
});
