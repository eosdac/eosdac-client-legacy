#!/bin/bash

echo " "
echo " "
echo "===================== eosDAC Member Client Deploy Script ====================="
echo " "
echo "Usage: ./deploy.sh 1.0.0"
echo "This example will deploy the 1.0.0 tag."
echo " "
echo "For local testing, add a true at the end like so:"
echo "./deploy.sh master true"
echo "This example will run the master branch locally."
echo " "
echo "Note: this script will blow away all local changes."
echo " "
echo "=============================================================================="
echo " "
echo " "

CONFIG_FILE=""
LOCAL_DEV=false

if [ -z "$1" ]
  then
    echo "Please specify the branch or tag you'd like to deploy."
fi

if [[ "$2" == "true" ]]
  then
    echo "Local build, will run quasar dev."
    LOCAL_DEV=true
fi

rm -f deploy-complete

git checkout .
git checkout master
if ! git pull
then
   echo "======= ERROR: ======="
   echo "Looks like the repo is dirty?"
   echo "NOT DEPLOYED"
   echo "======================"
   exit 1
fi
git fetch --tags
git checkout "$1"
git pull

if $LOCAL_DEV ;
then
  yarn dev
else
  mkdir -p dist/deploy
  yarn build
  if [ -z "$(ls -A dist/spa-mat)" ]; then
     echo "======= ERROR: ======="
     echo "dist/spa-mat empty."
     echo "Build Failed? NOT DEPLOYED"
     echo "======================"
     exit 1
  fi

  mv dist/deploy dist/deploy-old && mv dist/spa-mat dist/deploy && touch deploy-complete

  if [ -f deploy-complete ]; then
    rm -rf dist/deploy-old
    echo "Deploy Complete."
    echo "Please test and verify using the correct domain such as members-dev.eosdac.io, members-staging.eosdac.io, or members.eosdac.io"
  else
     echo "======= ERROR: ======="
     echo "Deploy folder move failed."
     echo "NOT DEPLOYED"
     echo "======================"
     rm -rf dist/deploy && mv dist/deploy-old dist/deploy
     exit 1
  fi


fi
