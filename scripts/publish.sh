#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PACKAGE_VERSION=$(cat "${DIR}/../package.json" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo $PACKAGE_VERSION

git tag -a $PACKAGE_VERSION -m "version ${PACKAGE_VERSION}"
git push --tags

yarn build
yarn publish
