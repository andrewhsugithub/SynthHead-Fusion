#!/bin/bash

# Usage: to start up GPT-Audio services

# Initialize/Load variables
source "./scripts/services/.env.server.sh"

# SSH into the server and execute commands
ssh -tt $USER@$MAIN_SERVER << EOF

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