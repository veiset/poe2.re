import {Itembase, ItemRegex} from "@/types/generated/ItemTypedef.ts";
import {ItemSettings} from "@/app/settings.ts";
import {Input} from "@/components/ui/input.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";

interface ItemBaseSelectorProps {
  searchText: string;
  setSearchText: (text: string) => void;
  filteredItems: { baseType: string; item: string }[];
  setItemBase: (itemBase: Itembase) => void;
  settings: ItemSettings;
  setSettings: (settings: ItemSettings) => void;
  currentItemRegex: ItemRegex | undefined;
}

export function ItemBaseSelector({
  searchText,
  setSearchText,
  filteredItems,
  setItemBase,
  settings,
  setSettings,
  currentItemRegex,
}: ItemBaseSelectorProps) {
  return (
    <div className="bg-gray-700 border border-gray-500 rounded-sm p-4 shadow-sm">
      <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 uppercase tracking-wider">
        Select item base
      </p>
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
      {currentItemRegex && settings.itemBase && (
        <div className="mt-4">
          <ModWarnings itemRegex={currentItemRegex} />
        </div>
      )}

      {settings.itemBase && currentItemRegex && (
        <div className="pt-2 mt-4">
          <RadioGroup
            value={settings.rareSettings.matchAnyMod ? "any" : "all"}
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
              <RadioGroupItem value="all" id="rare-mods-all" />
              <Label htmlFor="rare-mods-all">
                <span className="text-lg cursor-pointer">
                  Match if only <span className="font-semibold">ALL</span> mods are found
                </span>
              </Label>
              <RadioGroupItem value="any" id="rare-mods-any" />
              <Label htmlFor="rare-mods-any">
                <span className="text-lg cursor-pointer">
                  Match if <span className="font-semibold">ANY</span> mod is found
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

function ModWarnings({itemRegex}: { itemRegex: ItemRegex }) {
  const warnings = itemRegex.itemRegexForCategory.flatMap((e) => e.warnings ?? []);
  if (warnings.length === 0) return null;
  return (
    <details className="pt-2">
      <summary className="text-sm text-muted-foreground cursor-pointer">
        Show warnings / mod conflicts for {itemRegex.basetype}{" "}
        <span className="text-yellow-300">({warnings.length})</span>
      </summary>
      <div className="pl-4 pt-1">
        {warnings.map((w, i) => (
          <div key={i} className="text-sm text-yellow-300">
            duplicate: {w}
          </div>
        ))}
      </div>
    </details>
  );
}
