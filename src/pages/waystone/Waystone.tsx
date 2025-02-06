import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {generateWaystoneRegex} from "@/pages/waystone/WaystoneResult.ts";
import {Input} from "@/components/ui/input.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import { CheckedWithSelection } from "@/components/checked/CheckedWithSelection";

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
            <Input type="number" min="1" max="16" placeholder="Min tier" className="pb-2 mb-2 w-40"
                  value={settings.tier.min}
                  onChange={(b) => {
                    if(Number(b.target.value) <= settings.tier.max) {
                      setSettings({
                        ...settings, tier: {...settings.tier, min: Math.min(Number(b.target.value), 16) || 0}
                      })
                    }
                  }}
            />
            <p className="pb-2">Maximum tier:</p>
            <Input type="number" min="1" max="16" placeholder="Max tier" className="pb-2 mb-2 w-40"
                  value={settings.tier.max}
                  onChange={(b) => {
                    if(Number(b.target.value) >= settings.tier.min) { 
                      setSettings({
                        ...settings, tier: {...settings.tier, max: Math.min(Number(b.target.value), 16) || 0}
                      })
                    }
                  }}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Global settings</p>
            <Checked id="over-100" text="Match numbers over 100% (takes more space)"
                     checked={settings.modifier.over100}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, over100: b}
                     })}
            />
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Good modifiers (will match any
              selected)</p>
            <Checked id="mod-drop-over-200" text="Waystone drop chance over 200%+"
                     checked={settings.modifier.dropOver200}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, dropOver200: b}
                     })}
            />
            <CheckedWithSelection id="mod-quant" text="%+ quantity of items"
                      checked={settings.modifier.itemsQuant.isChecked}
                      value={settings.modifier.itemsQuant.value}
                      options={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, itemsQuant: {...settings.modifier.itemsQuant, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, itemsQuant: {...settings.modifier.itemsQuant, value: v}}
                      })}
            />
            <CheckedWithSelection id="mod-rarity" text="%+ rarity of items"
                      checked={settings.modifier.rarity.isChecked}
                      value={settings.modifier.rarity.value}
                      options={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, rarity: {...settings.modifier.rarity, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, rarity: {...settings.modifier.rarity, value: v}}
                      })}
            />
            <CheckedWithSelection id="mod-experience" text="%+ experience gain"
                      checked={settings.modifier.experience.isChecked}
                      value={settings.modifier.experience.value}
                      options={[20, 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, experience: {...settings.modifier.experience, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, experience: {...settings.modifier.experience, value: v}}
                      })}
            />
            <CheckedWithSelection id="mod-raremonster" text="%+ rare monsters"
                      checked={settings.modifier.rareMonsters.isChecked}
                      value={settings.modifier.rareMonsters.value}
                      options={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, rareMonsters: {...settings.modifier.rareMonsters, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, rareMonsters: {...settings.modifier.rareMonsters, value: v}}
                      })}
            />
            <CheckedWithSelection id="mod-monsterpack" text="%+ monster packs"
                      checked={settings.modifier.monsterPack.isChecked}
                      value={settings.modifier.monsterPack.value}
                      options={[20, 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, monsterPack: {...settings.modifier.monsterPack, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, monsterPack: {...settings.modifier.monsterPack, value: v}}
                      })}
            />
            <CheckedWithSelection id="mod-magicpack" text="%+ magic pack size"
                      checked={settings.modifier.magicPackSize.isChecked}
                      value={settings.modifier.magicPackSize.value}
                      options={[ 30, 40, 50, 60, 70, 80, 90]}
                      onChange={(b) => setSettings({
                        ...settings, modifier: {...settings.modifier, magicPackSize: {...settings.modifier.magicPackSize, isChecked: b}}
                      })}
                      onSelected={(v) => setSettings({
                        ...settings, modifier: {...settings.modifier, magicPackSize: {...settings.modifier.magicPackSize, value: v}}
                      })}
            />
            <Checked id="mod-raremonster" text="Additional essence" checked={settings.modifier.additionalEssence}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, additionalEssence: b}
                     })}
            />
            <Checked id="mod-delirium" text="Players in area are X% Delirious" checked={settings.modifier.delirious}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, delirious: b}
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
            <Checked id="mod-maxres" text="-% Maximum player resistances" checked={settings.modifier.maxRes}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, maxRes: b}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
