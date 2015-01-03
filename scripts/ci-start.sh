#!/usr/bin/env bash
cd $WORKSPACE;
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.21.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install
npm install
npm install
export NODE_ENV=preprod
npm test
