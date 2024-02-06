#!/usr/bin/env sh

git subtree push --prefix=subtrees/shared-fvtt-bits shared-fvtt-bits main
./subtree-pull
