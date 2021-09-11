import { nanoid } from "nanoid";
import { assertGame } from "../functions";
import { saveJson } from "../saveFile";
import { showOpenFilePicker } from "file-system-access";

export const installCompendiumExportButton = () => {
  // Add the "export" button when rendering a Compendium window
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

  // add the "import" button when
  Hooks.on("changeSidebarTab", (app: SidebarTab) => {
    if (app.tabName !== "compendium") {
      return;
    }
    const id = `file-picker-button-${nanoid()}`;
    const content = $(`<div class="header-actions action-buttons flexrow">
        <button id="${id}" class="import-compendium" type="submit"><i class="fas fa-cloud-upload-alt"></i> Import Compendium</button>
    </div>`);
    $(app.element[0]).find(".directory-header").append(content);
    document.querySelector(`#${id}`)?.addEventListener("click", async () => {
      const [fileHandle] = await showOpenFilePicker({
        types: [], // default
        multiple: false, // default
        excludeAcceptAllOption: false, // default
        _preferPolyfill: false, // default
      } as any);
      const file = await fileHandle.getFile();
      const text = await file.text();
      console.log(text);
    });
  });
};
