#!/usr/bin/env sh

set -eux

branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch" != "main" ]; then
  echo "You must be on main to release"
  exit 1
fi

v=v$(jq .version public/system.json -r)
git commit -am $v --allow-empty
git push
git tag $v
git push origin $v 
