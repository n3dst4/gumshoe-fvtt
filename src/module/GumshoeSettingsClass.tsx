import React from "react";
import { GumshoeSettings } from "../components/GumshoeSettings";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import system from "../system.json";
import { reactTemplatePath } from "../constants";

class GumshoeSettingsClassBase extends FormApplication {
  constructor (object: any, options: any) {
    super(object, options);
    console.log(object, options);
  }

  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [system.name, "sheet", "item", "dialog"],
      template: reactTemplatePath,
      width: 800,
      height: 800,
      resizable: true,
      title: "GUMSHOE Settings",
    });
  }
}

const render = (sheet: GumshoeSettingsClassBase) => {
  $(sheet.element).find(".header-button.close").hide();
  return (
    <GumshoeSettings
      foundryApplication={sheet}
    />
  );
};

export const GumshoeSettingsClass = ReactApplicationMixin(
  GumshoeSettingsClassBase,
  render,
);
