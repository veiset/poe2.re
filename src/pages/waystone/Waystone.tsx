import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {generateWaystoneRegex} from "@/pages/waystone/WaystoneResult.ts";
import {Input} from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Checked} from "@/components/checked/Checked.tsx";
import {SelectList, SelectOption} from "@/components/selectList/SelectList.tsx";
import {waystoneRegex} from "@/generated/Waystone.Gen.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export function Waystone() {
  const globalSettings = loadSettings(selectedProfile())
  const [settings, setSettings] = useState<Settings["waystone"]>(globalSettings.waystone);
  const [result, setResult] = useState("");

  const prefixes: SelectOption[] = waystoneRegex
    .filter((e) => e.affix === "PREFIX")
    .map((mod) => ({
      name: mod.name,
      isSelected: settings.modifier.prefixes
        .some((e) => e.name === mod.name && e.isSelected),
      value: settings.modifier.prefixes
        .find((e) => e.name === mod.name)?.value || null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  const suffixes: SelectOption[] = waystoneRegex
    .filter((e) => e.affix === "SUFFIX")
    .map((mod) => ({
      name: mod.name,
      isSelected: settings.modifier.suffixes
        .some((e) => e.name === mod.name && e.isSelected),
      value: settings.modifier.suffixes
        .find((e) => e.name === mod.name)?.value || null,
      ranges: mod.ranges,
      regex: mod.regex
    }));

  useEffect(() => {
    const settingsResult = {...globalSettings, waystone: {...settings}};
    saveSettings(settingsResult);
    setResult(generateWaystoneRegex(settingsResult));
  }, [settings]);

  return (
    <>
      <Header name="Waystone Regex"></Header>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.waystone)}
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
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Global settings</p>
            <Checked id="round-10" text="Round down to nearest 10 (saves a lot of space)"
                     checked={settings.modifier.round10}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, round10: b}
                     })}
            />
            <Checked id="over-100" text="Match numbers over 100% (takes more space)"
                     checked={settings.modifier.over100}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, over100: b}
                     })}
            />
          </div>
          <div className="grid lg:grid-cols-2">
            <div>
              <p className="pb-2">Minimum tier:</p>
              <Input type="number" min="1" max="16" placeholder="Min tier" className="pb-2 mb-2 w-40"
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
            <div>
              <p className="pb-2">Maximum tier:</p>
              <Input type="number" min="1" max="16" placeholder="Max tier" className="pb-2 mb-2 w-40"
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
          </div>
          <div>
            <Checked id="rarity-corrupted" text="Corrupted Waystones"
                     checked={settings.rarity.corrupted}
                     onChange={(b) => setSettings({
                       ...settings, rarity: {...settings.rarity, corrupted: b}
                     })}
            />
            <Checked id="rarity-uncorrupted" text="Uncorrupted Waystones"
                     checked={settings.rarity.uncorrupted}
                     onChange={(b) => setSettings({
                       ...settings, rarity: {...settings.rarity, uncorrupted: b}
                     })}
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">
              Prefixes - Good modifiers
            </p>
            <div className="pb-4">
              <RadioGroup value={settings.modifier.prefixSelectType} onValueChange={(v) => {
                setSettings({
                  ...settings, modifier: {...settings.modifier, prefixSelectType: v}
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
            <Checked id="mod-drop-over-200" text="Waystone drop chance over"
                     checked={settings.modifier.dropOverX}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, dropOverX: b}
                     })}
            >
              <div className="w-20">
                <Select value={settings.modifier.dropOverValue.toString()} onValueChange={(e) =>
                  setSettings({
                    ...settings, modifier: {...settings.modifier, dropOverValue: Number(e)}
                  })
                }>
                  <SelectTrigger className="pl-2 pb-0 pt-0 h-8" >
                    <SelectValue placeholder="100%"/>
                  </SelectTrigger>
                  <SelectContent >
                    <SelectGroup>
                      {[100, 200, 300, 400, 500, 600, 700].map((option) => (
                        <SelectItem key={option} value={option.toString()}>{option}%</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Checked>
            <Checked id="mod-delirious" text="Players in area are #% delirious"
                     checked={settings.modifier.delirious}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, delirious: b}
                     })}
            />
            <Checked id="mod-anypack" text="Area contains # of any additional packs"
                     checked={settings.modifier.anyPack}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, anyPack: b}
                     })}
            />
            <SelectList
              id="prefix-modifiers"
              options={prefixes}
              selected={settings.modifier.prefixes}
              setSelected={(modifiers) => {
                setSettings({
                  ...settings,
                  modifier: {...settings.modifier, prefixes: modifiers}
                })
              }}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">
              Suffixes - Bad modifiers (will not highlight maps with these modifiers)
            </p>
            <SelectList
              id="suffix-modifiers"
              options={suffixes}
              selected={settings.modifier.suffixes}
              setSelected={(modifiers) => {
                setSettings({
                  ...settings,
                  modifier: {...settings.modifier, suffixes: modifiers}
                })
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
