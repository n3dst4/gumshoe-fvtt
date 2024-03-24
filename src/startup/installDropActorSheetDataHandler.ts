import { party, pc } from "../constants";
import { assertGame, getFolderDescendants } from "../functions/utilities";
import { InvestigatorActor } from "../module/InvestigatorActor";

// we are in a high fuckiness situation here. I don't have time to work out what
// the correct types for this DropData are, and there's a breaking change from
// v9 to v10 where the id is replaced with `uuid` which also includes the
// document type?

interface DropDataV9 {
  type: string;
  id: string;
  entity?: string;
}

interface DropDataV10 {
  type: string;
  uuid: string;
  entity?: string;
}

type DropData = DropDataV9 | DropDataV10;

// fuckiness reaching critical levels here, but we do know for now that we will
// have either an id or a uuid.
function getIdFromDropData(dropData: DropData): string {
  return (
    (dropData as DropDataV9).id ||
    (dropData as DropDataV10).uuid.replace(/^[\w]+\./, "")
  );
}

export const installDropActorSheetDataHandler = () => {
  Hooks.on(
    "dropActorSheetData",
    (
      targetActor: InvestigatorActor,
      application: Application,
      dropData: DropData,
    ) => {
      assertGame(game);
      if (
        targetActor.type !== party ||
        (dropData.type !== "Actor" &&
          (dropData.type !== "Folder" || dropData.entity !== "Actor")) ||
        !game.user?.isGM
      ) {
        return;
      }
      const id = getIdFromDropData(dropData);
      const actorIds =
        dropData.type === "Actor"
          ? [id]
          : dropData.type === "Folder"
            ? getFolderDescendants(game.folders?.get(id))
                .filter((actor) => {
                  return (actor as any).type === pc;
                })
                .map((actor) => (actor as any).id)
            : [];

      void targetActor.addActorIds(actorIds);
    },
  );
};
