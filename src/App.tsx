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
import "devextreme/dist/css/dx.light.css";
import "./styles.css";
import "devextreme/dist/css/dx.light.css";
import "devexpress-gantt/dist/dx-gantt.css";

function Toolbar() {
  const { state, dispatch } = useData();
  const hasChanges =
    state.diff.tasks.added.length +
      state.diff.tasks.removed.length +
      state.diff.tasks.changed.length +
      state.diff.links.added.length +
      state.diff.links.removed.length +
      state.diff.links.changed.length >
    0;

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
        {hasChanges ? "Änderungen vorhanden" : "Keine Änderungen"}
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
