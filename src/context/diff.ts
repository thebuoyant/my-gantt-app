// src/context/diff.ts
import { DiffResult } from "../types";

export function diffById<T extends { id: string | number }>(
  before: T[],
  after: T[]
): DiffResult<T> {
  const beforeMap = new Map(before.map((x) => [x.id, x] as const));
  const afterMap = new Map(after.map((x) => [x.id, x] as const));

  const added: T[] = [];
  const removed: T[] = [];
  const changed: { before: T; after: T }[] = [];

  for (const [id, b] of beforeMap) {
    if (!afterMap.has(id)) removed.push(b);
  }
  for (const [id, a] of afterMap) {
    const b = beforeMap.get(id);
    if (!b) {
      added.push(a);
    } else {
      // flacher Vergleich – reicht hier
      const bJson = JSON.stringify(b);
      const aJson = JSON.stringify(a);
      if (bJson !== aJson) changed.push({ before: b, after: a });
    }
  }
  return { added, removed, changed };
}
