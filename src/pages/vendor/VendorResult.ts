import {Settings} from "@/app/settings.ts";

export function generateVendorRegex(settings: Settings): string {
  const terms = [
    ...itemProperty(settings.vendor.itemProperty),
    itemType(settings.vendor.itemType),
    resistances(settings.vendor.resistances),
    movement(settings.vendor.movementSpeed),
    ...itemMods(settings.vendor.itemMods),
    settings.vendor.resultSettings.customText || null,
    itemClass(settings.vendor.itemClass),
  ].filter((e) => e !== null && e !== "")

  return terms.length > 0 ? `"${terms.join("|")}"` : "";
}


function itemProperty(settings: Settings["vendor"]["itemProperty"]): (string | null)[] {
  return [
    settings.quality ? "y: \\+" : null,
    settings.sockets ? "ts: S" : null,
  ].filter((e) => e !== null)
}

function itemType(settings: Settings["vendor"]["itemType"]): string | null {
  const types = [
    settings.rare ? "r" : null,
    settings.magic ? "m" : null,
    settings.normal ? "n" : null,
  ].filter((e) => e !== null);

  if (types.length === 0 || types.length === 3) return null;
  if (types.length > 1) return `y: (${types.join("|")})`
  return `y: ${types.join("|")}`;
}

function resistances(settings: Settings["vendor"]["resistances"]): string | null {
  const res = [
    settings.fire ? "fi" : null,
    settings.cold ? "co" : null,
    settings.lightning ? "li" : null,
    settings.chaos ? "ch" : null,
  ].filter((e) => e !== null);

  if (res.length === 0) return null;
  if (res.length === 4) return `resi`;
  if (res.length > 1) return `(${res.join("|")}).+res`;

  return `${res.join("|")}.+res`

}

function movement(settings: Settings["vendor"]["movementSpeed"]): string | null {
  const move0 = [
    settings.move30 ? "30" : null,
    settings.move20 ? "20" : null,
    settings.move10 ? "10" : null,
  ].filter((e) => e !== null)
  const move5 = [
    settings.move25 ? "25" : null,
    settings.move15 ? "15" : null,
  ].filter((e) => e !== null)

  const numOfSelected = move0.length + move5.length;
  if (numOfSelected === 0) return null;
  if (numOfSelected === 1) return `${[move0, move5].join("")}% i.+mov`;
  if (numOfSelected === 5) return `\\d+% i.+mov`;

  const zeros = move0.length > 1 ?
    `[${move0.map((e) => e[0]).join("")}]0`
    : move0.join("|");
  const fives = move5.length > 1 ?
    `[${move5.map((e) => e[0]).join("")}]5`
    : move5.join("|");
  return `(${[zeros, fives].filter((e) => e !== null && e !== "").join("|")})% i.+mov`;
}

function itemMods(settings: Settings["vendor"]["itemMods"]): (string | null)[] {
  return [
    settings.physical ? "ph.*da" : null,
    settings.elemental ? "\\d [cfl].+da" : null,
    settings.skillLevel ? "^\\+.*ills$" : null,
    settings.spirit ? "spiri" : null,
    settings.rarity ? "d rari" : null,
  ].filter((e) => e !== null)
}

function itemClass(settings: Settings["vendor"]["itemClass"]): string | null {
  const itemClasses = [
    settings.amulets ? "am" : null,
    settings.rings ? "ri" : null,
    settings.belts ? "be" : null,
    settings.daggers ? "da" : null,
    settings.wands ? "wa" : null,
    settings.oneHandMaces ? "on" : null,
    settings.sceptres ? "sc" : null,
    settings.bows ? "bow" : null,
    settings.staves ? "st" : null,
    settings.twoHandMaces ? "tw" : null,
    settings.quarterstaves ? "qua" : null,
    settings.crossbows ? "cr" : null,
    settings.gloves ? "gl" : null,
    settings.boots ? "boo" : null,
    settings.bodyArmours ? "bod" : null,
    settings.helmets ? "he" : null,
    settings.quivers ? "qui" : null,
    settings.foci ? "fo" : null,
    settings.shields ? "sh" : null,
  ].filter((e) => e !== null);

  if (itemClasses.length === 0) return null;
  if (itemClasses.length === 1) return `s: ${itemClasses.join("")}`
  return `s: (${itemClasses.join("|")})`;
}