import React from "react";
import { GumshoeSettings } from "../components/GumshoeSettings";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { reactTemplatePath, systemName } from "../constants";

class InvestigatorSettingsClassBase extends FormApplication {
  // constructor (object: any, options: any) {
  //   super(object, options);
  //   console.log(object, options);
  // }

  /** @override */
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
    <GumshoeSettings
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorSettingsClass = ReactApplicationMixin(
  InvestigatorSettingsClassBase,
  render,
);

export const gumshoeSettingsClassInstance = new InvestigatorSettingsClass({}, {});
