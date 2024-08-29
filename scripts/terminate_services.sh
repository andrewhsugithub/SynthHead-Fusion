#!/bin/bash

# Initialize/Load variables
source "./scripts/.env.server.sh"

# SSH into the server and execute commands to terminate services
ssh $USER@$SERVER << EOF
    # Navigate to the packages directory
    cd $PACKAGES_PATH

    echo "Terminating GPT-SoVITS-Inference service"
    pkill -f "python pure_api.py"

    echo "Terminating Real3DPortrait service"
    pkill -f "python main.py"

    echo "Terminating LivePortrait service"
    pkill -f "python main.py"

    echo "Terminating MuseTalk service"
    pkill -f "python main.py"

    echo "Terminating GPT-Audio service"
    pkill -f "python main.py"

    # Exit the SSH session
    exit
EOF