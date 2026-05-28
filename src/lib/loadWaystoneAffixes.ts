import { WaystoneRegex } from "@/types/generated/WaystoneTypedef.ts";
import { parseAffixToken, ParsedAffix } from "@/lib/parseAffixToken.ts";

export interface WaystoneAffix extends ParsedAffix {
  prefix: boolean,
}

let cache: Promise<WaystoneAffix[]> | null = null;

export function loadWaystoneAffixes(): Promise<WaystoneAffix[]> {
  if (!cache) {
    cache = fetch("/generated/Generated.Waystone.min.json")
      .then((r) => r.json() as Promise<WaystoneRegex>)
      .then((json) =>
        json.tokens
          .map((token) => ({
            ...parseAffixToken(token),
            prefix: token.options.prefix,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
  }
  return cache;
}
