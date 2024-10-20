#!/bin/bash

# 進入本專案所需環境
conda activate /mnt/Nami/users/Jason0411202/anaconda3/envs/real3dportrait

# 執行 cutting_video.py 腳本
python cutting_video.py

# 切換到 Real-ESRGAN 目錄
cd Real-ESRGAN

# 執行 inference_realesrgan.py 腳本
python inference_realesrgan.py -n RealESRGAN_x4plus -i inputs --face_enhance

# 返回上一層目錄
cd ..

# 執行 scaling_video.py 腳本
python scaling_video.py
