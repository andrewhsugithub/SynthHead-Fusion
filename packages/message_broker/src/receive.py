import sys, os
import pika
from src.gpt_sovits_client import GPTSoVITSClient
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path=".env", override=True)
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = os.getenv("AUDIO_QUEUE")
API_ENDPOINT = "http://your-api-endpoint.com"
CHARACTER_NAME = os.getenv("CHARACTER_NAME")
GPT_SOVITS_ENDPOINT = os.getenv("GPT_SOVITS_ENDPOINT")

def save_audio_to_file(audio, file_path):
    with open(file_path, 'wb') as f:
        f.write(audio)
    print(f"Audio saved to {file_path}")

def process_message(ch, method, properties, body):
    message = json.loads(body)
    print(f" [x] Received message") 
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

def main():
    try: 
        # Set up connection and channel to RabbitMQ
        connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
        channel = connection.channel()
        
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        
        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_message, auto_ack=True)
        
        # Start listening to messages
        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
        
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
