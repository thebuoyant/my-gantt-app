// src/localization/devextreme.ts
import { loadMessages, locale as dxLocale } from "devextreme/localization";

// Eingebaute DevExtreme-Sprachpakete
import deDx from "devextreme/localization/messages/de.json";
import enDx from "devextreme/localization/messages/en.json";

export type DxLang = "de" | "en";

/**
 * Einmalig aufrufen (z.B. in App.tsx), lädt die DevExtreme-Messages
 * und setzt die Startsprache (inkl. optionaler Overrides).
 */
export function initDevExtremeLocalization(
  lang: DxLang,
  perLangOverrides?: Partial<Record<DxLang, Record<string, string>>>
) {
  // eingebaute Messages registrieren
  loadMessages(deDx as any);
  loadMessages(enDx as any);

  // optionale eigene Overrides je Sprache laden (nur Keys, die du überschreiben willst)
  if (perLangOverrides?.de) loadMessages({ de: perLangOverrides.de } as any);
  if (perLangOverrides?.en) loadMessages({ en: perLangOverrides.en } as any);

  dxLocale(lang);
  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

/**
 * Während der Laufzeit Sprache umschalten (und bei Bedarf
 * pro Sprache spezifische Overrides nachladen/überschreiben).
 */
export function setDevExtremeLocale(
  lang: DxLang,
  perLangOverrides?: Partial<Record<DxLang, Record<string, string>>>
) {
  if (perLangOverrides?.[lang]) {
    loadMessages({ [lang]: perLangOverrides[lang]! } as any);
  }
  dxLocale(lang);
  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

/** Aktuelle Sprache aus DevExtreme lesen */
export function getDevExtremeLocale(): DxLang {
  return (dxLocale() as DxLang) || "en";
}
