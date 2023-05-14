#! /bin/bash

set -e

if ! CHANGED=$(yarn run changed); then 
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

yarn run lerna version --conventional-commits --yes --tag-version-prefix='' --message "%v: $UPDATED_PACKAGES"