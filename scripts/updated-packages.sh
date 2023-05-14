#! /bin/bash

# This script is used by GH actions to indicates which packages have been updated

# GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# if [ $GIT_BRANCH != "release" ]; then
#     echo "Must be on the 'release' branch to deploy!"
#     exit 1;
# fi

set -e

DIFF=$(yarn run diff)

COMMON_UPDATED=false

if echo $DIFF | grep -q "packages/common"; then
    COMMON_UPDATED=true
    echo "Detected updates in 'packages/common'. Running tests in all packages."
fi

if [ $COMMON_UPDATED = true ] || ( echo $DIFF | grep -q "packages/api" ) ; then
    if [ $COMMON_UPDATED = false ]; then 
        echo "Detected updates in 'packages/api'. Running tests."
    fi

    echo "api=true" >> $GITHUB_OUTPUT
fi

if [ $COMMON_UPDATED = true ] ||  ( echo $DIFF | grep -q "packages/mqtt" ) ; then
    if [ $COMMON_UPDATED = false ]; then 
        echo "Detected updates in 'packages/mqtt'. Running tests."
    fi

    echo "mqtt=true" >> $GITHUB_OUTPUT
fi
