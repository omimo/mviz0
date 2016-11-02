#!/bin/bash
echo "Checking out into gh-pages"
git checkout gh-pages

echo "Merging"
git merge master

echo "Pushing to the origin"
git push origin gh-pages

echo "Back to the master"
git checkout master