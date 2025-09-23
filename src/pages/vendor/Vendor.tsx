import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {useEffect, useState} from "react";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {generateVendorRegex} from "@/pages/vendor/VendorResult.ts";
import {Input} from "@/components/ui/input.tsx";

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
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Speed</p>
            <Checked id="mod-phys" text="Attack speed" checked={settings.itemMods.attackSpeed}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, attackSpeed: b}
                     })}
            />
            <Checked id="mod-phys" text="Cast speed" checked={settings.itemMods.castSpeed}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, castSpeed: b}
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
            <Checked id="mod-phys" text="Physical damage" checked={settings.itemMods.physical}
                     onChange={(b) => setSettings({
                       ...settings, itemMods: {...settings.itemMods, physical: b}
                     })}
            />
            <Checked id="mod-ele" text="Elemental damage" checked={settings.itemMods.elemental}
                     onChange={(b) => setSettings({
                       ...settings, itemMods: {...settings.itemMods, elemental: b}
                     })}
            />
            <Checked id="mod-ele" text="Cold damage" checked={settings.itemMods.coldDamage}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, coldDamage: b}
                     })}
            />
            <Checked id="mod-ele" text="Fire damage" checked={settings.itemMods.fireDamage}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, fireDamage: b}
                     })}
            />
            <Checked id="mod-ele" text="Lightning damage" checked={settings.itemMods.lightningDamage}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, lightningDamage: b}
                     })}
            />
            <Checked id="mod-ele" text="Chaos damage" checked={settings.itemMods.chaosDamage}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, chaosDamage: b}
                     })}
            />
            <Checked id="mod-skill" text="+# to level of skills" checked={settings.itemMods.skillLevel}
                     onChange={(b) => setSettings({
                       ...settings, itemMods: {...settings.itemMods, skillLevel: b}
                     })}
            />
            <Checked id="mod-spirit" text="+# Spirit" checked={settings.itemMods.spirit}
                     onChange={(b) => setSettings({
                       ...settings, itemMods: {...settings.itemMods, spirit: b}
                     })}
            />
            <Checked id="mod-rarity" text="Increased Rarity" checked={settings.itemMods.rarity}
                     onChange={(b) => setSettings({
                       ...settings, itemMods: {...settings.itemMods, rarity: b}
                     })}
            />
            <Checked id="mod-max-life" text="Maximum Life" checked={settings.itemMods.maxLife}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, maxLife: b}
                     })}
            />
            <Checked id="mod-max-mana" text="Maximum Mana" checked={settings.itemMods.maxMana}
                     onChange={(b) => setSettings({
                         ...settings, itemMods: {...settings.itemMods, maxMana: b}
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
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item level</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs pb-1">Min level:</p>
                <Input type="number" min="0" max="100" placeholder="Min level" className="pb-1 mb-2 w-full"
                       value={settings.itemLevel?.min ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const max = settings.itemLevel?.max || 100;
                         if (value <= max) {
                           setSettings({
                             ...settings,
                             itemLevel: {...(settings.itemLevel || { min: 0, max: 100 }), min: Math.max(0, value)}
                           })
                         }
                       }}
                />
              </div>
              <div>
                <p className="text-xs pb-1">Max level:</p>
                <Input type="number" min="0" max="100" placeholder="Max level" className="pb-1 mb-2 w-full"
                       value={settings.itemLevel?.max ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const min = settings.itemLevel?.min ?? 0;
                         if (value >= min) {
                           setSettings({
                             ...settings,
                             itemLevel: {...(settings.itemLevel || { min: 0, max: 100 }), max: Math.min(100, value)}
                           })
                         }
                       }}
                />
              </div>
            </div>

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Character level</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs pb-1">Min level:</p>
                <Input type="number" min="0" max="100" placeholder="Min level" className="pb-1 mb-2 w-full"
                       value={settings.characterLevel?.min ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const max = settings.characterLevel?.max || 100;
                         if (value <= max) {
                           setSettings({
                             ...settings,
                             characterLevel: {...(settings.characterLevel || { min: 0, max: 100 }), min: Math.max(0, value)}
                           })
                         }
                       }}
                />
              </div>
              <div>
                <p className="text-xs pb-1">Max level:</p>
                <Input type="number" min="0" max="100" placeholder="Max level" className="pb-1 mb-2 w-full"
                       value={settings.characterLevel?.max ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const min = settings.characterLevel?.min ?? 0;
                         if (value >= min) {
                           setSettings({
                             ...settings,
                             characterLevel: {...(settings.characterLevel || { min: 0, max: 100 }), max: Math.min(100, value)}
                           })
                         }
                       }}
                />
              </div>
            </div>

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item rarity</p>
            <Checked id="itemtype-rare" text="Rare"
                     checked={settings.itemType.rare}
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

          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-2">Item class - Jewlery</p>
            <Checked id="type-amulet" text="Amulets"
                     checked={settings.itemClass.amulets}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, amulets: b}
                     })}
            />
            <Checked id="type-rings" text="Rings"
                     checked={settings.itemClass.rings}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, rings: b}
                     })}
            />
            <Checked id="type-belts" text="Belts"
                     checked={settings.itemClass.belts}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, belts: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - 1H weapons</p>
            {/*<Checked id="type-daggers" text="Daggers"*/}
            {/*         checked={settings.itemClass.daggers}*/}
            {/*         onChange={(b) => setSettings({*/}
            {/*           ...settings, itemClass: {...settings.itemClass, daggers: b}*/}
            {/*         })}*/}
            {/*/>*/}
            <Checked id="type-wands" text="Wands"
                     checked={settings.itemClass.wands}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, wands: b}
                     })}
            />
            <Checked id="type-1h-maces" text="One Hand Maces"
                     checked={settings.itemClass.oneHandMaces}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, oneHandMaces: b}
                     })}
            />
            <Checked id="type-sceptres" text="Sceptres"
                     checked={settings.itemClass.sceptres}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, sceptres: b}
                     })}
            />
            {/*<Checked id="type-claws" text="Claws"/>*/}
            {/*<Checked id="type-1h-sword" text="One Hand Swords"/>*/}
            {/*<Checked id="type-1h-axes" text="One Hand Axes"/>*/}
            {/*<Checked id="type-spears" text="Spears"/>*/}
            {/*<Checked id="type-flails" text="Flails"/>*/}

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - 2h weapons</p>
            <Checked id="type-bows" text="Bows"
                     checked={settings.itemClass.bows}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, bows: b}
                     })}

            />
            <Checked id="type-staves" text="Staves"
                     checked={settings.itemClass.staves}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, staves: b}
                     })}

            />
            <Checked id="type-2h-maces" text="Two Hand Maces"
                     checked={settings.itemClass.twoHandMaces}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, twoHandMaces: b}
                     })}

            />
            <Checked id="type-q-staves" text="Quarterstaves"
                     checked={settings.itemClass.quarterstaves}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, quarterstaves: b}
                     })}
            />
            <Checked id="type-crossbow" text="Crossbows"
                     checked={settings.itemClass.crossbows}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, crossbows: b}
                     })}
            />
            {/*<Checked id="type-2h-swords" text="Two Hand Swords"/>*/}
            {/*<Checked id="type-2h-axes" text="Two Hand Axes"/>*/}
            {/*<Checked id="type-traps" text="Traps"/>*/}


            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - equipment</p>
            <Checked id="type-gloves" text="Gloves"
                     checked={settings.itemClass.gloves}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, gloves: b}
                     })}

            />
            <Checked id="type-boots" text="Boots"
                     checked={settings.itemClass.boots}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, boots: b}
                     })}

            />
            <Checked id="type-body" text="Body Armours"
                     checked={settings.itemClass.bodyArmours}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, bodyArmours: b}
                     })}

            />
            <Checked id="type-helm" text="Helmets"
                     checked={settings.itemClass.helmets}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, helmets: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - offhand</p>
            <Checked id="type-quiver" text="Quivers"
                     checked={settings.itemClass.quivers}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, quivers: b}
                     })}
            />
            <Checked id="type-foci" text="Foci"
                     checked={settings.itemClass.foci}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, foci: b}
                     })}
            />
            <Checked id="type-shields" text="Shields"
                     checked={settings.itemClass.shields}
                     onChange={(b) => setSettings({
                       ...settings, itemClass: {...settings.itemClass, shields: b}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
