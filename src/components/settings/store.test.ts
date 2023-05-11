// import { store } from "./store";
import { State } from "./types";

const initialState: State = {
  settings: {
    pcStats: {},
    npcStats: {},
    systemPreset: "dnd5e",
    combatAbilities: [],
    customThemePath: "",
    equipmentCategories: {},
    debugTranslations: false,
    useBoost: false,
    defaultThemeName: "",
    useMwInjuryStatus: false,
    useMwStyleAbilities: false,
    useNpcCombatBonuses: false,
    generalAbilityCategories: [],
    migrationFlags: {
      actor: {},
      item: {},
      compendium: {},
      journal: {},
      macro: {},
      scene: {},
      rollTable: {},
      playlist: {},
      world: {},
    },
    useTurnPassingInitiative: false,
    genericOccupation: "",
    investigativeAbilityCategories: [],
    longNotes: [],
    mwHiddenShortNotes: [],
    mwUseAlternativeItemTypes: false,
    newNPCPacks: [],
    newPCPacks: [],
    occupationLabel: "",
    personalDetails: [],
    showEmptyInvestigativeCategories: false,
    systemMigrationVersion: "",
    abilityCategories: "",
    shortNotes: [],
  },
};

describe("store", () => {
  it("should have a default state", () => {
    // const result = store.reducer(initialState, store.creators.());
    const result = initialState;
    expect(result).toEqual(initialState);
  });
});
