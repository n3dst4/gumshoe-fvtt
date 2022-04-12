import { assertGame } from "../functions";
import { version } from "../constants";

/**
 * install a script tag for fathom analytics - see https://usefathom.com/ .
 * fathom is a privacy-first, GDPR-compliant tracker. it just gives us some clue
 * how many people are using this software, which browser, what country etc,
 * nothing specific enough to be a fingerprint.
 */
export function installFathom () {
  if (process.env.NODE_ENV === "production") {
    // create a script element based on the code snippet that fathom provides.
    // (injecting raw HTML with a script tag in it doesn't actually load the
    // script.)
    logger.log("Installing Fathom");
    const scriptEl = document.createElement("script");
    scriptEl.setAttribute("src", "https://twentyseven-metal.lumphammer.net/script.js");
    scriptEl.setAttribute("data-spa", "auto");
    scriptEl.setAttribute("data-site", "HXDZGAVA");
    scriptEl.setAttribute("defer", "defer");
    document.body.appendChild(scriptEl);
  }
  Hooks.on("ready", () => {
    assertGame(game);
    window.fathom?.trackGoal("371LNPLT", version);
    window.fathom?.trackGoal("4NLLMFEW", game.version);
  });
}

declare global {
  interface Window {
    fathom?: {
      trackGoal(key: string, value: any): void,
    };
  }
}
