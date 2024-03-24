#!/usr/bin/env sh

set -eux

branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch" != "main" ]; then
  echo "You must be on main to release"
  exit 1
fi

if [ -e public/system.json ]; then
  manifest=public/system.json
elif [ -e public/module.json ]; then
  manifest=public/module.json
fi

v=v$(jq .version "$manifest" -r)

git commit -am $v --allow-empty
git push
git tag $v
git push origin $v
