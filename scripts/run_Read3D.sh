#!/bin/bash

DIR="$1"

echo "Activating conda"
echo "source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate"
source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate

echo "conda activate real3dportrait"
conda activate real3dportrait

echo "cd into repo: ${DIR}"
cd ${DIR}

echo "python main.py"
python "main.py"