import React, { createContext, useContext, useMemo, useReducer } from "react";
import { FullDiff, GanttData, Task, Link } from "../types";
import { diffById } from "./diff";

export type Action =
  | { type: "reset" }
  | { type: "setAll"; payload: GanttData }
  | { type: "upsertTask"; payload: Task }
  | { type: "removeTask"; payload: { id: Task["id"] } }
  | { type: "upsertLink"; payload: Link }
  | { type: "removeLink"; payload: { id: Link["id"] } };

export type DataState = {
  initial: GanttData;
  updated: GanttData;
  diff: FullDiff;
};

function computeDiff(initial: GanttData, updated: GanttData): FullDiff {
  return {
    tasks: diffById(initial.tasks, updated.tasks),
    links: diffById(initial.links, updated.links),
  };
}

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "reset": {
      const updated = JSON.parse(JSON.stringify(state.initial)) as GanttData;
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    case "setAll": {
      const updated = action.payload;
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    case "upsertTask": {
      const exists = state.updated.tasks.some((t) => t.id === action.payload.id);
      const tasks = exists
        ? state.updated.tasks.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t))
        : [...state.updated.tasks, action.payload];
      const updated = { ...state.updated, tasks };
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    case "removeTask": {
      const tasks = state.updated.tasks.filter((t) => t.id !== action.payload.id);
      const updated = { ...state.updated, tasks };
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    case "upsertLink": {
      const exists = state.updated.links.some((l) => l.id === action.payload.id);
      const links = exists
        ? state.updated.links.map((l) => (l.id === action.payload.id ? { ...l, ...action.payload } : l))
        : [...state.updated.links, action.payload];
      const updated = { ...state.updated, links };
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    case "removeLink": {
      const links = state.updated.links.filter((l) => l.id !== action.payload.id);
      const updated = { ...state.updated, links };
      return { initial: state.initial, updated, diff: computeDiff(state.initial, updated) };
    }
    default:
      return state;
  }
}

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function DataProvider({ initialData, children }: { initialData: GanttData; children: React.ReactNode }) {
  const initialState: DataState = useMemo(() => {
    const updated = JSON.parse(JSON.stringify(initialData)) as GanttData;
    return { initial: initialData, updated, diff: computeDiff(initialData, updated) };
  }, [initialData]);

  const [state, dispatch] = useReducer(reducer, initialState);
  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}