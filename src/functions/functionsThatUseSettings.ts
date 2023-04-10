import Case from "case";
import { settings } from "../settings";
import { assertGame, getDevMode } from "./functionsThatDontUseSettings";
import * as constants from "../constants";

/**
 * convenience method to grab a translated string
 */
export const getTranslated = (
  text: string,
  values: Record<string, string | number> = {},
) => {
  assertGame(game);
  const debug = settings.debugTranslations.get() && getDevMode();
  const pascal = Case.pascal(text);
  const prefixed = `${constants.systemName}.${pascal}`;
  const local = game.i18n.format(prefixed, values);
  const has = game.i18n.has(prefixed, false);
  return `${debug ? (has ? "✔ " : "❌ ") : ""}${local}`;
};

interface confirmADoodleDoArgs {
  message: string;
  confirmText: string;
  cancelText: string;
  confirmIconClass: string;
  values?: Record<string, string | number>;
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
