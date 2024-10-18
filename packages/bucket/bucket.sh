#!/bin/bash

# Usage: to start up bucket services

# Add the main server to the known hosts in the container
ssh-keyscan -H $MAIN_SERVER >> ~/.ssh/known_hosts

# SSH into the server and execute commands
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no -tt $USER@$MAIN_SERVER << EOF

    # Navigate to the packages directory
    cd $PACKAGES_PATH

    services=("bucket")

    for service in "\${services[@]}"; do
        cd "\$service"
        echo "Starting \$service service"
        echo "Running: pnpm bucket:start"
        pnpm bucket:start
    done

    wait
EOF