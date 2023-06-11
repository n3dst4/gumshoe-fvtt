# Development notes

- [Development notes](#development-notes)
  - [Development \& general hacking](#development--general-hacking)
    - [Prerequisites](#prerequisites)
    - [Getting started](#getting-started)
    - [pnpm](#pnpm)
  - [Migrations](#migrations)
  - [Flagged migrations](#flagged-migrations)
  - [Generating Compendium packs](#generating-compendium-packs)
  - [Translations](#translations)
    - [Getting set up to pull translations from Transifex](#getting-set-up-to-pull-translations-from-transifex)
  - [Adding Actor or Item data fields](#adding-actor-or-item-data-fields)
  - [Adding system settings](#adding-system-settings)
  - [Using the "Developer mode" module](#using-the-developer-mode-module)
  - [Development flow](#development-flow)
  - [Release process](#release-process)
    - [What happens if the CI pipeline fails?](#what-happens-if-the-ci-pipeline-fails)
  - [How to pull translations from Transifex](#how-to-pull-translations-from-transifex)
  - [GitLab Legacy](#gitlab-legacy)

## Development & general hacking

If you're a developer and you'd like to hack on this code, please be aware it uses Webpack and React so some of it will not look like normal Handlebars + JQuery Foundry stuff. Also it's set up to use **[pnpm](#pnpm)** instead of npm, so you'll need to install that.

### Prerequisites

* Have [Node.js](https://nodejs.org/) installed.

### Getting started

1. Clone the repo.
2. Copy `foundryconfig_template.json` to `foundryconfig.json` and edit it to fill in the `dataPath`, e.g.  `"dataPath" "/home/ndc/foundrydata",`.
3. `pnpm i` to install dependencies
4. `pnpm run build` to do a build
5. `pnpm run link` to link it into your foundry data folder
6. `pnpm start` to start a live incremental build (so you don't need to keep running `pnpm run build` after every change).
7. Open your local foundry server and create a world using this as the system.

### pnpm

We use [pnpm](https://pnpm.io/) instead of npm because it's faster and more efficient. It's a drop-in replacement for npm, so you can use it just like npm. If you don't have it installed, you can install it with `corepack enable` (Corepack is a tool for installing package managers. It ships with Node.js, so you should already have it.)

## Migrations

The migrations system is inspired by an earlier version of the one in the 5e system. It is triggered from `investigator.ts` based on version number.

If you want to force migrations to run, try this:

```ts
game.settings.set("investigator","systemMigrationVersion", "1.0.0")
```

## Flagged migrations

We have a newer, better system for migrations, which runs each migration once, and then marks it as "complete" so it doesn't run again. This is the "flagged migrations" system. Unlike the old system, it doesn't rely on the version number. Also, the old system has the unpleasant habit of running all the migrations every time it detects a version change, which is not ideal.

To see the current state of flagged migrations, open the console and type

```js
console.log(JSON.stringify(game.settings.get("investigator", "migrationFlags"), null,  "  "))
```

There will be a flag in there for every migration that has been run. If you want to force a migration to run again, you can delete the flag for it. For example, if you want to force the migration to run again that adds the `investigator` field to all actors, you can do this:

## Generating Compendium packs

1. In your **Items** tab, delete the "Trail of Cthulhu Abilities" folder
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for the pack (right click and `Toggle edit lock` if you see a padlock.)
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compendium packs if you like
5. Copy the `packs/*.db` files back from `build/` into `public/`

## Translations

There are three npm tasks pertaining to translations:

* `npm run build-pack-translations` will:
  * populate `src/lang/babele-sources` with template translation files based on the packs.
  * These should be picked up by Transifex automatically.
* `npm run pull-translations` will:
  * use the Transifex command line tool, [`tx`](https://github.com/transifex/cli), to pull in the latest translations and overwrite all the JSONs.
  * THIS WILL CLOBBER ANY JSON MODIFICATIONS WHICH HAVE NOT BEEN UPLOADED TO TRANSIFEX!

To keep the translation imports running sweetly, you will need to update `.tx/config` to map everything to the right places.

### Getting set up to pull translations from Transifex

Install the Transifex command-line utility `tx` from https://github.com/transifex/cli

There is some older documentation somewhere on the Transifex website that talks about their old Python-based cli client - ignore that. You want the new one written in Go, as linked above.

The first time you try to pull translations, it will ask you to log in with an API token. It will give you instructions so I won't repeat them here.

I have a manual download which I keep checked-in with my dotfiles, but the other installation methods listed may be preferable.

## Adding Actor or Item data fields

1. Add the field to [`src/template.json`](). This is what Foundry uses to generate initial data for new actors and items, and to do some kind of validation on entries when they get saved.
2. Add the field to [`src/types.ts`](), in the appropriate `*SourceData` type.
3. In  `src/module/InvestigatorActor.ts`, add `get*` and `set*` methods with the appropriate `assert*` call (see existing examples.)


## Adding system settings

1. Add an entry to [`src/settings.ts`]().
2. Add it to the `PresetV1` type in `@lumphammer/investigator-fvtt-type`, publish, and update the package version here. We haven't got as far as new `PresetV*` types yet, so make sure you add it as an optional property.
3. Add a sensible default to `pathOfCthulhuPreset` in `src/settings.ts`, and add values to the other presets if they need them.
4. In [`src/components/settings/`](), add it to the JSX somewhere - see the existing examples. `tempSettings` will contain the value and `setters` will have the setter.
5. You will probably need to add a translation string to [`public/lang/en.json`]() or maybe [`public/lang/moribundWorld/en.json`]() for MW stuffs.
6. If it's a setting that can be controlled by system presets, also add it to the `PresetV1` type in @lumphammer/investigator-fvtt-types and publish a new version.


## Using the "Developer mode" module

There's a fantastic Foundry VTT module called [🧙 Developer Mode](https://foundryvtt.com/packages/_dev-mode). I highly recommend installing it if you're doing any development work on Foundry. You can also use it to activate specific developer features for systems. To do this, click on the little wizard dude in the top left of the screen, go to "Package specific debugging", and "Enable Debug Mode" for "INVESTIGATOR System".

What this enables (list subject to change):

* Notes fields will now have a "view source" mode (looks like `</>`.)
* "NUKE" button on PC character sheet (this used to be present all the time.)
* "Debug translations" option available in INVESTIGATOR System Settings.


## Development flow

* We develop on `main`, with occasional feature branches or forks as needed and wanted.
* We deliver both the public-facing manifest and the downloadable zip package using [tagged GitHub releases][gh-releases]
* The manifest in VCS points to the "latest package" of the manifest and the download.
* To do a release, we push a tag.
* The CI kicks in and:
  * Checks that the tag matches the version in the manifest. Barfs if not right.
  * Works out the release asset URL and set the `download` path.
  * Runs tests.
  * Runs the build.
  * Creates the zip package.
  * Creates/updates a tagged release with two extra attachments:
    * The zip package
    * The manifest
  * If the tag is a release (i.e.there is no pre-release suffix), it also marks the release as "latest" on GitHub.
  * You can always find the latest release at the URL https://github.com/n3dst4/gumshoe-fvtt/releases/latest


## Release process

> The innocuous-looking 4.9.7 release represented a change in how we do releases. We used to have a `release` branch which pointed to the most recent release, with attachment links pasted into `system.json` for the download. For the foreseeable future we will need to fast-forward `release` to `main` when releasing to make sure we catch slow updaters*
>
> 7.0.0 will be (probably) the first release from GitHub:
> * Uses GitGub actions instead of GitLab CI
> * Uses GitHub Releases instead of GitLab Generic Packages

To perform a release:

1. Decide if you're doing a testing release or a real release. DO DO A TESTING RELEASE AND CHECK IT ON A TEST SERVER.
2. Pick the new version number according to semantic versioning. If you're doing a testing release, use a suffix e.g. `x.y.z-test-1`.
3. Update the version in
   * [`package.json`](package.json)
   * [`system.json`](public/system.json).
4. Update the `CHANGELOG`.
5. Run this one handy command, which will commit, push, and create a new tag and push it also:

    ```
    scripts/do-release.sh
    ```

6. If this is a test release, stop here. You can find the manifest URL to install this test release on [the GitHub releases page][gh-releases].

   Otherwise, continue.

7. Fast-forward `release` to `main` (yes this is a funky use of `fetch`):

    ```
    scripts/update-legacy-release-branch.sh
    ```

8. Head over to the [CI page][gh-ci] and wait for the pipeline to finish.

9. Create a new release on https://foundryvtt.com/admin/packages/package/948/change/

    You can mostly copy everything from the line before, but **update the version number and the version number in the URLs**. You can also update the compatible Foundry versions as long as you've made the same change in `system.json`.

10. Barf forth glad tidings on the [Pelgrane's Virtual Tabletops Discord channel][pelgrane-discord] and the [Foundry Package Releases channel][fprd].

    Paste in the CHANGELOG entry you just wrote, adding "INVESTIGATOR" in front of the version number to give people context.

### What happens if the CI pipeline fails?

1. Delete the `vX.Y.Z` tag from local and remote:

    ```sh
    git tag -d vX.Y.Z
    git push origin :refs/tags/vX.Y.Z
    ```

2. Fix the problem, commit.
3. Run `do-release.sh` again.


## How to pull translations from Transifex

```sh
pn pull-translations
```

The command to pull translations has gone through a few iterations and never quite seemed right. Here's the current version (this is in `package.json`):

```sh
tx pull --all --force --workers 16
```

* `--all` - pull all languages, not just the pre-existing ones.
* `--workers 16` - seems to make sense on a 16-core machine. I'm not sure if it's actually helping.
* `--force` - overwrite "newer" files. This should only happen if there has been a PR or commit that changed the translations without also uploading those changes to Transifex.

> ⚠️ After running `pn pullTranslations` (or the `tx pull` command above), you MUST look through the changes in git and confirm that they make sense. Look for languages with a lot of changes and double check that you are not accidentally overwriting changes that were added to git but not TX.
>
> ⚠️ To that point - when someone sends a PR with translation changes, it's better to feed those into TX (resources -> language -> upload file) and then pull them back down again, rather than committing directly. This way TX remains the single source of truth for translations.


## GitLab Legacy

As of v7.0.0 we are moving off GitLab and going home to GitHub. The following links are historical purposes only:

* [GitLab CI pipeline][gl-ci]
* [GitLab Releases][gl-releases]
* [GitLab Generic Packages (docs)][gl-generic-packages]


[gl-generic-packages]: https://docs.gitlab.com/ee/user/packages/generic_packages/
[gl-releases]: https://gitlab.com/n3dst4/investigator-fvtt/-/releases
[gl-ci]: https://gitlab.com/n3dst4/investigator-fvtt/-/pipelines
[gh-ci]: https://github.com/n3dst4/gumshoe-fvtt/actions/workflows/ci-cd.yml
[pelgrane-discord]: https://discord.com/channels/692113540210753568/720741108937916518
[fprd]: https://discord.com/channels/170995199584108546/64821535989524071
[gh-releases]: https://github.com/n3dst4/gumshoe-fvtt/releases
