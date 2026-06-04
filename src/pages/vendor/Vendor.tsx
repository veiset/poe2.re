import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {Checked} from "@/components/checked/Checked.tsx";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {useEffect, useState} from "react";
import {defaultEmptyVendor, defaultSettings, Settings, VendorGroup} from "@/app/settings.ts";
import {generateVendorGroupRegex} from "@/pages/vendor/VendorResult.ts";
import {Input} from "@/components/ui/input.tsx";
import {getSelectedPropertiesFromObject} from "@/lib/utils.ts";
import {cx} from "class-variance-authority";

export function Vendor() {

  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const initSettings = loadSettings(initialProfile).vendor;
  const [settings, setSettings] = useState<Settings["vendor"]>(() => initSettings);
  const [selectedGroup, setSelectedGroup] = useState<VendorGroup>(initSettings.vendorGroups[initSettings.selectedGroupId]);
  const [result, setResult] = useState("");

  const removeGroup = () => {
    const groups = [...settings.vendorGroups];
    let selected = settings.selectedGroupId;
    groups.splice(settings.selectedGroupId, 1);
    if (groups.length === 0) {
      groups.push(defaultEmptyVendor);
    }
    if (settings.selectedGroupId >= groups.length) {
      selected = groups.length - 1;
    }
    setSettings({
      ...settings,
      selectedGroupId: selected,
      vendorGroups: groups
    });
    setSelectedGroup(groups[selected]);
  };

  const addGroup = () => {
    const groups = settings.vendorGroups.concat([{...defaultEmptyVendor}]);
    const selectedGroup = groups.length - 1;
    setSettings({
      ...settings,
      vendorGroups: groups,
      selectedGroupId: selectedGroup,
    })
    setSelectedGroup(groups[selectedGroup]);
  }

  const setGroup = (id: number) => {
    setSettings({
      ...settings,
      selectedGroupId: id,
    })
    setSelectedGroup(settings.vendorGroups[id])
  }

  // Save whenever settings change (for the currently selected profile)
  useEffect(() => {
    const base = loadSettings(currentProfile);
    const updatedGroups = settings.vendorGroups.map((group, index) =>
      index === settings.selectedGroupId
        ? {...group, ...selectedGroup}
        : group
    );
    const vendor = {
      selectedGroupId: settings.selectedGroupId,
      resultSettings: settings.resultSettings,
      vendorGroups: updatedGroups,
    }
    const settingsResult: Settings = {...base, vendor: vendor, name: currentProfile};
    saveSettings(settingsResult);
    setSettings(vendor);
  }, [selectedGroup]);

  useEffect(() => {
    setResult(generateVendorGroupRegex(settings));
  }, [settings]);

  // When the selected profile changes, load its settings
  useEffect(() => {
    const gs = loadSettings(currentProfile);
    setSettings(gs.vendor);
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header name="Vendor Regex"></Header>
        <div className="page-header-profile pr-4">
          <ProfileSelector currentProfile={currentProfile} setCurrentProfile={setCurrentProfile}/>
        </div>
      </div>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => {
            setSettings({...defaultSettings.vendor})
            setSelectedGroup({...defaultSettings.vendor.vendorGroups[0]})
          }}
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
        <p className="match-text">
          {settings.vendorGroups.map((group, i) => {
            const selectedProperties = getSelectedPropertiesFromObject(group);
            const groupText = selectedProperties.map((prop, index) => (
              <span key={index}> {prop}
                {index < selectedProperties.length - 1 && (
                  <span className="font-bold mx-1"> OR </span>
                )} </span>
            ));
            return (
              <>
                {i > 0 && <span className="font-bold mx-1">AND</span>}
                <span
                  className={cx("or-group", {
                    selected: i == settings.selectedGroupId,
                    empty: settings.vendorGroups.length === 0
                  })}
                  onClick={() => setGroup(i)}
                >
                  {groupText.length === 0
                    ? "Select conditions"
                    : groupText}
            </span>
              </>
            );
          })}
        </p>
        <p className="match-text-buttons">
          <a className="addGroup" href="#" onClick={addGroup}>
            ➕ Add grouping
          </a>
          <a className="removeGroup" href="#" onClick={removeGroup}>
            ❌ Remove current grouping
          </a>
        </p>
      </div>
      <div className="flex grow bg-muted/30 flex-1 flex-col gap-2 p-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item property</p>
            <Checked id="atr-quality" text="Quality" checked={selectedGroup.itemProperty.quality}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemProperty: {...selectedGroup.itemProperty, quality: b}
                     })}
            />
            <Checked id="atr-socket" text="Sockets" checked={selectedGroup.itemProperty.sockets}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemProperty: {...selectedGroup.itemProperty, sockets: b}
                     })}
            />
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Speed</p>
            <Checked id="mod-attack-speed" text="Attack speed" checked={selectedGroup.itemMods.attackSpeed}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, attackSpeed: b}
                     })}
            />
            <Checked id="mod-cast-speed" text="Cast speed" checked={selectedGroup.itemMods.castSpeed}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, castSpeed: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Movement speed</p>
            <Checked id="30ms" text="Movement speed (30%)" checked={selectedGroup.movementSpeed.move30}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, movementSpeed: {...selectedGroup.movementSpeed, move30: b}
                     })}
            />
            <Checked id="25ms" text="Movement speed (25%)" checked={selectedGroup.movementSpeed.move25}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, movementSpeed: {...selectedGroup.movementSpeed, move25: b}
                     })}
            />
            <Checked id="20ms" text="Movement speed (20%)" checked={selectedGroup.movementSpeed.move20}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, movementSpeed: {...selectedGroup.movementSpeed, move20: b}
                     })}
            />
            <Checked id="15ms" text="Movement speed (15%)" checked={selectedGroup.movementSpeed.move15}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, movementSpeed: {...selectedGroup.movementSpeed, move15: b}
                     })}
            />
            <Checked id="10ms" text="Movement speed (10%)" checked={selectedGroup.movementSpeed.move10}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, movementSpeed: {...selectedGroup.movementSpeed, move10: b}
                     })}
            />
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Resistances</p>
            <Checked id="res-fire" text="Fire resistance" checked={selectedGroup.resistances.fire}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, resistances: {...selectedGroup.resistances, fire: b}
                     })}
            />
            <Checked id="res-cold" text="Cold resistance" checked={selectedGroup.resistances.cold}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, resistances: {...selectedGroup.resistances, cold: b}
                     })}
            />
            <Checked id="res-lightning" text="Lightning resistance" checked={selectedGroup.resistances.lightning}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, resistances: {...selectedGroup.resistances, lightning: b}
                     })}
            />
            <Checked id="res-chaos" text="Chaos resistance" checked={selectedGroup.resistances.chaos}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, resistances: {...selectedGroup.resistances, chaos: b}
                     })}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item modifiers</p>
            <Checked id="mod-physical" text="Physical damage" checked={selectedGroup.itemMods.physical}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, physical: b}
                     })}
            />
            <Checked id="mod-spellDamage" text="Spell damage" checked={selectedGroup.itemMods.spellDamage}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, spellDamage: b}
                     })}
            />
            <Checked id="mod-elemental" text="Elemental damage" checked={selectedGroup.itemMods.elemental}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, elemental: b}
                     })}
            />
            <Checked id="mod-cold" text="Cold damage" checked={selectedGroup.itemMods.coldDamage}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, coldDamage: b}
                     })}
            />
            <Checked id="mod-fire" text="Fire damage" checked={selectedGroup.itemMods.fireDamage}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, fireDamage: b}
                     })}
            />
            <Checked id="mod-lightning" text="Lightning damage" checked={selectedGroup.itemMods.lightningDamage}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, lightningDamage: b}
                     })}
            />
            <Checked id="mod-chaos" text="Chaos damage" checked={selectedGroup.itemMods.chaosDamage}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, chaosDamage: b}
                     })}
            />
            <Checked id="mod-spirit" text="+# Spirit" checked={selectedGroup.itemMods.spirit}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, spirit: b}
                     })}
            />
            <Checked id="mod-rarity" text="Increased Rarity" checked={selectedGroup.itemMods.rarity}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, rarity: b}
                     })}
            />
            <Checked id="mod-max-life" text="Maximum Life" checked={selectedGroup.itemMods.maxLife}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, maxLife: b}
                     })}
            />
            <Checked id="mod-max-mana" text="Maximum Mana" checked={selectedGroup.itemMods.maxMana}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, maxMana: b}
                     })}
            />
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item modifiers (skill)</p>
            <Checked id="mod-skill" text="+# to level of skills (any)" checked={selectedGroup.itemMods.skillLevel}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevel: b}
                     })}
            />
            <Checked id="mod-skill-minion" text="+# to level of minion skills"
                     checked={selectedGroup.itemMods.skillLevelMinion}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelMinion: b}
                     })}
            />
            <Checked id="mod-skill-melee" text="+# to level of melee skills"
                     checked={selectedGroup.itemMods.skillLevelMelee}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelMelee: b}
                     })}
            />
            <Checked id="mod-skill-spell" text="+# to level of all spell skills"
                     checked={selectedGroup.itemMods.skillLevelSpell}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelSpell: b}
                     })}
            />
            <Checked id="mod-skill-fire" text="+# to level of fire spell skills"
                     checked={selectedGroup.itemMods.skillLevelFire}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelFire: b}
                     })}
            />
            <Checked id="mod-skill-cold" text="+# to level of cold spell skills"
                     checked={selectedGroup.itemMods.skillLevelCold}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelCold: b}
                     })}
            />
            <Checked id="mod-skill-lightning" text="+# to level of lightning spell skills"
                     checked={selectedGroup.itemMods.skillLevelLightning}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelLightning: b}
                     })}
            />
            <Checked id="mod-skill-physical" text="+# to level of physical spell skills"
                     checked={selectedGroup.itemMods.skillLevelPhysical}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelPhysical: b}
                     })}
            />
            <Checked id="mod-skill-projectile" text="+# to level of projectile skills"
                     checked={selectedGroup.itemMods.skillLevelProjectile}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, skillLevelProjectile: b}
                     })}
            />
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item modifiers (attributes)</p>
            <Checked id="mod-str" text="Strength" checked={selectedGroup.itemMods.strength}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, strength: b}
                     })}
            />
            <Checked id="mod-int" text="Intelligence" checked={selectedGroup.itemMods.intelligence}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, intelligence: b}
                     })}
            />
            <Checked id="mod-dex" text="Dexterity" checked={selectedGroup.itemMods.dexterity}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemMods: {...selectedGroup.itemMods, dexterity: b}
                     })}
            />

          </div>

          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2">Item level</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs pb-1">Min level:</p>
                <Input type="number" min="0" max="100" placeholder="Min level" className="pb-1 mb-2 w-full"
                       value={selectedGroup.itemLevel?.min ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const max = selectedGroup.itemLevel?.max || 100;
                         if (value <= max) {
                           setSelectedGroup({
                             ...selectedGroup,
                             itemLevel: {...(selectedGroup.itemLevel || {min: 0, max: 100}), min: Math.max(0, value)}
                           })
                         }
                       }}
                />
              </div>
              <div>
                <p className="text-xs pb-1">Max level:</p>
                <Input type="number" min="0" max="100" placeholder="Max level" className="pb-1 mb-2 w-full"
                       value={selectedGroup.itemLevel?.max ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const min = selectedGroup.itemLevel?.min ?? 0;
                         if (value >= min) {
                           setSelectedGroup({
                             ...selectedGroup,
                             itemLevel: {...(selectedGroup.itemLevel || {min: 0, max: 100}), max: Math.min(100, value)}
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
                       value={selectedGroup.characterLevel?.min ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const max = selectedGroup.characterLevel?.max || 100;
                         if (value <= max) {
                           setSelectedGroup({
                             ...selectedGroup,
                             characterLevel: {
                               ...(selectedGroup.characterLevel || {min: 0, max: 100}),
                               min: Math.max(0, value)
                             }
                           })
                         }
                       }}
                />
              </div>
              <div>
                <p className="text-xs pb-1">Max level:</p>
                <Input type="number" min="0" max="100" placeholder="Max level" className="pb-1 mb-2 w-full"
                       value={selectedGroup.characterLevel?.max ?? 0}
                       onChange={(b) => {
                         const value = Number(b.target.value);
                         const min = selectedGroup.characterLevel?.min ?? 0;
                         if (value >= min) {
                           setSelectedGroup({
                             ...selectedGroup,
                             characterLevel: {
                               ...(selectedGroup.characterLevel || {min: 0, max: 100}),
                               max: Math.min(100, value)
                             }
                           })
                         }
                       }}
                />
              </div>
            </div>

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item rarity</p>
            <Checked id="itemtype-rare" text="Rare"
                     checked={selectedGroup.itemType.rare}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemType: {...selectedGroup.itemType, rare: b}
                     })}
            />
            <Checked id="itemtype-magic" text="Magic" checked={selectedGroup.itemType.magic}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemType: {...selectedGroup.itemType, magic: b}
                     })}
            />
            <Checked id="itemtype-normal" text="Normal" checked={selectedGroup.itemType.normal}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemType: {...selectedGroup.itemType, normal: b}
                     })}
            />

          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-2">Item class - Jewellery</p>
            <Checked id="type-amulet" text="Amulets"
                     checked={selectedGroup.itemClass.amulets}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, amulets: b}
                     })}
            />
            <Checked id="type-rings" text="Rings"
                     checked={selectedGroup.itemClass.rings}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, rings: b}
                     })}
            />
            <Checked id="type-belts" text="Belts"
                     checked={selectedGroup.itemClass.belts}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, belts: b}
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
                     checked={selectedGroup.itemClass.wands}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, wands: b}
                     })}
            />
            <Checked id="type-1h-maces" text="One Hand Maces"
                     checked={selectedGroup.itemClass.oneHandMaces}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, oneHandMaces: b}
                     })}
            />
            <Checked id="type-sceptres" text="Sceptres"
                     checked={selectedGroup.itemClass.sceptres}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, sceptres: b}
                     })}
            />
            {/*<Checked id="type-claws" text="Claws"/>*/}
            {/*<Checked id="type-1h-sword" text="One Hand Swords"/>*/}
            {/*<Checked id="type-1h-axes" text="One Hand Axes"/>*/}
            {/*<Checked id="type-spears" text="Spears"/>*/}
            {/*<Checked id="type-flails" text="Flails"/>*/}

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - 2h weapons</p>
            <Checked id="type-bows" text="Bows"
                     checked={selectedGroup.itemClass.bows}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, bows: b}
                     })}

            />
            <Checked id="type-staves" text="Staves"
                     checked={selectedGroup.itemClass.staves}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, staves: b}
                     })}

            />
            <Checked id="type-2h-maces" text="Two Hand Maces"
                     checked={selectedGroup.itemClass.twoHandMaces}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, twoHandMaces: b}
                     })}

            />
            <Checked id="type-q-staves" text="Quarterstaves"
                     checked={selectedGroup.itemClass.quarterstaves}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, quarterstaves: b}
                     })}
            />
            <Checked id="type-spears" text="Spears"
                     checked={selectedGroup.itemClass.spears}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, spears: b}
                     })}
            />
            <Checked id="type-crossbow" text="Crossbows"
                     checked={selectedGroup.itemClass.crossbows}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, crossbows: b}
                     })}
            />
            <Checked id="type-talisamn" text="Talisman"
                     checked={selectedGroup.itemClass.talisman}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, talisman: b}
                     })}
            />
            {/*<Checked id="type-2h-swords" text="Two Hand Swords"/>*/}
            {/*<Checked id="type-2h-axes" text="Two Hand Axes"/>*/}
            {/*<Checked id="type-traps" text="Traps"/>*/}


            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - equipment</p>
            <Checked id="type-gloves" text="Gloves"
                     checked={selectedGroup.itemClass.gloves}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, gloves: b}
                     })}

            />
            <Checked id="type-boots" text="Boots"
                     checked={selectedGroup.itemClass.boots}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, boots: b}
                     })}

            />
            <Checked id="type-body" text="Body Armours"
                     checked={selectedGroup.itemClass.bodyArmours}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, bodyArmours: b}
                     })}

            />
            <Checked id="type-helm" text="Helmets"
                     checked={selectedGroup.itemClass.helmets}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, helmets: b}
                     })}
            />

            <p className="text-xs font-medium text-sidebar-foreground/70 pb-2 pt-4">Item class - offhand</p>
            <Checked id="type-quiver" text="Quivers"
                     checked={selectedGroup.itemClass.quivers}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, quivers: b}
                     })}
            />
            <Checked id="type-foci" text="Foci"
                     checked={selectedGroup.itemClass.foci}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, foci: b}
                     })}
            />
            <Checked id="type-shields" text="Shields"
                     checked={selectedGroup.itemClass.shields}
                     onChange={(b) => setSelectedGroup({
                       ...selectedGroup, itemClass: {...selectedGroup.itemClass, shields: b}
                     })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
