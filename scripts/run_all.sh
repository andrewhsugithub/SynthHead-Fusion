#!/bin/bash

# # Example usage: 
# bash /mnt/Nami/users/Jason0411202/ml/scripts/run_all.sh

# Initialize/Load variables
source "./scripts/.env.sh"

# Start up GPT-SoVits-inference backend
echo "Start up GPT-SoVITs inference service"
{
    bash "${CWD}/scripts/run_GPT-SoVITS.sh" "${CWD}/GPT-SoVITS-Inference"
}

# Run ChatGPT api and GPT-SoVits-inference api
echo "Start parsing article to create emotions with GPT-Audio"
{
    bash "${CWD}/scripts/run_GPT-Audio.sh" "${CWD}/GPT-Audio"
}

# Run Real3D to turn audios to talking head vids
echo "Start running Real3D to generate videos"
{
    bash "${CWD}/scripts/run_Read3D.sh" "${CWD}/Read3D-Interface"
}

# Finalize output vid to make more original
echo "Start LivePortrait for final output"
{
    bash "${CWD}/scripts/run_LivePortrait.sh" "${CWD}/LivePortrait" "${SOURCE_VID_DIR}" "${DRIVING_VID_DIR}" "${OUTPUT_DIR}"
}