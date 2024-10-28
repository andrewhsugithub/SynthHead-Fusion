import sys, os, time
import pika
from gpt_sovits_client import GPTSoVITSClient
from dotenv import load_dotenv
import json
from functools import partial
import requests

def save_audio_to_file(audio, file_path):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'wb') as f:
        f.write(audio)
    print(f"Audio saved to {file_path}")

def process_audio_queue(ch, method, properties, body, GPT_SOVITS_ENDPOINT, CHARACTER_NAME):
    
    message = json.loads(body)
    print(f" [x] Received message from audio queue") 
    sentence = message['sentence']
    emotion = message['emotion']
    user_id = message['user_id']
    access_token = message['access_token']
    audio_file_path = message['audio_file_path']
    
    print(f"sentence: {sentence}, emotion: {emotion}, user_id: {user_id}, access_token: {access_token}, audio_file_path: {audio_file_path}")
    
    try:  
        gpt_sovits_client = GPTSoVITSClient(GPT_SOVITS_ENDPOINT)
        audio = gpt_sovits_client.get_audio_with_post(character=CHARACTER_NAME, emotion=emotion, text=sentence)
        
        save_audio_to_file(audio, audio_file_path)
    except Exception as e:
        print(f"Error processing message: {e}")
        
def process_video_queue(ch, method, properties, body, REAL3D_ENDPOINT, MUSETALK_ENDPOINT):
    message = json.loads(body)
    print(f" [x] Received message from video queue") 
    audio_file_path = message['drv_aud']
    emotion = message['emotion']
    user_id = message['user_id']
    access_token = message['access_token']
    
    while not os.path.exists(audio_file_path):
        print(f"Waiting for audio file to be saved at {audio_file_path}")
        time.sleep(5)
    
    real3d_data = {
        "drv_aud": audio_file_path,
        "emotion": emotion,
        "user_id": user_id,
    }
    
    try:
        requests.post(REAL3D_ENDPOINT, json=real3d_data, headers={"Authorization": f"Bearer {access_token}"}).json()
    except Exception as e:
        print(f"Error processing message for real3d: {e}")
    
    musetalk_data = {}
    # requests.post(MUSETALK_ENDPOINT, json=musetalk_data, headers={"Authorization": f"Bearer {access_token}"}).json()
        
def load_env():
    load_dotenv(dotenv_path=".env", override=True)
    RABBITMQ_URL = os.getenv("RABBITMQ_URL")
    AUDIO_QUEUE = os.getenv("AUDIO_QUEUE")
    VIDEO_QUEUE = os.getenv("VIDEO_QUEUE")
    CHARACTER_NAME = os.getenv("CHARACTER_NAME")
    GPT_SOVITS_ENDPOINT = os.getenv("GPT_SOVITS_ENDPOINT")
    REAL3D_ENDPOINT = os.getenv("REAL3D_ENDPOINT")
    MUSETALK_ENDPOINT = os.getenv("MUSETALK_ENDPOINT")
    print(f"Loaded env vars, {RABBITMQ_URL}, {AUDIO_QUEUE}, {VIDEO_QUEUE}, {CHARACTER_NAME}, {GPT_SOVITS_ENDPOINT}, {REAL3D_ENDPOINT}, {MUSETALK_ENDPOINT}")
    return RABBITMQ_URL, AUDIO_QUEUE, VIDEO_QUEUE, CHARACTER_NAME, GPT_SOVITS_ENDPOINT, REAL3D_ENDPOINT, MUSETALK_ENDPOINT

def main():
    RABBITMQ_URL, AUDIO_QUEUE, VIDEO_QUEUE, CHARACTER_NAME, GPT_SOVITS_ENDPOINT, REAL3D_ENDPOINT, MUSETALK_ENDPOINT  = load_env()

    # Set up connection and channel to RabbitMQ
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    
    channel.queue_declare(queue=AUDIO_QUEUE, durable=True)
    channel.queue_declare(queue=VIDEO_QUEUE, durable=True)
    
    on_get_audio_message_callback = partial(process_audio_queue, GPT_SOVITS_ENDPOINT=GPT_SOVITS_ENDPOINT, CHARACTER_NAME=CHARACTER_NAME)
    on_get_video_message_callback = partial(process_video_queue, REAL3D_ENDPOINT=REAL3D_ENDPOINT, MUSETALK_ENDPOINT=MUSETALK_ENDPOINT)

    channel.basic_consume(queue=AUDIO_QUEUE, on_message_callback=on_get_audio_message_callback, auto_ack=True)
    channel.basic_consume(queue=VIDEO_QUEUE, on_message_callback=on_get_video_message_callback, auto_ack=True)
    
    # Start listening to messages
    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
        
            
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
