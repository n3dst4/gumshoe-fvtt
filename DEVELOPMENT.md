# Development notes


## Games supported/future plans

### GUMSHOE Games that I have, and want to support:

* [x] Trail of Cthulhu
  * [x] Categorized investigating abilities
  * [x] General Abilities
  * [x] Health, Sanity, Stability, Magic
* [x] Night's Black Agents
  * [x] Categorized investigating abilities
  * [x] General Abilities
  * [x] Health & Stability
* [x] Fear Itself 2nd ed.
  * [x] Categorized investigating abilities
  * [x] General Abilities
  * [x] *Psychic Powers*
  * [x] ~~*No trackers*~~ Not accurate - the standard character sheet doesn't have trackers, but the system has health and stability.
* [x] Ashen Stars
  * [x] Categorized investigating abilities
  * [x] General Abilities
  * [x] *Special (Vas Mal)*
  * [x] *"Boost"*
  * [ ] Spaceships?
* [ ] The Fall of Delta Green
* [ ] The Yellow King
* [ ] Cthulhu Confidential (is 1-to-1)

### GUMSHOE Games that I don't have yet, but would like to support:

* [x] Casting The Runes (aka "The M.R. James one")
* [ ] Mutant City Blues (2nd ed.)

### Games that I have, and could be bribed to focus on:

* [ ] Timewatch
* [ ] The Gaean Reach

### Other games:

* [ ] Esoterrorists
* [ ] Bubblegumshoe


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


## Developer mode

There's a fantastic Foundry VTT module called [🧙 Developer Mode](https://foundryvtt.com/packages/_dev-mode). I highly recommend installing it if you're doing any development work on Foundry. You can also use it to activate specific developer features for systems. To do this, click on the little wizard dude in the top left of the screen, go to "Package specific debugging", and "Enable Debug Mode" for "INVESTIGATOR System".

What this enables (list subject to change):

* Notes fields will now have a "view source" mode (looks like `</>`.)
* "NUKE" button on PC character sheet (this used to be present all the time.)
* "Debug translations" option available in INVESTIGATOR System Settings.


## Release process

We have a "release" branch. Its job is to hold a manifest version that points to the right release download.

To perform a release from `master`: 

1. Update the version in `package.json` and `system.json`.
2. Update the `CHANGELOG`.
3. Run `npm run package`.
4. Add the downloadable package .zip to an existing tag, e.g. https://gitlab.com/n3dst4/investigator-fvtt/-/tags/v4.0.0
5. Get the download URL for the asset.
6. Paste it into the `download` field of `system.json`.
7. Commit and push.
8. On GitLab, create a tag matching the new version.
9. FF the `release` branch to to `master`.
10. Create a new release on https://foundryvtt.com/admin/packages/package/948/change/

Now, anyone who installs or upgrades, will see the new manifest, and the new download.

Why do we have a separate `release` branch? To keep control. The manifest on `master` can be unstable, broken, experimental, whatever and we know that users will be safely looking at the `release` version.
