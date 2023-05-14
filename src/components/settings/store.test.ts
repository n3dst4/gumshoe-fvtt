// import { nanoid } from "nanoid";
import { createSystemSlice } from "./store";
import { State } from "./types";
import { expect, jest, it, describe } from "@jest/globals";
// import * as functions from "../../functions";
import { AnyAction } from "./reducerTools";
import { pathOfCthulhuPreset } from "../../presets";
// import { createPatch } from "diff";
import { diff } from "jest-diff";

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

// const initialStateJSON = JSON.stringify(initialState, null, 2);

const noColor = (x: string) => x;

const slice = createSystemSlice({
  log: jest.fn(),
  onError: jest.fn(),
});

// we need to mock nanoid so that we can predictably generate ids
// I tried putting this in beforeAll but for some reason we weren't seeing the
// mock in the test
jest.mock("nanoid", () => {
  let count = 0;
  return {
    __esModule: true,
    nanoid: () => "id" + count++,
  };
});

afterAll(() => {
  jest.resetModules();
});

/*
 * DIFF SNAPSHOT TESTS!
 *
 * Rather than maintain a manual list of expected values,
 * we can just snapshot the diff between the initial state and the state after
 * the action is applied. This means the tests are not super brittle in the
 * event of the structure changing, but it does require you to manually check
 * the diff to make sure it's what you expect.
 *
 * The snapshots are stored in the __snapshots__ folder.
 *
 * To update the snapshots, run `npx jest-u`
 *
 * AND PLEASE CHECK THE DIFFS AFTER UPDATING! Your git tool of choice will help
 * here, so you can just compare the diffs that have changed. Yes, it might feel
 * a bit weird looking at "diffs of diffs", but you'll get the hang of it.
 */
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
    ["move a category up", slice.creators.moveCategoryUp({ id: "category1" })],
    [
      "move a category down",
      slice.creators.moveCategoryDown({ id: "category0" }),
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
    [
      "set a stat default",
      slice.creators.setStatDefault({
        which: "pcStats",
        id: "pcStat0",
        value: 1,
      }),
    ],
    [
      "set a stat name",
      slice.creators.setStatName({
        which: "pcStats",
        id: "pcStat0",
        name: "foo",
      }),
    ],
    [
      "delete a stat",
      slice.creators.deleteStat({
        which: "pcStats",
        id: "pcStat0",
      }),
    ],
    [
      "set a stat id",
      slice.creators.setStatId({
        which: "pcStats",
        oldId: "pcStat0",
        newId: "foo",
      }),
    ],
  ])("should %s", (name, action) => {
    // * why snapshots of diffs?
    //   * they're smaller and easier to read than snapshotting the entire
    //     output object. You can peruse the snapshots file and see the
    //     *changes* caused by the action, rather than the entire state.
    // * why a patch formatted diff?
    //   * first attempt used an object diff (from `just-diff`) but that does
    //     not detect changes in key order.
    const result = slice.reducer(initialState, action);
    // const resultJSON = JSON.stringify(result, null, 2);
    const diffs = diff(initialState, result, {
      aColor: noColor,
      bColor: noColor,
      changeColor: noColor,
      commonColor: noColor,
      patchColor: noColor,
      contextLines: 3,
      expand: false,
      omitAnnotationLines: true,
    });
    expect(diffs).toMatchSnapshot();
  });
});
