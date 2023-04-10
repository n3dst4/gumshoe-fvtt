import * as constants from "../constants";
import { SocketHookAction } from "../types";

interface NameHaver {
  name: string | null;
}

export const sortEntitiesByName = <T extends NameHaver>(ents: T[]) => {
  return ents.sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName.localeCompare(bName);
  });
};

function isMapIndexFunction<T>(
  x: T | ((index: number) => T),
): x is (index: number) => T {
  return typeof x === "function";
}

/**
 * Given an array (or nullish), a desired length, and a padding element, return
 * an array which is at least the desired length by padding the original if
 * necessary.
 */
export const padLength = <T>(
  originalArray: T[] | null | undefined,
  desiredlength: number,
  paddingElement: T | ((index: number) => T),
): T[] => {
  const originalLength = originalArray?.length ?? 0;
  const paddingSize = Math.max(0, desiredlength - originalLength);
  const padding = isMapIndexFunction(paddingElement)
    ? new Array(paddingSize)
        .fill(0)
        .map((_, i) => paddingElement(i + originalLength))
    : new Array(paddingSize).fill(paddingElement);
  const result = [...(originalArray || []), ...padding];
  return result;
};

/**
 * Given an array (or nullish), a desired length, and a padding element, return
 * an array which is exactly the desired length by either padding or truncating
 * the original.
 */
export const fixLength = <T>(
  originalArray: T[] | null | undefined,
  desiredlength: number,
  paddingElement: T,
): T[] => {
  const padded = padLength(originalArray, desiredlength, paddingElement);
  const result = padded.slice(0, desiredlength);
  return result;
};

export const mapValues = <V1, V2, K extends string = string>(
  mapper: (v: V1, k: K, i: number) => V2,
  subject: { [k in K]: V1 },
): { [k in K]: V2 } => {
  const result: { [k: string]: V2 } = {};
  let i = 0;
  for (const k in subject) {
    result[k] = mapper(subject[k], k, i);
    i += 1;
  }
  return result as { [k in K]: V2 };
};

export const isNullOrEmptyString = (x: any) => {
  return x === null || x === undefined || x === "";
};

// Folder type is a bit fucky rn
export const getFolderDescendants = <T extends Document>(folder: any): T[] => {
  return [...folder.children.flatMap(getFolderDescendants), ...folder.content];
};

// version of Object.prototype.hasOwnProperty that's safe even when prototype
// has been overridden
export const hasOwnProperty = (x: any, y: string) =>
  Object.prototype.hasOwnProperty.call(x, y);

/**
 * Check that `game` has been initialised
 */
export function isGame(game: any): game is Game {
  return game instanceof Game;
}

/**
 * Throw if `game` has not been initialized. This is hyper unlikely at runtime
 * but technically possible during a calamitous upfuckage to TS keeps us honest
 * and requires a check.
 */
export function assertGame(game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

/**
 * The developer mode package allows any module to be put into "debug mode".
 * This is just a convenience function to get the curent value of the debug flag
 * for INVESTIGATOR.
 */
export function getDevMode() {
  assertGame(game);
  return !!(game.modules.get("_dev-mode") as any)?.api?.getPackageDebugValue(
    constants.systemId,
  );
}

export function assertNotNull<T>(t: T | undefined | null): asserts t is T {
  if (t === undefined) {
    throw new Error("t was undefined");
  }
}

/**
 * create a new object with a key "renamed" in the same order
 * this keeps the renamed key in the same relative order, if you're relying on
 * JS's object key order being stable
 */
export function renameProperty<T>(
  oldProp: string,
  newProp: string,
  subject: Record<string, T>,
) {
  const result: Record<string, T> = {};
  for (const p in subject) {
    if (p === oldProp) {
      result[newProp] = subject[oldProp];
    } else {
      result[p] = subject[p];
    }
  }
  return result;
}

export function broadcastHook<T>(hook: string, payload: T) {
  assertGame(game);
  const socketHookAction: SocketHookAction<T> = {
    hook,
    payload,
  };
  game.socket?.emit(constants.socketScope, socketHookAction);
  Hooks.call(hook, payload);
}

export const makeLogger = (name: string) =>
  console.log.bind(console, `[${name}]`);

/**
 * Get a file from the user's computer and return it as a string.
 * Nicked off from various sources:
 * https://code-boxx.com/read-files-javascript/
 * https://github.com/GoogleChromeLabs/text-editor/blob/e3a33c2c0b1832ecdb7221f17d7f8a1b23e1ad19/src/inline-scripts/fallback.js#L28
 * https://stackoverflow.com/questions/26754486/how-to-convert-arraybuffer-to-string
 */
export async function getUserFile(accept: string): Promise<string> {
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.accept = accept;
  const file = await new Promise<File>((resolve, reject) => {
    filePicker.onchange = () => {
      const file = filePicker.files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("Aborted"));
      }
    };
    filePicker.click();
  });
  const reader = new FileReader();
  const textPromise = new Promise<string>((resolve, reject) => {
    reader.addEventListener("loadend", () => {
      const text =
        reader.result === null
          ? ""
          : typeof reader.result === "string"
          ? reader.result
          : new TextDecoder("utf-8").decode(new Uint8Array(reader.result));
      resolve(text);
    });
  });
  reader.readAsText(file);
  return textPromise;
}

export const mapObject =
  <T, U>(fn: (val: T, key: string, i: number) => U) =>
  (obj: Record<string, T>): Record<string, U> => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val], i) => [key, fn(val, key, i)]),
    );
  };

export function moveKeyUp<V>(
  obj: Record<string, V>,
  key: string,
): Record<string, V> {
  const entries = Object.entries(obj);
  const index = entries.findIndex(([k]) => k === key);
  if (index === 0) {
    throw new Error(`Cannot move up from index ${index}`);
  }
  if (index >= entries.length || index < 0) {
    throw new Error(`Index ${index} out of range`);
  }
  const item = entries[index];
  entries.splice(index, 1);
  entries.splice(index - 1, 0, item);
  const result = Object.fromEntries(entries);
  return result;
}

export function moveKeyDown<V>(
  obj: Record<string, V>,
  key: string,
): Record<string, V> {
  const entries = Object.entries(obj);
  const index = entries.findIndex(([k]) => k === key);
  if (index === entries.length - 1) {
    throw new Error("Cannot move down from last index");
  }
  if (index >= entries.length || index < 0) {
    throw new Error(`Index ${index} out of range`);
  }
  const cat = entries[index];
  entries.splice(index, 1);
  entries.splice(index + 1, 0, cat);
  const result = Object.fromEntries(entries);
  return result;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
