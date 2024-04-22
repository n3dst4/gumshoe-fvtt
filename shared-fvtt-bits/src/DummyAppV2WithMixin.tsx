import "./ApplicationV2Types";

import React from "react";

import { DummyComponent } from "./DummyComponent";
import { ReactApplicationV2Mixin } from "./ReactApplicationV2Mixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
// class DummyAppV2WithMixinClassBase extends foundry.applications.api
//   .ApplicationV2 {
//   // /** @override */
//   // static get defaultOptions() {
//   //   return foundry.utils.mergeObject(super.defaultOptions, {
//   //     width: 777,
//   //     height: 900,
//   //   });
//   // }
// }

const render = (sheet: foundry.applications.api.ApplicationV2) => {
  return <DummyComponent>Hey from mixed in code</DummyComponent>;
};

export const DummyAppV2WithMixin = ReactApplicationV2Mixin(
  "DummyAppV2WithMixin",
  foundry.applications.api.ApplicationV2,
  render,
);
