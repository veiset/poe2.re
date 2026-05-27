export interface WaystoneAffix {
  id: number,
  name: string,
  regex: string,
  values: number[],
  ranges: number[][],
  prefix: boolean,
}

interface WaystoneJsonToken {
  id: number,
  regex: string,
  rawText: string,
  generalizedText: string,
  options: {
    prefix: boolean,
    tags: string[],
  },
}

interface WaystoneJson {
  tokens: WaystoneJsonToken[],
}

function parseToken(token: WaystoneJsonToken): WaystoneAffix {
  const ranges: number[][] = [];
  const values: number[] = [];

  const lines = token.rawText.split("\n");
  const processed = lines.map((line) => {
    let out = line;
    out = out.replace(/\(([+-]?\d+)-([+-]?\d+)\)/g, (_match, a, b) => {
      ranges.push([Number(a), Number(b)]);
      return "##";
    });
    out = out.replace(/(?<![A-Za-z0-9])\+?(\d+)(?![A-Za-z0-9])/g, (_match, n) => {
      values.push(Number(n));
      return "#";
    });
    out = out.replace(/\[([^\]]+)\]/g, "$1");
    return out;
  });

  return {
    id: token.id,
    name: processed.join("|"),
    regex: token.regex,
    values,
    ranges,
    prefix: token.options.prefix,
  };
}

let cache: Promise<WaystoneAffix[]> | null = null;

export function loadWaystoneAffixes(): Promise<WaystoneAffix[]> {
  if (!cache) {
    cache = fetch("/generated/Generated.Waystone.json")
      .then((r) => r.json() as Promise<WaystoneJson>)
      .then((json) =>
        json.tokens
          .map(parseToken)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
  }
  return cache;
}
