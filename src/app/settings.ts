export interface WebSettings {
  sidebarOpen: boolean
  optionsOpen: boolean
}

export const defaultWebSettings: WebSettings = {
  sidebarOpen: true,
  optionsOpen: true,
}

export interface Settings {
  name: string
  vendor: {
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
    weaponMods: {
      physical: boolean,
      elemental: boolean,
      skillLevel: boolean,
    },
    resistances: {
      fire: boolean,
      cold: boolean,
      lightning: boolean,
      chaos: boolean,
    }
  }
}

export const defaultSettings: Settings = {
  name: "default",
  vendor: {
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
    weaponMods: {
      physical: false,
      elemental: false,
      skillLevel: false,
    },
    resistances: {
      fire: false,
      cold: false,
      lightning: false,
      chaos: false,
    }
  }
}