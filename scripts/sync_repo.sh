#!/bin/bash

# Reset the local repository to the latest HEAD
echo "Resetting repository to HEAD"
git reset --hard HEAD

# Remove all untracked files and directories
echo "Removing untracked files and directories"
git clean -f -d

# Pull the latest changes from the remote repository
echo "Pulling latest changes"
git pull --rebase

# Update submodules
echo "Update submodules"
git submodule update --init --recursive