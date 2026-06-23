import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {generateTabletRegex} from "@/pages/tablet/TabletResult.ts";
import {openTabletTradeSearch} from "@/lib/TradeUrlBuilder.ts";
import {loadTabletTradeStatIds, TradeStatIdMap} from "@/lib/loadTradeStatIds.ts";
import {Input} from "@/components/ui/input.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import {SelectList, SelectOption} from "@/components/selectList/SelectList.tsx";
import {loadTabletAffixes, TabletAffix} from "@/lib/loadTabletAffixes.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export function Tablet(){
  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const globalSettings = loadSettings(initialProfile)
  const [settings, setSettings] = useState<Settings["tablet"]>(globalSettings.tablet);
  const [result, setResult] = useState("");
  const [affixes, setAffixes] = useState<TabletAffix[]>([]);
  const [affixSearch, setAffixSearch] = useState("");
  const [tradeStatIds, setTradeStatIds] = useState<TradeStatIdMap>({});

  useEffect(() => {
    loadTabletAffixes().then(setAffixes);
    loadTabletTradeStatIds().then(setTradeStatIds);
  }, []);

  const normalizedSearch = affixSearch.trim().toLowerCase();
  const affixOptions: SelectOption[] = affixes
    .filter((mod) => normalizedSearch === "" || mod.name.toLowerCase().includes(normalizedSearch))
    .map((mod) => ({
      id: mod.id,
      name: mod.name,
      isSelected: settings.modifier.affixes
        .some((e) => e.name === mod.name && e.isSelected),
      value: settings.modifier.affixes
        .find((e) => e.name === mod.name)?.value || null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  useEffect(() => {
    const base = loadSettings(currentProfile);
    const settingsResult = {...base, tablet: {...settings}, name: currentProfile};
    saveSettings(settingsResult);
    setResult(generateTabletRegex(settingsResult));
  }, [settings]);

  useEffect(() => {
    const gs = loadSettings(currentProfile);
    setSettings(gs.tablet);
    setResult(generateTabletRegex(gs));
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header name="Tablet Regex"></Header>
        <div className="page-header-profile pr-4">
          <ProfileSelector currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} />
        </div>
      </div>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 sticky top-0 z-10 shadow-md">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.tablet)}
          onTradeSearch={() => openTabletTradeSearch({...loadSettings(currentProfile), tablet: settings}, tradeStatIds)}
          customText={settings.resultSettings.customText}
          autoCopy={settings.resultSettings.autoCopy}
          setCustomText={(text) => {
            setSettings({
              ...settings, resultSettings: {...settings.resultSettings, customText: text,}
            })
          }}
          setAutoCopy={(enable) => {
            setSettings({
              ...settings, resultSettings: {...settings.resultSettings, autoCopy: enable,}
            })
          }}
        />
      </div>
      <div className="flex grow bg-muted/30 flex-1 flex-col gap-2 p-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Tablet rarity</p>
            <Checked id="tabletrarity-rare" text="Rare" checked={settings.rarity.rare}
                     onChange={(b) => setSettings({
                       ...settings, rarity: {...settings.rarity, rare: b}
                     })}
            />
            <Checked id="tabletrarity-magic" text="Magic" checked={settings.rarity.magic}
                     onChange={(b) => setSettings({
                       ...settings, rarity: {...settings.rarity, magic: b}
                     })}
            />
            <Checked id="tabletrarity-normal" text="Normal" checked={settings.rarity.normal}
                     onChange={(b) => setSettings({
                       ...settings, rarity: {...settings.rarity, normal: b}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Tablet type</p>
            <Checked id="tablettype-irradiated" text="Irradiated" checked={settings.type.irradiated}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, irradiated: b}
                     })}
            />
            <Checked id="tablettype-ritual" text="Ritual" checked={settings.type.ritual}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, ritual: b}
                     })}
            />
            <Checked id="tablettype-delirium" text="Delirium" checked={settings.type.delirium}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, delirium: b}
                     })}
            />
            <Checked id="tablettype-breach" text="Breach" checked={settings.type.breach}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, breach: b}
                     })}
            />
            <Checked id="tablettype-abyss" text="Abyss" checked={settings.type.abyss}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, abyss: b}
                     })}
            />
            <Checked id="tablettype-temple" text="Temple" checked={settings.type.temple}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, temple: b}
                     })}
            />
            <Checked id="tablettype-overseer" text="Overseer" checked={settings.type.overseer}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, overseer: b}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Modifier</p>

            <Checked id="tabletmodifier-usesremaining" text="Min. uses remaining" checked={settings.modifier.usesRemaining}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, usesRemaining: b}
                     })}
            />
            <Input type="number" placeholder="Min uses remaining" className="pb-2 mb-2 w-40"
                   value={settings.modifier.numUsesRemaining}
                   min="1"
                   max="18"
                   onChange={(b) =>
                     setSettings({
                       ...settings, modifier: {...settings.modifier, numUsesRemaining: Number(b.target.value) || 0}
                     })}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Affix value matching</p>
          <Checked id="tablet-round-10" text="Round down to nearest 10 (saves a lot of space)"
                   checked={settings.modifier.round10}
                   onChange={(b) => setSettings({
                     ...settings, modifier: {...settings.modifier, round10: b}
                   })}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">
            Modifiers to include
          </p>
          <div className="pb-4">
            <RadioGroup value={settings.modifier.affixSelectType} onValueChange={(v) => {
              setSettings({
                ...settings, modifier: {...settings.modifier, affixSelectType: v}
              })
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="tablet-affix-any"/>
                <Label htmlFor="tablet-affix-any"><span className="text-lg cursor-pointer">Match when <span className="font-semibold">any</span> mod is found</span></Label>
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <RadioGroupItem value="all" id="tablet-affix-all"/>
                <Label htmlFor="tablet-affix-all"><span className="text-lg cursor-pointer">Match only when <span className="font-semibold">all</span> mods are found</span></Label>
              </div>
            </RadioGroup>
          </div>
          <Input
            type="text"
            placeholder="Filter modifiers..."
            className="mb-3 h-8 w-full max-w-sm"
            value={affixSearch}
            onChange={(e) => setAffixSearch(e.target.value)}
          />
          <SelectList
            id="tablet-affix-modifiers"
            options={affixOptions}
            selected={settings.modifier.affixes}
            setSelected={(modifiers) => {
              setSettings({
                ...settings,
                modifier: {...settings.modifier, affixes: modifiers}
              })
            }}
          />
        </div>
      </div>
    </>
  )
}
