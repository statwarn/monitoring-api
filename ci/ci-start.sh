#!/usr/bin/env zsh
DIR=${0%/*}
cd $DIR/..
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.21.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install
nvm use
npm install
npm install
export NODE_ENV=preprod
setopt extended_glob;
`npm bin`/mocha -t 5000 -R spec **/*.test.js~node_modules/*;
