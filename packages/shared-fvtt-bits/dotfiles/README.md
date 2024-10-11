# Shared dotfiles

This folder contains the multifarious things which live in the root of your projects, but which are not part of the codebase.

There are three folders here:

`import` contains things which are imported, like the `"extends": ` clause of a tsconfig.

`copy` contains things that should be copied into the root folder of your project. These are generally small stubs that you may want to cuistomise in the context of a particular project.

`link` is similar to `copy`, but for thinks you are less likely to want to customise, so they can be safely symlinked straight here.
