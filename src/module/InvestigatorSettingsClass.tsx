import React from "react";
import { Settings } from "../components/Settings";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { reactTemplatePath, systemName } from "../constants";

// eslint doesn't like object, but it's what foundry-vtt-types wants
// eslint-disable-next-line @typescript-eslint/ban-types
export class InvestigatorSettingsClassBase extends FormApplication<FormApplicationOptions, object, undefined> {
  // /** @override */
  static get defaultOptions () {
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
  _updateObject (event: Event, formData?: any) {
    return Promise.resolve();
  }
}

const render = (sheet: InvestigatorSettingsClassBase) => {
  $(sheet.element).find(".header-button.close").hide();
  return (
    <Settings
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorSettingsClass = ReactApplicationMixin(
  InvestigatorSettingsClassBase,
  render,
);

export const investigatorSettingsClassInstance = new InvestigatorSettingsClass(undefined, {});
