export interface TabletAffix {
  name: string,
  regex: string,
  values: number[],
  ranges: number[][],
}

interface TabletJsonToken {
  id: number,
  regex: string,
  rawText: string,
  generalizedText: string,
  options: {
    prefix: boolean,
    tags: string[],
  },
}

interface TabletJson {
  tokens: TabletJsonToken[],
}

function parseToken(token: TabletJsonToken): TabletAffix {
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
    name: processed.join("|"),
    regex: token.regex,
    values,
    ranges,
  };
}

let cache: Promise<TabletAffix[]> | null = null;

export function loadTabletAffixes(): Promise<TabletAffix[]> {
  if (!cache) {
    cache = fetch("/generated/Generated.Tablet.json")
      .then((r) => r.json() as Promise<TabletJson>)
      .then((json) =>
        json.tokens
          .map(parseToken)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
  }
  return cache;
}
