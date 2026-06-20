import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, ItemSettings, SelectedItemMod} from "@/app/settings.ts";
import {useEffect, useMemo, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {Input} from "@/components/ui/input.tsx";
import {loadItemBasetypes, loadItemRegex} from "@/lib/loadItemData.ts";
import {WarningBox} from "@/components/warning/WarningBox.tsx";
import {ItemBaseSelector} from "@/pages/item/ItemBaseSelector.tsx";
import {RareItemSelect} from "@/pages/item/RareItemSelect.tsx";
import {
  Itembase,
  ItemRegex,
  ItemRegexCategory,
} from "@/types/generated/ItemTypedef.ts";
import {ItemBasetype} from "@/types/generated/ItemBasetypesTypedef.ts";
import {generateRareItemRegex} from "@/pages/item/ItemResult.ts";
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

  // Save settings and generate result
  useEffect(() => {
    const base = loadSettings(currentProfile);
    const settingsResult = {...base, item: {...settings}, name: currentProfile};
    saveSettings(settingsResult);
    setResult(generateRareItemRegex(settings));
  }, [settings]);

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
          setCustomText={() => {
          }}
          setAutoCopy={() => {
          }}
        />
      </div>
      <div className="flex grow bg-muted/30 flex-1 flex-col gap-2 p-4">
        <WarningBox
          header="Beta feature!"
          text={<>
            Regex might incorrectly match modifiers. <br/>
            Please report bugs for incorrect matches and I'll try to fix them. Keep in mind that generating unique regex for generic item modifiers is really hard!
          </>}
        />

        <ItemBaseSelector
          searchText={searchText}
          setSearchText={setSearchText}
          filteredItems={filteredItems}
          setItemBase={setItemBase}
          settings={settings}
          setSettings={setSettings}
          currentItemRegex={currentItemRegex}
        />

        {settings.itemBase && currentItemRegex && (
          <RareItemSelect
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
