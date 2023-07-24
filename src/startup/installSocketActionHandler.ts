import * as constants from "../constants";
import { assertGame } from "../functions";
import { isSocketHookAction } from "../typeAssertions";

export function installSocketActionHandler() {
  Hooks.on("ready", () => {
    assertGame(game);
    game.socket?.on(constants.socketScope, (data: any) => {
      if (isSocketHookAction<unknown>(data)) {
        Hooks.call(data.hook, data.payload);
      }
    });
  });
}
