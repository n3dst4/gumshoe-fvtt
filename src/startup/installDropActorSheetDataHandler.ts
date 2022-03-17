import { InvestigatorActor } from "../module/InvestigatorActor";
import { party, pc } from "../constants";
import { assertGame, getFolderDescendants } from "../functions";

export const installDropActorSheetDataHandler = () => {
  Hooks.on(
    "dropActorSheetData",
    (
      targetActor: InvestigatorActor,
      application: Application,
      dropData: { type: string, id: string, entity?: string },
    ) => {
      assertGame(game);
      if (
        targetActor.data.type !== party ||
        (dropData.type !== "Actor" &&
          (dropData.type !== "Folder" || dropData.entity !== "Actor")) ||
        !game.user?.isGM
      ) {
        return;
      }
      const actorIds =
        dropData.type === "Actor"
          ? [dropData.id]
          : dropData.type === "Folder"
            ? getFolderDescendants(game.folders?.get(dropData.id))
                .filter((actor) => {
                  return (actor as any).data.type === pc;
                })
                .map((actor) => (actor as any).id)
            : [];

      targetActor.addActorIds(actorIds);
    },
  );
};
