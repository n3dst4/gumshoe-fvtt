import { assertGame } from "../functions";
import { systemName } from "../constants";
import Case from "case";
import { Dictionary } from "lodash";
import { getDebugTranslations } from "../settingsHelpers";

const getXlated = (text: string, values: Dictionary<string|number>) => {
  assertGame(game);
  const debug = getDebugTranslations();
  const pascal = Case.pascal(text);
  const prefixed = `${systemName}.${pascal}`;
  const local = game.i18n.format(prefixed, values);
  const has = game.i18n.has(prefixed, false);
  return `${debug ? (has ? "✔ " : "❌ ") : ""}${local}`;
};

export const confirmADoodleDo = (
  message: string,
  confirmText: string,
  cancelText: string,
  confirmIconClass: string,
  values: Dictionary<string|number>,
  callback: () => void,
) => {
  assertGame(game);
  const tlMessage = getXlated(message, values);
  const tlConfirmText = getXlated(confirmText, values);
  const tlCancelText = getXlated(cancelText, values);
  const d = new Dialog({
    title: "Confirm",
    content: `<p>${tlMessage}</p>`,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-ban"></i>',
        label: tlCancelText,
      },
      confirm: {
        icon: `<i class="fas ${confirmIconClass}"></i>`,
        label: tlConfirmText,
        callback,
      },
    },
    default: "cancel",
  });
  d.render(true);
};
