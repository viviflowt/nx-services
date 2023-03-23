#!/bin/bash

FILE=apps/service-account/src/mocks/accounts.ts

npx env-cmd -f .env ts-node -r tsconfig-paths/register $FILE
