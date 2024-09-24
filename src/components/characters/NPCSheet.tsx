import { assertGame } from "../../functions/utilities";
import { useIsDocumentLimited } from "../../hooks/useIsDocumentLimited";
import { useActorSheetContext } from "../../hooks/useSheetContexts";
import { assertNPCActor } from "../../v10Types";
import { NPCSheetFull } from "./NPCSheetFull";
import { NPCSheetSimple } from "./NPCSheetSimple";

export const NPCSheet = () => {
  const { actor } = useActorSheetContext();

  assertNPCActor(actor);
  assertGame(game);

  const isLimited = useIsDocumentLimited();

  if (isLimited) {
    return <NPCSheetSimple />;
  } else {
    return <NPCSheetFull />;
  }
};

NPCSheet.displayName = "NPCSheet";
