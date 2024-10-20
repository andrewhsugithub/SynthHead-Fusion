import cv2
import os
from dotenv import load_dotenv

load_dotenv()

CUTTING_SIZE_X=int(os.getenv("CUTTING_SIZE_X"))
CUTTING_SIZE_Y=int(os.getenv("CUTTING_SIZE_Y"))
MID_2_DIR=os.getenv("MID_2_DIR")
OUTPUT_DIR=os.getenv("OUTPUT_DIR")

def ScalingImage(output_size):
    print("Scaling image...")
    # 讀取圖片
    file_names = os.listdir(MID_2_DIR)
    file_names = [f for f in file_names if os.path.isfile(os.path.join(MID_2_DIR, f))]

    for file_name in file_names:
        image_path = os.path.join(MID_2_DIR, file_name)
        img = cv2.imread(image_path)

        # 縮放圖片到 output_size
        resized_img = cv2.resize(img, output_size)

        # 保存縮放後的圖片
        output_path = os.path.join(OUTPUT_DIR, file_name)
        cv2.imwrite(output_path, resized_img)
        print(f"Processed image saved as {output_path}")

if __name__ == "__main__":
    ScalingImage((CUTTING_SIZE_X, CUTTING_SIZE_Y))


