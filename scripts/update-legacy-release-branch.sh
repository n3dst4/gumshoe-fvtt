#!/usr/bin/env sh

set -eux

# yes, this is a funky use of fetch, but it kinda makes sense if you think of it
# as "fetch main into release" and get high
git fetch . main:release
