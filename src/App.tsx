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
import LanguageSwitcher from "./components/LanguageSwitcher";

// WICHTIG: beide CSS-Imports
import "devextreme/dist/css/dx.light.css";
import "devexpress-gantt/dist/dx-gantt.css";

import "./styles.css";

import { initDevExtremeLocalization, DxLang } from "./localization/devextreme";

function Toolbar({ onLangChanged }: { onLangChanged: (lang: DxLang) => void }) {
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

      <div style={{ flex: 1 }} />

      {/* Language Switcher (rechts) */}
      <LanguageSwitcher onChanged={onLangChanged} />
    </div>
  );
}

export default function App() {
  // Sprache aus LS oder Browser ableiten
  const [lang, setLang] = React.useState<DxLang>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang") as DxLang | null;
      if (stored === "de" || stored === "en") return stored;
      return navigator.language?.startsWith("de") ? "de" : "en";
    }
    return "de";
  });

  React.useEffect(() => {
    // Beispiel-Overrides (optional, anpassbar oder löschen)
    const overrides = {
      de: {
        // "dxCollectionWidget-noDataText": "Keine Daten verfügbar",
      },
      en: {
        // "dxCollectionWidget-noDataText": "No data available",
      },
    } as const;

    initDevExtremeLocalization(lang, overrides as any);
  }, []); // nur einmal initialisieren

  const handleLangChanged = (l: DxLang) => {
    setLang(l);
    // setDevExtremeLocale wird im Switcher schon aufgerufen;
    // hier reicht das Re-Render erzwingen:
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <DataProvider initialData={initialSeed}>
        <div
          className="container"
          key={lang /* force rerender on language change */}
        >
          <h1>DevExtreme Gantt – React 18 + TS + Fluent UI</h1>
          <Toolbar onLangChanged={handleLangChanged} />
          <GanttView />
        </div>
      </DataProvider>
    </FluentProvider>
  );
}
