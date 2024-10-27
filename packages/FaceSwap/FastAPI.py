import subprocess
import uvicorn
from fastapi import FastAPI

app = FastAPI()


# api 範例: http://localhost:8000/processimg/?param1=./input_folder&param2=./output_folder
@app.get("/processimg/")
def process_image(src: str, dst: str, out: str): # 接受兩個參數，分別代表輸入圖片路徑跟輸出圖片路徑
    try:

        command = [
            "python", "main.py",
            "--src", src,
            "--dst", dst,
            "--out", out,
            "--correct_color",
            "--no_debug_window",

        ]

        # 阻塞地執行 process_img.sh 並傳入參數
        result = subprocess.run(
            command,
            check=True, capture_output=True, text=True
        )

        return {"message": "Script executed successfully", "output": result.stdout.strip()}
    
    except subprocess.CalledProcessError as e:
        return {"message": "Script execution failed", "error": str(e), "stderr": e.stderr}

# 啟動伺服器的部分
if __name__ == "__main__":
    # 直接啟動 uvicorn
    uvicorn.run("FastAPI:app", host="0.0.0.0", port=3000, reload=True)