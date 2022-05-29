# Development notes

- [Development notes](#development-notes)
  - [Development & general hacking](#development--general-hacking)
  - [Migrations](#migrations)
  - [Generating Compendium packs](#generating-compendium-packs)
  - [Translations](#translations)
  - [Adding Actor or Item data fields](#adding-actor-or-item-data-fields)
  - [Adding system settings](#adding-system-settings)
  - [Using the "Developer mode" module](#using-the-developer-mode-module)
  - [Development flow](#development-flow)
  - [Release process](#release-process)

## Development & general hacking

If you're a developer and you'd like to hack on this code, please be aware it uses Webpack and React so some of it will not look like normal Handlebars + JQuery Foundry stuff.

1. Clone the repo.
2. Copy `foundryconfig_template.json` to `foundryconfig.json` and edit it to fill in the `dataPath`, e.g.  `"dataPath" "/home/ndc/foundrydata",`.
3. `npm i` to install dependencies
4. `npm run build` to do a build
5. `npm run link` to link it into your foundry data folder
6. `npm start` to start a live incremental build (so you don't need to keep running `npm run build` after every change).
7. Open your local foundry server and create a world using this as the system.

## Migrations

The migrations system is inspired by an earlier version of the one in the 5e system. It is triggered from `investigator.ts` based on version number.

If you want to force migrations to run, try this:

```ts
game.settings.set("investigator","systemMigrationVersion", "1.0.0")
```


## Generating Compendium packs

1. In your **Items** tab, delete the "Trail of Cthulhu Abilies" folder
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for the pack (right click and `Toggle edit lock` if you see a padlock.) 
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compenium packs if you like
5. Copy the `packs/*.db` files back from `dist/` into `src/`

## Translations

There are three npm tasks pertaining to translations:

* `npm run groom-translations` will:
  * alphabetise `en.json` and all the other core translations.
  * report any missing translations.
  * report any "extra" translations.
* `npm run extract-pack-translation-templates` will:
  * populate `src/lang/babele-sources` with template translation files based on the packs.
  * YOU WILL PROBABLY WANT TO UPLOAD THESE TO TRANSIFEX IF THEY CHANGE.
* `npm run pull-translations` will:
  * use the Transifex command line tool, [`tx`](https://docs.transifex.com/client/installing-the-client), to pull in the latest translations and overwrite all the JSONs.
  * THIS WILL CLOBBER ANY JSON MODIFICATIONS WHICH HAVE NOT BEEN UPLOADED TO TRANSIFEX!

To keep the translation imports running sweetly, you will need to update `.tx/config` to map everything to the right places.


## Adding Actor or Item data fields

1. Add the field to [`src/template.json`](). This is what Foundry uses to generate initial data for new actors and items, and to do some kind of validation on entries when they get saved.
2. Add the field to [`src/types.ts`](), in the appropriate `*SourceData` type.
3. In  `src/module/InvestigatorActor.ts`, add `get*` and `set*` methods with the appropriate `assert*` call (see existing examples.)


## Adding system settings

1. Add an entry to [`src/settings.ts`]().
2. In [`src/components/InvestigatorSettings.tsx`](), add it to the JSX somewhere - see the existing examples. `tempSettings` will contain the value and `setters` will have the setter.
3. You will probably need to add a translation string to [`src/lang/en.json`]() or maybe [`src/lang/moribundWorld/en.json`]() for MW stuffs.
4. If it's a setting that caan be controlled by system presets, also add it to the `PresetV1` type in @lumphammer/investigator-fvtt-types and publish a new version.


## Using the "Developer mode" module

There's a fantastic Foundry VTT module called [🧙 Developer Mode](https://foundryvtt.com/packages/_dev-mode). I highly recommend installing it if you're doing any development work on Foundry. You can also use it to activate specific developer features for systems. To do this, click on the little wizard dude in the top left of the screen, go to "Package specific debugging", and "Enable Debug Mode" for "INVESTIGATOR System".

What this enables (list subject to change):

* Notes fields will now have a "view source" mode (looks like `</>`.)
* "NUKE" button on PC character sheet (this used to be present all the time.)
* "Debug translations" option available in INVESTIGATOR System Settings.


## Development flow

* We develop on main, with occasional feature branches or forks as needed and wanted.
* We deliver both the public-facing manifest and the downloadable zip package using [GitLab Generic Packages][gl-generic-packages].
* The manifest in VCS points to the "latest package" of the manifest and the download.
* To do a release, we push a tag.
* The CI kicks in and:
  * Checks that the tag matches the version in the manifest. Barfs if not right.
  * Works out the release asset URL and set the `download` path.
  * Runs the build.
  * Uploads a "latest package" of the manifest.
  * Uploads a "latest package" of the actual package.
  * Creates a release with linked assets for the above.


## Release process

*The innocuous-looking 4.9.7 release represented a change in how we do releases. We used to have a `release` branch which pointed to the most recent release, with attachment links pasted into `system.json` for the download. For the forseeable future we wiill need to fast-forward `release` to `main` when releasing to make sure we catch slow updaters*

To perform a release: 

1. Update the version in `package.json` and `system.json`.
2. Update the `CHANGELOG`.
3. Commit and push:

    ```
    v=v$(jq .version src/system.json -r) && git commit -am $v && git push
    ```

4. Create and push a new tag with the version from `system.json` prepended with a "v":

    ```
    v=v$(jq .version src/system.json -r) && git tag $v && git push origin $v 
    ```

5. Fast-forward `release` to master (yes this is a funky use of `fetch`):

    ```
    git fetch . main:release
    ```

5. Create a new release on https://foundryvtt.com/admin/packages/package/948/change/


[gl-generic-packages]: https://docs.gitlab.com/ee/user/packages/generic_packages/
