# CHANGELOG

## 5.1.0 (2022-08-16)

* You can now remove the last item from all lists in settings except ability categories and combat abilities.
* You can now add and remove custom stats!
* The settings window has been given a small glow-up and now has tabs, which gives us more room to work with.

## 5.0.1 (2022-08-08)

* Typo in `minimumCoreVersion` 🤣

## 5.0.0 (2022-08-08)

* Drop support for FVTT 0.8.x.
* Various FVTT v10 compatibility fixes:
  * The combat tracker now looks right in FVTT v10.
  * Dropping actors onto the party sheets works in FVTT v10.
* Specialities with more than one word no longer get bunched up on the left.

## 4.12.0 (2022-06-12)

* A small release to include some new translations:
  * Polish (Core & SRD abilities)
  * Japanese (Core, SRD weapons, and Path of Cthulhu)

## 4.11.1 (2022-06-01)

* **Bug fix** New combat tracker show names, not IDs, now.
* **Bug fix** Ability specialities only show up once.
* **Bug fix** Double-clicking combatant now opens the actor sheet, like the standard combat tracker does.

## 4.11.1 (2022-06-01)

* **Bug fix** BIG WHOOPS. 4.11.0 incorrectly triggered an old migration which had the effect of wiping out actor notes and text fields. This version does not. Thanks to @Seamonster and Francesco Giorgi for reporting.

## 4.11.0 (2022-05-31)

* Presets, like themes, are now decoupled from the core system, so we can write modules which add support for new games.
* Numeric trackers can now be configured (instead of just having hard-coded hit threshold etc.) This is important for games which use other numeric counters which are not full abilities.
* The text shown when you don't have an occupation can now be configured. It used to be hard-coded as "Investigator" but can be anything, e.g. "Hero".
* The NPC sheet has a new layout.
* Unlockable talents - when you have more than a given number of ranks in an ability, show a badge indicating that a special talent has been unlocked.
* QoL tweaks to the "Edit" tab.
* New initiative tracker! No longer will you have to click an irrelevant d20 to "roll" initiative in Gumshoe.
* New *alternative* turn-passing combat tracker, for games which use "Popcorn"-style initiative.
* Various deprecation fixes.
* **Bug fix** Sheets now look right in Pop-Out (probably; this is the second time this has come up)

## 4.10.0 (2022-04-12)

* Basic testing against Foundry VTT v10. Seems okay to me so far?
* Character sheet themes are now decoupled from the main system, so you can:
  * Write Foundry modules that add themes to INVESTIGATOR, or
  * Throw some JSON in a folder in your local Foundry data to create a local theme!
* **Bug fix** The SRD ability "archaeology" was spelled "archeology" in the "Path of Cthulhu" compendium.

## 4.9.7 (2022-04-04)

* There was a bug in the way initiative order was being set that made it sometimes look as if it didn't work at all. Fixed now.
* Setting the actor icon sets the default token icon.
* Updated ES and CA translations (thank you!)
* New JA translations (thank you!!)

## 4.9.1 (2022-03-04)

* Minor fixes

## 4.9.0 (2022-03-03)

Happy March! A big list of updates today:

* **Tested against Foundry VTT v9.251**
* Several QoL improvements for Moribund World mode:
  * Better layout on the abilities page and items page
  * High-level items types (sandestins, manses, retainers)
  * Injury status
* The party sheet now lets you add missing abilities! This a really easy way to fill in abilities on characters when you're tinkering with your setup.
* Default images for PCs, NPCs, and parties.
* The party sheet now shows PC images.
* The party sheet now has a an editable image.
* **Bug fix** If a character is missing the relevant ability for a weapon, they can now do a simple +0 roll.
* **Bug fix** You can now click to open an ability from the party sheet directly in FVTT 9.x, as you could in 8.x.
* **Bug fix** The "Remove" buttons across the top of the party sheet now remove the right charcater.

## v4.8.0 (2021-12-31)

Happy new year! A big update. 

