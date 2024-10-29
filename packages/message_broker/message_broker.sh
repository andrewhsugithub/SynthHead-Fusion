#!/bin/bash

# Usage: to start up GPT-Audio services

# Add the main server to the known hosts in the container
ssh-keyscan -H $MAIN_SERVER >> ~/.ssh/known_hosts

# SSH into the server and execute commands
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no -tt $USER@$MAIN_SERVER << EOF

    # Navigate to the packages directory
    cd $PACKAGES_PATH

    services=("message_broker")

    for service in "\${services[@]}"; do
        echo "Starting \$service service"
        echo "Running: bash ${CWD}/scripts/run_\$service.sh ${PACKAGES_PATH}/\$service python src/receive.py"
        bash "${CWD}/scripts/run_\$service.sh" "${PACKAGES_PATH}/\$service" "python src/receive.py"
    done

    wait
EOF