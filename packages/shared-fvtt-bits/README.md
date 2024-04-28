# @lumphammer/shared-fvtt-bits

Common parts to be used across Foundry VTT modules and systems

- [@lumphammer/shared-fvtt-bits](#lumphammershared-fvtt-bits)
  - [Installation - TLDR version](#installation---tldr-version)
  - [Tour Guide](#tour-guide)
  - [Installation - the long version](#installation---the-long-version)
    - [About pnpm](#about-pnpm)
  - [Why subrepo, not subtree or submodule?](#why-subrepo-not-subtree-or-submodule)
  - [Adding dependencies](#adding-dependencies)
  - [Troubleshooting](#troubleshooting)
    - [Checklist (*try these first*)](#checklist-try-these-first)
    - [`fatal: Not a valid object name: ''.`](#fatal-not-a-valid-object-name-)
    - [Huge long list of type errors](#huge-long-list-of-type-errors)


## Installation - TLDR version

Install [`git-subrepo`](https://github.com/ingydotnet/git-subrepo) if you don't already have it.

Run:

```sh
git subrepo clone git@github.com:n3dst4/shared-fvtt-bits.git shared-fvtt-bits
pnpm add file:shared-fvtt-bits
```

Optional:

* Copy `pnpm.patchedDependencies` from `package.json` into your project (altering the paths to point into this folder).
* Create your `tsconfig.json` extending the one from `dotfiles`.
    ```json
    {
	    "extends": "./shared-fvtt-bits/dotfiles/tsconfig.json",
	    "include": ["src"],
    }
    ```
* Check out the `dotfiles` and symlink or reference them from you project root.

## Tour Guide

This repo a a stash for anything that might be useful to shared between FVTT projects.

`src` is for shared code that will be incorporated into your project.

`task-core` is the barely-there task runner framework I threw together to get away from Gulp, Grunt, etc.

`dotfiles` is for tool configs that can be usefully shared between projects.


## Installation - the long version

This package is not published on npm. You could I *guess* install it as a git or github dependency, but the chief intent is that you will incorporate it into your project as [git subrepo](https://github.com/ingydotnet/git-subrepo).

First you need to install git subrepo as per the [instructions](https://github.com/ingydotnet/git-subrepo?tab=readme-ov-file#installation)

Then we add the shared code to our project.

```sh
git subrepo clone git@github.com:n3dst4/shared-fvtt-bits.git shared-fvtt-bits
```

To break that command down:

* `git subrepo clone` asks the subrepo command to incorporate the shared code into your project.
* `git@github.com:n3dst4/shared-fvtt-bits.git` is the url of the new remote (there's no need to manually set up a remote.)
* `shared-fvtt-bits` is the name of the folder we want to clone into.

Now we need to tell pnpm "install" it into our project. We could just refer to it by path, e.g. `import {foo} from '../../subtrees/shared-fvtt-bits/foo'`, but that causes chaos with dependency management.

```sh
pnpm add file:shared-fvtt-bits
```

Using the `file:` protocol means that pnpm will work out the dependencies for you.

### About pnpm

I use [pnpm](https://pnpm.io/) for dependency management. I like it because it's fast, uses PnP, and it makes me feel slightly hipster for not using npm or yarn. Plus yarn has just always been irritatingly smug.

(As a side note, I'm also super excited about [bun](https://bun.sh/) for dependency management and a bunch of other things, but as of right now (2024-03)it's not ready for primetime.)

Technically, pnpm is just one package manager. You could use another package manager for your own project, and still use this package, but you'll need to work out dependency management for yourself in that case.

My intent is to use pnpm for dependency management everywhere. There is a checked-in pnpm-lock.yaml file, for example.

A key feature is how pnpm handles `file:` dependencies -  see https://pnpm.io/cli/link#whats-the-difference-between-pnpm-link-and-using-the-file-protocol.

npm handles `file:` dependencies similarly-ish. npm will symlink the dependency and install its sub-dependencies in the main project. From a quick test just now, it installed `archiver`, `chalk`, and `fs-extra` in the main project, and it ALSO installed `chalk` in the `shared-fvtt-bits/node_modules` folder because it had a different version requirement to something else that was installed in the main project. So I guess `npm` would be usable for our purposes. `npm i` took 3m from a cold cache, 8s from warm.

yarn just copies the dependency into `node_modules` without packaging, but their docs promise that will change in future (https://yarnpkg.com/protocol/file). The fact that it *copies* the dependency into `node_modules` means that changes to the source are not reflected in your project until you run `yarn` again. This is a deal-breaker for our purposes. Yarn took 3m from a cold cache, 4s from warm.

pnpm hard-links the dependency into `node_modules`, which is great because you can make changes to the source and they are instantly reflected in your project, like with npm. **With the exception** that pnpm hardlinks each file individually, so if you **add** a file, you need to re-run `pnpm install` in your project.

TL;DR: npm and pnpm will both work, I am using and therefore testing pnpm and I'm checking in pnpm-lock.yaml. Yarn handles file: dependencies differently and will be annoying if you want to make subtree contributions from your main project, which is the whole point of using subtree.


## Why subrepo, not subtree or submodule?

My first attempt used [git subtree](https://www.atlassian.com/git/tutorials/git-subtree). There are many better source of documentation on issues with subtree, but the one that broke me very quickly was the timeline clutter. There is the option to "squash" with subtree pushes and pulls, but you're still left with:

* Noise in the git timeline. Even if you `squash` you're still seeing extra parallel lines in your graph view.
* A fragile experience (you have to `subtree pull` every time you `subtree push` or you get errors and have to `subtree split --rejoin` - and even then there are still scenarios that can break you.)
* An awkward UX (it's fiddly enough that you'll want to boil it out into a script or something.)
* No indication to contributors that the shared folder is shared. I "solved" this by putting my subtree in a folder called "subtrees".

`git submodule` is just widely considered to be a mistake, and even its own docs recommend using subtree.

Git subrepo seems to be much nicer in every respect except that it needs to to be installed (it doesn't ship with git.) The counterpoint to that is that only the maintainer (person who wants to add/push/pull subrepos) needs to have it installed; regular contributors can just clone your main project repo and they will have access to all the files.


## Adding dependencies

If you add a dependency to this project, think hard about whether it should be a peer dependency. Libraries which should be shared with the main project should be peer dependencies.

If it's a peer dep, add it like:

```sh
pnpm add --save-peer foo
```

If it's not a peer dep, add it as normal like:

```sh
pnpm add foo
```

## Troubleshooting

### Checklist (*try these first*)

* Is `foundryconfig.json` pointing to the right foundry instance?
* `pnpm i`
* `pnpm run build`
* Restart foundry (e.g. `pm2 reload foundry-v12`)


### `fatal: Not a valid object name: ''.`

Problem:

```
$ git subrepo pull shared-fvtt-bits
git-subrepo: Command failed: 'git branch subrepo/shared-fvtt-bits '.
fatal: Not a valid object name: ''.
```

Cause:

You've rebase a commit that was created by `git subrepo push`. When you push or pull a subrepo, it records the parent commit SHA in the subrepo `.gitrrepo` file. If you rebase that commit, that SHA will be a DAMNED LIE.

Fix:

Look at your git history. If you still have a record of the pre-rebase commit, you can look at its **parent** and you will see it has the commit SHA that's currently in the .gitrepo file under `parent`.

Find the equivalent commit in the rebased branch (i.e. the commit before the `.gitrepo` file got modified), copy out its SHA, and paste that into the `.gitrepo` file under `parent`. Commit that, and then try `git subrepo pull/push` again.

Link:

https://github.com/ingydotnet/git-subrepo/issues/503

Prevention:

When a branch contains subrepo push/pull commits, avoid rebasing it. Try to just merge with the parent branch. Less than ideal but will save you from this.


### Huge long list of type errors

Problem:

```
Subsequent property declarations must have the same type.  Property 'use' must
be of type 'SVGProps<SVGUseElement>', but here has type 'SVGProps<SVG
UseElement>'.
```

Cause:

The key is not notice that the conflict looks really weird - `SVGProps<SVGUseElement>`, does not match `SVGProps<SVGUseElement>`?

What's happening is that you're accidentally importing the same type from different files. If you use `shared-fvtt-bits` correctly, you will always import it into your main project as `@lumphammer/shared-fvtt-bits`. This will cause the resolver to find the version that pnpm has hard-linked into your `node_modules` folder. This version overrides the `node_modules` folder within `shared-fvtt-bits`.

As a side note, no amount of `tsconfig` tweaking can fix this. You are literally reaching down into the filesystem and the resolver is just doing its job - finding the closest neighbouring `node_modules` and resolving from there.

Fix:

Somewhere, you have done a direct import from the `shared-fvtt-bits` folder instead of referring to the package.

Wrong:

```ts
import { makeDummyAppV2 } from "../shared-fvtt-bits/src/DummyAppV2";
```

Right:

```ts
import { makeDummyAppV2 } from "@lumphammer/shared-fvtt-bits/src/DummyAppV2";
```

Prevention:

Always always always use `@lumphammer/shared-fvtt-bits` instead of `../../shared-fvtt-bits` in your TS code.