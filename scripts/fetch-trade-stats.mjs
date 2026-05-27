/**
 * Fetches PoE2 trade stats and matches them to map mod entries.
 *
 * Sources:
 *   public/generated/Generated.Waystone.json
 *   public/generated/Generated.Tablet.json
 *
 * Outputs (keyed by the source token `id`):
 *   public/generated/trade/WaystoneTradeStatIds.json
 *   public/generated/trade/TabletTradeStatIds.json
 *
 * Run with: npm run fetch-trade-stats
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STATS_API_URL = "https://www.pathofexile.com/api/trade2/data/stats";
const WAYSTONE_FILE = path.join(__dirname, "../public/generated/Generated.Waystone.json");
const TABLET_FILE = path.join(__dirname, "../public/generated/Generated.Tablet.json");
const OUTPUT_DIR = path.join(__dirname, "../public/generated/trade");
const WAYSTONE_OUTPUT = path.join(OUTPUT_DIR, "WaystoneTradeStatIds.json");
const TABLET_OUTPUT = path.join(OUTPUT_DIR, "TabletTradeStatIds.json");

function normalizeText(text, aggressive = false) {
  let out = text
    .toLowerCase()
    .replace(/\^|\$/g, "")
    .replace(/\([^)]*\)/g, "#")
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/\+/g, "")
    // Any numeric value (#, ##, raw integers, with optional %) → NUM.
    .replace(/\b\d+%?\b/g, "NUM")
    .replace(/##?%?/g, "NUM")
    .replace(/\bnum\b/gi, "NUM");
  // The Map/Area/Your Maps trio all refer to the same surface — collapse to "map"
  // *first* so the locative strip below treats "in Map" and "in Area" identically.
  out = out
    .replace(/\byour maps?\b/g, "map")
    .replace(/\bareas?\b/g, "map")
    .replace(/\bmaps\b/g, "map")
    // Mid-sentence locative "… in Map <more text>" — the trade phrasing usually omits
    // it (e.g. "Monsters in Map have …" → "Monsters have …"). Only strip it when
    // followed by more words; a *trailing* locative is kept because it distinguishes
    // map-scoped stats ("Rarity found in your Maps") from the bare item stat
    // ("Rarity found").
    .replace(/\bin map (?=\S)/g, " ")
    // "Map which contains X have …" (a conditional trade phrasing) is the same mod a
    // tablet states plainly as "Map has …".
    .replace(/\bmap which contains? \w+ (?:have|has)\b/g, "map has")
    // Verb agreement so unified "map" reads consistently regardless of source plurality.
    .replace(/\bmap contain\b/g, "map contains")
    .replace(/\bmap have\b/g, "map has")
    .replace(/\bmap are\b/g, "map is")
    .replace(/\bmap spawn\b/g, "map spawns")
    .replace(/\bmap allow\b/g, "map allows")
    .replace(/\bmap dissipate\b/g, "map dissipates")
    .replace(/\ban additional\b/g, "NUM additional")
    .replace(/\ba additional\b/g, "NUM additional");

  if (aggressive) {
    // Last-resort loosening, only tried after every precise match fails: drop the
    // trailing locative and the "Expedition" qualifier the trade site sometimes omits.
    out = out
      .replace(/\bin map\b/g, " ")
      .replace(/\bexpedition\b/g, " ");
  }

  return out
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function depluralize(text) {
  return text.replace(/([^s])s(?=\s|$)/g, "$1");
}

// mode: "exact" → equality only; "fuzzy" → +chance/polarity/containment heuristics;
// "aggressive" → equality after dropping locative + Expedition qualifier.
function textsMatch(modText, tradeText, mode) {
  if (mode === "aggressive") {
    const normMod = normalizeText(modText, true);
    const normTrade = normalizeText(tradeText, true);
    return (
      normMod === normTrade ||
      depluralize(normMod) === depluralize(normTrade)
    );
  }

  const normMod = normalizeText(modText);
  const normTrade = normalizeText(tradeText);

  if (normMod === normTrade) return true;
  if (depluralize(normMod) === depluralize(normTrade)) return true;

  if (mode === "exact") return false;

  const tradeWithoutChance = normTrade
    .replace(/monsters have NUM chance to have a /i, "monsters have ")
    .replace(/monsters have NUM chance to /i, "monsters ")
    .replace(/players have NUM chance to be /i, "players are ")
    .replace(/players have NUM chance to /i, "players ");
  if (normMod === tradeWithoutChance) return true;
  if (depluralize(normMod) === depluralize(tradeWithoutChance)) return true;

  const modWithChance = normMod.replace(/^monsters /, "monsters have NUM chance to ");
  if (modWithChance === normTrade) return true;

  // The trade stat for a mod is the same regardless of which polarity the tablet
  // rolls (e.g. "dissipates slower" and "dissipates faster" share one stat).
  const modPositive = normMod
    .replace(/ less /g, " more ")
    .replace(/ reduced /g, " increased ")
    .replace(/\bslower\b/g, "faster");
  if (modPositive === normTrade) return true;
  if (depluralize(modPositive) === depluralize(normTrade)) return true;

  if (normMod.includes(normTrade) || normTrade.includes(normMod)) {
    const ratio =
      Math.min(normMod.length, normTrade.length) /
      Math.max(normMod.length, normTrade.length);
    if (ratio > 0.7) return true;
  }
  return false;
}

async function fetchExplicitStats() {
  console.log(`Fetching trade stats from ${STATS_API_URL}...`);
  const response = await fetch(STATS_API_URL, {
    headers: { "User-Agent": "poe2.re/1.0 (https://poe2.re)" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const explicit = data.result.find((g) => g.id === "explicit");
  if (!explicit) throw new Error("No 'explicit' group in trade stats");
  console.log(`Found ${explicit.entries.length} explicit stats`);
  return explicit.entries;
}

function loadTokens(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return data.tokens;
}

function modClauses(token) {
  // Each token may carry several clauses (multi-line mods). Split by both newline
  // and pipe so each one gets matched independently against the trade stats.
  const source = token.rawText || token.generalizedText || "";
  return source
    .split(/[\n|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function findStatForToken(token, tradeStats) {
  const clauses = modClauses(token);

  // Try the tiers in order of strictness so a precise match always wins over a
  // looser one: exact → fuzzy → aggressive (locative/qualifier dropped). Each tier
  // scans every stat before the next tier runs, and within a tier clauses are tried
  // last-to-first (the trailing clause is usually the most distinguishing).
  for (const mode of ["exact", "fuzzy", "aggressive"]) {
    for (let i = clauses.length - 1; i >= 0; i--) {
      for (const stat of tradeStats) {
        if (textsMatch(clauses[i], stat.text, mode)) {
          return { stat, clause: clauses[i] };
        }
      }
    }
  }
  return null;
}

function buildMapping(label, tokens, tradeStats) {
  const mapping = {};
  const unmatched = [];
  for (const token of tokens) {
    const found = findStatForToken(token, tradeStats);
    if (found) {
      mapping[String(token.id)] = found.stat.id;
    } else {
      unmatched.push(token);
    }
  }
  const matched = Object.keys(mapping).length;
  console.log(`\n[${label}] Matched: ${matched}/${tokens.length} (${((matched / Math.max(tokens.length, 1)) * 100).toFixed(1)}%)`);
  if (unmatched.length > 0) {
    console.log(`[${label}] Unmatched:`);
    for (const t of unmatched) {
      console.log(`  - id=${t.id}: ${t.rawText.replace(/\n/g, " / ").slice(0, 100)}`);
    }
  }
  return mapping;
}

function writeJson(filePath, mapping) {
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2) + "\n", "utf-8");
  console.log(`Output: ${filePath}`);
}

async function main() {
  const waystoneTokens = loadTokens(WAYSTONE_FILE);
  console.log(`Parsed ${waystoneTokens.length} waystone tokens`);
  const tabletTokens = loadTokens(TABLET_FILE);
  console.log(`Parsed ${tabletTokens.length} tablet tokens`);

  const stats = await fetchExplicitStats();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  writeJson(WAYSTONE_OUTPUT, buildMapping("waystone", waystoneTokens, stats));
  writeJson(TABLET_OUTPUT, buildMapping("tablet", tabletTokens, stats));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
