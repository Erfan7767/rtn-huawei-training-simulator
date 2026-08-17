import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type TrainingModuleId =
  | "course-roadmap"
  | "slot-layout"
  | "link-configuration"
  | "ne-attribute"
  | "elan-vlan"
  | "protection-hsb"
  | "navigator"
  | "performance-reference"
  | "alarms-reference";

type TrainingProgress = {
  visited: TrainingModuleId[];
  completed: TrainingModuleId[];
  lastVisited?: TrainingModuleId;
};

type TrainingProgressContextValue = TrainingProgress & {
  visitModule: (moduleId: TrainingModuleId) => void;
  completeModule: (moduleId: TrainingModuleId) => void;
  resetTrainingProgress: () => void;
};

const STORAGE_KEY = "fieldlink-training-progress-v1";
const emptyProgress: TrainingProgress = { visited: [], completed: [] };

function isModuleId(value: unknown): value is TrainingModuleId {
  return typeof value === "string" && [
    "course-roadmap", "slot-layout", "link-configuration", "ne-attribute", "elan-vlan",
    "protection-hsb", "navigator", "performance-reference", "alarms-reference",
  ].includes(value);
}

export function sanitizeTrainingProgress(value: unknown): TrainingProgress {
  if (!value || typeof value !== "object") return emptyProgress;
  const candidate = value as Partial<TrainingProgress>;
  const visited = Array.isArray(candidate.visited) ? candidate.visited.filter(isModuleId) : [];
  const completed = Array.isArray(candidate.completed) ? candidate.completed.filter(isModuleId) : [];
  return {
    visited: Array.from(new Set(visited)),
    completed: Array.from(new Set(completed)),
    lastVisited: isModuleId(candidate.lastVisited) ? candidate.lastVisited : undefined,
  };
}

function readProgress(): TrainingProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeTrainingProgress(JSON.parse(stored)) : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

const TrainingProgressContext = createContext<TrainingProgressContextValue | null>(null);

export function TrainingProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<TrainingProgress>(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Local progress is optional; a blocked storage API must not interrupt the lab.
    }
  }, [progress]);

  const visitModule = useCallback((moduleId: TrainingModuleId) => {
    setProgress((current) => ({
      ...current,
      visited: current.visited.includes(moduleId) ? current.visited : [...current.visited, moduleId],
      lastVisited: moduleId,
    }));
  }, []);

  const completeModule = useCallback((moduleId: TrainingModuleId) => {
    setProgress((current) => ({
      ...current,
      visited: current.visited.includes(moduleId) ? current.visited : [...current.visited, moduleId],
      completed: current.completed.includes(moduleId) ? current.completed : [...current.completed, moduleId],
      lastVisited: moduleId,
    }));
  }, []);

  const resetTrainingProgress = useCallback(() => setProgress(emptyProgress), []);

  const value = useMemo(() => ({ ...progress, visitModule, completeModule, resetTrainingProgress }), [progress, visitModule, completeModule, resetTrainingProgress]);
  return <TrainingProgressContext.Provider value={value}>{children}</TrainingProgressContext.Provider>;
}

export function useTrainingProgress() {
  const context = useContext(TrainingProgressContext);
  if (!context) throw new Error("useTrainingProgress must be used within TrainingProgressProvider");
  return context;
}
