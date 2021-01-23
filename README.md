# Trail of Cthulhu (Unsanctioned)

## How to install

You can't! (Yet.)


## Making PCs

All the character abilities are represented as Items. There are compendium packs containing all the standard abilities from Trail of Cthulhu.

As GM:

1. Open the Compendium Packs tab in the sidebar.
2. Right click "Trail of Cthulhu General Abilies" and then "Import all content"
3. Do the same for "Trail of Cthulhu Investigative Abilies".
4. In the Items tab of the sidebar, right click and "Configure permissions" for both folders, and set "All Players: Observer".
5. Create a player character in the normal way.
6. You should now be abnle to drag a whole folder full of abilities (or just the ones you want individually) onto a character sheet.


## Development

1. Clone the repo.
2. Copy `foundryconfig_template.json` to `foundryconfig.json` and edit it to fill in the `dataPath`, e.g.  `"dataPath" "/home/ndc/foundrydata",`.
3. `npm i` to install dependencies
4. `npm run build` to do a build
5. `npm run link` to link it into your foundry data folder
6. `npm start` to start a live incremental build (so you don't need to keep running `npm run build` after every change).
7. Open your local foundry server and create a world with "Trail of Cthulhu (Unsanctioned)" as the system.

## TODO

- [x] Editable speciality
- [x] dynamic name stuff with Foundry hooks
- [x] createItem hook should check for existing basename
- [x] bug when you tick on hasSpeciality but there's already a speciality
- [x] Ability refresh
- [x] tweak the logo gradient so the top row gets more shone when it's longer 
- [x] +/- controls
- [x] README - setup, install, dev
- [x] Sort abilities alphabetically
- [ ] Placeholder on speciality field
- [ ] Change phrasing on speciality?
- [ ] Confirm on nuke
- [ ] Pools
- [ ] General refresh
- [ ] Equipment
- [ ] Weapons
- [ ] Notes/background etc.
- [ ] Attack rolls?
- [ ] Update window title when entity name changes
- [ ] Publish

## Generating Compendia

1. In your **Items** tab, delete the "Trail of Cthulhu General Abilies" and "Trail of Cthulhu Investigative Abilies" folders
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for both packs (right click and `Toggle edit lock` if you see a padlock.) 
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compenium packs if you like
5. Copy the `packs/*.db` files back from `dist/` into `src/`