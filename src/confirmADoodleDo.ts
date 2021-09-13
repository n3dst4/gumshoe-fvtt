import { assertGame, getTranslated } from "./functions";
import { Dictionary } from "lodash";

export const confirmADoodleDo = (
  message: string,
  confirmText: string,
  cancelText: string,
  confirmIconClass: string,
  values: Dictionary<string|number>,
  callback: () => void,
) => {
  assertGame(game);
  const tlMessage = getTranslated(message, values);
  const tlConfirmText = getTranslated(confirmText, values);
  const tlCancelText = getTranslated(cancelText, values);
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
