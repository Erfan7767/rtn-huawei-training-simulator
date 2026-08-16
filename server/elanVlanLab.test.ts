import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "client/src/pages/Rtn950ElanVlanLab.tsx"), "utf8");
const routes = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");

describe("RTN950 E-LAN/VLAN training lab", () => {
  it("registers a separate source-bounded route and staged workflow", () => {
    expect(routes).toContain("/rtn950-elan-vlan-lab");
    expect(source).toContain("E-LAN / VLAN Service Validation");
    expect(source).toContain("STEP 4 / VALIDATE");
    expect(source).toContain("Training Apply: Success");
  });

  it("keeps the documented general VLAN validation rules and blocks invalid apply", () => {
    expect(source).toContain("1 و4094");
    expect(source).toContain("Link Type غير متطابق بين Site A وSite B.");
    expect(source).toContain("Allowed VLAN غير متطابق بين الطرفين.");
    expect(source).toContain("Apply محظور");
    expect(source).toContain("لا توجد خدمة أو VLAN حقيقية");
  });
});
