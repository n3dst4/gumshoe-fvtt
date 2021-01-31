# Trail of Cthulhu (Unsanctioned) Foundry VTT System

A Foundry VTT system for running games of Trail of Cthulhu.

<a target="_new" href="screenshot.jpg"><img src="screenshot-thumb.jpg" style="width: 50%"></a>

## How to install

This sytem isn't registered so to install it into your Foundry instance:

1. On the admin screen, got to **Game Systems**
2. Click **Install System**
3. Where it says **Manfest URL**, paste in
    ```
    https://gitlab.com/n3dst4/trail-of-cthulhu-unsanctioned/-/raw/master/src/system.json
    ```
4. Click **Install**


## Making PCs

All the character abilities are represented as Items. They should all auto-populate wyhen you create a character, but there are compendium packs containing all the standard abilities from Trail of Cthulhu if you'd like to import them.


## Development & general hacking

If you're a developer and you'd like to hack on this code, please be aware it uses Webpack and React so some of it will not look like normal Handlebars + JQuery Foundry stuff.

1. Clone the repo.
2. Copy `foundryconfig_template.json` to `foundryconfig.json` and edit it to fill in the `dataPath`, e.g.  `"dataPath" "/home/ndc/foundrydata",`.
3. `npm i` to install dependencies
4. `npm run build` to do a build
5. `npm run link` to link it into your foundry data folder
6. `npm start` to start a live incremental build (so you don't need to keep running `npm run build` after every change).
7. Open your local foundry server and create a world with "Trail of Cthulhu (Unsanctioned)" as the system.

## TODO

- [x] editable speciality
- [x] dynamic name stuff with Foundry hooks
- [x] createItem hook should check for existing basename
- [x] bug when you tick on hasSpeciality but there's already a speciality
- [x] ability refresh
- [x] tweak the logo gradient so the top row gets more shone when it's longer 
- [x] +/- controls
- [x] README - setup, install, dev
- [x] sort abilities alphabetically
- [x] change phrasing on speciality?
- [x] placeholder on speciality field
- [x] confirm on nuke
- [x] pools
- [x] weird data submit thing
- [x] Show message when pool ability is missing
- [x] break up ability sheet
- [x] ability "config area" for rarer options & delete button
- [x] totally rework specialities
- [x] min/max on abilities
- [x] starting pools
- [x] occupational abilities
- [x] show (I) in investigable skills
- [x] general refresh
- [x] tabbable main area
- [x] pillars of sanity
- [x] sources of stability
- [x] contacts & notes
- [x] background etc.
- [x] equipment
- [x] weapons
- [x] attack rolls
- [x] resources to track key abilities
- [x] initiative
- [x] remaining attack rolls
- [x] scroll main area not whole sheet
- [x] update window title when entity name changes
- [x] check deployability
- [x] hide zero-rated abilities
- [x] theme textareas
- [x] empty equipment message
- [x] empty weapons message - hide headers
- [x] shade attack area
- [x] show notes on weapons main page
- [x] column widths on weapons table
- [x] ammo!
- [x] weird red glow on focused buttons
- [x] beautifying pass
- [x] add weapon name to attack rolls
- [x] weapon bonus pool should affect spend options
- [x] auto-populate abilities
- [x] publish
- [x] README for installing


## The future

- [ ] i18n
- [ ] expandy-collapsy bits on the notes area
- [ ] rich text editing
- [ ] Character gen mode? (track free values, point spends, I<->G trades, synergies)
- [ ] GM player skill matrix (pickable actors, show a big ol' matrix)


## Generating Compendia

1. In your **Items** tab, delete the "Trail of Cthulhu General Abilies" and "Trail of Cthulhu Investigative Abilies" folders
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for both packs (right click and `Toggle edit lock` if you see a padlock.) 
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compenium packs if you like
5. Copy the `packs/*.db` files back from `dist/` into `src/`


## Credits

<span>Photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

<span>Photo by <a href="https://unsplash.com/@marjan_blan?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Марьян Блан | @marjanblan</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

This System for Foundry VTT uses trademarks and/or copyrights owned by Pelgrane Press Ltd, which are used under the Pelgrane Press Ltd, Community Use Policy. We are expressly prohibited from charging you to use or access this content. This System for Foundry VTT is not published, endorsed, or specifically approved by Pelgrane Press Ltd. For more information about Pelgrane Press Ltd’s Community Use Policy, please visit [this page](https://wp.me/p7Ic36-5FU). For more information about Pelgrane Press Ltd visit [pelgranepress.com](http://pelgranepress.com/).”

Huge thanks to Nick van Oosten/NickEast for [Foundry Project Creator](https://gitlab.com/foundry-projects/foundry-pc/create-foundry-project) and [the Typescript types to go with it](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types).