import {Settings} from "@/app/settings.ts";
import {selectedOptionRegex} from "@/lib/SelectedOptionRegex.ts";

export function generateRelicResult(settings: Settings): string {

  const modifiers = [
    settings.relic.modifier.prefixes
      .filter((e) => e.isSelected)
      .map((e) => selectedOptionRegex(e, false, false))
      .join("|"),
    settings.relic.modifier.suffixes
      .filter((e) => e.isSelected)
      .map((e) => selectedOptionRegex(e, false, false))
      .join("|"),
  ].filter((e) => e !== null && e !== "");

  if (modifiers.length === 0) {
    return "";
  }
  if (settings.relic.matchType === "any") {
    return `"${modifiers.join("|")}"`;
  } else {
    return modifiers.map((e) => `"${e}"`).join(" ");
  }
}
