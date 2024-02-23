import React from "react";

import { ReactApplicationMixin } from "../../subtrees/shared-fvtt-bits/src/ReactApplicationMixin";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemId } from "../constants";

const Settings = React.lazy(() =>
  import("../components/settings/Settings").then(({ Settings }) => ({
    default: Settings,
  })),
);

// this has to be a FormApplication so that we can "register" it as a "menu"
// in settings
export class SettingsClassBase extends FormApplication<
  FormApplicationOptions,
  object,
  undefined
> {
  // /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [systemId, "sheet", "item", "dialog"],
      template: reactTemplatePath,
      width: 700,
      height: 800,
      resizable: true,
      title: "GUMSHOE Settings",
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

export const SettingsClass = ReactApplicationMixin(
  "SettingsClass",
  SettingsClassBase,
  render,
);

export const investigatorSettingsClassInstance = new SettingsClass(
  undefined,
  {},
);
