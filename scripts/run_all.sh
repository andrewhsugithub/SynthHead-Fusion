#!/bin/bash

# # Example usage: 
# bash /mnt/Nami/users/Jason0411202/ml/scripts/run_all.sh

# Initialize variables
PWD="/mnt/Nami/users/Jason0411202/ml"

# Start up GPT-SoVits-inference backend
echo "Start up GPT-SoVITs inference service"
{
    bash "${PWD}/scripts/run_GPT-SoVITS.sh" "${PWD}/GPT-SoVITS-Inference"
}
# Run ChatGPT api and GPT-SoVits-inference api
echo "Start parsing article to create emotions with GPT-Audio"
{
    bash "${PWD}/scripts/run_GPT-Audio.sh" "${PWD}/GPT-Audio"
}