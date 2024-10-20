# 環境配置
## 安裝所需依賴
* 環境: python 3.11
* 註: win10 安裝 dlib   https://github.com/z-mahmud22/Dlib_Windows_Python3.x

```
conda create -n real-esrgan python=3.11
conda activate real-esrgan
git clone https://github.com/xinntao/Real-ESRGAN.git
cd Real-ESRGAN
pip install --verbose basicsr --use-pep517
pip install facexlib
pip install gfpgan
pip install -r requirements.txt
python setup.py develop
cd ..
git clone https://github.com/davisking/dlib
cd dlib
python -m pip install cmake
python setup.py install
pip install python-dotenv
```

## 配置環境變數
在本專案根目錄下建立 `.env` 檔案，並填入以下內容
```
CUTTING_SIZE_X=500 # 切出來的圖片長所占的像素
CUTTING_SIZE_Y=500 # 切出來的圖片寬所占的像素
PADDING=0.5 # dlib 切出來的人臉區域，要加上圖片長的幾倍作為 padding
BIAS_X=0 # 切出來的圖片長的偏移量
BIAS_Y=0 # 切出來的圖片寬的偏移量
INPUT_DIR=./input # 專案的輸入資料夾
MID_1_DIR=./Real-ESRGAN/inputs # 切割後的圖片輸出之暫存資料夾
MID_2_DIR=./Real-ESRGAN/results # 切割與提升畫質完之圖片的暫存資料夾
OUTPUT_DIR=./output # 專案的輸出資料夾
```

## 測試 real-esrgan 是否正常運作 (可選)
在 Real-ESRGAN 目錄下執行以下指令
```bash
python inference_realesrgan.py -n RealESRGAN_x4plus -i inputs --face_enhance
```

## 除錯紀錄 (可選)
* 有時候會出現以下錯誤 `No module named ‘torchvision.transforms.functional_tensor`
    * 解決方法: https://blog.csdn.net/lanxing147/article/details/136625264

# 執行
## 處理圖片
在本專案根目錄中執行
輸入的圖片放在 input 資料夾中 (可以多張)
最終輸出圖片將會輸出在 output 資料夾中
```bash
chmod +x process_img.sh
./process_img.sh
```

## 處理影片
在本專案根目錄中執行
輸入的影片放在 input 資料夾中 (只能放一部)
最終輸出的影片將會輸出在 output 資料夾中
```bash
chmod +x process_video.sh
./process_video.sh
```