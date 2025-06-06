export interface WaystoneRegex {
  name: string,
  regex: string,
  values: number[],
  ranges: number[][],
  affix: string,
}
export const waystoneRegex: WaystoneRegex[] = [
{
  name: "##% increased Experience gain",
  regex: "xper",
  values: [],
  ranges: [[25, 40]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Gold found in this Area",
  regex: "gol",
  values: [],
  ranges: [[55, 150]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Magic Monsters",
  regex: "gic m",
  values: [],
  ranges: [[35, 100]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Magic Pack Size",
  regex: "gic p",
  values: [],
  ranges: [[35, 100]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Monster Damage",
  regex: "mage$",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "##% increased Monster Movement Speed|##% increased Monster Attack Speed|##% increased Monster Cast Speed",
  regex: "mov",
  values: [],
  ranges: [[16, 30], [21, 35], [21, 35]],
  affix: "SUFFIX",
}, 
{
  name: "##% increased Pack size",
  regex: "d pac",
  values: [],
  ranges: [[21, 50]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Quantity of Items found in this Area|##% increased Rarity of Items found in this Area",
  regex: "uan",
  values: [],
  ranges: [[10, 29], [18, 35]],
  affix: "PREFIX",
}, 
{
  name: "##% increased Rarity of Items found in this Area",
  regex: "ms",
  values: [],
  ranges: [[50, 100]],
  affix: "PREFIX",
}, 
{
  name: "##% increased amount of Chests",
  regex: "f che",
  values: [],
  ranges: [[60, 100]],
  affix: "PREFIX",
}, 
{
  name: "##% increased amount of Magic Chests",
  regex: "f mag",
  values: [],
  ranges: [[30, 100]],
  affix: "PREFIX",
}, 
{
  name: "##% increased amount of Rare Chests",
  regex: "t of r",
  values: [],
  ranges: [[25, 65]],
  affix: "PREFIX",
}, 
{
  name: "##% increased number of Monster Packs",
  regex: "ks$",
  values: [],
  ranges: [[25, 35]],
  affix: "PREFIX",
}, 
{
  name: "##% increased number of Rare Monsters",
  regex: "r of r",
  values: [],
  ranges: [[25, 65]],
  affix: "PREFIX",
}, 
{
  name: "##% maximum Player Resistances",
  regex: "% ma",
  values: [],
  ranges: [[-15, 10]],
  affix: "SUFFIX",
}, 
{
  name: "##% more Monster Life",
  regex: "fe$",
  values: [],
  ranges: [[30, 79]],
  affix: "SUFFIX",
}, 
{
  name: "#% less effect of Curses on Monsters",
  regex: "ses",
  values: [75],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "+#% Monster Elemental Resistances",
  regex: "r el",
  values: [50, 40, 30],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Area contains # additional Rare Chests",
  regex: "l ra",
  values: [4, 3, 2],
  ranges: [],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional Magic Chests",
  regex: "l ma",
  values: [],
  ranges: [[3, 8]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Beasts",
  regex: "asts",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Bramble Monsters",
  regex: "f br",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Ezomyte Monsters",
  regex: "yt",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Faridun Monsters",
  regex: "un m",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Iron Guards",
  regex: "ds",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Plagued Monsters",
  regex: "agu",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Transcended Monsters",
  regex: "ans",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Undead",
  regex: "ndea",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains ## additional packs of Vaal Monsters",
  regex: "aa",
  values: [],
  ranges: [[8, 20]],
  affix: "PREFIX",
}, 
{
  name: "Area contains an additional Essence",
  regex: "sse",
  values: [],
  ranges: [],
  affix: "PREFIX",
}, 
{
  name: "Area contains an additional Shrine",
  regex: "shr",
  values: [],
  ranges: [],
  affix: "PREFIX",
}, 
{
  name: "Area contains an additional Strongbox",
  regex: "gb",
  values: [],
  ranges: [],
  affix: "PREFIX",
}, 
{
  name: "Area has patches of Chilled Ground",
  regex: "hil",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Area has patches of Ignited Ground",
  regex: "ited",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Area has patches of Shocked Ground",
  regex: "cke",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monster Damage Penetrates #% Elemental Resistances",
  regex: "tes",
  values: [25, 20, 15],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters Break Armour equal to #% of Physical Damage dealt",
  regex: "eq",
  values: [50, 35, 20],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters are Armoured",
  regex: "oure",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters are Evasive",
  regex: "vas",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters deal ##% of Damage as Extra Chaos",
  regex: "ra ch",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters deal ##% of Damage as Extra Cold",
  regex: "cold",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters deal ##% of Damage as Extra Fire",
  regex: "fire$",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters deal ##% of Damage as Extra Lightning",
  regex: "tn",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters fire # additional Projectiles",
  regex: "oj",
  values: [2],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters gain #% of maximum Life as Extra maximum Energy Shield",
  regex: "m li",
  values: [25],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have ##% increased Ailment Threshold|Monsters have ##% increased Stun Threshold",
  regex: "lm",
  values: [],
  ranges: [[50, 99], [50, 99]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have ##% increased Critical Hit Chance|+##% to Monster Critical Damage Bonus",
  regex: "bon",
  values: [],
  ranges: [[160, 400], [31, 45]],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% chance to Bleed on Hit",
  regex: "blee",
  values: [25],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% chance to Poison on Hit",
  regex: "ois",
  values: [40],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% chance to steal Power, Frenzy and Endurance charges on Hit",
  regex: "r,",
  values: [25],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% increased Accuracy Rating",
  regex: "cc",
  values: [50, 40, 30],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% increased Area of Effect",
  regex: "ect$",
  values: [50],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% increased Freeze Buildup|Monsters have #% increased Ignite Chance|Monsters have #% increased Shock Chance",
  regex: "eez",
  values: [200, 200, 200, 150, 150, 150, 100, 100, 100],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters have #% increased Stun Buildup",
  regex: "un b",
  values: [200, 150, 100],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Monsters take ##% reduced Extra Damage from Critical Hits",
  regex: "tak",
  values: [],
  ranges: [[26, 40]],
  affix: "SUFFIX",
}, 
{
  name: "Players are Cursed with Elemental Weakness",
  regex: "h el",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Players are Cursed with Enfeeble",
  regex: "ble$",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Players are Cursed with Temporal Chains",
  regex: "h tem",
  values: [],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Players gain #% reduced Flask Charges",
  regex: "sk",
  values: [50, 40, 30],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Players have #% less Cooldown Recovery Rate",
  regex: "wn",
  values: [50, 40, 30],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Players have #% less Recovery Rate of Life and Energy Shield",
  regex: "f l",
  values: [60, 50, 40],
  ranges: [],
  affix: "SUFFIX",
}, 
{
  name: "Rare Monsters have # additional Modifier",
  regex: "mod",
  values: [1],
  ranges: [],
  affix: "PREFIX",
}]