#! /bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ $GIT_BRANCH != "devops" ]; then
    echo "Must be on the 'release' branch to deploy!"
    exit 1;
fi

DIFF=$(yarn run diff)

COMMON_UPDATED=false
API_UPDATED=false

if echo $DIFF | grep -q "packages/common"; then
    COMMON_UPDATED=true
    echo "Detected updates in 'packages/common'. All packages will be tested."
fi

if [ COMMON_UPDATED = false ] && [ echo $DIFF | grep -q "packages/api"]; then
    API_UPDATED=true
    echo "Detected updates in 'packages/api'"
fi