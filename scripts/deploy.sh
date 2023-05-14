#! /bin/bash

# This script is used by GH actions to indicates which packages have been updated

# GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# if [ $GIT_BRANCH != "release" ]; then
#     echo "Must be on the 'release' branch to deploy!"
#     exit 1;
# fi

set -e


if ! CHANGED=$(yarn run changed); then 
    echo "hi"
    exit 0
fi

echo "CHANGED"
echo $CHANGED

if [ -z "$CHANGED" ] ; then
    echo "Deploy failed: no package changes found."
    exit 0
fi

COMMON_UPDATED=false

UPDATED_PACKAGES=""

if echo $CHANGED | grep -q "huebot-hub-core/common"; then
    COMMON_UPDATED=true
    echo "Detected updates in 'packages/common'. Running tests in all packages."
    UPDATED_PACKAGES="api, mqtt"
fi

if [ $COMMON_UPDATED = true ] || ( echo $CHANGED | grep -q "huebot-hub-core/api" ) ; then
    if [ $COMMON_UPDATED = false ]; then 
        echo "Detected updates in 'packages/api'. Running tests."
    fi

    UPDATED_PACKAGES="api"
    # echo "api=true" >> $GITHUB_OUTPUT
fi

if [ $COMMON_UPDATED = true ] ||  ( echo $CHANGED | grep -q "huebot-hub-core/mqtt" ) ; then
    if [ $COMMON_UPDATED = false ]; then 
        echo "Detected updates in 'huebot-hub-core/mqtt'. Running tests."
    fi

    
    if [ -z "$UPDATED_PACKAGES" ] ; then
        UPDATED_PACKAGES="mqtt"
    else
        UPDATED_PACKAGES="$UPDATED_PACKAGES, mqtt"
    fi
    # echo "mqtt=true" >> $GITHUB_OUTPUT
fi


echo $UPDATED_PACKAGES