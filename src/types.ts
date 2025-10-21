export type Task = {
  id: number | string;
  parentId?: number | string | null;
  title: string;
  start: string | Date;
  end: string | Date;
  progress?: number;
};

export type Link = {
  id: number | string;
  predecessorId: number | string;
  successorId: number | string;
  type?: number; // 0..3
};

export type GanttData = {
  tasks: Task[];
  links: Link[];
};

export type DiffResult<T> = {
  added: T[];
  removed: T[];
  changed: { before: T; after: T }[];
};

export type FullDiff = {
  tasks: DiffResult<Task>;
  links: DiffResult<Link>;
};