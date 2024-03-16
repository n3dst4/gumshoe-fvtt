#!/usr/bin/env sh

DIR="$( cd "$( dirname "$0" )" && pwd )"

git subtree push --prefix=subtrees/shared-fvtt-bits shared-fvtt-bits main
# execute script relative to this one

$DIR/subtree-pull.sh
