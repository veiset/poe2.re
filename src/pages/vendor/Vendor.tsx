import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {useEffect, useState} from "react";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {generateVendorRegex} from "@/pages/vendor/VendorResult.ts";

export function Vendor() {

  const globalSettings = loadSettings(selectedProfile())
  const [settings, setSettings] = useState<Settings["vendor"]>(globalSettings.vendor);
  const [result, setResult] = useState("");

  useEffect(() => {
    const settingsResult = {...globalSettings, vendor: {...settings}};
    saveSettings(settingsResult);
    setResult(generateVendorRegex(settingsResult));
  }, [settings]);

  return (
    <>
      <Header name="Vendor Regex"></Header>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.vendor)}
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
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item property</p>
            <Checked id="atr-quality" text="Quality" checked={settings.itemProperty.quality}
                     onChange={(b) => setSettings({
                       ...settings, itemProperty: {...settings.itemProperty, quality: b}
                     })}
            />
            <Checked id="atr-socket" text="Sockets" checked={settings.itemProperty.sockets}
                     onChange={(b) => setSettings({
                       ...settings, itemProperty: {...settings.itemProperty, sockets: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Movement speed</p>
            <Checked id="30ms" text="Movement speed (30%)" checked={settings.movementSpeed.move30}
                     onChange={(b) => setSettings({
                       ...settings, movementSpeed: {...settings.movementSpeed, move30: b}
                     })}
            />
            <Checked id="25ms" text="Movement speed (25%)" checked={settings.movementSpeed.move25}
                     onChange={(b) => setSettings({
                       ...settings, movementSpeed: {...settings.movementSpeed, move25: b}
                     })}
            />
            <Checked id="20ms" text="Movement speed (20%)" checked={settings.movementSpeed.move20}
                     onChange={(b) => setSettings({
                       ...settings, movementSpeed: {...settings.movementSpeed, move20: b}
                     })}
            />
            <Checked id="15ms" text="Movement speed (15%)" checked={settings.movementSpeed.move15}
                     onChange={(b) => setSettings({
                       ...settings, movementSpeed: {...settings.movementSpeed, move15: b}
                     })}
            />
            <Checked id="10ms" text="Movement speed (10%)" checked={settings.movementSpeed.move10}
                     onChange={(b) => setSettings({
                       ...settings, movementSpeed: {...settings.movementSpeed, move10: b}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item modifiers</p>
            <Checked id="mod-phys" text="Physical damage" checked={settings.weaponMods.physical}
                     onChange={(b) => setSettings({
                       ...settings, weaponMods: {...settings.weaponMods, physical: b}
                     })}
            />
            <Checked id="mod-ele" text="Elemental damage" checked={settings.weaponMods.elemental}
                     onChange={(b) => setSettings({
                       ...settings, weaponMods: {...settings.weaponMods, elemental: b}
                     })}
            />
            <Checked id="mod-skill" text="+# to level of skills" checked={settings.weaponMods.skillLevel}
                     onChange={(b) => setSettings({
                       ...settings, weaponMods: {...settings.weaponMods, skillLevel: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Resistances</p>
            <Checked id="res-fire" text="Fire resistance" checked={settings.resistances.fire}
                     onChange={(b) => setSettings({
                       ...settings, resistances: {...settings.resistances, fire: b}
                     })}
            />
            <Checked id="res-cold" text="Cold resistance" checked={settings.resistances.cold}
                     onChange={(b) => setSettings({
                       ...settings, resistances: {...settings.resistances, cold: b}
                     })}
            />
            <Checked id="res-lightning" text="Lightning resistance" checked={settings.resistances.lightning}
                     onChange={(b) => setSettings({
                       ...settings, resistances: {...settings.resistances, lightning: b}
                     })}
            />
            <Checked id="res-chaos" text="Chaos resistance" checked={settings.resistances.chaos}
                     onChange={(b) => setSettings({
                       ...settings, resistances: {...settings.resistances, chaos: b}
                     })}
            />
          </div>
          <div>
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item types</p>
            <Checked id="itemtype-rare" text="Rare" checked={settings.itemType.rare}
                     onChange={(b) => setSettings({
                       ...settings, itemType: {...settings.itemType, rare: b}
                     })}
            />
            <Checked id="itemtype-magic" text="Magic" checked={settings.itemType.magic}
                     onChange={(b) => setSettings({
                       ...settings, itemType: {...settings.itemType, magic: b}
                     })}
            />
            <Checked id="itemtype-normal" text="Normal" checked={settings.itemType.normal}
                     onChange={(b) => setSettings({
                       ...settings, itemType: {...settings.itemType, normal: b}
                     })}
            />

            {/*  <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item types - 1H weapons</p>*/}
            {/*  /!*<Checked id="type-claws" text="Claws"/>*!/*/}
            {/*  <Checked id="type-daggers" text="Daggers"/>*/}
            {/*  <Checked id="type-wands" text="Wands"/>*/}
            {/*  /!*<Checked id="type-1h-sword" text="One Hand Swords"/>*!/*/}
            {/*  /!*<Checked id="type-1h-axes" text="One Hand Axes"/>*!/*/}
            {/*  <Checked id="type-1h-maces" text="One Hand Maces"/>*/}
            {/*  <Checked id="type-sceptres" text="Sceptres"/>*/}
            {/*  /!*<Checked id="type-spears" text="Spears"/>*!/*/}
            {/*  /!*<Checked id="type-flails" text="Flails"/>*!/*/}

            {/*  <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item types - 2H weapons</p>*/}
            {/*  <Checked id="type-bows" text="Bows"/>*/}
            {/*  <Checked id="type-staves" text="Staves"/>*/}
            {/*  /!*<Checked id="type-2h-swords" text="Two Hand Swords"/>*!/*/}
            {/*  /!*<Checked id="type-2h-axes" text="Two Hand Axes"/>*!/*/}
            {/*  <Checked id="type-2h-maces" text="Two Hand Maces"/>*/}
            {/*  <Checked id="type-q-staves" text="Quarterstaves"/>*/}
            {/*  <Checked id="type-crossbow" text="Crossbows"/>*/}
            {/*  /!*<Checked id="type-traps" text="Traps"/>*!/*/}

            {/*  <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item types - Equipment</p>*/}
            {/*  <Checked id="type-amulet" text="Amulets"/>*/}
            {/*  <Checked id="type-rings" text="Rings"/>*/}
            {/*  <Checked id="type-belts" text="Belts"/>*/}

            {/*  <Checked id="type-gloves" text="Gloves"/>*/}
            {/*  <Checked id="type-boots" text="Boots"/>*/}
            {/*  <Checked id="type-body" text="Body Armours"/>*/}
            {/*  <Checked id="type-helm" text="Helmets"/>*/}

            {/*  <Checked id="type-quiver" text="Quivers"/>*/}
            {/*  <Checked id="type-foci" text="Foci"/>*/}
            {/*  <Checked id="type-shields" text="Shields"/>*/}
          </div>
        </div>
      </div>
    </>
  )
}
