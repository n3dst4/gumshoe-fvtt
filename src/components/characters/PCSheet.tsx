import React from "react";
import { assertGame } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertPCActor } from "../../v10Types";
import { PCSheetFull } from "./PCSheetFull";
import { PCSheetSimple } from "./PCSheetSimple";
interface PCSheetProps {
  actor: InvestigatorActor;
  foundryApplication: ActorSheet;
}

export const PCSheet: React.FC<PCSheetProps> = ({
  actor,
  foundryApplication,
}) => {
  assertGame(game);
  assertPCActor(actor);

  const user = game.user;
  const myLevel = user ? actor.getUserLevel(user) ?? 0 : 0;
  // @ts-expect-error types still have DOCUMENT_PERMISSION_LEVELS
  if (myLevel === CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED) {
    return (
      <PCSheetSimple actor={actor} foundryApplication={foundryApplication} />
    );
  } else {
    return (
      <PCSheetFull actor={actor} foundryApplication={foundryApplication} />
    );
  }
};

PCSheet.displayName = "PCSheet";
