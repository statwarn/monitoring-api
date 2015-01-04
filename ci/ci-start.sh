#!/usr/bin/env zsh
export NODE_ENV=preprod
DIR=${0%/*}
cd $DIR/..
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.21.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install
nvm use
npm install
npm install
set -e
# Any subsequent commands which fail will cause the shell script to exit immediately
setopt extended_glob;
# Allow extended globbing (see fellow)
`npm bin`/mocha -t 10000 -R spec **/*.test.js~node_modules/*;
npm install -g check-build
check-build
