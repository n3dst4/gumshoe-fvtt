import React from "react";
import { GumshoeSettings } from "../components/GumshoeSettings";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import system from "../system.json";
import { reactTemplatePath } from "../constants";

class GumshoeSettingsClassBase extends Application {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [system.name, "sheet", "item"],
      template: reactTemplatePath,
      width: 800,
      height: 800,
      resizable: true,
    });
  }
}

const render = (sheet: GumshoeSettingsClassBase) => {
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
