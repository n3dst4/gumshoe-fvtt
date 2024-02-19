import React from "react";

import { assertGame } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertNPCActor } from "../../v10Types";
import { NPCSheetFull } from "./NPCSheetFull";
import { NPCSheetSimple } from "./NPCSheetSimple";

type NPCSheetProps = {
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
};

export const NPCSheet = ({ actor, foundryApplication }: NPCSheetProps) => {
  assertNPCActor(actor);
  assertGame(game);

  const user = game.user;
  const myLevel = user ? actor.getUserLevel(user) ?? 0 : 0;

  // @ts-expect-error types still have DOCUMENT_PERMISSION_LEVELS
  if (myLevel === CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED) {
    return (
      <NPCSheetSimple actor={actor} foundryApplication={foundryApplication} />
    );
  } else {
    return (
      <NPCSheetFull actor={actor} foundryApplication={foundryApplication} />
    );
  }
};

NPCSheet.displayName = "NPCSheet";
