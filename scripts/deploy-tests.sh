#! /bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ $GIT_BRANCH != "devops" ]; then
    echo "Must be on the 'release' branch to deploy!"
    exit 1;
fi

echo "YARN RUN DIFF"
DIFF=$(yarn run diff)
echo $DIFF
echo "END YARN RUN FIFG"

# DIFF=$(yarn run diff)

# echo $DIFF

# COMMON_UPDATED=false

# # Used for GH actions vars
# API_UPDATED=false
# MQTT_UPDATED=false

# if echo $DIFF | grep -q "packages/common"; then
#     COMMON_UPDATED=true
#     echo "Detected updates in 'packages/common'. Running tests in all packages."
# fi

# if [ $COMMON_UPDATED = true ] || echo $DIFF | grep -q "packages/api"; then
#     if [ $COMMON_UPDATED = false ]; then 
#         echo "Detected updates in 'packages/api'. Running tests."
#     fi

#     # if ! docker-compose -f docker-compose.test.yml up --exit-code-from api ; then
#     #     exit 1
#     # fi

#     echo "API UPDATED"

#     API_UPDATED=true
# fi

# if [ $COMMON_UPDATED = true ] ||  echo $DIFF | grep -q "packages/mqtt"; then
#     if [ $COMMON_UPDATED = false ]; then 
#         echo "Detected updates in 'packages/mqtt'. Running tests."
#     fi
#     # export FOO=bar
#     MQTT_UPDATED=true
#     # docker-compose -f docker-compose.test.yml up --exit-code-from mqtt
# fi

# echo "UPDATED"
# echo $API_UPDATED

# # Set Github action variable
# echo "api_updated=$API_UPDATED" >> $GITHUB_OUTPUT