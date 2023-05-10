#! /bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ $GIT_BRANCH != "devops" ]; then
    echo "Must be on the 'main' branch to deploy!"
    exit 1;
fi

DIFF=$(yarn run diff)

TAG=""

if echo $DIFF | grep -q "packages/common";
then
    TAG="c"
    echo "changes detected in package/common"
fi

if echo $DIFF | grep -q "packages/api";
then
    TAG="${TAG}a"
    echo "changes detected in package/api"
fi

if echo $DIFF | grep -q "packages/mqtt";
then
    TAG="${TAG}m"
    echo "changes detected in package/mqtt"
fi


# DEBUG
echo "TAG:"
echo $TAG