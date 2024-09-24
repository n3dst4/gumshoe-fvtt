import React from "react";

import { assertGame } from "../../functions/utilities";
import { useIsDocumentLimited } from "../../hooks/useIsDocumentLimited";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertNPCActor } from "../../v10Types";
import { NPCSheetFull } from "./NPCSheetFull";
import { NPCSheetSimple } from "./NPCSheetSimple";

type NPCSheetProps = {
  actor: InvestigatorActor;
  foundryApplication:
    | ActorSheet
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | foundry.applications.api.DocumentSheetV2<InvestigatorActor>;
};

export const NPCSheet = ({ actor, foundryApplication }: NPCSheetProps) => {
  assertNPCActor(actor);
  assertGame(game);

  const isLimited = useIsDocumentLimited();

  if (isLimited) {
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
