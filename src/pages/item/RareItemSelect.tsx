import {SelectedItemMod} from "@/app/settings.ts";
import {Itembase, ItemRegex, ItemRegexCategory} from "@/types/generated/ItemTypedef.ts";
import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";

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

export function RareItemSelect({itemRegex, itemBase, selected, setSelected}: {
  itemRegex: ItemRegex;
  itemBase: Itembase;
  selected: SelectedItemMod[];
  setSelected: (mods: SelectedItemMod[]) => void;
}) {
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
