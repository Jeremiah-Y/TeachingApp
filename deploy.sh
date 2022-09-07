#!/usr/bin/envsh

set -e

npm run build

cd dist 

git init
git add -A
git commit -m 'New Deployment'
git push -f git@github.com:Jeremiah-Y/teachingApp.git master:gh-pages

cd -
