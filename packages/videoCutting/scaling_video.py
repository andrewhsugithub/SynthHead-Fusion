import cv2
import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()

INPUT_DIR=os.getenv("INPUT_DIR")
CUTTING_SIZE_X=int(os.getenv("CUTTING_SIZE_X"))
CUTTING_SIZE_Y=int(os.getenv("CUTTING_SIZE_Y"))
MID_2_DIR=os.getenv("MID_2_DIR")
OUTPUT_DIR=os.getenv("OUTPUT_DIR")

def ScalingImage(output_size):
    # 取得原始影片的 metadata
    input_file_names = os.listdir(INPUT_DIR)
    input_file_names = [f for f in input_file_names if os.path.isfile(os.path.join(INPUT_DIR, f))]
    input_file_name=input_file_names[0]
    input_video_path = os.path.join(INPUT_DIR, input_file_name)
    input_cap = cv2.VideoCapture(input_video_path)
    input_fps = input_cap.get(cv2.CAP_PROP_FPS)
    print(f"Processing {input_file_names}")
    print(f"FPS: {input_fps}")
    print(f"Output size: {CUTTING_SIZE_X}x{CUTTING_SIZE_Y}")
    input_cap.release()


    print("combinating and Scaling video...")
    # 讀取圖片
    file_names = os.listdir(MID_2_DIR) # 取得 MID_2_DIR 目錄下的所有檔案與資料夾
    file_names = [f for f in file_names if os.path.isfile(os.path.join(MID_2_DIR, f))] # 只保留檔案，過濾掉資料夾
    file_names.sort(key=lambda x: int(x.split('_')[1].split('.')[0])) # 依照檔名排序
    out = cv2.VideoWriter(os.path.join(OUTPUT_DIR, f"{input_file_name}"), cv2.VideoWriter_fourcc(*'mp4v'), input_fps, output_size) # 建立影片寫入器
    frame_count = 0
    for file_name in file_names: # 將 MID_2_DIR 目錄下的所有檔案組合成一部完整的影片
        image_path = os.path.join(MID_2_DIR, file_name) # 設定圖片檔案路徑
        img = cv2.imread(image_path) # 讀取圖片
        img=img.astype(np.uint8) # 轉換成 uint8 格式，避免影片寫入器無法處理

        # 縮放圖片到 output_size
        resized_img = cv2.resize(img, output_size)
        out.write(resized_img) # 將縮放後的圖片寫入影片

        frame_count += 1
        print(f"Processed image {image_path} successfully. Frame count: {frame_count}")

    out.release() # 釋放影片寫入器

if __name__ == "__main__":
    ScalingImage((CUTTING_SIZE_X, CUTTING_SIZE_Y))


