import {generateNumberRegex} from "@/lib/GenerateNumberRegex.ts";
import {ItemSettings} from "@/app/settings.ts";

export function generateRareItemRegex(
  settings: ItemSettings,
): string {
  const itemBase = settings.itemBase;
  const selectedMods = settings.selectedMods;

  console.log(`yo ${itemBase?.baseType}`)
  if (!itemBase) return "";


  console.log({selectedMods})

  const result = selectedMods
    .filter((e) => e.selected)
    .filter((e) => e.basetype.startsWith(itemBase.baseType))
    .map((e) => {
      const rangeInRegex = e.itemModifier.regexPosition.on[0];
      const hasRangeInsideRegex = rangeInRegex !== undefined
        && e.values[rangeInRegex] !== ""
        && e.values[rangeInRegex] !== undefined;
      const regex = hasRangeInsideRegex
        ? e.itemModifier.regex
          .replace(
            "\\d+",
            generateNumberRegex(e.values[rangeInRegex], false).replace(".", "\\d")
          )
        : e.itemModifier.regex;
      const numbersBefore = e.itemModifier.regexPosition.before
        .map((number) => e.values[number])
        .filter((e) => e !== undefined && e !== "")
        .map((f) => generateNumberRegex(f, false).replace(".", "\\d"))
        .join(".*");
      const numbersAfter = e.itemModifier.regexPosition.after
        .map((number) => e.values[number])
        .filter((e) => e !== undefined && e !== "")
        .map((f) => generateNumberRegex(f, false).replace(".", "\\d"))
        .join(".*");

      const regexStr = [numbersBefore, regex, numbersAfter]
        .filter((e) => e !== undefined && e !== "")
        .join(".*");

      return {
        str: regexStr,
        affixtype: e.itemModifier.affixType
      };
    });

  if (settings.rareSettings.matchAnyMod) {
    const regex = result.map(e => e.str).join("|");
    return regex.length > 0 ? `"${regex}"` : "";
  } else {
    return result.map((e) => `"${e.str}"`).join(" ");
  }
}