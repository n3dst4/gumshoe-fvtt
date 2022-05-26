import { assertGame } from "../functions";
import * as constants from "../constants";
import { isSocketAction } from "../types";

export function installSocketActionHandler () {
  Hooks.on("ready", () => {
    assertGame(game);
    game.socket?.on(constants.socketScope, (data: any) => {
      if (isSocketAction<unknown>(data)) {
        Hooks.call(data.type, data.payload);
      }
    });
  });
}
