import {Settings} from "@/app/settings.ts";

export function generateVendorRegex(settings: Settings): string {
  const terms = [
    ...itemProperty(settings.vendor.itemProperty),
    itemType(settings.vendor.itemType),
    resistances(settings.vendor.resistances),
    movement(settings.vendor.movementSpeed),
    ...weaponMods(settings.vendor.weaponMods),
    settings.vendor.resultSettings.customText || null,
  ].filter((e) => e !== null && e !== "")

  return terms.length > 0 ? `"${terms.join("|")}"` : "";
}


function itemProperty(settings: Settings["vendor"]["itemProperty"]): string[] {
  return [
    settings.quality ? "ity: \\d+" : null,
    settings.sockets ? "ts: s" : null,
  ].filter((e) => e !== null)
}

function itemType(settings: Settings["vendor"]["itemType"]): string | null {
  const types = [
    settings.rare ? "r" : null,
    settings.magic ? "m" : null,
    settings.normal ? "n" : null,
  ].filter((e) => e !== null);

  if (types.length === 0 || types.length === 3) return null;
  if (types.length > 1) return `e: (${types.join("|")})`
  return `e: ${types.join("|")}`;
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
  if (res.length > 1) return`(${res.join("|")}).+res`;

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

  let numOfSelected = move0.length + move5.length;
  if (numOfSelected === 0) return null;
  if (numOfSelected === 1) return `${[move0, move5].join("")}% mov`;
  if (numOfSelected === 5) return `\\d+ mov`;

  const zeros = move0.length > 1 ?
    `[${move0.map((e) => e[0]).join("")}]0`
    : move0.join("|");
  const fives = move5.length > 1 ?
    `[${move5.map((e) => e[0]).join("")}]5`
    : move5.join("|");
  return `(${[zeros, fives].filter((e) => e !== null && e !== "").join("|")})% mov`;
}

function weaponMods(settings: Settings["vendor"]["weaponMods"]): string[] {
  return [
    settings.physical ? "phys" : null,
    settings.elemental ? "ele" : null,
    settings.skillLevel ? "skills" : null,
  ].filter((e) => e !== null)
}