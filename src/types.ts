// src/types.ts
export type Task = {
  id: number | string;
  parentId?: number | string | null;
  title: string;
  start: Date; // jetzt echte Date-Objekte
  end: Date;
  progress?: number; // 0..100
};

export type Dependency = {
  id: number | string;
  predecessorId: number | string;
  successorId: number | string;
  type?: number; // 0..3 (FS, SS, FF, SF)
};

export type Resource = {
  id: number | string;
  text: string;
};

export type ResourceAssignment = {
  id: number | string;
  taskId: number | string;
  resourceId: number | string;
};

export type GanttData = {
  tasks: Task[];
  dependencies: Dependency[];
  resources: Resource[];
  resourceAssignments: ResourceAssignment[];
};

export type DiffResult<T> = {
  added: T[];
  removed: T[];
  changed: { before: T; after: T }[];
};

export type FullDiff = {
  tasks: DiffResult<Task>;
  dependencies: DiffResult<Dependency>;
  resources: DiffResult<Resource>;
  resourceAssignments: DiffResult<ResourceAssignment>;
};
