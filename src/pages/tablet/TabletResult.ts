import { Settings } from "@/app/settings.ts";
import { selectedOptionRegex } from "@/lib/SelectedOptionRegex.ts";

/**
 * Generates tablet regex toi be pasted in PoE2
 *
 * Generates regex for:
 *  rarity, league mechanic, uses remaining, selected affixes
 *
 * @param settings - Settings instance that contains input values
 * @returns Regex as string
 *
 */
export function generateTabletRegex(settings: Settings): string {
  const result = [
    generateRarityRegex(settings.tablet.rarity),
    generateTypeRegex(settings.tablet.type),
    settings.tablet.modifier.usesRemaining
      ? generateUsesRemainingRegex(settings.tablet.modifier)
      : null,
    ...generateModifierRegex(settings.tablet.modifier),
    settings.tablet.resultSettings.customText || null,
  ].filter((e) => e !== null && e !== "");

  if (result.length === 0) return "";
  return result.join(" ").trim();
}

/**
 * Generates a regex segment for the selected affixes.
 *
 * Selected affixes are joined with `|` when match type is "any", or
 * emitted as separate quoted segments when match type is "all".
 *
 * @param settings - Tablet modifier settings
 * @returns Array of regex segments (already quoted)
 */
function generateModifierRegex(
  settings: Settings["tablet"]["modifier"],
): string[] {
  const affixes = settings.affixes
    .filter((e) => e.isSelected)
    .map((e) => selectedOptionRegex(e, settings.round10));

  if (affixes.length === 0) return [];

  if (settings.affixSelectType === "all") {
    return affixes.map((e) => `"${e}"`);
  }
  return [`"${affixes.join("|")}"`];
}

/**
 * Generates a regex that matches tablet rarity.
 * The supported types are:
 *  Normal, Magic
 *
 * Example regex:
 *  Normal              ->  "y: n"
 *  Magic               ->  "y: m"
 *  Normal, Magic       ->  null
 *
 * @param settings - Settings instance that contains input values
 * @returns Regex as string, null on failure
 *
 */
function generateRarityRegex(
  settings: Settings["tablet"]["rarity"],
): string | null {
  if (
    (settings.normal && settings.magic) ||
    (!settings.normal && !settings.magic)
  ) {
    return null;
  }
  const normalRegex = settings.normal ? "n" : "";
  const magicRegex = settings.magic ? "m" : "";
  const result = [normalRegex, magicRegex]
    .filter((e) => e.length > 0)
    .join("|");

  if (result.length === 0) return null;
  if (result.length === 1) return `"y: ${result}"`;
  if (result.length > 1) return `"y: (${result})"`;
  return null;
}

/**
 * Generates a regex that matches all tablet types.
 * The supported types are:
 *  Breach, Delirium, Irradiated, Expedition, Ritual, Overseer
 *
 * Example regex:
 *  Breach and Ritual   ->  "(eac|tual)"
 *  Delirium            ->  "liri"
 *
 * @param settings - Settings instance that contains input values
 * @returns Regex as string, null on failure
 *
 */
function generateTypeRegex(
  settings: Settings["tablet"]["type"],
): string | null {
  if (
    (settings.breach &&
      settings.delirium &&
      settings.irradiated &&
      settings.expedition &&
      settings.ritual &&
      settings.overseer) ||
    (!settings.breach &&
      !settings.delirium &&
      !settings.irradiated &&
      !settings.expedition &&
      !settings.ritual &&
      !settings.overseer)
  ) {
    return null;
  }

  const breachRegex = settings.breach ? "eac" : "";
  const deliriumRegex = settings.delirium ? "liri" : "";
  const irradiatedRegex = settings.irradiated ? "rra" : "";
  const expeditionRegex = settings.expedition ? "xped" : "";
  const ritualRegex = settings.ritual ? "tual" : "";
  const overseerRegex = settings.overseer ? "eer" : "";
  const result = [
    breachRegex,
    deliriumRegex,
    irradiatedRegex,
    expeditionRegex,
    ritualRegex,
    overseerRegex,
  ]
    .filter((e) => e.length > 0)
    .join("|");

  if (result.length === 0) return null;
  if (result.length === 1) return `"${result}"`;
  if (result.length > 1) return `"(${result})"`;
  return null;
}

/**
 * Generates a regex matching a tablet's "# uses remaining" line when the number
 * is greater or equal to the given limit. Tablets are consumed per use, so this
 * highlights tablets with at least the requested number of uses left.
 * Uses range from 1 to 18.
 *
 * The matched in-game text looks like:
 *  Adds Abysses to a Map
 *  10 uses remaining
 *
 * Example regex (min uses):
 *  1   ->  "([1-9]|1[0-8]) uses"
 *  9   ->  "(9|1[0-8]) uses"
 *  18  ->  "(18) uses"
 *
 * @param settings - Settings instance that contains input value
 * @returns Regex as string, null on failure
 *
 */
function generateUsesRemainingRegex(
  settings: Settings["tablet"]["modifier"],
): string | null {
  const n = settings.numUsesRemaining;
  if (n < 1 || n > 18) {
    return null;
  }

  let numberRegex: string;
  if (n === 18) {
    numberRegex = "(18)";
  } else if (n < 10) {
    /* single digit n..9, or 10-18 */
    numberRegex = `(${n === 9 ? "9" : `[${n}-9]`}|1[0-8])`;
  } else {
    /* 10-18 */
    numberRegex = `(1[${n % 10}-8])`;
  }

  return `"${numberRegex} us"`;
}
