#!/usr/bin/envsh

set -envsh

npm run build

cd dist 

git init
git add -add
git commit -m 'New Deployment'
git push -f git@github.com:Jeremiah-Y/teachingApp.git master:gh-pages

cd -
