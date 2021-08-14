# Development notes

- [x] Message when no actors
- [x] Update more often
- [ ] Sorting options
- [ ] Filtering options
- [ ] Option to add missing ability on click


## The future

- [ ] i18n
- [ ] images for equipment & abilities
- [ ] expandy-collapsy bits on the notes area
- [ ] rich text editing
- [ ] Character gen mode? (track free values, point spends, I<->G trades, synergies)
- [x] GM player skill matrix (pickable actors, show a big ol' matrix)


## GUMSHOE Games that I have, and want to support:

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

## GUMSHOE Games that I don't have yet, but would like to support:

* [ ] Mutant City Blues (2nd ed.)

## Games that I have, and could be bribed to focus on:

* [ ] Timewatch
* [ ] The Gaean Reach

## Other games:

* [ ] Esoterrorists
* [ ] Casting The Runes (aka "The M.R. James one")
* [ ] Bubblegumshoe


## Generating Compendium packs

1. In your **Items** tab, delete the "Trail of Cthulhu Abilies" folder
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for the pack (right click and `Toggle edit lock` if you see a padlock.) 
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compenium packs if you like
5. Copy the `packs/*.db` files back from `dist/` into `src/`


## Release process

We have "release" branch. Its job is to hold a manifest version that points to the right release download.

To perform a release from `master`: 

1. Update the version in `package.json` and `system.json`.
2. Update the `CHANGELOG`.
3. Run `npm run package`.
4. Add the downloadable package .zip to an existing tag, e.g. https://gitlab.com/n3dst4/investigator-fvtt/-/tags/v3.0.0
5. Get the download URL for the asset.
6. Paste it into the `download` field of `system.json`.
7. Commit and push.
8. On GitLab, create a tag matching the new version.
9. FF the `release` branch to to `master`.

Now, anyone who installs or upgrades, will see the new manifest, and the new download.

Why do we have a separate `release` branch? To keep control. The manifest on `master` can be unstable, broken, experimental, whatever and we know that users will be safely looking at the `release` version.
