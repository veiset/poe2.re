import {Settings} from "@/app/settings.ts";

export function generateVendorRegex(settings: Settings): string {
  const terms = [
    ...itemProperty(settings.vendor.itemProperty),
    itemType(settings.vendor.itemType),
    resistances(settings.vendor.resistances),
    movement(settings.vendor.movementSpeed),
    ...weaponMods(settings.vendor.weaponMods),
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

  return res.join("|")
}

function movement(settings: Settings["vendor"]["movementSpeed"]): string | null {
  const move = [
    settings.move30 ? "30ms" : null,
    settings.move25 ? "25ms" : null,
    settings.move20 ? "20ms" : null,
    settings.move15 ? "15ms" : null,
    settings.move10 ? "10ms" : null,
  ].filter((e) => e !== null)

  return move.join("|")
}

function weaponMods(settings: Settings["vendor"]["weaponMods"]): string[] {
  return [
    settings.physical ? "phys" : null,
    settings.elemental ? "ele" : null,
    settings.skillLevel ? "skill" : null,
  ].filter((e) => e !== null)
}