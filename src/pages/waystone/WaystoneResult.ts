import {Settings} from "@/app/settings.ts";

export function generateWaystoneRegex(settings: Settings): string {

  const result = [
    generateTierRegex(settings.waystone.tier),
    generateModifiers(settings.waystone.modifier),
    settings.waystone.resultSettings.customText || null,
  ].filter((e) => e !== null);

  if (result.length === 0) return "";
  return result.join(" ").trim();
}


function generateTierRegex(settings: Settings["waystone"]["tier"]): string | null {
  if (settings.max === 0 && settings.min === 0) return null
  if (settings.max !== 0 && settings.min > settings.max) return null;
  if (settings.min < 0 || settings.max < 0) return null;
  if (settings.min <= 1 && settings.max === 15) return null;

  const max = settings.max === 0 ? 15 : settings.max;
  const min = settings.min;

  const numbersUnder10 = range(min, Math.min(10, max + 1));
  const numbersOver10 = range(Math.max(10, min), max + 1);

  const regexUnder10 = numbersUnder10.length <= 1 ? `${numbersUnder10.join("")}` :
    numbersUnder10.length > 2 ? `[${numbersUnder10[0]}-${numbersUnder10[numbersUnder10.length - 1]}]` : `[${numbersUnder10.join("")}]`;

  const regexOver10 = numbersOver10.length <= 1 ? `${numbersOver10.join("")}` : `1[${numbersOver10.map((e) => e.toString()[1]).join("")}]`;

  const under10 = regexUnder10 === "" ? "" : `r ${regexUnder10}\\)`
  const over10 = regexOver10 === "" ? "" : `${regexOver10}\\)`
  const result = [under10, over10].filter((e) => e !== "").join("|");
  return result === "" ? "" : `"${result}"`
}

function generateModifiers(settings: Settings["waystone"]["modifier"]): string | null {
  const goodMods = [
    settings.dropOver200 ? ": \\+[2-9]\\d\\d" : null,
    settings.quant50 ? "[5-9]\\d+\\D{12}q" : null,
    settings.rarity50 ? "[5-9]\\d+\\D{12}r" : null,
    settings.experience50 ? "[5-9]\\d+\\D{12}ex" : null,
    settings.rareMonsters50 ? "[5-9]\\d+\\D{22}r" : null,
    settings.monsterPack50 ? "[5-9]\\d+\\D{22}m" : null,
    settings.packSize50 ? "[5-9]\\d+\\D{12}m" : null,
    settings.additionalEssence ? "sen" : null,
    settings.delirious ? "delir" : null,
  ].filter((e) => e !== null).join("|");

  const badMods = [
    settings.burningGround ? "f bur" : null,
    settings.shockedGround ? "ho" : null,
    settings.chilledGround ? "lled" : null,
    settings.eleWeak ? "l wea" : null,
    settings.lessRecovery ? "s r" : null,
    settings.pen ? "pene" : null,
  ].filter((e) => e !== null).join("|");

  return [
    goodMods.length > 0 ? `"${goodMods}"` : null,
    badMods.length > 0 ? `"!${badMods}"` : null,
  ].join(" ");
}

function range(start: number, end: number): number[] {
  if (end - start <= 0) return [];
  return [...Array((end - start)).keys()].map(i => i + start);
}

