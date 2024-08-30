#!/bin/bash

# Usage: to start up all services

# Initialize/Load variables
source "./scripts/.env.server.sh"

# SSH into the server and execute commands
ssh -tt $USER@$MAIN_SERVER << EOF

    # Navigate to the packages directory
    cd $PACKAGES_PATH

    services=("GPT-SoVITS-Inference" "Real3DPortrait" "LivePortrait" "MuseTalk" "GPT-Audio")

    for service in "\${services[@]}"; do
        echo "Starting \$service service"
        if [ "\$service" == "GPT-SoVITS-Inference" ]; then
            # Run a different command for GPT-SoVITS-Inference service
            echo "Running: bash ${CWD}/scripts/special_run.sh ${PACKAGES_PATH}/\$service python pure_api.py &"
            bash "${CWD}/scripts/special_run.sh" "${PACKAGES_PATH}/\$service" "python pure_api.py" &
        else
            echo "Running: bash ${CWD}/scripts/run_\$service.sh ${PACKAGES_PATH}/\$service python main.py &"
            bash "${CWD}/scripts/run_\$service.sh" "${PACKAGES_PATH}/\$service" "python main.py" &
    done

    wait
EOF