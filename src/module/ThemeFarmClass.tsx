import { ReactApplicationMixin } from "@lumphammer/shared-fvtt-bits/src/ReactApplicationMixin";

import { reactTemplatePath, systemId } from "../constants";
import { ThemeFarm } from "../themes/components/ThemeFarm";

class ThemeFarmClassBase extends FormApplication {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [systemId, "sheet", "item", "dialog"],
      template: reactTemplatePath,
      width: window.innerWidth,
      height: window.innerHeight,
      resizable: true,
      top: 0,
      left: 0,
      title: "Theme Farm",
    });
  }

  // this is here to satisfy foundry-vtt-types
  _updateObject(event: Event, formData?: any) {
    return Promise.resolve();
  }
}

const render = (sheet: ThemeFarmClassBase) => {
  return <ThemeFarm foundryApplication={sheet} />;
};

export const ThemeFarmClass = ReactApplicationMixin(
  "ThemeFarmClass",
  ThemeFarmClassBase,
  render,
);

export const themeFarmClassInstance = new ThemeFarmClass({}, {});
