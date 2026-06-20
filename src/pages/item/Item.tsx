import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, ItemSettings, SelectedItemMod} from "@/app/settings.ts";
import {useEffect, useMemo, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {loadItemBasetypes, loadItemRegex} from "@/lib/loadItemData.ts";
import {
  Itembase,
  ItemModifier,
  ItemRegex,
  ItemRegexCategory,
  Rarity,
} from "@/types/generated/ItemTypedef.ts";
import {ItemBasetype} from "@/types/generated/ItemBasetypesTypedef.ts";
import {generateMagicItemRegex, generateRareItemRegex} from "@/pages/item/ItemResult.ts";
import {cn} from "@/lib/utils.ts";

export function Item() {
  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const globalSettings = loadSettings(initialProfile);
  const [settings, setSettings] = useState<ItemSettings>(globalSettings.item);
  const [result, setResult] = useState("");

  const [basetypes, setBasetypes] = useState<ItemBasetype[]>([]);
  const [allItemRegex, setAllItemRegex] = useState<ItemRegex[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadItemBasetypes().then(setBasetypes);
    loadItemRegex().then(setAllItemRegex);
  }, []);

  const searchItems = useMemo(() => {
    return basetypes.flatMap((base) =>
      base.item.map((item) => ({baseType: base.base, item}))
    );
  }, [basetypes]);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (q === "") return [];
    return searchItems.filter(
      (e) =>
        e.item.toLowerCase().includes(q) ||
        e.baseType.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [searchText, searchItems]);

  const currentItemRegex = useMemo(() => {
    if (!settings.itemBase) return undefined;
    return allItemRegex.find((e) => e.basetype === settings.itemBase!.baseType);
  }, [settings.itemBase, allItemRegex]);

  const affixMap: Record<string, ItemModifier> = useMemo(() => {
    if (!allItemRegex.length) return {};
    return allItemRegex
      .flatMap((item) =>
        item.itemRegexForCategory.flatMap((cat) =>
          cat.modifiers.map((mod) => ({
            key: `${item.basetype}-${cat.modCategory}-${mod.description}`,
            value: mod,
          }))
        )
      )
      .reduce<Record<string, ItemModifier>>((acc, {key, value}) => {
        acc[key] = value;
        return acc;
      }, {});
  }, [allItemRegex]);

  // Save settings and generate result
  useEffect(() => {
    const base = loadSettings(currentProfile);
    const settingsResult = {...base, item: {...settings}, name: currentProfile};
    saveSettings(settingsResult);

    if (settings.itemBase && settings.itemBase.rarity === "Rare") {
      setResult(generateRareItemRegex(settings));
    } else if (settings.itemBase && settings.itemBase.rarity === "Magic") {
      setResult(generateMagicItemRegex(settings));
    } else {
      setResult("");
    }
  }, [settings, affixMap]);

  useEffect(() => {
    const gs = loadSettings(currentProfile);
    setSettings(gs.item);
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  const setItemBase = (itemBase: Itembase) => {
    setSettings({...settings, itemBase});
    setSearchText("");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Header name="Item Regex"></Header>
        <div className="page-header-profile pr-4">
          <ProfileSelector currentProfile={currentProfile} setCurrentProfile={setCurrentProfile}/>
        </div>
      </div>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 sticky top-0 z-10 shadow-md">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.item)}
          customText={""}
          autoCopy={false}
          setCustomText={() => {}}
          setAutoCopy={() => {}}
        />
      </div>
      <div className="flex grow bg-muted/30 flex-1 flex-col gap-2 p-4">
        {/* Item base selector */}
        <div className="bg-gray-700 border border-gray-500 rounded-sm p-4 shadow-sm">
          <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 uppercase tracking-wider">Select item base</p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for item..."
              className="mb-1 h-10 w-full max-w-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {filteredItems.length > 0 && (
              <div className="absolute z-10 w-full max-w-sm bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredItems.map((item, i) => (
                  <div
                    key={`${item.baseType}-${item.item}-${i}`}
                    className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                    onClick={() =>
                      setItemBase({
                        baseType: item.baseType,
                        item: item.item,
                        rarity: "Rare",
                      })
                    }
                  >
                    {item.baseType} - {item.item}
                  </div>
                ))}
              </div>
            )}
          </div>
          {settings.itemBase && (
            <p className="text-md pt-4">
              Selected: <span className="font-semibold text-yellow-500">{settings.itemBase.item}</span>
              <span className="text-muted-foreground"> ({settings.itemBase.baseType})</span>
            </p>
          )}

          {/* Warnings */}
          {currentItemRegex && settings.itemBase?.rarity === "Rare" && (
            <div className="mt-4">
              <ModWarnings itemRegex={currentItemRegex}/>
            </div>
          )}

          {/* Rare item settings */}
          {settings.itemBase && currentItemRegex && settings.itemBase.rarity === "Rare" && (
            <div className="pt-2 mt-4">
              <p className="text-xs font-medium text-sidebar-foreground/70 pb-4 uppercase tracking-wider">Rare mod matching</p>
              <RadioGroup
                value={
                  settings.rareSettings.matchAnyMod
                    ? "any"
                    : "all"
                }
                onValueChange={(v) => {
                  setSettings({
                    ...settings,
                    rareSettings: {
                      matchAnyMod: v === "any",
                    },
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="rare-mods-all"/>
                  <Label htmlFor="rare-mods-all">
                    <span className="text-lg cursor-pointer">Match if only <span className="font-semibold">ALL</span> mods are found</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="rare-mods-any"/>
                  <Label htmlFor="rare-mods-any">
                    <span className="text-lg cursor-pointer">Match if <span className="font-semibold">ANY</span> mod is found</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {settings.itemBase && currentItemRegex && settings.itemBase.rarity === "Rare" && (
          <RareItemSelect
            itemRegex={currentItemRegex}
            itemBase={settings.itemBase}
            selected={settings.selectedMods}
            setSelected={(mods) => setSettings({...settings, selectedMods: mods})}
          />
        )}

        {/* Rarity selector hidden as per request */}

        {/* Magic item settings */}
        {settings.itemBase && currentItemRegex && settings.itemBase.rarity === "Magic" && (
          <div className="bg-muted/30 border rounded-lg p-4 shadow-sm">
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-4 uppercase tracking-wider">Magic mod matching</p>
            <RadioGroup
              value={
                settings.magicSettings.matchOpenAffix
                  ? "open"
                  : settings.magicSettings.onlyIfBothPrefixAndSuffix
                    ? "both"
                    : "any"
              }
              onValueChange={(v) => {
                setSettings({
                  ...settings,
                  magicSettings: {
                    matchOpenAffix: v === "open",
                    onlyIfBothPrefixAndSuffix: v === "both",
                  },
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="magic-mods-any"/>
                <Label htmlFor="magic-mods-any">
                  <span className="text-lg cursor-pointer">Match if <span className="font-semibold">ANY</span> mod is found</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="magic-mods-both"/>
                <Label htmlFor="magic-mods-both">
                  <span className="text-lg cursor-pointer">Match at least 1 <span className="font-semibold">Prefix AND 1 Suffix</span></span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open" id="magic-mods-open"/>
                <Label htmlFor="magic-mods-open">
                  <span className="text-lg cursor-pointer">Match an <span className="font-semibold">open prefix or suffix</span></span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {settings.itemBase && currentItemRegex && settings.itemBase.rarity === "Magic" && (
          <MagicItemSelect
            itemRegex={currentItemRegex}
            itemBase={settings.itemBase}
            selected={settings.selectedMods}
            setSelected={(mods) => setSettings({...settings, selectedMods: mods})}
          />
        )}
      </div>
    </>
  );
}

// --- Sub-components ---

function cleanCategoryName(category: string): string {
  return category
    .replace(/suffix_?/, "Suffix ")
    .replace(/prefix_?/, "Prefix ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function groupCategories(categories: ItemRegexCategory[]): Record<string, ItemRegexCategory[]> {
  return categories.reduce<Record<string, ItemRegexCategory[]>>((acc, cat) => {
    const key = cat.modCategory.replace(/(suffix|prefix)_?/, "");
    if (!acc[key]) acc[key] = [];
    acc[key].push(cat);
    return acc;
  }, {});
}

function ModWarnings({itemRegex}: { itemRegex: ItemRegex }) {
  const warnings = itemRegex.itemRegexForCategory.flatMap((e) => e.warnings ?? []);
  if (warnings.length === 0) return null;
  return (
    <details className="pt-2">
      <summary className="text-sm text-muted-foreground cursor-pointer">
        Show warnings / mod conflicts for {itemRegex.basetype} <span className="text-yellow-300">({warnings.length})</span>
      </summary>
      <div className="pl-4 pt-1">
        {warnings.map((w, i) => (
          <div key={i} className="text-sm text-yellow-300">duplicate: {w}</div>
        ))}
      </div>
    </details>
  );
}

interface RareItemSelectProps {
  itemRegex: ItemRegex;
  itemBase: Itembase;
  selected: SelectedItemMod[];
  setSelected: (mods: SelectedItemMod[]) => void;
}

function RareItemSelect({itemRegex, itemBase, selected, setSelected}: RareItemSelectProps) {
  const filteredCategories = itemRegex.itemRegexForCategory.filter(
    (cat) => cat.modCategory !== "corrupted" && cat.modCategory !== "unique"
  );
  const grouped = groupCategories(filteredCategories);

  return (
    <div className="pt-4">
      {Object.entries(grouped).map(([groupKey, cats]) => (
        <div key={groupKey} className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 pb-4">
          {cats.map((cat) => (
            <div key={cat.modCategory}>
              <p className="text-sm font-semibold pb-2">{cleanCategoryName(cat.modCategory)}</p>
              {cat.modifiers.map((mod) => {
                const modEntry = selected.find(
                  (s) =>
                    s.basetype === itemBase.baseType &&
                    s.category === cat.modCategory &&
                    s.itemModifier.description === mod.description
                );
                const isSelected = modEntry?.selected ?? false;
                const values = modEntry?.values ?? {};

                const toggle = () => {
                  const existing = selected.find(
                    (s) =>
                      s.basetype === itemBase.baseType &&
                      s.category === cat.modCategory &&
                      s.itemModifier.description === mod.description
                  );
                  if (existing) {
                    setSelected(
                      selected.map((s) =>
                        s === existing ? {...s, selected: !s.selected} : s
                      )
                    );
                  } else {
                    setSelected([
                      ...selected,
                      {
                        basetype: itemBase.baseType,
                        category: cat.modCategory,
                        itemModifier: mod,
                        values: {},
                        selected: true,
                      },
                    ]);
                  }
                };

                const updateValue = (index: number, value: string) => {
                  const existing = selected.find(
                    (s) =>
                      s.basetype === itemBase.baseType &&
                      s.category === cat.modCategory &&
                      s.itemModifier.description === mod.description
                  );
                  const newValues = {...(existing?.values ?? {}), [index]: value};
                  if (existing) {
                    setSelected(
                      selected.map((s) =>
                        s === existing ? {...s, values: newValues, selected: true} : s
                      )
                    );
                  } else {
                    setSelected([
                      ...selected,
                      {
                        basetype: itemBase.baseType,
                        category: cat.modCategory,
                        itemModifier: mod,
                        values: newValues,
                        selected: true,
                      },
                    ]);
                  }
                };

                const decimalRegex = /\b\d+\.\d+\b/;
                const hasRange =
                  mod.stats.some((s) => s.hasRange) &&
                  !decimalRegex.test(mod.affixes[0]?.name ?? "");

                return (
                  <div
                    key={`${cat.modCategory}-${mod.description}`}
                    className={cn(
                      "p-2 rounded cursor-pointer text-sm border border-transparent hover:border-muted-foreground/30",
                      {"bg-slate-700": isSelected}
                    )}
                    onClick={toggle}
                  >
                    {!hasRange ? (
                      <span>{mod.description}</span>
                    ) : (
                      mod.description.split("#").map((part, index) => {
                        const stat = mod.stats[index] ?? {min: "#", max: "#", numberIndex: index, hasRange: false};
                        const pos = mod.regexPosition;
                        if (
                          pos.before.includes(index) ||
                          pos.after.includes(index) ||
                          pos.on.includes(index)
                        ) {
                          return (
                            <span key={index}>
                              <span>{part}</span>
                              <Input
                                placeholder={`${stat.min}-${stat.max}`}
                                type="number"
                                className="w-20 h-6 px-1 mx-1 text-sm bg-background border rounded inline-block"
                                onClick={(e) => e.stopPropagation()}
                                value={values[index] ?? ""}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updateValue(index, e.target.value);
                                }}
                              />
                            </span>
                          );
                        } else if (pos.disabled.includes(index)) {
                          return (
                            <span key={index}>
                              {part}
                              <span className="text-muted-foreground">
                                {stat.min}-{stat.max}
                              </span>
                            </span>
                          );
                        }
                        return <span key={index}>{part}</span>;
                      })
                    )}
                    {isSelected && (
                      <div className="pl-2 pt-1">
                        {[...mod.affixes].reverse().map((a, i) => (
                          <div
                            key={i}
                            className="text-xs text-muted-foreground/95 p-1 mr-2 bg-gray-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-semibold">T{i + 1}</span> {a.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface MagicItemSelectProps {
  itemRegex: ItemRegex;
  itemBase: Itembase;
  selected: SelectedItemMod[];
  setSelected: (mods: SelectedItemMod[]) => void;
}

function MagicItemSelect({itemRegex, itemBase, selected, setSelected}: MagicItemSelectProps) {
  const filteredCategories = itemRegex.itemRegexForCategory.filter(
    (cat) => cat.modCategory !== "corrupted" && cat.modCategory !== "unique"
  );
  const grouped = groupCategories(filteredCategories);

  return (
    <div className="pt-4">
      {Object.entries(grouped).map(([groupKey, cats]) => (
        <div key={groupKey} className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 pb-4">
          {cats.map((cat) => (
            <div key={cat.modCategory}>
              <p className="text-sm font-semibold pb-2">{cleanCategoryName(cat.modCategory)}</p>
              {cat.modifiers.flatMap((mod) =>
                mod.affixes.map((affix) => {
                  const isSelected = selected.some(
                    (s) =>
                      s.basetype === itemBase.baseType &&
                      s.itemModifier.description === affix.description
                  );

                  const toggle = () => {
                    if (isSelected) {
                      setSelected(
                        selected.filter(
                          (s) =>
                            !(
                              s.basetype === itemBase.baseType &&
                              s.itemModifier.description === affix.description
                            )
                        )
                      );
                    } else {
                      setSelected([
                        ...selected,
                        {
                          basetype: itemBase.baseType,
                          category: cat.modCategory,
                          itemModifier: {
                            ...mod,
                            description: affix.description,
                          },
                          values: {},
                          selected: true,
                        },
                      ]);
                    }
                  };

                  return (
                    <div
                      key={`${cat.modCategory}-${affix.description}-${affix.name}`}
                      className={cn(
                        "p-2 rounded cursor-pointer text-sm border border-transparent hover:border-muted-foreground/30",
                        {"bg-green-900/40": isSelected}
                      )}
                      onClick={toggle}
                    >
                      {affix.name}
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
