import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {generateWaystoneRegex} from "@/pages/waystone/WaystoneResult.ts";
import {Input} from "@/components/ui/input.tsx";
import {Checked} from "@/components/checked/Checked.tsx";

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
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Tier</p>
            <p className="pb-2">Minimum tier:</p>
            <Input type="number" placeholder="Min tier" className="pb-2 mb-2 w-40"
                   value={settings.tier.min}
                   onChange={(b) =>
                     setSettings({
                       ...settings, tier: {...settings.tier, min: Math.min(Number(b.target.value), 15) || 0}
                     })}
            />
            <p className="pb-2">Maximum tier:</p>
            <Input type="number" placeholder="Max tier" className="pb-2 mb-2 w-40"
                   value={settings.tier.max}
                   onChange={(b) =>
                     setSettings({
                       ...settings, tier: {...settings.tier, max: Math.min(Number(b.target.value), 15) || 0}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Good modifiers (will match any selected)</p>
            <Checked id="mod-drop-over-200" text="Waystone drop chance over 200%+" checked={settings.modifier.dropOver200}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, dropOver200: b}
                     })}
            />
            <Checked id="mod-quant50" text="50%+ quantity of items" checked={settings.modifier.quant50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, quant50: b}
                     })}
            />
            <Checked id="mod-rarity50" text="50%+ rarity of items" checked={settings.modifier.rarity50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, rarity50: b}
                     })}
            />
            <Checked id="mod-experience" text="50%+ experience gain" checked={settings.modifier.experience50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, experience50: b}
                     })}
            />
            <Checked id="mod-raremonster" text="50%+ rare monsters" checked={settings.modifier.rareMonsters50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, rareMonsters50: b}
                     })}
            />
            <Checked id="mod-monsterpack" text="50%+ monster packs" checked={settings.modifier.monsterPack50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, monsterPack50: b}
                     })}
            />
            <Checked id="mod-magicpack" text="50%+ magic pack size" checked={settings.modifier.packSize50}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, packSize50: b}
                     })}
            />
            <Checked id="mod-raremonster" text="Additional essence" checked={settings.modifier.additionalEssence}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, additionalEssence: b}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Bad modifiers (will not highlight maps with these modifiers)</p>
            <Checked id="mod-burningground" text="Burning ground" checked={settings.modifier.burningGround}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, burningGround: b}
                     })}
            />
            <Checked id="mod-shockedground" text="Shocked ground" checked={settings.modifier.shockedGround}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, shockedGround: b}
                     })}
            />
            <Checked id="mod-chilledground" text="Chilled ground" checked={settings.modifier.chilledGround}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, chilledGround: b}
                     })}
            />
            <Checked id="mod-eleweak" text="Elemental weakness" checked={settings.modifier.eleWeak}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, eleWeak: b}
                     })}
            />
            <Checked id="mod-lessrecovery" text="Player less recovery rate life/shield" checked={settings.modifier.lessRecovery}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, lessRecovery: b}
                     })}
            />
            <Checked id="mod-pen" text="Monster damage penetrate resistances" checked={settings.modifier.pen}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, pen: b}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
