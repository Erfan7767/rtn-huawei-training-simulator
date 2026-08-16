import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("Web LCT reference replicas", () => {
  it("keeps the 5.212.19.27 performance page as a separately scoped evidence-bound screen", () => {
    const source = readFileSync(resolve(projectRoot, "client/src/pages/WebLctPerformance52121927.tsx"), "utf8");
    expect(source).toContain("5.212.19.27");
    expect(source).toContain("History Performance");
    expect(source).toContain("Link Errors");
    expect(source).toContain("TRAINING REPLICA");
  });

  it("keeps the alarm reference in its own documented release scope", () => {
    const source = readFileSync(resolve(projectRoot, "client/src/pages/WebLctAlarms2121921.tsx"), "utf8");
    const routes = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
    expect(source).toContain("212.19.21");
    expect(source).toContain("Browse Current Alarms");
    expect(source).toContain("Filter");
    expect(source).toContain("Save As");
    expect(source).toContain("SYNTHETIC ALARMS ONLY");
    expect(routes).toContain("/weblct-reference-2121921-alarms");
  });
});
