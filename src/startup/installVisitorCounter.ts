import { countSystemVisit } from "@lumphammer/fvtt-visitor-counter-client";
import { getDevMode } from "../functions";

export const installVisitorCounter = () => {
  Hooks.on("ready", () => {
    if (!getDevMode()) {
      countSystemVisit();
    }
  });
};
