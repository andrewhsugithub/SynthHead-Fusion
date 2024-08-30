#!/bin/bash

# Initialize/Load variables
source "./scripts/.env.server.sh"

# SSH into the server and execute commands to terminate services
ssh $USER@$MAIN_SERVER << EOF
    if [ -f service_pids.txt ]; then
        pids=($(cat service_pids.txt))
        for pid in "${pids[@]}"; do
            kill $pid
        done
        rm service_pids.txt
    else
        echo "No PID file found. Services may not be running."
    fi
EOF