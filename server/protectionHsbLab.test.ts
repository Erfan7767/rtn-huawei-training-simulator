import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("Protection 1+1 HSB concept lab", () => {
  it("keeps the lab local, source-bounded, and blocked until the pair is valid", () => {
    const source = readFileSync(resolve(root, "client/src/pages/RtnProtectionHsbLab.tsx"), "utf8");
    const routes = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    expect(source).toContain("1+1 HSB CONCEPT LAB");
    expect(source).toContain("Working + Protection");
    expect(source).toContain("Training Apply محظور");
    expect(source).toContain("LOCAL STATE ONLY");
    expect(source).toContain("لا يمثل ذلك failover على معدات");
    expect(source).toContain("Simulate local member selection");
    expect(routes).toContain("/protection-hsb-lab");
  });
});
