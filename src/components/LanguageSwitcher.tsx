import React from "react";
import { Dropdown, Option } from "@fluentui/react-components";
import {
  setDevExtremeLocale,
  DxLang,
  getDevExtremeLocale,
} from "../localization/devextreme";

export default function LanguageSwitcher({
  onChanged,
}: {
  onChanged?: (lang: DxLang) => void;
}) {
  const [value, setValue] = React.useState<DxLang>(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("lang") as DxLang | null)
        : null;
    return stored || getDevExtremeLocale() || "de";
  });

  const handleChange = (_: any, data: any) => {
    const lang = (data.optionValue ?? data.value) as DxLang;
    setValue(lang);
    // hier könntest du pro Sprache eigene Overrides mitgeben
    setDevExtremeLocale(lang);
    onChanged?.(lang);
  };

  return (
    <Dropdown
      value={value.toUpperCase()}
      selectedOptions={[value]}
      onOptionSelect={handleChange}
      aria-label="Language"
      style={{ width: 120 }}
    >
      <Option value="de">DE</Option>
      <Option value="en">EN</Option>
    </Dropdown>
  );
}
