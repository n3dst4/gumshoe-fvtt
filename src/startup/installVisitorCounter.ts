import { countSystemVisit } from "@lumphammer/fvtt-visitor-counter-client";

export const installVisitorCounter = () => {
  Hooks.on("ready", countSystemVisit);
};
