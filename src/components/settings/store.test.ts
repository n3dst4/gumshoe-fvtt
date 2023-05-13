// import { nanoid } from "nanoid";
import { createSystemSlice } from "./store";
import { State } from "./types";
import { expect, jest, it, describe } from "@jest/globals";
// import * as functions from "../../functions";
import { AnyAction } from "./reducerTools";
import { pathOfCthulhuPreset } from "../../presets";
import { createPatch } from "diff";

type TestTuple = [string, AnyAction];

const initialState: State = {
  settings: {
    pcStats: {
      pcStat0: {
        min: 0,
        max: 10,
        default: 3,
        name: "PC Statisitic Zero",
      },
    },
    npcStats: {
      npcStat0: {
        min: 0,
        max: 10,
        default: 3,
        name: "NPC Statisitic Zero",
      },
    },
    systemPreset: "dnd5e",
    combatAbilities: [],
    customThemePath: "",
    equipmentCategories: {
      category0: {
        name: "initial category",
        fields: {
          field0: {
            name: "Initial field",
            type: "string",
            default: "default value",
          },
          field1: {
            name: "Initial field",
            type: "string",
            default: "default value",
          },
        },
      },
      category1: {
        name: "initial category",
        fields: {},
      },
    },
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

const slice = createSystemSlice({
  log: jest.fn(),
  onError: jest.fn(),
});

jest.mock("nanoid", () => {
  return {
    __esModule: true,
    nanoid: () => "foo",
  };
});

// why doesn't this work?
// beforeAll(() => {
//   jest.mock("nanoid", () => {
//     return {
//       __esModule: true,
//       nanoid: () => "foo",
//     };
//   });
// });

afterAll(() => {
  jest.resetModules();
});

describe("reducer", () => {
  it("should ignore unknown actions", () => {
    const result = slice.reducer(initialState, { type: "FOOEY" });
    // no point snapshotting this
    expect(result).toEqual(initialState);
  });

  it.each<TestTuple>([
    [
      "set a value using setSome",
      slice.creators.setSome({ newSettings: { genericOccupation: "foo" } }),
    ],
    ["add a category", slice.creators.addCategory()],
    ["delete a category", slice.creators.deleteCategory({ id: "category0" })],
    [
      "rename a category",
      slice.creators.renameCategory({ id: "category0", newName: "foo" }),
    ],
    [
      "change a category id",
      slice.creators.changeCategoryId({ oldId: "category0", newId: "foo" }),
    ],
    ["add a field", slice.creators.addField({ categoryId: "category0" })],
    [
      "delete a field",
      slice.creators.deleteField({
        categoryId: "category0",
        fieldId: "field0",
      }),
    ],
    [
      "rename a field",
      slice.creators.renameField({
        categoryId: "category0",
        fieldId: "field0",
        newName: "foo",
      }),
    ],
    [
      "change a field id",
      slice.creators.changeFieldId({
        categoryId: "category0",
        fieldId: "field0",
        newFieldId: "foo",
      }),
    ],
    [
      "set a field type",
      slice.creators.setFieldType({
        categoryId: "category0",
        fieldId: "field0",
        newType: "number",
      }),
    ],
    [
      "set a field default",
      slice.creators.setFieldDefault({
        categoryId: "category0",
        fieldId: "field0",
        newDefault: "foo",
      }),
    ],
    [
      "set a field minimum",
      slice.creators.setFieldMin({
        categoryId: "category0",
        fieldId: "field0",
        newMin: 1,
      }),
    ],
    [
      "set a field maximum",
      slice.creators.setFieldMax({
        categoryId: "category0",
        fieldId: "field0",
        newMax: 1,
      }),
    ],
    [
      "apply a preset",
      slice.creators.applyPreset({
        preset: pathOfCthulhuPreset,
        presetId: "pathOfCthulhu",
      }),
    ],
    [
      "add a stat",
      slice.creators.addStat({
        which: "pcStats",
      }),
    ],
    [
      "set a stat minimum",
      slice.creators.setStatMin({
        which: "pcStats",
        id: "pcStat0",
        value: 1,
      }),
    ],
    [
      "set a stat maximum",
      slice.creators.setStatMax({
        which: "pcStats",
        id: "pcStat0",
        value: 1,
      }),
    ],
    [
      "set a stat default",
      slice.creators.setStatDefault({
        which: "pcStats",
        id: "pcStat0",
        value: 1,
      }),
    ],
    ["move a category up", slice.creators.moveCategoryUp({ id: "category1" })],
    [
      "move a category down",
      slice.creators.moveCategoryDown({ id: "category0" }),
    ],

    [
      "move a field up",
      slice.creators.moveFieldUp({
        categoryId: "category0",
        fieldId: "field0",
      }),
    ],
    [
      "move a field down",
      slice.creators.moveFieldDown({
        categoryId: "category0",
        fieldId: "field0",
      }),
    ],
  ])("should %s", (name, action) => {
    const result = slice.reducer(initialState, action);
    const oldJSON = JSON.stringify(initialState, null, 2);
    const newJSON = JSON.stringify(result, null, 2);
    const diff = createPatch(name, oldJSON, newJSON);
    expect(diff).toMatchSnapshot();
  });
});
