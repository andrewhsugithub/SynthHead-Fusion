import os
import shutil
import cv2
import dlib
from dotenv import load_dotenv
import os

detector = dlib.get_frontal_face_detector() # 載入 dlib 的臉部檢測器
load_dotenv()

CUTTING_SIZE_X=int(os.getenv("CUTTING_SIZE_X"))
CUTTING_SIZE_Y=int(os.getenv("CUTTING_SIZE_Y"))
BIAS_X=int(os.getenv("BIAS_X"))
BIAS_Y=int(os.getenv("BIAS_Y"))
PADDING=float(os.getenv("PADDING"))
INPUT_DIR=os.getenv("INPUT_DIR")
MID_1_DIR=os.getenv("MID_1_DIR")
MID_2_DIR=os.getenv("MID_2_DIR")
OUTPUT_DIR=os.getenv("OUTPUT_DIR")

def ClearDirectory(directory):
    # 先清空 directory 目錄下的所有檔案與資料夾
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.remove(file_path)  # 刪除檔案或符號連結
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)  # 刪除資料夾
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

def DetectFaceBoundingBox(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) # 轉成灰階
    faces = detector(gray) # 檢測人臉
    if len(faces) == 0:
        print("No face detected!") 
        return 0, 0, 0, 0, 0
    face = faces[0] # 只處理第一個檢測到的人臉
    x, y, w, h = (face.left(), face.top(), face.width(), face.height()) # 計算人臉區域
    padding = int(PADDING * h)  # 擴展高度的一半作為以容納軀幹
    return x, y, w, h, padding

def Detect_and_crop_face(output_size):
    # 先清空上一次的輸出目錄
    ClearDirectory(MID_1_DIR)
    ClearDirectory(MID_2_DIR)
    ClearDirectory(OUTPUT_DIR)

    file_names = os.listdir(INPUT_DIR)
    file_names = [f for f in file_names if os.path.isfile(os.path.join(INPUT_DIR, f))]
    for file_name in file_names:
        image_path = os.path.join(INPUT_DIR, file_name)

        img = cv2.imread(image_path)     # 讀取圖片
        if img is None:
            print("Image not found!")
            return
        
        x, y, w, h, padding = DetectFaceBoundingBox(img)
        cropped_img1 = img[max(0, y-padding-BIAS_Y):min(img.shape[0], y+h+padding+BIAS_Y), max(0, x-padding-BIAS_X):min(img.shape[1], x+w+padding+BIAS_X)] # 裁剪人臉區域

        x, y, w, h, padding = DetectFaceBoundingBox(cropped_img1)
        cropped_img2 = cropped_img1[max(0, y-padding):min(cropped_img1.shape[0], y+h+padding), max(0, x-padding):min(cropped_img1.shape[1], x+w+padding)] # 裁剪人臉區域

        output_path = os.path.join(MID_1_DIR, file_name)
        cv2.imwrite(output_path, cropped_img2)
        print(f"Processed image saved as {output_path}")

if __name__ == "__main__":
    Detect_and_crop_face((CUTTING_SIZE_X, CUTTING_SIZE_Y))


