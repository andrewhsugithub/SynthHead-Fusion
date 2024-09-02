#!/bin/bash

# Usage: to test the entire pipeline 

# # Example usage: 
# bash /mnt/Nami/users/Jason0411202/ml/scripts/run_all.sh

# Initialize/Load variables
source "./scripts/.env.sh"

SERVICES_DIR="${CWD}/packages"

# Start up GPT-SoVits-inference backend
echo "Start up GPT-SoVITs inference service"
{
    bash "${CWD}/scripts/run_GPT-SoVITS-Inference.sh" "${SERVICES_DIR}/GPT-SoVITS-Inference" "python 'pure_api.py'" &
}

sleep 30s # TODO: fix this

# Run ChatGPT api and GPT-SoVits-inference api
echo "Start parsing article to create emotions with GPT-Audio"
{
    bash "${CWD}/scripts/run_GPT-Audio.sh" "${SERVICES_DIR}/GPT-Audio" "python './src/app.py'"
}

# Run Real3D to turn audios to talking head vids
echo "Start running Real3D to generate videos"
{
    bash "${CWD}/scripts/run_Read3D.sh" "${SERVICES_DIR}/Read3D-Interface" "python 'main.py'"
}

# Finalize output vid to make more original
echo "Start LivePortrait for final output"
{
    bash "${CWD}/scripts/run_LivePortrait.sh" "${SERVICES_DIR}/LivePortrait" "python inference.py --flag_do_torch_compile --loop --source ${SOURCE_VID_DIR} --driving ${DRIVING_VID_DIR} --output-dir ${OUTPUT_DIR}"
}