* **Tested against Foundry VTT v9.238**
* **Rich text support!** All the places where previously we had plain-text notes areas, you can ow choose to edit as either rich text (using Foundry's standard rich text editor,) [Markdown](https://commonmark.org/help/) (if you're into that sort of thing), or plain text.
* Rules support for the **"Moribund World" system**, which is very similar to GUMSHOE but not quite.
* **The "Nuke" button is now hidden** unless you're using the [🧙 Developer Mode](https://foundryvtt.com/packages/_dev-mode) module.
* Speaking of which, [🧙 Developer Mode](https://foundryvtt.com/packages/_dev-mode) is now the preferred way to activate developer features.
* You can now set the **Initiative Ability** directly from the character sheet. This a great QoL feature, thanks to @yariv).
* German translations! Thanks to `@muwak` on Gitlab.
* **Bug fix** There were some missing translations around combat ordering. Fixed now.
* **Bug fix** The new chat messages from 4.7.0 could go weird if the relevant ability or weapon was removed. Fixed now.

## v4.7.1 (2021-11-01)

* Whoops
* Update `compatibleCoreVersion` in system manifest (#54)

## v4.7.0 (2021-11-01)

* **Improved chat messages** for spends, tests, and combat rolls (#26).
* **(Initial) Foundry v9.x compatibility** - seems okay but we will monitor as FVTT 9.x progresses (#54).
* Bug fix: there were some check boxes which were a bit laggy (#55).
* The Delta Groovy theme has had some polish (#56, #57).
* Behind-the-scenes code improvements (#53, #58).


## v4.6.0 (2021-10-20)

* **New "Play" and "Edit" tabs** (#41) Thanks to Yariv Yanay (@yariv on Discord, @yarrriv on GitLab). The main character sheet tab is now interative and you can performs tests and spends directly from it instead of having to open the ability pop-up. There's also an "Edit" tab for rapid ability editing.
* **Behind the scenes** Two chnages which won't be visible to the user, but which will affect development: 1. I've semi-automated pulling in translations from Transifex, so it'll be nice and easy to keep up to date with the translation contributions. 2. The way themes are authored has been completely refactored. This will bear fruit later.

## v4.5.0 (2021-10-04)

* **Casting the Runes** (#45) With thanks to The Design Mechanism, we have full support for [Casting the Runes](http://thedesignmechanism.com/Casting-the-Runes.php), the GUMSHOE-system RPG based on the works of M. R. James.
* **Brazilian Portuguese translations** (#46) Big thanks Diogo A Gomes.
* **Bug fix** The party matrix was broken if you had any non-ability compendium packs selected as default PC packs. Terribly sorry for any inconvenience etc., fixed now.

## v4.4.0 (2021-09-28)

* **New actor type and ability pack for NPCs!** (#5) Thanks to Yariv Yanay (@yariv on Discord, @yarrriv on GitLab). This closes one of the oldest feature requests.
* **Two new character sheet themes!** Delta Groovy and Green Triangle (#20)
* **Editable image for abilities and equipment!** (#28) Also the ability to view an image full size.
* **All GUMSHOE SRD v3 abilities in one handy pack!** (#22) Even the ones that aren't in other packs.
* **Babele translations for various packs!** (#40) Big thanks to @Simone [UTC +2]#6710 for patching Babele to allow systems to distribute translations.
* **Bug fix** Package size is down from 4.4MB to 1.4MB (#39)
* **Bug fix** Weapons and equipment can now be dragged out from the character sheet to the sidebar (#44)

## v4.3.0 (2021-09-16)

* **French translations!** Merci @algol.
* A compendium pack of default **SRD weapons** - thanks @yariv/@yarrriv
* **Editable hit threshold** on the character sheet (#24) - this is purely informative at this point but I have ideas about making combat rolls better.
* **Icons for weapons & equipment** (#27). Editable images for these (and abilities) is on the list for later.
* **Notes field on abilities** (#19) This has been asked for by a few people.
* Abilities can be marked as **"Goes first in combat"**, and they will always go before anyone using an ability which is not marked as "goes first in combat". This lets you have a Night's Black Agents-style "guns go first" rule.
* **SRD weapons pack!** Thanks to Yariv Yanay (@yariv on Discord, @yarrriv on GitLab)
* **Bug fix**: Longer translations were pushing the ability configuration dialog (and others) out of whack (#29)
* **Bug fix**: Various translation fixes (#32, #31, #30)
* **Bug fix**: game-icons.net is given due attribution in README (#37)

## v4.2.0 (2021-09-12)

* ***Beta Feature***: *Quick import and export of Item and Actor compendium packs, to facilitate sharing of home-brew ability packs. (#11)*
* **Spanish translations!** INVESTIGATOR officially works in Spanish now, thanks to Rigal (@apz024), David Montilla (@montver), and Isaac Perez (@rizzibukki) (#7).
* **Catalan translations!** INVESTIGATOR officially works in Catalan now, thanks to David Montilla (@montver) (#21).
* **Bug fix:** Initiative is now based on the selected "combat ordering" ability (this was a Foundry 0.8.x breaking change) (#15)
* **Bug fix:** Weapons which don't use ammo, no longer show an ammo count (#32).
* **Bug fix:** Newly created abilities now have the right icon and have a category set (another latent Foundry 0.8.x breaker.) (#18 and #23)

## v4.1.0 (2021-09-05)

* Feature: New checkbox to exclude an ability from the full refresh
* Feature: "24h refresh" abilities
* Bug fix: Refreshed abilities were not remembering their pool values between sessions.
* Bug fix: the built-in resource trackers were not updating correctly.
* Fix some translation issues.
* Remove a couple more deprecated Foundry API calls.

## v4.0.0 (2021-08-14)

* Drop compatibility for Foundry VTT < 0.8.0 :(
* Fix Deprecation warnings when running in Foundry VTT 0.8.0+ :)
* (Internal) switch from `foundry-pc-types` to the more up-to-date and complete
  `@league-of-foundry-developers/foundry-vtt-types`.
* Fix a bug where newly created characters' abilities were missing, duplicated, 
  or weird.
* Fix some translation issues.

## v3.1.0 (2021-08-05)

* Remove non-SRD abilities

## v3.0.1 (2021-07-03)

* A couple of minor tweaks.

## v3.0.0 (2021-07-03)

* Move to "INVESTIGATOR" branding.
* Translations! Currently ony English is supported but we have a way to do others now.

## v2.5.0 (2021-06-26)

* FoundryVTT 0.8.8 compatible

## v2.4.0 (2021-06-04)

* FoundryVTT 0.8.6 compatible

## v2.3.0 (2021-05-16)

* FoundryVTT 0.8.3 compatible

## v2.2.0 (2021-04-12)

* Update FVTT compatibility to 0.8.1
* Some minor fixes on the party sheet

## v2.1.1 (2021-03-15)

* Quick patch release to include some minor theming tweaks I hadn't committed

## v2.1.0 (2021-03-15)

* Add themes and compendium packs for Fear Itself and Ashen Stars
* Add a Party Tracker, a matrix view of abilities in a party

## v2.0.1 (2021-02-26)

* Mainly practicing my release process
* Fix for newly created abilities having the wrong icons
* Fix a possible bug when adding new charcaters

## v2.0.0 (2021-02-26)

* GUMSHOE for Foundry VTT is now re-launched separate from the previous Trail of Cthulhu system, which will go into maintenance mode with a strong recommendation that folks upgrade to this one.
* Skipping a version number and dropping the pre-prelease suffix. Version numbers are free!
* Launch this newly renamed GUMSHOE for Foundry VTT with support for Trail of Cthulhu (as taken from the previous incarnation) and Night's Black Agents.

## v1.0.0-alpha.4 (2021-02-19)

* FIX not being able to edit sidebar abilities.
* There is loads more on the way but we're past due for a bugfix on this.


## v1.0.0-alpha.3 (2021-02-07)

* FIX: #3 (users getting "user  lacks permission to update character" when someone else updates their own pools).
* Infrastructure stuff, mainly working out the best way to do releases.

## v1.0.0-alpha.2 (2021-01-31)

* First public release
* Character sheet for Trail of Cthulhu
* Abilities, with pools and refreshes
* Key ability trackers
* General ability tests
* Weapons with range-dependent damage
* Pool trackers

## v1.0.0-alpha.1

Unreleased
