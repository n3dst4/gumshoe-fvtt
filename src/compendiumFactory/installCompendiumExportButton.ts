import { nanoid } from "nanoid";
import { assertGame } from "../functions";
import { saveJson } from "../saveFile";

export const installCompendiumExportButton = () => {
  Hooks.on(
    "renderCompendium",
    (app: Compendium<CompendiumCollection.Metadata>, jQ: JQuery, data: any) => {
      const id = `investigator_export_${nanoid()}`;
      jQ.find("header.window-header a.close").before(
        `<a id="${id}"><i class="fas fa-cloud-download-alt"></i>Export</a>`,
      );
      document.querySelector(`#${id}`)?.addEventListener("click", async () => {
        assertGame(game);
        await app.getData();
        // what a pavlova just to get the contents of the pack - surely there's
        // a more direct way?
        const contents =
          (await game.packs.get(app.collection.collection)?.getDocuments()) ??
          [];
        const mapped = contents.map(
          ({ data: { name, type, img, data } }: any) => ({
            name,
            type,
            img,
            data,
          }),
        );
        saveJson(
          {
            name: app.collection.metadata.label,
            entity: app.collection.metadata.entity,
            contents: mapped,
          },
          data.collection.metadata.name,
        );
      });
    },
  );
};
