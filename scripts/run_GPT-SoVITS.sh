#!/bin/bash

DIR="$1"

echo "Activating conda"
echo "source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate"
source /mnt/Nami/users/Jason0411202/anaconda3/bin/activate

echo "cd into repo: ${DIR}"
cd ${DIR}

echo "conda activate GPTSoVits"
conda activate GPTSoVits
echo "python app.py"
python "app.py"