import {ItemBasetype} from "@/types/generated/ItemBasetypesTypedef.ts";
import {ItemRegex} from "@/types/generated/ItemTypedef.ts";

let basetypesCache: Promise<ItemBasetype[]> | null = null;
let itemRegexCache: Promise<ItemRegex[]> | null = null;

export function loadItemBasetypes(): Promise<ItemBasetype[]> {
  if (!basetypesCache) {
    basetypesCache = fetch("/generated/Generated.Basetypes.Item.json")
      .then((r) => r.json() as Promise<ItemBasetype[]>);
  }
  return basetypesCache;
}

export function loadItemRegex(): Promise<ItemRegex[]> {
  if (!itemRegexCache) {
    itemRegexCache = fetch("/generated/Generated.Item.json")
      .then((r) => r.json() as Promise<ItemRegex[]>);
  }
  return itemRegexCache;
}
