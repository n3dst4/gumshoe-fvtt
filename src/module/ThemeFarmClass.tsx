import React from "react";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { reactTemplatePath, systemName } from "../constants";
import { ThemeFarm } from "../components/themeFarm/ThemeFarm";

class ThemeFarmClassBase extends FormApplication {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "item", "dialog"],
      template: reactTemplatePath,
      width: 700,
      height: 800,
      resizable: true,
      title: "Theme Farm",
    });
  }

  // this is here to satisfy foundry-vtt-types
  _updateObject (event: Event, formData?: any) {
    return Promise.resolve();
  }
}

const render = (sheet: ThemeFarmClassBase) => {
  return (
    <ThemeFarm
      foundryApplication={sheet}
    />
  );
};

export const ThemeFarmClass = ReactApplicationMixin(
  ThemeFarmClassBase,
  render,
);

export const themeFarmClassInstance = new ThemeFarmClass({}, {});

export function installShowThemeFarmHack () {
  (window as any).showThemeFarm = function showThemefarm () {
    themeFarmClassInstance.render(true);
  };
}
