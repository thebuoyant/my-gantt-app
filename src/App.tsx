// src/App.tsx
import React from "react";
import {
  FluentProvider,
  webLightTheme,
  Button,
  Divider,
  Tooltip,
} from "@fluentui/react-components";
import { ArrowResetRegular, DataTrendingRegular } from "@fluentui/react-icons";
import GanttView from "./components/GanttView";
import { DataProvider, useData } from "./context/DataContext";
import { initialSeed } from "./data/seed";

// WICHTIG: beide CSS-Imports
import "devextreme/dist/css/dx.light.css";
import "devexpress-gantt/dist/dx-gantt.css";

import "./styles.css";

function Toolbar() {
  const { state, dispatch } = useData();
  const changesCount =
    state.diff.tasks.added.length +
    state.diff.tasks.removed.length +
    state.diff.tasks.changed.length +
    state.diff.dependencies.added.length +
    state.diff.dependencies.removed.length +
    state.diff.dependencies.changed.length +
    state.diff.resources.added.length +
    state.diff.resources.removed.length +
    state.diff.resources.changed.length +
    state.diff.resourceAssignments.added.length +
    state.diff.resourceAssignments.removed.length +
    state.diff.resourceAssignments.changed.length;

  const hasChanges = changesCount > 0;

  return (
    <div className="toolbar">
      <Tooltip content="Zurück auf Initialdaten" relationship="label">
        <Button
          appearance="primary"
          icon={<ArrowResetRegular />}
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset
        </Button>
      </Tooltip>

      <Divider vertical style={{ margin: "0 12px" }} />

      <Tooltip content="Diff anzeigen (Konsole)" relationship="label">
        <Button
          icon={<DataTrendingRegular />}
          onClick={() => console.log("DIFF", state.diff)}
          disabled={!hasChanges}
        >
          Diff → Konsole
        </Button>
      </Tooltip>

      <span className="muted">
        {hasChanges ? `Änderungen: ${changesCount}` : "Keine Änderungen"}
      </span>
    </div>
  );
}

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <DataProvider initialData={initialSeed}>
        <div className="container">
          <h1>DevExtreme Gantt – React 18 + TS + Fluent UI</h1>
          <Toolbar />
          <GanttView />
        </div>
      </DataProvider>
    </FluentProvider>
  );
}
