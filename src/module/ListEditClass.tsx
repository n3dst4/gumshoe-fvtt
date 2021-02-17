// import ReactDOM from "react-dom";
import React from "react";
import { ListEditApp } from "../components/inputs/ListEdit";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {FormApplication}
 */
export class ListEditClassBase extends FormApplication {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 660,
      height: 900,
    });
  }
}

const render = (sheet: ListEditClassBase) => {
  return (
    <ListEditApp
      list={["foo", "bar"]}
      foundryApplication={sheet}
    />
  );
};

export const ListEditClass = ReactApplicationMixin(
  ListEditClassBase,
  render,
);
