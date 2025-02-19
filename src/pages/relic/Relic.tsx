import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {SelectList, SelectOption} from "@/components/selectList/SelectList.tsx";
import {relicRegex} from "@/generated/Relic.Gen.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {generateRelicResult} from "@/pages/relic/RelicResult.ts";


export function Relic() {
  const globalSettings = loadSettings(selectedProfile())
  const [settings, setSettings] = useState<Settings["relic"]>(globalSettings.relic);
  const [result, setResult] = useState("");

  const prefixes: SelectOption[] = relicRegex
    .filter((e) => e.affix === "PREFIX")
    .map((mod) => ({
      name: mod.name,
      isSelected: false,
      value: null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  const suffixes: SelectOption[] = relicRegex
    .filter((e) => e.affix === "SUFFIX")
    .map((mod) => ({
      name: mod.name,
      isSelected: false,
      value: null,
      ranges: mod.ranges,
      regex: mod.regex,
    }));

  useEffect(() => {
    const settingsResult = {...globalSettings, relic: {...settings}};
    saveSettings(settingsResult);
    setResult(generateRelicResult(settingsResult));
  }, [settings]);

  return (
    <>
      <Header name="Relic Regex"></Header>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.relic)}
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
      <div className="p-4">
        <RadioGroup value={settings.matchType} onValueChange={(v) => {
          setSettings({
            ...settings, matchType: v,
          })
        }}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any"/>
            <Label htmlFor="any"><span className="text-lg cursor-pointer">Match if <span
              className="font-semibold">any</span> prefix or suffix matches</span></Label>
          </div>
          <div className="flex items-center space-x-2 pb-2">
            <RadioGroupItem value="both" id="both"/>
            <Label htmlFor="both"><span className="text-lg cursor-pointer">Only match if <span
              className="font-semibold">both</span> prefix and suffix matches</span></Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-10">
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
    </>
  );
}