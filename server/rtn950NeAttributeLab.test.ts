import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(projectRoot, "client/src/pages/Rtn950NeAttributeLab.tsx"), "utf8");
const routes = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

describe("RTN950 NE Attribute training lab", () => {
  it("keeps the workflow in the observed RTN950 and Web LCT release scope", () => {
    expect(source).toContain("REFERENCE DEVICE: RTN 950");
    expect(source).toContain("NE VERSION: 5.76.07.24");
    expect(source).toContain("RTN950 1+0 reference");
    expect(routes).toContain("/rtn950-ne-attribute-lab");
  });

  it("requires review, warns of communication interruption, and only simulates re-login locally", () => {
    expect(source).toContain("Approved change window confirmed");
    expect(source).toContain("Communication interruption is possible.");
    expect(source).toContain("Simulate re-login");
    expect(source).toContain("NO LIVE NE");
    expect(source).toContain("لا يتم إرسال اسم أو معرف أو أمر إلى RTN 950");
  });
});
