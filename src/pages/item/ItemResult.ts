import {ItemModifier} from "@/types/generated/ItemTypedef.ts";
import {generateNumberRegex} from "@/lib/GenerateNumberRegex.ts";
import {ItemSettings, SelectedItemMod} from "@/app/settings.ts";

const openPrefix = (item: string) => `^${item}`;
const openSuffix = (item: string) => `${item}$`;

type RareModSelectionEntry = {
  key: string;
  value: SelectedItemMod;
  regex: ItemModifier
};

export function generateMagicItemRegex(
  settings: ItemSettings
) {
  const itemBase = settings.itemBase;
  const selectedMods = settings.selectedMods;
  if (!itemBase) return "";
  const mods = selectedMods.filter((e) => e.basetype === itemBase.baseType);
  const prefixes = mods.filter((e) => e.itemModifier.affixType === "PREFIX").map((e) => e.itemModifier.description);
  const suffixes = mods.filter((e) => e.itemModifier.affixType === "SUFFIX").map((e) => e.itemModifier.description);

  if (!settings.magicSettings.matchOpenAffix && !settings.magicSettings.onlyIfBothPrefixAndSuffix) {
    const prefixMatch = prefixes.length > 0 ? prefixes.map((e) => `^${e}`) : [];
    const suffixMatch = suffixes.length > 0 ? suffixes.map((e) => `${e}$`) : [];
    const s = prefixMatch.concat(suffixMatch).filter((e) => e !== null).join("|");
    return s ? `"${s}"` : "";
  } else if (!settings.magicSettings.matchOpenAffix && settings.magicSettings.onlyIfBothPrefixAndSuffix) {
    const prefixMatch = prefixes.length > 0 ? `(${prefixes.join("|")})` : "";
    const suffixMatch = suffixes.length > 0 ? `(${suffixes.join("|")})` : "";
    return `"${prefixMatch}\\s?${itemBase.item}\\s?${suffixMatch}"`;
  } else if (settings.magicSettings.matchOpenAffix && settings.magicSettings.onlyIfBothPrefixAndSuffix) {
    const prefixMatch = prefixes.length > 0 ? `(${prefixes.join("|")})` : "";
    const suffixMatch = suffixes.length > 0 ? `(${suffixes.join("|")})` : "";
    const item = itemBase.item;
    if (prefixMatch.length === 0 && suffixMatch.length === 0) return "";
    return `"^${prefixMatch}\\s${item}|${openPrefix(item)}" "${item}\\s${suffixMatch}|${openSuffix(item)}"`
  } else if (settings.magicSettings.matchOpenAffix && !settings.magicSettings.onlyIfBothPrefixAndSuffix) {
    const prefixMatch = prefixes.length > 0 ? prefixes.map((e) => `^${e}`) : [];
    const suffixMatch = suffixes.length > 0 ? suffixes.map((e) => `${e}$`) : [];
    const item = itemBase.item;
    const s = prefixMatch.concat(suffixMatch).concat([openPrefix(item), openSuffix(item)]).filter((e) => e !== null).join("|");
    return s ? `"${s}"` : "";
  }
  return "Error reading configuration";
}

export function generateRareItemRegex(
  affixMap: Record<string, ItemModifier>,
  settings: ItemSettings,
): string {
  const itemBase = settings.itemBase;
  const selectedMods = settings.selectedMods;

  if (!itemBase) return "";

  const mods: RareModSelectionEntry[] = Object.entries(selectedMods)
    .map(([key, value]) => ({key, value, regex: affixMap[key]}));


  const result = mods
    .filter((e) => e.value.selected)
    .filter((e) => e.key.startsWith(itemBase.baseType))
    .map((e) => {
      const rangeInRegex = e.regex.regexPosition.on[0];
      const hasRangeInsideRegex = rangeInRegex !== undefined
        && e.value.values[rangeInRegex] !== ""
        && e.value.values[rangeInRegex] !== undefined;
      const regex = hasRangeInsideRegex
        ? e.regex.regex
          .replace(
            "\\d+",
            generateNumberRegex(e.value.values[rangeInRegex], false).replace(".", "\\d")
          )
        : e.regex.regex;
      const numbersBefore = e.regex.regexPosition.before
        .map((number) => e.value.values[number])
        .filter((e) => e !== undefined && e !== "")
        .map((f) => generateNumberRegex(f, false).replace(".", "\\d"))
        .join(".*");
      const numbersAfter = e.regex.regexPosition.after
        .map((number) => e.value.values[number])
        .filter((e) => e !== undefined && e !== "")
        .map((f) => generateNumberRegex(f, false).replace(".", "\\d"))
        .join(".*");

      const regexStr = [numbersBefore, regex, numbersAfter]
        .filter((e) => e !== undefined && e !== "")
        .join(".*");

      return {
        str: regexStr,
        affixtype: e.regex.affixType
      };
    });

  if (settings.rareSettings.matchPrefixAndSuffix) {
    const prefixes = result.filter(e => e.affixtype === "PREFIX").map(e => e.str).join("|");
    const suffixes = result.filter(e => e.affixtype === "SUFFIX").map(e => e.str).join("|");

    if (prefixes && suffixes) {
      return `"${prefixes}" "${suffixes}"`;
    }
    // Fallback to default behavior if one of the categories is empty
    return result.map((e) => `"${e.str}"`).join(" ");
  } else if (settings.rareSettings.matchAnyMod) {
    const regex = result.map(e => e.str).join("|");
    return regex.length > 0 ? `"${regex}"` : "";
  } else {
    return result.map((e) => `"${e.str}"`).join(" ");
  }
}