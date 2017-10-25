#!/bin/bash

set -e

if [ -z "$1" ] ; then
  echo "Error: Upstream Version number must be supplied"
  exit
fi

upstreamversion="$1"
rhversion="$upstreamversion-rh"

echo Getting tags from upstream
git fetch upstream --tags

echo Generating branch for $rhversion
git checkout -b $rhversion $upstreamversion

echo Removing deps/openssl
git rm -rq deps/openssl

echo Committing $rhversion
git commit -m "$rhversion"

echo Pushing to origin/$rhversion
git push origin $rhversion
