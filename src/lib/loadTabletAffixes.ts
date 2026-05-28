import { TabletRegex } from "@/types/generated/TabletTypedef.ts";
import { parseAffixToken, ParsedAffix } from "@/lib/parseAffixToken.ts";

export type TabletAffix = ParsedAffix;

let cache: Promise<TabletAffix[]> | null = null;

export function loadTabletAffixes(): Promise<TabletAffix[]> {
  if (!cache) {
    cache = fetch("/generated/Generated.Tablet.min.json")
      .then((r) => r.json() as Promise<TabletRegex>)
      .then((json) =>
        json.tokens
          .map(parseAffixToken)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
  }
  return cache;
}
