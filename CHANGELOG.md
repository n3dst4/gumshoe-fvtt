# CHANGELOG

## v4.3.0 (2021-09-16)

* **French translations!** Merci @algol.
* A compendium pack of default **SRD weapons** - thanks @yariv/@yarrriv
* **Editable hit threshold** on the character sheet (#24) - this is purely informative at this point but I have ideas about making combat rolls better.
* **Icons for weapons & equipment** (#27). Editable images for these (and abilities) is on the list for later.
* **Notes field on abilities** (#19) This has been asked for by a few people.
* Abilities can be marked as **"Goes first in combat"**, and they will always go before anyone using an ability which is not marked as "goes first in combat". This lets you have a Night's Black Agents-style "guns go first" rule.
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
