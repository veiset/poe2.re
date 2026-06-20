import { describe, it, expect } from 'vitest';
import { generateMagicItemRegex, generateRareItemRegex } from './ItemResult';
import { ItemSettings } from '@/app/settings';
import { ItemModifier } from '@/types/generated/ItemTypedef';

describe('ItemResult', () => {
  describe('generateMagicItemRegex', () => {
    const baseSettings: ItemSettings = {
      itemBase: {
        baseType: 'Amulet',
        item: 'Gold Amulet',
        rarity: 'Magic',
      },
      selectedMods: [],
      magicSettings: {
        matchOpenAffix: false,
        onlyIfBothPrefixAndSuffix: false,
      },
      rareSettings: {
        matchPrefixAndSuffix: false,
        matchAnyMod: false,
      },
    };

    it('returns empty string if no itemBase', () => {
      const settings = { ...baseSettings, itemBase: undefined };
      expect(generateMagicItemRegex(settings)).toBe('');
    });

    it('generates regex for single prefix (no open affix, no both required)', () => {
      const settings: ItemSettings = {
        ...baseSettings,
        selectedMods: [
          {
            basetype: 'Amulet',
            category: 'Life',
            itemModifier: {
              description: 'Adds # to Life',
              affixType: 'PREFIX',
            } as ItemModifier,
            values: {},
            selected: true,
          },
        ],
      };
      expect(generateMagicItemRegex(settings)).toBe('"^Adds # to Life"');
    });

    it('generates regex for prefix and suffix (no open affix, no both required)', () => {
      const settings: ItemSettings = {
        ...baseSettings,
        selectedMods: [
          {
            basetype: 'Amulet',
            category: 'Life',
            itemModifier: { description: 'Prefix1', affixType: 'PREFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
          {
            basetype: 'Amulet',
            category: 'Resist',
            itemModifier: { description: 'Suffix1', affixType: 'SUFFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
        ],
      };
      expect(generateMagicItemRegex(settings)).toBe('"^Prefix1|Suffix1$"');
    });

    it('generates regex for onlyIfBothPrefixAndSuffix (no open affix)', () => {
      const settings: ItemSettings = {
        ...baseSettings,
        magicSettings: { matchOpenAffix: false, onlyIfBothPrefixAndSuffix: true },
        selectedMods: [
          {
            basetype: 'Amulet',
            category: 'Life',
            itemModifier: { description: 'Prefix1', affixType: 'PREFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
          {
            basetype: 'Amulet',
            category: 'Resist',
            itemModifier: { description: 'Suffix1', affixType: 'SUFFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
        ],
      };
      // itemBase.item is "Gold Amulet"
      expect(generateMagicItemRegex(settings)).toBe('"(Prefix1)\\s?Gold Amulet\\s?(Suffix1)"');
    });

    it('generates regex with open affix (matchOpenAffix: true)', () => {
      const settings: ItemSettings = {
        ...baseSettings,
        magicSettings: { matchOpenAffix: true, onlyIfBothPrefixAndSuffix: false },
        selectedMods: [
          {
            basetype: 'Amulet',
            category: 'Life',
            itemModifier: { description: 'Prefix1', affixType: 'PREFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
        ],
      };
      expect(generateMagicItemRegex(settings)).toBe('"^Prefix1|^Gold Amulet|Gold Amulet$"');
    });

    it('generates regex with open affix and both required', () => {
      const settings: ItemSettings = {
        ...baseSettings,
        magicSettings: { matchOpenAffix: true, onlyIfBothPrefixAndSuffix: true },
        selectedMods: [
          {
            basetype: 'Amulet',
            category: 'Life',
            itemModifier: { description: 'Prefix1', affixType: 'PREFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
          {
            basetype: 'Amulet',
            category: 'Resist',
            itemModifier: { description: 'Suffix1', affixType: 'SUFFIX' } as ItemModifier,
            values: {},
            selected: true,
          },
        ],
      };
      expect(generateMagicItemRegex(settings)).toBe('"^(Prefix1)\\sGold Amulet|^Gold Amulet" "Gold Amulet\\s(Suffix1)|Gold Amulet$"');
    });
  });

  describe('generateRareItemRegex', () => {
    const itemModifier: ItemModifier = {
      description: 'Adds # to Life',
      regex: 'Adds (\\d+) to Life',
      stats: [],
      regexPosition: {
        on: [0],
        before: [],
        after: [],
        start: 0,
        end: 0,
        disabled: [],
      },
      affixes: [],
      affixType: 'PREFIX',
    };

    const baseSettings: ItemSettings = {
      itemBase: {
        baseType: 'Amulet',
        item: 'Gold Amulet',
        rarity: 'Rare',
      },
      selectedMods: [],
      magicSettings: {
        matchOpenAffix: false,
        onlyIfBothPrefixAndSuffix: false,
      },
      rareSettings: {
        matchPrefixAndSuffix: false,
        matchAnyMod: false,
      },
    };

    it('returns empty string if no itemBase', () => {
      expect(generateRareItemRegex({}, { ...baseSettings, itemBase: undefined })).toBe('');
    });

    it('generates basic rare regex', () => {
      const affixMap = { 'Amulet_Life': itemModifier };
      const selectedModsRecord: any = {
          'Amulet_Life': {
              selected: true,
              values: { 0: '50' }
          }
      };
      const settings = { ...baseSettings, selectedMods: selectedModsRecord };

      const result = generateRareItemRegex(affixMap, settings);
      // For 50, generateNumberRegex returns '([5-9].|\d..)'
      // In generateRareItemRegex, it replaces '.' with '\d' (ONLY FIRST OCCURRENCE)
      // Resulting in 'Adds (([5-9]\d|\d..)) to Life'
      expect(result).toBe('"Adds (([5-9]\\d|\\d..)) to Life"');
    });

    it('handles matchAnyMod', () => {
        const affixMap = { 
            'Amulet_Life': itemModifier,
            'Amulet_Mana': { ...itemModifier, description: 'Adds # to Mana', regex: 'Adds (\\d+) to Mana' }
        };
        const selectedModsRecord: any = {
            'Amulet_Life': { selected: true, values: { 0: '50' } },
            'Amulet_Mana': { selected: true, values: { 0: '30' } }
        };
        const settings = { 
            ...baseSettings, 
            selectedMods: selectedModsRecord,
            rareSettings: { ...baseSettings.rareSettings, matchAnyMod: true }
        };

        const result = generateRareItemRegex(affixMap, settings);
        expect(result).toBe('"Adds (([5-9]\\d|\\d..)) to Life|Adds (([3-9]\\d|\\d..)) to Mana"');
    });

    it('handles matchPrefixAndSuffix', () => {
        const prefixMod = { ...itemModifier, affixType: 'PREFIX' as const, regex: 'Prefix' };
        const suffixMod = { ...itemModifier, affixType: 'SUFFIX' as const, regex: 'Suffix' };
        const affixMap = { 
            'Amulet_P': prefixMod,
            'Amulet_S': suffixMod
        };
        const selectedModsRecord: any = {
            'Amulet_P': { selected: true, values: {} },
            'Amulet_S': { selected: true, values: {} }
        };
        const settings = { 
            ...baseSettings, 
            selectedMods: selectedModsRecord,
            rareSettings: { ...baseSettings.rareSettings, matchPrefixAndSuffix: true }
        };

        const result = generateRareItemRegex(affixMap, settings);
        expect(result).toBe('"Prefix" "Suffix"');
    });

    it('handles numbers before and after regex', () => {
        const mod: ItemModifier = {
            description: 'Test',
            regex: 'Middle',
            stats: [],
            regexPosition: {
                on: [],
                before: [0],
                after: [1],
                start: 0,
                end: 0,
                disabled: [],
            },
            affixes: [],
            affixType: 'PREFIX',
        };
        const affixMap = { 'Amulet_Test': mod };
        const selectedModsRecord: any = {
            'Amulet_Test': { selected: true, values: { 0: '10', 1: '20' } },
        };
        const settings = { ...baseSettings, selectedMods: selectedModsRecord };

        const result = generateRareItemRegex(affixMap, settings);
        // generateNumberRegex(10) -> ([1-9].|\d..)
        // generateNumberRegex(20) -> ([2-9].|\d..)
        // regexStr = [numbersBefore, regex, numbersAfter].filter(...).join(".*")
        // numbersBefore = ([1-9]\d|\d..)
        // numbersAfter = ([2-9]\d|\d..)
        // regex = Middle
        expect(result).toBe('"([1-9]\\d|\\d..).*Middle.*([2-9]\\d|\\d..)"');
    });
  });
});
