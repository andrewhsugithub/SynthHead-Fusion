#!/bin/bash

# Initialize/Load variables
source "./scripts/.env.server.sh"

# SSH into the server and execute commands
ssh $USER@$SERVER << EOF
    # Navigate to the packages directory
    cd $PACKAGES_PATH

    echo "Starting GPT-SoVITS-Inference service"
    {
        cd ${CWD}/GPT-SoVITS-Inference/
        python pure_api.py &
    }

    echo "Starting Real3DPortrait service"
    {
        cd ${CWD}/Real3DPortrait/
        python main.py &
    }

    echo "Starting Real3DPortrait service"
    {
        cd ${CWD}/Real3DPortrait/
        python main.py &
    }

    echo "Starting LivePortrait service"
    {
        cd ${CWD}/LivePortrait/
        python main.py &
    }

    echo "Starting MuseTalk service"
    {
        cd ${CWD}/MuseTalk/
        python main.py &
    }

    echo "Starting GPT-Audio service"
    {
        cd ${CWD}/GPT-Audio/
        python main.py &
    }

    # Exit the SSH session
    exit
EOF