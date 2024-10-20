import subprocess
import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv, set_key

app = FastAPI()

dotenv_path = ".env"
load_dotenv(dotenv_path)


# api 範例: http://localhost:8000/processimg/?param1=./input_folder&param2=./output_folder
@app.get("/processimg/")
def process_image(param1: str, param2: str): # 接受兩個參數，分別代表輸入圖片路徑跟輸出圖片路徑
    try:
        # 根據輸入的參數設定 .env 檔案中的 INPUT_DIR 跟 OUTPUT_DIR
        set_key(dotenv_path, "INPUT_DIR", param1)
        set_key(dotenv_path, "OUTPUT_DIR", param2)

        # subprocess.run(["chmod", "+x", "./process_img.sh"], check=True)

        # 阻塞地執行 process_img.sh 並傳入參數
        result = subprocess.run(
            ["./process_img.sh"],
            check=True, capture_output=True, text=True
        )

        return {"message": "Script executed successfully", "output": result.stdout.strip()}
    
    except subprocess.CalledProcessError as e:
        return {"message": "Script execution failed", "error": str(e), "stderr": e.stderr}

# 啟動伺服器的部分
if __name__ == "__main__":
    # 直接啟動 uvicorn
    uvicorn.run("FastAPI:app", host="0.0.0.0", port=8000, reload=True)
