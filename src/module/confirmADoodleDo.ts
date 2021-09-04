import { assertGame } from "../functions";
import { systemName } from "../constants";
import Case from "case";

export const confirmADoodleDo = (
  message: string,
  confirmText: string,
  cancelText: string,
  confirmIconClass: string,
  callback: () => void,
) => {
  assertGame(game);
  const tlMessage = game.i18n.format(`${systemName}.${Case.pascal(message)}`);
  const tlConfirmText = game.i18n.format(`${systemName}.${Case.pascal(confirmText)}`);
  const tlCancelText = game.i18n.format(`${systemName}.${Case.pascal(cancelText)}`);
  const d = new Dialog({
    title: "Confirm",
    content: `<p>${tlMessage}</p>`,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-ban"></i>',
        label: tlCancelText,
      },
      delete: {
        icon: `<i class="fas ${confirmIconClass}"></i>`,
        label: tlConfirmText,
        callback,
      },
    },
    default: "cancel",
  });
  d.render(true);
};
