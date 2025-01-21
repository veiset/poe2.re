import {Settings} from "@/app/settings.ts";

/**
 * Generates tablet regex toi be pasted in PoE2
 * 
 * Generates regex for:
 *  rarity, league mechanic, affected maps
 *
 * @param settings - Settings instance that contains input values
 * @returns Regex as string
 *
 */
export function generateTabletRegex(settings: Settings): string {

  const result = [
    generateRarityRegex(settings.tablet.rarity),
    generateTypeRegex(settings.tablet.type),
    settings.tablet.modifier.affectedMaps ? generateAffectedMapsRegex(settings.tablet.modifier) : null,
    settings.tablet.resultSettings.customText || null,
  ].filter((e) => e !== null);

  if (result.length === 0) return "";
  return result.join(" ").trim();
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
function generateRarityRegex(settings: Settings["tablet"]["rarity"]): string | null {
  if ((settings.normal && settings.magic) ||
      (!settings.normal && !settings.magic)){
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
function generateTypeRegex(settings: Settings["tablet"]["type"]): string | null {
  if ((settings.breach && settings.delirium && settings.irradiated &&
       settings.expedition && settings.ritual && settings.overseer) ||
      (!settings.breach && !settings.delirium && !settings.irradiated &&
       !settings.expedition && !settings.ritual && !settings.overseer)) {
    return null;
  }
  
  const breachRegex = settings.breach ? "eac" : "";
  const deliriumRegex = settings.delirium ? "liri" : "";
  const irradiatedRegex = settings.irradiated ? "rra" : "";
  const expeditionRegex = settings.expedition ? "xped" : "";
  const ritualRegex = settings.ritual ? "tual" : "";
  const overseerRegex = settings.overseer ? "eer" : "";
  const result = [breachRegex, deliriumRegex, irradiatedRegex,
                  expeditionRegex, ritualRegex, overseerRegex]
    .filter((e) => e.length > 0)
    .join("|");
  
  if (result.length === 0) return null;
  if (result.length === 1) return `"${result}"`;
  if (result.length > 1) return `"(${result})"`;
  return null;
}

/**
 * Generates a regex that matches all numbers greater or equal the
 * given limit. The maximum of affected maps is 10.
 *
 * Includes some rudimentary length optimization to generate short regex
 * due to the 50 character limits of the PoE search.
 * 
 * Example regex:
 *  2   ->  "([2-9]|10)\\D{7}n Ra"
 *  9   ->  "(9|10)\\D{7}n Ra"
 *  10  ->  "(10)\\D{7}n Ra"
 *  
 *
 * @param settings - Settings instance that contains input value
 * @returns Regex as string, null on failure
 *
 */
function generateAffectedMapsRegex(settings: Settings["tablet"]["modifier"]): string | null {
  if (settings.numAffectedMaps < 1 || settings.numAffectedMaps > 10) {
    return null;
  }

  let regex = "\"";
  if(settings.numAffectedMaps === 10) {
    regex += "(10)"
  }
  else
  {
    regex += "(" + ((settings.numAffectedMaps === 9) ? "9" : `[${settings.numAffectedMaps}-9]`) + "|10)"
  }
  
  regex += "\\D{7}n Ra\"";
  return regex;
}

