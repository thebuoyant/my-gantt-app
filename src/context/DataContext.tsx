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

/* ============================ Normalisierung ============================ */
/** Hilfsfunktionen, die IDs/Referenzen als Strings normalisieren,
    Dates korrekt klonen und damit E1046 vermeiden. */

function toStr(
  v: string | number | null | undefined
): string | null | undefined {
  if (v === null || v === undefined) return v;
  return String(v);
}

function cloneTask(t: Task): Task {
  return {
    ...t,
    id: String(t.id),
    // parentId: 0 kennzeichnet Root — das lassen wir als 0 stehen.
    // Alle anderen Parent-IDs in Strings konvertieren.
    parentId:
      t.parentId === 0 || t.parentId === null || t.parentId === undefined
        ? t.parentId
        : String(t.parentId),
    title: t.title,
    start: new Date(t.start),
    end: new Date(t.end),
    progress: t.progress,
  };
}

function cloneDependency(d: Dependency): Dependency {
  return {
    ...d,
    id: String(d.id),
    predecessorId: String(d.predecessorId),
    successorId: String(d.successorId),
    type: d.type,
  };
}

function cloneResource(r: Resource): Resource {
  return {
    ...r,
    id: String(r.id),
    text: r.text,
  };
}

function cloneAssignment(a: ResourceAssignment): ResourceAssignment {
  return {
    ...a,
    id: String(a.id), // <- "0" ist truthy, kein E1046 mehr
    taskId: String(a.taskId),
    resourceId: String(a.resourceId),
  };
}

function normalize(data: GanttData): GanttData {
  return {
    tasks: data.tasks.map(cloneTask),
    dependencies: data.dependencies.map(cloneDependency),
    resources: data.resources.map(cloneResource),
    resourceAssignments: data.resourceAssignments.map(cloneAssignment),
  };
}

/* =============================== Diff ================================== */
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

/* ============================= Actions/State ============================ */
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

/* ============================== Reducer ================================= */
function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "reset": {
      const updated = normalize(state.initial);
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "setAll": {
      const updated = normalize(action.payload);
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "upsertTask": {
      const payload = cloneTask(action.payload);
      const exists = state.updated.tasks.some((t) => t.id === payload.id);
      const tasks = exists
        ? state.updated.tasks.map((t) =>
            t.id === payload.id ? { ...t, ...payload } : t
          )
        : [...state.updated.tasks, payload];
      const updated = { ...state.updated, tasks };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "removeTask": {
      const id = String(action.payload.id);
      const tasks = state.updated.tasks.filter((t) => t.id !== id);
      const updated = { ...state.updated, tasks };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "upsertDependency": {
      const payload = cloneDependency(action.payload);
      const exists = state.updated.dependencies.some(
        (l) => l.id === payload.id
      );
      const dependencies = exists
        ? state.updated.dependencies.map((l) =>
            l.id === payload.id ? { ...l, ...payload } : l
          )
        : [...state.updated.dependencies, payload];
      const updated = { ...state.updated, dependencies };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "removeDependency": {
      const id = String(action.payload.id);
      const dependencies = state.updated.dependencies.filter(
        (l) => l.id !== id
      );
      const updated = { ...state.updated, dependencies };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "upsertResource": {
      const payload = cloneResource(action.payload);
      const exists = state.updated.resources.some((r) => r.id === payload.id);
      const resources = exists
        ? state.updated.resources.map((r) =>
            r.id === payload.id ? { ...r, ...payload } : r
          )
        : [...state.updated.resources, payload];
      const updated = { ...state.updated, resources };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "removeResource": {
      const id = String(action.payload.id);
      const resources = state.updated.resources.filter((r) => r.id !== id);
      const updated = { ...state.updated, resources };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "upsertResourceAssignment": {
      const payload = cloneAssignment(action.payload);
      const exists = state.updated.resourceAssignments.some(
        (ra) => ra.id === payload.id
      );
      const resourceAssignments = exists
        ? state.updated.resourceAssignments.map((ra) =>
            ra.id === payload.id ? { ...ra, ...payload } : ra
          )
        : [...state.updated.resourceAssignments, payload];
      const updated = { ...state.updated, resourceAssignments };
      return {
        initial: state.initial,
        updated,
        diff: computeDiff(state.initial, updated),
      };
    }

    case "removeResourceAssignment": {
      const id = String(action.payload.id);
      const resourceAssignments = state.updated.resourceAssignments.filter(
        (ra) => ra.id !== id
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

/* =============================== Context ================================ */
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
    // initial & updated werden getrennt, aber beide normalisiert
    const init = normalize(initialData);
    const updated = normalize(initialData);
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
