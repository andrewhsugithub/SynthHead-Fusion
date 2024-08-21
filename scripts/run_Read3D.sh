#!/bin/bash

DIR="$1"

echo "cd into repo: ${DIR}"
cd ${DIR}

echo "python main.py"
python "main.py"