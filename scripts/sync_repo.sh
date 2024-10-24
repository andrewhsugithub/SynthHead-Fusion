#!/bin/bash

# Initialize/Load variables
source "./scripts/services/.env.server.sh"
BRANCH_NAME="$1"

# SSH into the server and execute commands
ssh -tt $USER@$MAIN_SERVER << EOF
    # cd into the repository
    cd $CWD

    # Reset the local repository to the latest HEAD
    echo "Resetting repository to HEAD"
    git reset --hard HEAD

    # Remove all untracked files and directories
    echo "Removing untracked files and directories"
    git clean -f -d

    # Switch to the desired branch
    echo "Switching to branch: $BRANCH_NAME"
    git switch $BRANCH_NAME

    # Pull the latest changes from the remote repository
    echo "Pulling latest changes"
    git pull --rebase

    # Update submodules
    echo "Update submodules"
    git submodule update --init --recursive --force

    # Install correct node version specified in .nvmrc
    echo "Installing correct node version"
    nvm install

    # Install dependencies
    echo "Installing dependencies"
    pnpm install

    # Exit the SSH session
    exit
EOF