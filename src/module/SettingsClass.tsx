import React from "react";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { reactTemplatePath, systemName } from "../constants";
import { Suspense } from "../components/Suspense";

const Settings = React.lazy(() =>
  import("../components/settings/Settings").then(({ Settings }) => ({
    default: Settings,
  })),
);

// eslint doesn't like object, but it's what foundry-vtt-types wants
// eslint-disable-next-line @typescript-eslint/ban-types
export class SettingsClassBase extends FormApplication<
  FormApplicationOptions,
  object,
  undefined
> {
  // /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "item", "dialog"],
      template: reactTemplatePath,
      width: 700,
      height: 800,
      resizable: true,
      title: "INVESTIGATOR Settings",
    });
  }

  // this is here to satisfy foundry-vtt-types
  _updateObject(event: Event, formData?: any) {
    return Promise.resolve();
  }
}

const render = (sheet: SettingsClassBase) => {
  $(sheet.element).find(".header-button.close").hide();
  return (
    <Suspense>
      <Settings foundryApplication={sheet} />
    </Suspense>
  );
};

export const SettingsClass = ReactApplicationMixin(SettingsClassBase, render);

export const investigatorSettingsClassInstance = new SettingsClass(
  undefined,
  {},
);
