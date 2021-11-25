import { systemName } from "./constants";
import Case from "case";
import { Dictionary } from "lodash";
import { getDebugTranslations } from "./settingsHelpers";
import { escape as escapeText } from "html-escaper";
import { safeTurndown } from "./turndown";

interface NameHaver {
  name: string|null;
}

export const sortEntitiesByName = <T extends NameHaver>(ents: T[]) => {
  return ents.sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  });
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
  const paddingSize = Math.max(0, desiredlength - (originalArray?.length ?? 0));
  const result = [
    ...(originalArray || []),
    ...new Array(paddingSize).fill(paddingElement),
  ].slice(0, desiredlength);
  return result;
};

export const mapValues = <V1, V2>(
  mapper: (v: V1) => V2,
  subject: {[k: string]: V1},
): {[k: string]: V2} => {
  const result: {[k: string]: V2} = {};
  for (const k in subject) {
    result[k] = mapper(subject[k]);
  }
  return result;
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
export function isGame (game: any): game is Game {
  return game instanceof Game;
}

export function assertGame (game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

export const getTranslated = (
  text: string,
  values: Dictionary<string|number> = {},
) => {
  assertGame(game);
  const debug = getDebugTranslations();
  const pascal = Case.pascal(text);
  const prefixed = `${systemName}.${pascal}`;
  const local = game.i18n.format(prefixed, values);
  const has = game.i18n.has(prefixed, false);
  return `${debug ? (has ? "✔ " : "❌ ") : ""}${local}`;
};

interface confirmADoodleDoArgs {
  message: string;
  confirmText: string;
  cancelText: string;
  confirmIconClass: string;
  values?: Dictionary<string|number>;
  resolveFalseOnCancel?: boolean;
}

/**
 * Pop up a foundry confirmation box. Returns a promise that resolves `true`
 * when the user clicks the confirm button.
 * The default behaviour is to not resolve at all if the user clicks `cancel`,
 * sine most commonly you want to just do nothing, but if you specify
 * `resolveFalseOnCancel: true` it will resolve `false` in that case.
 */
export const confirmADoodleDo = ({
  message,
  confirmText,
  cancelText,
  confirmIconClass,
  values = {},
  resolveFalseOnCancel = false,
}: confirmADoodleDoArgs) => {
  assertGame(game);
  const tlMessage = getTranslated(message, values);
  const tlConfirmText = getTranslated(confirmText, values);
  const tlCancelText = getTranslated(cancelText, values);
  const promise = new Promise<boolean>((resolve) => {
    const onConfirm = () => {
      resolve(true);
    };
    const onCancel = () => {
      if (resolveFalseOnCancel) {
        resolve(false);
      }
    };
    const d = new Dialog({
      title: "Confirm",
      content: `<p>${tlMessage}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: tlCancelText,
          callback: onCancel,
        },
        confirm: {
          icon: `<i class="fas ${confirmIconClass}"></i>`,
          label: tlConfirmText,
          callback: onConfirm,
        },
      },
      default: "cancel",
    });
    d.render(true);
  });
  return promise;
};

export const plainTextToHtml = (source: string) => {
  return escapeText(source).replace(/\n/g, "<br/>");
};

/**
 * use turndown to get markdown back out of html, but then specifically unescape
 * foundry's link syntax
 */
export const htmlToMarkdown = (source: string) => {
  // ever first-time a cool regex and then realise you don't need it, but
  // you're so proud of your ninja regex skills dating back to doing Perl in the
  // 90s that you want to leave it in as a comment? Anyway check this bad boy
  // out. Turns out I don't need it because I've overridden turndown to stop it
  // doing any escaping at all.
  // return turndown(source).replace(/@(\w+)\\\[(\w+)\\\]\{([^}]*)\}/g, (m, p1, p2, p3) => `@${p1}[${p2}]{${p3}}`);
  return safeTurndown(source);
};
