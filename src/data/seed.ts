import { GanttData } from "../types";

export const initialSeed: GanttData = {
  tasks: [
    { id: 1, title: "Projekt", start: "2025-10-01", end: "2025-10-30", progress: 30 },
    { id: 2, parentId: 1, title: "Analyse", start: "2025-10-01", end: "2025-10-05", progress: 100 },
    { id: 3, parentId: 1, title: "Implementierung", start: "2025-10-06", end: "2025-10-25", progress: 40 },
    { id: 4, parentId: 3, title: "Komponente A", start: "2025-10-06", end: "2025-10-15", progress: 80 },
  ],
  links: [
    { id: 1, predecessorId: 2, successorId: 3, type: 0 },
    { id: 2, predecessorId: 4, successorId: 3, type: 1 },
  ],
};