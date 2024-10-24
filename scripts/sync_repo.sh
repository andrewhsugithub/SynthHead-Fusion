#!/bin/bash

# Initialize/Load variables
source "./scripts/services/.env.server.sh"
BRANCH_NAME="$1"

# SSH into the server and execute commands
ssh -tt $USER@$MAIN_SERVER << EOF
    # cd into the repository
    cd $CWD

    # Fetch the latest changes from the remote repository
    echo "Fetching latest changes from remote"
    git fetch origin

    # Reset the local repository to the latest HEAD
    echo "Resetting repository to latest remote HEAD"
    git reset --hard origin/$BRANCH_NAME

    # Remove all untracked files and directories
    echo "Removing untracked files and directories"
    git clean
    git clean -f -d

    # Pull the latest changes from the remote repository
    echo "Pulling latest changes"
    git pull --rebase

    # Update submodules
    echo "Update submodules"
    git submodule update --init --recursive --force

    # Switch to the desired branch
    echo "Switching to branch: $BRANCH_NAME"
    git switch $BRANCH_NAME

    # Install correct node version specified in .nvmrc
    echo "Installing correct node version"
    nvm install

    # Install dependencies
    echo "Installing dependencies"
    pnpm install

    # Exit the SSH session
    exit
EOF