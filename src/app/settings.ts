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

export interface NumericModifier {
  isChecked: boolean,
  value: string,
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
    }
  },
  waystone: {
    resultSettings: ResultSettings,
    tier: {
      min: number,
      max: number,
    },
    modifier: {
      over100: boolean,

      dropOver200: boolean,
      itemsQuant: NumericModifier,
      rarity: NumericModifier,
      experience: NumericModifier,
      rareMonsters: NumericModifier,
      monsterPack: NumericModifier,
      magicPackSize: NumericModifier,
      additionalEssence: boolean,
      delirious: boolean,

      burningGround: boolean,
      shockedGround: boolean,
      chilledGround: boolean,
      eleWeak: boolean,
      lessRecovery: boolean,
      pen: boolean,
      maxRes: boolean,
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
  },
  waystone: {
    resultSettings: defaultResultSettings,
    tier: {
      min: 1,
      max: 16,
    },
    modifier: {
      over100: false,

      dropOver200: false,
      itemsQuant: {
        isChecked: false,
        value: "10",
      },
      rarity: {
        isChecked: false,
        value: "10",
      },
      experience: {
        isChecked: false,
        value: "20",
      },
      rareMonsters: {
        isChecked: false,
        value: "10",
      },
      monsterPack: {
        isChecked: false,
        value: "20",
      },
      magicPackSize: {
        isChecked: false,
        value: "30",
      },
      additionalEssence: false,
      delirious: false,

      burningGround: false,
      shockedGround: false,
      chilledGround: false,
      eleWeak: false,
      lessRecovery: false,
      pen: false,
      maxRes: false,
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
}