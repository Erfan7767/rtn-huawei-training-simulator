import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");

describe("source-scoped course roadmap", () => {
  it("links the evidenced training labs and labels unsupported modules as evidence-gated", () => {
    expect(source).toContain("المختبرات المتاحة حسب الطراز والإصدار");
    expect(source).toContain("/rtn950a-slot-layout");
    expect(source).toContain("/rtn950a-link-lab");
    expect(source).toContain("/rtn950-ne-attribute-lab");
    expect(source).toContain("/navigator-demo");
    expect(source).toContain("/rtn950-elan-vlan-lab");
    expect(source).toContain("Physical Link Aggregation");
    expect(source).toContain("Evidence required");
  });
});
