import React, { useCallback } from "react";
import Gantt, { Tasks, Dependencies, Editing, Column } from "devextreme-react/gantt";
import { useData } from "../context/DataContext";
import { Task, Link } from "../types";

function getTaskFromEvent(e: any): Task | null {
  return (e?.values || e?.newData || e?.taskData || null) as Task | null;
}
function getLinkFromEvent(e: any): Link | null {
  return (e?.values || e?.newData || e?.data || null) as Link | null;
}

export default function GanttView() {
  const { state, dispatch } = useData();

  const onTaskInserted = useCallback((e: any) => {
    const t = getTaskFromEvent(e);
    if (t) dispatch({ type: "upsertTask", payload: t });
  }, [dispatch]);

  const onTaskUpdated = useCallback((e: any) => {
    const t = getTaskFromEvent(e);
    if (t) dispatch({ type: "upsertTask", payload: t });
  }, [dispatch]);

  const onTaskDeleted = useCallback((e: any) => {
    const t = getTaskFromEvent(e);
    if (t?.id != null) dispatch({ type: "removeTask", payload: { id: t.id } });
  }, [dispatch]);

  const onLinkInserted = useCallback((e: any) => {
    const l = getLinkFromEvent(e);
    if (l) dispatch({ type: "upsertLink", payload: l });
  }, [dispatch]);

  const onLinkDeleted = useCallback((e: any) => {
    const l = getLinkFromEvent(e);
    if (l?.id != null) dispatch({ type: "removeLink", payload: { id: l.id } });
  }, [dispatch]);

  return (
    <div style={{ height: 600 }}>
      <Gantt
        taskListWidth={360}
        onTaskInserted={onTaskInserted}
        onTaskUpdated={onTaskUpdated}
        onTaskDeleted={onTaskDeleted}
        onLinkInserted={onLinkInserted}
        onLinkDeleted={onLinkDeleted}
      >
        <Tasks dataSource={state.updated.tasks} startExpr="start" endExpr="end" titleExpr="title" parentIdExpr="parentId" progressExpr="progress" idExpr="id" />
        <Dependencies dataSource={state.updated.links} predecessorIdExpr="predecessorId" successorIdExpr="successorId" typeExpr="type" idExpr="id" />

        <Editing enabled={true} allowTaskAdding={true} allowTaskDeleting={true} allowTaskUpdating={true}
                 allowDependencyAdding={true} allowDependencyDeleting={true} />

        <Column dataField="title" caption="Titel" width={200} />
        <Column dataField="start" caption="Start" dataType="date" />
        <Column dataField="end" caption="Ende" dataType="date" />
        <Column dataField="progress" caption="%" />
      </Gantt>
    </div>
  );
}