// src/context/DataContext.tsx
import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  FullDiff,
  GanttData,
  Task,
  Dependency,
  Resource,
  ResourceAssignment,
} from "../types";
import { diffById } from "./diff";

// —————————————————————— Helpers
function cloneTasks(ts: Task[]): Task[] {
  return ts.map((t) => ({
    ...t,
    // sicherstellen, dass Dates echte Dates bleiben
    start: new Date(t.start),
    end: new Date(t.end),
  }));
}

function deepClone(data: GanttData): GanttData {
  return {
    tasks: cloneTasks(data.tasks),
    dependencies: data.dependencies.map((d) => ({ ...d })),
    resources: data.resources.map((r) => ({ ...r })),
    resourceAssignments: data.resourceAssignments.map((ra) => ({ ...ra })),
  };
}

function computeDiff(initial: GanttData, updated: GanttData): FullDiff {
  return {
    tasks: diffById(initial.tasks, updated.tasks),
    dependencies: diffById(initial.dependencies, updated.dependencies),
    resources: diffById(initial.resources, updated.resources),
    resourceAssignments: diffById(
      initial.resourceAssignments,
      updated.resourceAssignments
    ),
  };
}

// —————————————————————— Actions/State
export type Action =
  | { type: "reset" }
  | { type: "setAll"; payload: GanttData }
  | { type: "upsertTask"; payload: Task }
  | { type: "removeTask"; payload: { id: Task["id"] } }
  | { type: "upsertDependency"; payload: Dependency }
  | { type: "removeDependency"; payload: { id: Dependency["id"] } }
  | { type: "upsertResource"; payload: Resource }
  | { type: "removeResource"; payload: { id: Resource["id"] } }
  | { type: "upsertResourceAssignment"; payload: ResourceAssignment }
  | {
      type: "removeResourceAssignment";
      payload: { id: ResourceAssignment["id"] };
    };

export type DataState = {
  initial: GanttData;
  updated: GanttData;
  diff: FullDiff;
};

// —————————————————————— Reducer
function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "reset": {
      const updated = deepClone(state.initial);
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "setAll": {
      const updated = deepClone(action.payload);
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "upsertTask": {
      const exists = state.updated.tasks.some(
        (t) => t.id === action.payload.id
      );
      const tasks = exists
        ? state.updated.tasks.map((t) =>
            t.id === action.payload.id ? { ...t, ...action.payload } : t
          )
        : [...state.updated.tasks, action.payload];
      const updated = { ...state.updated, tasks: cloneTasks(tasks) };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "removeTask": {
      const tasks = state.updated.tasks.filter(
        (t) => t.id !== action.payload.id
      );
      const updated = { ...state.updated, tasks };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "upsertDependency": {
      const exists = state.updated.dependencies.some(
        (l) => l.id === action.payload.id
      );
      const dependencies = exists
        ? state.updated.dependencies.map((l) =>
            l.id === action.payload.id ? { ...l, ...action.payload } : l
          )
        : [...state.updated.dependencies, action.payload];
      const updated = { ...state.updated, dependencies };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "removeDependency": {
      const dependencies = state.updated.dependencies.filter(
        (l) => l.id !== action.payload.id
      );
      const updated = { ...state.updated, dependencies };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "upsertResource": {
      const exists = state.updated.resources.some(
        (r) => r.id === action.payload.id
      );
      const resources = exists
        ? state.updated.resources.map((r) =>
            r.id === action.payload.id ? { ...r, ...action.payload } : r
          )
        : [...state.updated.resources, action.payload];
      const updated = { ...state.updated, resources };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "removeResource": {
      const resources = state.updated.resources.filter(
        (r) => r.id !== action.payload.id
      );
      const updated = { ...state.updated, resources };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "upsertResourceAssignment": {
      const exists = state.updated.resourceAssignments.some(
        (ra) => ra.id === action.payload.id
      );
      const resourceAssignments = exists
        ? state.updated.resourceAssignments.map((ra) =>
            ra.id === action.payload.id ? { ...ra, ...action.payload } : ra
          )
        : [...state.updated.resourceAssignments, action.payload];
      const updated = { ...state.updated, resourceAssignments };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    case "removeResourceAssignment": {
      const resourceAssignments = state.updated.resourceAssignments.filter(
        (ra) => ra.id !== action.payload.id
      );
      const updated = { ...state.updated, resourceAssignments };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }
    default:
      return state;
  }
}

// —————————————————————— Context
const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function DataProvider({
  initialData,
  children,
}: {
  initialData: GanttData;
  children: React.ReactNode;
}) {
  const initialState: DataState = useMemo(() => {
    const init = deepClone(initialData);
    const updated = deepClone(initialData);
    return { initial: init, updated, diff: computeDiff(init, updated) };
  }, [initialData]);

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
