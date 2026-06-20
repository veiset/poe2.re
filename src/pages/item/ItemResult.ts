import {generateNumberRegex} from "@/lib/GenerateNumberRegex.ts";
import {ItemSettings} from "@/app/settings.ts";

const openPrefix = (item: string) => `^${item}`;
const openSuffix = (item: string) => `${item}$`;


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