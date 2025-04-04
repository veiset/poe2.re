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

export interface Settings {
  name: string
  vendor: {
    resultSettings: ResultSettings,
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
      elemental: boolean,
      skillLevel: boolean,
      spirit: boolean,
      rarity: boolean,
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
      crossbows: boolean,

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
  },
  waystone: {
    resultSettings: ResultSettings,
    tier: {
      min: number,
      max: number,
    },
    rarity: {
      corrupted: boolean,
      uncorrupted: boolean,
    },
    modifier: {
      over100: boolean,
      round10: boolean,
      dropOverX: boolean,
      dropOverValue: number,
      delirious: boolean,
      anyPack: boolean,
      prefixSelectType: string,
      prefixes: SelectOption[],
      suffixes: SelectOption[],
    }
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
      affectedMaps: boolean,
      numAffectedMaps: number,
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

export const defaultSettings: Settings = {
  name: "default",
  vendor: {
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
      elemental: false,
      skillLevel: false,
      spirit: false,
      rarity: false,
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
      crossbows: false,

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
  },
  waystone: {
    resultSettings: defaultResultSettings,
    tier: {
      min: 1,
      max: 16,
    },
    rarity: {
      corrupted: false,
      uncorrupted: false,
    },
    modifier: {
      over100: false,
      round10: true,
      dropOverX: false,
      dropOverValue: 200,
      delirious: false,
      anyPack: false,
      prefixSelectType: "any",
      prefixes: [],
      suffixes: [],
    }
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
      affectedMaps: false,
      numAffectedMaps: 0,
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