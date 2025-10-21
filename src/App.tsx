// src/App.tsx
import React from "react";
import {
  FluentProvider,
  webLightTheme,
  Button,
  Divider,
  Tooltip,
} from "@fluentui/react-components";
import {
  ArrowResetRegular,
  DataTrendingRegular,
  EyeRegular,
  EyeOffRegular,
} from "@fluentui/react-icons";
import GanttView from "./components/GanttView";
import { DataProvider, useData } from "./context/DataContext";
import { initialSeed } from "./data/seed";
import LanguageSwitcher from "./components/LanguageSwitcher";

// WICHTIG: beide CSS-Imports
import "devextreme/dist/css/dx.light.css";
import "devexpress-gantt/dist/dx-gantt.css";

import "./styles.css";

import { initDevExtremeLocalization, DxLang } from "./localization/devextreme";

function Toolbar({
  onLangChanged,
  showResources,
  onToggleResources,
}: {
  onLangChanged: (lang: DxLang) => void;
  showResources: boolean;
  onToggleResources: () => void;
}) {
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

      <Divider vertical style={{ margin: "0 12px" }} />

      <Tooltip
        content={
          showResources ? "Ressourcen ausblenden" : "Ressourcen einblenden"
        }
        relationship="label"
      >
        <Button
          icon={showResources ? <EyeOffRegular /> : <EyeRegular />}
          onClick={onToggleResources}
        >
          {showResources ? "Ressourcen aus" : "Ressourcen an"}
        </Button>
      </Tooltip>

      <span className="muted" style={{ marginLeft: 8 }}>
        {hasChanges ? `Änderungen: ${changesCount}` : "Keine Änderungen"}
      </span>

      <div style={{ flex: 1 }} />

      {/* Language Switcher (rechts) */}
      <LanguageSwitcher onChanged={onLangChanged} />
    </div>
  );
}

export default function App() {
  // Sprache initialisieren (DevExtreme-Localization)
  const [lang, setLang] = React.useState<DxLang>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang") as DxLang | null;
      if (stored === "de" || stored === "en") return stored;
      return navigator.language?.startsWith("de") ? "de" : "en";
    }
    return "de";
  });

  React.useEffect(() => {
    const overrides = {
      de: {
        // optional: eigene Überschreibungen hier eintragen
      },
      en: {
        // optional: eigene Überschreibungen hier eintragen
      },
    } as const;

    initDevExtremeLocalization(lang, overrides as any);
  }, []); // einmalig beim Mount

  const handleLangChanged = (l: DxLang) => {
    setLang(l);
  };

  // Sichtbarkeit der Ressourcen (Resources + ResourceAssignments)
  const [showResources, setShowResources] = React.useState<boolean>(true);
  const toggleResources = () => setShowResources((s) => !s);

  return (
    <FluentProvider theme={webLightTheme}>
      <DataProvider initialData={initialSeed}>
        {/* key={lang} erzwingt Re-Mount bei Sprachwechsel */}
        <div className="container" key={lang}>
          <h1>DevExtreme Gantt – React 18 + TS + Fluent UI</h1>
          <Toolbar
            onLangChanged={handleLangChanged}
            showResources={showResources}
            onToggleResources={toggleResources}
          />
          <GanttView showResources={showResources} />
        </div>
      </DataProvider>
    </FluentProvider>
  );
}
