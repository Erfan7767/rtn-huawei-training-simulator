import { describe, expect, it } from "vitest";
import { sanitizeTrainingProgress } from "../client/src/contexts/TrainingProgressContext";

describe("training progress storage boundary", () => {
  it("keeps only known local module identifiers and removes duplicates", () => {
    expect(sanitizeTrainingProgress({
      visited: ["course-roadmap", "slot-layout", "slot-layout", "unsupported-module"],
      completed: ["link-configuration", "unsupported-module", "link-configuration"],
      lastVisited: "slot-layout",
    })).toEqual({
      visited: ["course-roadmap", "slot-layout"],
      completed: ["link-configuration"],
      lastVisited: "slot-layout",
    });
  });

  it("falls back to an empty local state for malformed storage data", () => {
    expect(sanitizeTrainingProgress("not a progress object")).toEqual({ visited: [], completed: [] });
  });
});
