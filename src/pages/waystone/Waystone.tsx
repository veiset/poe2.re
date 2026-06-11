import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {generateWaystoneRegex} from "@/pages/waystone/WaystoneResult.ts";
import {openWaystoneTradeSearch} from "@/lib/TradeUrlBuilder.ts";
import {loadWaystoneTradeStatIds, TradeStatIdMap} from "@/lib/loadTradeStatIds.ts";
import {Input} from "@/components/ui/input.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import {SelectList, SelectOption} from "@/components/selectList/SelectList.tsx";
import {loadWaystoneAffixes, WaystoneAffix} from "@/lib/loadWaystoneAffixes.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export function Waystone() {
  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const globalSettings = loadSettings(initialProfile)
  const [settings, setSettings] = useState<Settings["waystone"]>(globalSettings.waystone);
  const [result, setResult] = useState("");
  const [affixes, setAffixes] = useState<WaystoneAffix[]>([]);
  const [tradeStatIds, setTradeStatIds] = useState<TradeStatIdMap>({});

  useEffect(() => {
    loadWaystoneAffixes().then(setAffixes);
    loadWaystoneTradeStatIds().then(setTradeStatIds);
  }, []);

  const wantedMods: SelectOption[] = affixes
    .map((mod) => ({
      id: mod.id,
      name: mod.name,
      isSelected: settings.modifier.wantedMods
        .some((e) => e.name === mod.name && e.isSelected),
      value: settings.modifier.wantedMods
        .find((e) => e.name === mod.name)?.value || null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  const unwantedMods: SelectOption[] = affixes
    .map((mod) => ({
      id: mod.id,
      name: mod.name,
      isSelected: settings.modifier.unwantedMods
        .some((e) => e.name === mod.name && e.isSelected),
      value: settings.modifier.unwantedMods
        .find((e) => e.name === mod.name)?.value || null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  useEffect(() => {
    const base = loadSettings(currentProfile);
    const settingsResult = {...base, waystone: {...settings}, name: currentProfile};
    saveSettings(settingsResult);
    setResult(generateWaystoneRegex(settingsResult));
  }, [settings]);

  useEffect(() => {
    const gs = loadSettings(currentProfile);
    setSettings(gs.waystone);
    setResult(generateWaystoneRegex(gs));
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header name="Waystone Regex"></Header>
        <div className="page-header-profile pr-4">
          <ProfileSelector currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} />
        </div>
      </div>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.waystone)}
          onTradeSearch={() => openWaystoneTradeSearch({...loadSettings(currentProfile), waystone: settings}, tradeStatIds)}
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
        <div>
          <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Global settings</p>
          <Checked id="round-10" text="Round down to nearest 10 (saves a lot of space)"
                   checked={settings.modifier.round10}
                   onChange={(b) => setSettings({
                     ...settings, modifier: {...settings.modifier, round10: b}
                   })}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">{"Quantity & yield"}</p>

          <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-iiq">Waystone IIQ:</Label>
                <Input className="w-20 h-8"
                       id="waystone-iiq"
                       value={settings.itemQuantity}
                       onChange={(e) => setSettings({
                         ...settings, itemQuantity: e.target.value
                       })}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-iir">Waystone IIR:</Label>
                <Input className="w-20 h-8"
                       id="waystone-iir"
                       value={settings.itemRarity}
                       onChange={(e) => setSettings({
                         ...settings, itemRarity: e.target.value
                       })}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-drop-chance">Waystone Drop Chance:</Label>
                <Input className="w-20 h-8"
                       id="waystone-drop-chance"
                       value={settings.waystoneDropChance}
                       onChange={(e) => setSettings({
                        ...settings, waystoneDropChance: e.target.value
                       })}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-magic-monsters">Waystone Magic Monsters:</Label>
                <Input className="w-20 h-8"
                       id="waystone-magic-monsters"
                       value={settings.magicMonsters}
                       onChange={(e) => setSettings({
                        ...settings, magicMonsters: e.target.value
                       })}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-rare-monsters">Waystone Rare Monsters:</Label>
                <Input className="w-20 h-8"
                       id="waystone-rare-monsters"
                       value={settings.rareMonsters}
                       onChange={(e) => setSettings({
                        ...settings, rareMonsters: e.target.value
                       })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-min-tier">Minimum tier:</Label>
                <Input className="w-20 h-8"
                       id="waystone-min-tier"
                       type="number"
                       min="1"
                       max="16"
                       placeholder="Min tier"
                       value={settings.tier.min}
                       onChange={(b) => {
                         if (Number(b.target.value) <= settings.tier.max) {
                           setSettings({
                             ...settings, tier: {...settings.tier, min: Math.min(Number(b.target.value), 16) || 0}
                           })
                         }
                       }}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-max-tier">Maximum tier:</Label>
                <Input className="w-20 h-8"
                       id="waystone-max-tier"
                       type="number"
                       min="1"
                       max="16"
                       placeholder="Min tier"
                       value={settings.tier.max}
                       onChange={(b) => {
                         if (Number(b.target.value) >= settings.tier.min) {
                           setSettings({
                             ...settings, tier: {...settings.tier, max: Math.min(Number(b.target.value), 16) || 0}
                           })
                         }
                       }}
                />
              </div>
              <br />
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-min-revives">Minimum revives:</Label>
                <Input className="w-20 h-8"
                       id="waystone-min-revives"
                       type="number"
                       min="1"
                       max="6"
                       placeholder="Min revives"
                       value={settings.revives.min}
                       onChange={(b) => {
                         if (Number(b.target.value) <= settings.revives.max) {
                           setSettings({
                             ...settings, revives: {...settings.revives, min: Math.min(Number(b.target.value), 6) || 0}
                           })
                         }
                       }}
                />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <Label htmlFor="waystone-max-revives">Maximum revives:</Label>
                <Input className="w-20 h-8"
                       id="waystone-max-revives"
                       type="number"
                       min="1"
                       max="6"
                       placeholder="Max revives"
                       value={settings.revives.max}
                       onChange={(b) => {
                         if (Number(b.target.value) >= settings.revives.min) {
                           setSettings({
                             ...settings, revives: {...settings.revives, max: Math.min(Number(b.target.value), 6) || 0}
                           })
                         }
                       }}
                />
              </div>
            </div>

            <div>
              <Checked id="state-corrupted" text="Corrupted Waystones"
                       checked={settings.state.corrupted}
                       onChange={(b) => setSettings({
                         ...settings, state: {...settings.state, corrupted: b}
                       })}
              />
              <Checked id="state-uncorrupted" text="Uncorrupted Waystones"
                       checked={settings.state.uncorrupted}
                       onChange={(b) => setSettings({
                         ...settings, state: {...settings.state, uncorrupted: b}
                       })}
              />
              <Checked id="mod-delirious" text="Players in area are #% delirious"
                       checked={settings.state.delirious}
                       onChange={(b) => setSettings({
                         ...settings, state: {...settings.state, delirious: b}
                       })}
              />
            </div>

          </div>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">
              I don't want any of these mods
            </p>
            <SelectList
              id="unwanted-mods"
              options={unwantedMods}
              selected={settings.modifier.unwantedMods}
              setSelected={(modifiers) => {
                setSettings({
                  ...settings,
                  modifier: {...settings.modifier, unwantedMods: modifiers}
                })
              }}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">
              I want these mods
            </p>
            <div className="pb-4">
              <RadioGroup value={settings.modifier.wantedModsSelectType} onValueChange={(v) => {
                setSettings({
                  ...settings, modifier: {...settings.modifier, wantedModsSelectType: v}
                })
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="any"/>
                  <Label htmlFor="any"><span className="text-lg cursor-pointer">Match when <span className="font-semibold">any</span> mod is found</span></Label>
                </div>
                <div className="flex items-center space-x-2 pb-2">
                  <RadioGroupItem value="all" id="all"/>
                  <Label htmlFor="all"><span className="text-lg cursor-pointer">Match only when <span className="font-semibold">all</span> mods are found</span></Label>
                </div>
              </RadioGroup>
            </div>
            <SelectList
              id="wanted-mods"
              options={wantedMods}
              selected={settings.modifier.wantedMods}
              setSelected={(modifiers) => {
                setSettings({
                  ...settings,
                  modifier: {...settings.modifier, wantedMods: modifiers}
                })
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
