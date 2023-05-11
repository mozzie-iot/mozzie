#! /bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ $GIT_BRANCH != "devops" ]; then
    echo "Must be on the 'release' branch to deploy!"
    exit 1;
fi

DIFF=$(yarn run diff)

COMMON_UPDATED=false

UPDATED_PACKAGES=()

if echo $DIFF | grep -q "packages/common"; then
    COMMON_UPDATED=true
    echo "Detected updates in 'packages/common'. Running tests in all packages."
    UPDATED_PACKAGES+=('api','mqtt')
fi

if [ $COMMON_UPDATED = true ] || echo $DIFF | grep -q "packages/api"; then
    if $COMMON_UPDATED = false; then 
        echo "Detected updates in 'packages/api'. Running tests."
    fi

    # if ! docker-compose -f docker-compose.test.yml up --exit-code-from api ; then
    #     exit 1
    # fi

    UPDATED_PACKAGES+=('api')
fi

if [ $COMMON_UPDATED = false ] ||  echo $DIFF | grep -q "packages/mqtt"; then
    if $COMMON_UPDATED = false; then 
        echo "Detected updates in 'packages/mqtt'. Running tests."
    fi

    # export FOO=bar
    UPDATED_PACKAGES+=('mqtt')

    # docker-compose -f docker-compose.test.yml up --exit-code-from mqtt
fi

# Set Github action variable
echo "updated_packages=$UPDATED_PACKAGES)" >> $GITHUB_OUTPUT