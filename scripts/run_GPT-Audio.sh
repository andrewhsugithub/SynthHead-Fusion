#!/bin/bash

DIR="$1"
COMMAND_TO_RUN="$2"

echo "Activating conda"
echo "source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate"
source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate

echo "cd into repo: ${DIR}"
cd ${DIR}
echo "conda activate GPTAudio"
conda activate GPTAudio
echo "Running command: ${COMMAND_TO_RUN}"
$COMMAND_TO_RUN