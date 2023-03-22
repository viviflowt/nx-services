#!/bin/bash

npm addUser --registry http://localhost:4873
npm login --registry http://localhost:4873
npm whoami --registry http://localhost:4873

# npm token create --registry http://localhost:4873
# npx npm-cli-adduser -u viviflowt -p viviflowt -e viviflowt@gmail.com --registry http://localhost:4873
