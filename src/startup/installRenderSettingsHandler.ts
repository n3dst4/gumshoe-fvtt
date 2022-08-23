import { assertGame, getTranslated } from "../functions";
import { investigatorSettingsClassInstance } from "../module/SettingsClass";

export const installRenderSettingsHandler = () => {
  Hooks.on("renderSettings", (app: Application, html: JQuery) => {
    assertGame(game);
    const systemNameTranslated = getTranslated("SystemName");
    const text = getTranslated("SystemNameSystemSettings", {
      SystemName: systemNameTranslated,
    });
    const button = $(`<button><i class="fas fa-search"></i>${text}</button>`);
    html.find('button[data-action="configure"]').after(button);

    button.on("click", (ev) => {
      ev.preventDefault();
      investigatorSettingsClassInstance.render(true);
    });
  });
};
