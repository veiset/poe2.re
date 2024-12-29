import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {generateWaystoneRegex} from "@/pages/waystone/WaystoneResult.ts";
import {Input} from "@/components/ui/input.tsx";

export function Waystone(){
  const globalSettings = loadSettings(selectedProfile())
  const [settings, setSettings] = useState<Settings["waystone"]>(globalSettings.waystone);
  const [result, setResult] = useState("");

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
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Tier</p>
            <p className="pb-2">Minimum tier:</p>
            <Input type="number" placeholder="Min tier" className="pb-2 mb-2"
                   value={settings.tier.min}
                   onChange={(b) =>
                     setSettings({
                       ...settings, tier: {...settings.tier, min: Math.min(Number(b.target.value), 15) || 0}
                     })}
            />
            <p className="pb-2">Maximum tier:</p>
            <Input type="number" placeholder="Max tier" className="pb-2 mb-2"
                   value={settings.tier.max}
                   onChange={(b) =>
                     setSettings({
                       ...settings, tier: {...settings.tier, max: Math.min(Number(b.target.value), 15) || 0}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
