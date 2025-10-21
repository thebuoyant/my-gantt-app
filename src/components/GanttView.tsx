// src/components/GanttView.tsx
import React, { useCallback } from "react";
import Gantt, {
  Tasks,
  Dependencies,
  Resources,
  ResourceAssignments,
  Editing,
  Column,
} from "devextreme-react/gantt";
import { useData } from "../context/DataContext";
import { Task, Dependency, ResourceAssignment } from "../types";

// Defensive Extractors – Event-Payloads variieren leicht je nach Aktion/Version
function getTaskFromEvent(e: any): Task | null {
  return (e?.values || e?.newData || e?.taskData || null) as Task | null;
}
function getDependencyFromEvent(e: any): Dependency | null {
  return (e?.values || e?.newData || e?.data || null) as Dependency | null;
}
function getAssignmentFromEvent(e: any): ResourceAssignment | null {
  return (e?.values ||
    e?.newData ||
    e?.data ||
    null) as ResourceAssignment | null;
}

export default function GanttView() {
  const { state, dispatch } = useData();

  // ——— Tasks
  const onTaskInserted = useCallback(
    (e: any) => {
      const t = getTaskFromEvent(e);
      if (t) dispatch({ type: "upsertTask", payload: t });
    },
    [dispatch]
  );

  const onTaskUpdated = useCallback(
    (e: any) => {
      const t = getTaskFromEvent(e);
      if (t) dispatch({ type: "upsertTask", payload: t });
    },
    [dispatch]
  );

  const onTaskDeleted = useCallback(
    (e: any) => {
      const t = getTaskFromEvent(e);
      if (t?.id != null)
        dispatch({ type: "removeTask", payload: { id: t.id } });
    },
    [dispatch]
  );

  // ——— Dependencies (richtige Eventnamen!)
  const onDependencyInserted = useCallback(
    (e: any) => {
      const d = getDependencyFromEvent(e);
      if (d) dispatch({ type: "upsertDependency", payload: d });
    },
    [dispatch]
  );

  const onDependencyDeleted = useCallback(
    (e: any) => {
      const d = getDependencyFromEvent(e);
      if (d?.id != null)
        dispatch({ type: "removeDependency", payload: { id: d.id } });
    },
    [dispatch]
  );

  // ——— Resource Assignments
  const onResourceAssigned = useCallback(
    (e: any) => {
      const a = getAssignmentFromEvent(e);
      if (a) dispatch({ type: "upsertResourceAssignment", payload: a });
    },
    [dispatch]
  );

  const onResourceUnassigned = useCallback(
    (e: any) => {
      const a = getAssignmentFromEvent(e);
      if (a?.id != null)
        dispatch({ type: "removeResourceAssignment", payload: { id: a.id } });
    },
    [dispatch]
  );

  return (
    <div style={{ height: 600 }}>
      <Gantt
        taskListWidth={360}
        onTaskInserted={onTaskInserted}
        onTaskUpdated={onTaskUpdated}
        onTaskDeleted={onTaskDeleted}
        onDependencyInserted={onDependencyInserted}
        onDependencyDeleted={onDependencyDeleted}
        onResourceAssigned={onResourceAssigned}
        onResourceUnassigned={onResourceUnassigned}
      >
        {/* Aufgaben */}
        <Tasks
          dataSource={state.updated.tasks}
          keyExpr="id"
          parentIdExpr="parentId"
          titleExpr="title"
          startExpr="start"
          endExpr="end"
          progressExpr="progress"
        />

        {/* Abhängigkeiten */}
        <Dependencies
          dataSource={state.updated.dependencies}
          keyExpr="id"
          predecessorIdExpr="predecessorId"
          successorIdExpr="successorId"
          typeExpr="type"
        />

        {/* Ressourcen */}
        <Resources
          dataSource={state.updated.resources}
          keyExpr="id"
          textExpr="text"
        />

        {/* Ressourcenzuweisungen */}
        <ResourceAssignments
          dataSource={state.updated.resourceAssignments}
          keyExpr="id"
          taskIdExpr="taskId"
          resourceIdExpr="resourceId"
        />

        <Editing
          enabled={true}
          allowTaskAdding={true}
          allowTaskDeleting={true}
          allowTaskUpdating={true}
          allowDependencyAdding={true}
          allowDependencyDeleting={true}
          allowResourceAdding={true}
          allowResourceDeleting={true}
        />

        <Column dataField="title" caption="Titel" width={220} />
        <Column dataField="start" caption="Start" dataType="date" />
        <Column dataField="end" caption="Ende" dataType="date" />
        <Column dataField="progress" caption="%" />
      </Gantt>
    </div>
  );
}
