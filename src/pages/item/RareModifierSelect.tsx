import {SelectedItemMod} from "@/app/settings.ts";
import {Itembase, ItemModifier, ItemRegex, ItemRegexCategory} from "@/types/generated/ItemTypedef.ts";
import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import React, {useMemo} from "react";

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

interface ModifierItemProps {
  mod: ItemModifier;
  cat: ItemRegexCategory;
  itemBase: Itembase;
  selected: SelectedItemMod[];
  setSelected: (mods: SelectedItemMod[]) => void;
}

const ModifierItem = React.memo(({mod, cat, itemBase, selected, setSelected}: ModifierItemProps) => {
  const modEntry = selected.find(
    (s) =>
      s.basetype === itemBase.baseType &&
      s.category === cat.modCategory &&
      s.itemModifier.description === mod.description
  );
  const isSelected = modEntry?.selected ?? false;
  const values = modEntry?.values ?? {};

  const toggle = () => {
    if (modEntry) {
      setSelected(selected.map((s) => (s === modEntry ? {...s, selected: !s.selected} : s)));
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
    const newValues = {...values, [index]: value};
    if (modEntry) {
      setSelected(selected.map((s) => (s === modEntry ? {...s, values: newValues, selected: true} : s)));
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
  const hasRange = useMemo(() => 
    mod.stats.some((s) => s.hasRange) && !decimalRegex.test(mod.affixes[0]?.name ?? ""),
    [mod.stats, mod.affixes]
  );

  const renderDescription = () => {
    if (!hasRange) return <span>{mod.description}</span>;

    return mod.description.split("#").map((part, index) => {
      const stat = mod.stats[index] ?? {min: "#", max: "#", numberIndex: index, hasRange: false};
      const pos = mod.regexPosition;
      
      if (pos.before.includes(index) || pos.after.includes(index) || pos.on.includes(index)) {
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
            <span className="text-muted-foreground">{stat.min}-{stat.max}</span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        "p-2 rounded cursor-pointer text-sm border border-transparent hover:border-muted-foreground/30",
        {"bg-slate-700": isSelected}
      )}
      onClick={toggle}
    >
      {renderDescription()}
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
});

export function RareModifierSelect({itemRegex, itemBase, selected, setSelected}: {
  itemRegex: ItemRegex;
  itemBase: Itembase;
  selected: SelectedItemMod[];
  setSelected: (mods: SelectedItemMod[]) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredGrouped = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const filteredCategories = itemRegex.itemRegexForCategory
      .filter((cat) => cat.modCategory !== "corrupted" && cat.modCategory !== "unique")
      .map((cat) => ({
        ...cat,
        modifiers: cat.modifiers.filter((mod) =>
          mod.description.toLowerCase().includes(q) ||
          mod.affixes.some(a => a.name.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.modifiers.length > 0);

    return groupCategories(filteredCategories);
  }, [itemRegex.itemRegexForCategory, searchTerm]);

  return (
    <div className="pt-4">
      <div className="pb-4">
        <Input
          placeholder="Search modifiers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      {Object.entries(filteredGrouped).map(([groupKey, cats]) => (
        <div key={groupKey} className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 pb-4">
          {cats.map((cat) => (
            <div key={cat.modCategory}>
              <p className="text-sm font-semibold pb-2">{cleanCategoryName(cat.modCategory)}</p>
              {cat.modifiers.map((mod) => (
                <ModifierItem
                  key={`${cat.modCategory}-${mod.description}`}
                  mod={mod}
                  cat={cat}
                  itemBase={itemBase}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
