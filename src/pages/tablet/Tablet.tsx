import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {generateTabletRegex} from "@/pages/tablet/TabletResult.ts";
import {Input} from "@/components/ui/input.tsx";
import {Checked} from "@/components/checked/Checked.tsx";

export function Tablet(){
  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const globalSettings = loadSettings(initialProfile)
  const [settings, setSettings] = useState<Settings["tablet"]>(globalSettings.tablet);
  const [result, setResult] = useState("");

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
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.tablet)}
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
            <Checked id="tablettype-breach" text="Breach" checked={settings.type.breach}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, breach: b}
                     })}
            />
            <Checked id="tablettype-delirium" text="Delirium" checked={settings.type.delirium}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, delirium: b}
                     })}
            />
            {/* Not sure about this one, so i didn't changed tablettype from precursor to irradiated ~ MaxxxxiorS */}
            <Checked id="tablettype-precursor" text="Irradiated" checked={settings.type.irradiated}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, irradiated: b}
                     })}
            />
            <Checked id="tablettype-expedition" text="Expedition" checked={settings.type.expedition}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, expedition: b}
                     })}
            />
            <Checked id="tablettype-ritual" text="Ritual" checked={settings.type.ritual}
                     onChange={(b) => setSettings({
                       ...settings, type: {...settings.type, ritual: b}
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
            
            <Checked id="tabletmodifier-affectedmaps" text="Min. affected maps in range" checked={settings.modifier.affectedMaps}
                     onChange={(b) => setSettings({
                       ...settings, modifier: {...settings.modifier, affectedMaps: b}
                     })}
            />
            <Input type="number" placeholder="Min affected maps in range" className="pb-2 mb-2 w-40"
                   value={settings.modifier.numAffectedMaps}
                   min="2"
                   max="18"
                   onChange={(b) =>
                     setSettings({
                       ...settings, modifier: {...settings.modifier, numAffectedMaps: Number(b.target.value) || 0}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
