import { useCallback, useEffect, useState } from "react";
import { emptyProfile, type Profile } from "./prompts";
import type { PlanResult, SummaryResult } from "./types";

const KEY = "hireboost:v1";

export type SavedEmail = {
  id: string;
  createdAt: number;
  purpose: string;
  subject: string;
  body: string;
};

export type TaskItem = {
  id: string;
  title: string;
  minutes: number;
  bucket: string;
  day: string;
  done: boolean;
};

export type AppState = {
  profile: Profile;
  emails: SavedEmail[];
  summaries: (SummaryResult & { id: string; meta: string; createdAt: number })[];
  plan: PlanResult | null;
  tasks: TaskItem[];
};

export const initialState: AppState = {
  profile: emptyProfile,
  emails: [],
  summaries: [],
  plan: null,
  tasks: [],
};

function read(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return initialState;
  }
}

const listeners = new Set<(s: AppState) => void>();
let memory: AppState | null = null;

function write(next: AppState) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — the session still works in memory */
  }
  listeners.forEach((l) => l(next));
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    memory = memory ?? read();
    setState(memory);
    setHydrated(true);
    const listener = (s: AppState) => setState(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((patch: Partial<AppState>) => {
    const base = memory ?? read();
    write({ ...base, ...patch });
  }, []);

  const clearAll = useCallback(() => {
    write(initialState);
  }, []);

  return { state, hydrated, update, clearAll };
}

export const uid = () => Math.random().toString(36).slice(2, 10);
