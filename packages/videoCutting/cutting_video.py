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

def Detect_and_crop_face(output_size):
    # 先清空上一次的輸出目錄
    ClearDirectory(MID_1_DIR)
    ClearDirectory(MID_2_DIR)
    ClearDirectory(OUTPUT_DIR)

    file_names = os.listdir(INPUT_DIR) # 取得 INPUT_DIR 目錄下的所有檔案與資料夾
    file_names = [f for f in file_names if os.path.isfile(os.path.join(INPUT_DIR, f))] # 只保留檔案，過濾掉資料夾
    file_name=file_names[0] # 只採用第一個檔案
    video_path = os.path.join(INPUT_DIR, file_name) # 設定影片檔案路徑

    cap = cv2.VideoCapture(video_path) # 建立影片讀取器

    x, y, w, h = -1, -1, -1, -1 # 初始化人臉區域
    padding = 0 # 初始化 padding
    frame_count = 0 # 初始化影格計數器
    while True:
        ret, img = cap.read() # 讀取一幀
        if not ret: # 如果讀取失敗，離開迴圈
            break
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) # 轉成灰階
        if(x == -1): # 只透過第一個 frame 來設定人臉區域
            faces = detector(gray) # 檢測人臉
            if len(faces) == 0:
                print("No face detected!") 
                return
        
            face = faces[0] # 只處理第一個檢測到的人臉
            x, y, w, h = (face.left(), face.top(), face.width(), face.height())
            padding = int(PADDING * h)  # 擴展高度的一半作為以容納軀幹

        # 有 bias 的版本，加入 BIAS_X 與 BIAS_Y
        cropped_img = img[max(0, y-padding-BIAS_Y):min(img.shape[0], y+h+padding+BIAS_Y), max(0, x-padding-BIAS_X):min(img.shape[1], x+w+padding+BIAS_X)] # 裁剪人臉區域
        cropped_img = cv2.resize(cropped_img, output_size) # resize 成 output_size

        cv2.imwrite(os.path.join(MID_1_DIR, f"{file_name}_{frame_count}.jpg"), cropped_img) # 儲存每一幀裁減後的圖片，存至 MID_1_DIR 目錄
        frame_count += 1
        print(f"Processing {frame_count} frames")

    cap.release()

if __name__ == "__main__":
    Detect_and_crop_face((CUTTING_SIZE_X, CUTTING_SIZE_Y))


