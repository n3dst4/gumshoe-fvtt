import { nanoid } from "nanoid";
import { assertGame } from "../functions";
import { saveJson } from "../saveFile";
// file-system-access does dynamic `import(...)` which caused some headaches -
// see webpack.config.js and setWebpackPublicPath.ts
import { showOpenFilePicker } from "file-system-access";
import { ExportedCompendium, importCompendium } from "./importCompendium";

const importButtonIconClass = "fa-cloud-upload-alt";
const importButtonSpinnerClass = "fa-spinner fa-pulse";

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
        const exportData: ExportedCompendium = {
          name: app.collection.metadata.label,
          entity: app.collection.metadata.entity,
          contents: mapped,
        };
        saveJson(
          exportData,
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
        <button id="${id}" class="import-compendium" type="submit">
          <i class="fas ${importButtonIconClass}"></i> Import Compendium
        </button>
    </div>`);
    $(app.element[0]).find(".directory-header").append(content);
    document.querySelector(`#${id}`)?.addEventListener("click", async () => {
      $(`#${id} i`).removeClass(importButtonIconClass).addClass(importButtonSpinnerClass);
      try {
        const [fileHandle] = await showOpenFilePicker({
          types: [
            {
              description: "JSON",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        } as any);
        const file = await fileHandle.getFile();
        const text = await file.text();
        importCompendium(JSON.parse(text));
      } finally {
        $(`#${id} i`).removeClass(importButtonSpinnerClass).addClass(importButtonIconClass);
      }
    });
  });
};
