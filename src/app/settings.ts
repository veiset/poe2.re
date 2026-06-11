import {SelectOption} from "@/components/selectList/SelectList.tsx";

export interface WebSettings {
  sidebarOpen: boolean
  optionsOpen: boolean
}

export const defaultWebSettings: WebSettings = {
  sidebarOpen: true,
  optionsOpen: true,
}

export interface ResultSettings {
  customText: string,
  autoCopy: boolean,
}

export interface VendorGroup {
  itemType: {
    rare: boolean,
    magic: boolean,
    normal: boolean,
  }
  itemProperty: {
    quality: boolean,
    sockets: boolean,
  },
  movementSpeed: {
    move30: boolean,
    move25: boolean,
    move20: boolean,
    move15: boolean,
    move10: boolean,
  },
  itemMods: {
    physical: boolean,
    spellDamage: boolean,
    elemental: boolean,
    fireDamage: boolean,
    coldDamage: boolean,
    lightningDamage: boolean,
    chaosDamage: boolean,
    skillLevel: boolean,
    skillLevelMinion: boolean,
    skillLevelMelee: boolean,
    skillLevelSpell: boolean,
    skillLevelFire: boolean,
    skillLevelCold: boolean,
    skillLevelLightning: boolean,
    skillLevelPhysical: boolean,
    skillLevelProjectile: boolean,
    spirit: boolean,
    rarity: boolean,
    attackSpeed: boolean,
    castSpeed: boolean,
    maxLife: boolean,
    maxMana: boolean,
    strength: boolean,
    intelligence: boolean,
    dexterity: boolean,
  },
  resistances: {
    fire: boolean,
    cold: boolean,
    lightning: boolean,
    chaos: boolean,
  },
  itemClass: {
    amulets: boolean,
    rings: boolean,
    belts: boolean,

    daggers: boolean,
    wands: boolean,
    oneHandMaces: boolean,
    sceptres: boolean,

    bows: boolean,
    staves: boolean,
    twoHandMaces: boolean,
    quarterstaves: boolean,
    spears: boolean,
    crossbows: boolean,
    talisman: boolean,

    gloves: boolean,
    boots: boolean,
    bodyArmours: boolean,
    helmets: boolean,
    quivers: boolean,
    foci: boolean,
    shields: boolean,
  },
  itemLevel: {
    min: number,
    max: number,
  },
  characterLevel: {
    min: number,
    max: number,
  }
}

export interface Settings {
  name: string
  vendor: {
    selectedGroupId: number
    resultSettings: ResultSettings,
    vendorGroups: VendorGroup[],
  }
  waystone: {
    resultSettings: ResultSettings,
    tier: {
      min: number,
      max: number,
    },
    revives: {
      min: number,
      max: number,
    },
    state: {
      corrupted: boolean,
      uncorrupted: boolean,
      delirious: boolean,
    },
    modifier: {
      round10: boolean,
      wantedModsSelectType: string,
      wantedMods: SelectOption[],
      unwantedMods: SelectOption[],
    },
    itemRarity: string,
    itemQuantity: string,
    waystoneDropChance: string,
    magicMonsters: string,
    rareMonsters: string,
  },
  tablet: {
    resultSettings: ResultSettings,
    rarity: {
      normal: boolean,
      magic: boolean,
    },
    type: {
      breach: boolean,
      delirium: boolean,
      irradiated: boolean,
      expedition: boolean,
      ritual: boolean,
      overseer: boolean,
    },
    modifier: {
      usesRemaining: boolean,
      numUsesRemaining: number,
      round10: boolean,
      affixSelectType: string,
      affixes: SelectOption[],
    }
  },
  relic: {
    resultSettings: ResultSettings,
    matchType: string,
    modifier: {
      prefixes: SelectOption[],
      suffixes: SelectOption[],
    }
  }
}

const defaultResultSettings: ResultSettings = ({
  customText: "",
  autoCopy: false,
})

export const defaultEmptyVendor = {
  resultSettings: defaultResultSettings,
  itemType: {
    rare: false,
    magic: false,
    normal: false,
  },
  itemProperty: {
    quality: false,
    sockets: false,
  },
  movementSpeed: {
    move30: false,
    move25: false,
    move20: false,
    move15: false,
    move10: false,
  },
  itemMods: {
    physical: false,
    spellDamage: false,
    elemental: false,
    skillLevel: false,
    skillLevelMinion: false,
    skillLevelMelee: false,
    skillLevelSpell: false,
    skillLevelFire: false,
    skillLevelCold: false,
    skillLevelLightning: false,
    skillLevelPhysical: false,
    skillLevelProjectile: false,
    spirit: false,
    rarity: false,
    fireDamage: false,
    coldDamage: false,
    lightningDamage: false,
    chaosDamage: false,
    attackSpeed: false,
    castSpeed: false,
    maxLife: false,
    maxMana: false,
    strength: false,
    intelligence: false,
    dexterity: false,
  },
  resistances: {
    fire: false,
    cold: false,
    lightning: false,
    chaos: false,
  },
  itemClass: {
    amulets: false,
    rings: false,
    belts: false,

    daggers: false,
    wands: false,
    oneHandMaces: false,
    sceptres: false,

    bows: false,
    staves: false,
    twoHandMaces: false,
    quarterstaves: false,
    spears: false,
    crossbows: false,
    talisman: false,

    gloves: false,
    boots: false,
    bodyArmours: false,
    helmets: false,
    quivers: false,
    foci: false,
    shields: false,
  },
  itemLevel: {
    min: 0,
    max: 0,
  },
  characterLevel: {
    min: 0,
    max: 0,
  }
};
export const defaultSettings: Settings = {
  name: "default",
  vendor: {
    resultSettings: defaultResultSettings,
    selectedGroupId: 0,
    vendorGroups: [{...defaultEmptyVendor}],
  },
  waystone: {
    resultSettings: defaultResultSettings,
    tier: {
      min: 1,
      max: 16,
    },
    revives: {
      min: 0,
      max: 6,
    },
    state: {
      corrupted: false,
      uncorrupted: false,
      delirious: false,
    },
    modifier: {
      round10: true,
      wantedModsSelectType: "any",
      wantedMods: [],
      unwantedMods: [],
    },
    itemQuantity: "",
    itemRarity: "",
    magicMonsters: "",
    rareMonsters: "",
    waystoneDropChance: ""
  },
  tablet: {
    resultSettings: defaultResultSettings,
    rarity: {
      normal: false,
      magic: false,
    },
    type: {
      breach: false,
      delirium: false,
      irradiated: false,
      expedition: false,
      ritual: false,
      overseer: false,
    },
    modifier: {
      usesRemaining: false,
      numUsesRemaining: 10,
      round10: true,
      affixSelectType: "any",
      affixes: [],
    }
  },
  relic: {
    resultSettings: defaultResultSettings,
    matchType: "any",
    modifier: {
      prefixes: [],
      suffixes: [],
    }
  }
}
