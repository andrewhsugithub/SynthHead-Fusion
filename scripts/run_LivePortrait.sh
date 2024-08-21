#!/bin/bash

DIR="$1"
SOURCE_VID="$2"
DRIVING_VID="$3"
OUTPUT_DIR="$4"

echo "Activating conda"
echo "source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate"
source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate

echo "cd into repo: ${DIR}"
cd ${DIR}

echo "conda activate LivePortrait"
conda activate LivePortrait

command="python inference.py --flag_do_torch_compile --source ${SOURCE_VID} --driving ${DRIVING_VID} --output-dir ${OUTPUT_DIR}"
echo "Running LivePortrait: ${command}"
eval $command