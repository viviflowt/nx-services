#!/bin/bash

rm -rf generated 2>/dev/null
rm -rf dist 2>/dev/null
rm -rf tmp 2>/dev/null

git add .
git commit -m "update" --allow-empty --no-verify
git push
