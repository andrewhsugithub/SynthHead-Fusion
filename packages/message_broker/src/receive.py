import sys
import os
import json
import asyncio
from functools import partial
from dotenv import load_dotenv
import aiohttp
import aiofiles
from aio_pika import connect_robust, Message, ExchangeType
from gpt_sovits_client import GPTSoVITSClient

async def save_audio_to_file(audio, file_path):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(audio)
    print(f"Audio saved to {file_path}")
    
async def wait_for_file(file_path, interval=5):
    while not os.path.exists(file_path):
        print(f"Waiting for audio file to be saved at {file_path}")
        await asyncio.sleep(interval)
        
async def recreate_session(session_container):
    if not session_container['session'].closed:
        await session_container['session'].close()
    session_container['session'] = aiohttp.ClientSession()

async def process_audio_queue(message, GPT_SOVITS_ENDPOINT, CHARACTER_NAME, session):
    await message.ack()
    msg_content = json.loads(message.body)
    print(f" [x] Received message from audio queue")
    sentence = msg_content['sentence']
    emotion = msg_content['emotion']
    user_id = msg_content['user_id']
    access_token = msg_content['access_token']
    audio_file_path = msg_content['audio_file_path']
    
    print(f"sentence: {sentence}, emotion: {emotion}, user_id: {user_id}, access_token: {access_token}, audio_file_path: {audio_file_path}")
    
    while True:
        try:
            gpt_sovits_client = GPTSoVITSClient(GPT_SOVITS_ENDPOINT)
            audio = await gpt_sovits_client.get_audio_with_post(character=CHARACTER_NAME, emotion=emotion, text=sentence, session=session)
            await save_audio_to_file(audio, audio_file_path)
            break
        except aiohttp.ClientPayloadError as e:
            print("Session error in audio queue, recreating session.")
            await recreate_session()
        except Exception as e:
            print(f"Error processing message for audio queue: {e}")
            break

async def process_video_queue(message, REAL3D_ENDPOINT, MUSETALK_ENDPOINT, session):
    await message.ack()
    msg_content = json.loads(message.body)
    print(f" [x] Received message from video queue")
    audio_file_path = msg_content['drv_aud']
    emotion = msg_content['emotion']
    user_id = msg_content['user_id']
    access_token = msg_content['access_token']
    
    await wait_for_file(audio_file_path)

    real3d_data = {
        "drv_aud": audio_file_path,
        "emotion": emotion,
        "user_id": user_id,
    }
    
    print(f"real3d_data: {real3d_data}")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    while True:
        try:
            async with session.post(REAL3D_ENDPOINT, json=real3d_data, headers=headers) as response:
                await response.json()
                break
        except aiohttp.ClientPayloadError as e:
            print("Session error in audio queue, recreating session.")
            await recreate_session()
        except Exception as e:
            print(f"Error processing message for REAL3D: {e}")
            break
            
        musetalk_data = {}

async def load_env():
    load_dotenv(dotenv_path=".env", override=True)
    return {
        "RABBITMQ_URL": os.getenv("RABBITMQ_URL"),
        "AUDIO_QUEUE": os.getenv("AUDIO_QUEUE"),
        "VIDEO_QUEUE": os.getenv("VIDEO_QUEUE"),
        "CHARACTER_NAME": os.getenv("CHARACTER_NAME"),
        "GPT_SOVITS_ENDPOINT": os.getenv("GPT_SOVITS_ENDPOINT"),
        "REAL3D_ENDPOINT": os.getenv("REAL3D_ENDPOINT"),
        "MUSETALK_ENDPOINT": os.getenv("MUSETALK_ENDPOINT")
    }

async def main():
    env = await load_env()
    RABBITMQ_URL = env["RABBITMQ_URL"]
    AUDIO_QUEUE = env["AUDIO_QUEUE"]
    VIDEO_QUEUE = env["VIDEO_QUEUE"]
    CHARACTER_NAME = env["CHARACTER_NAME"]
    GPT_SOVITS_ENDPOINT = env["GPT_SOVITS_ENDPOINT"]
    REAL3D_ENDPOINT = env["REAL3D_ENDPOINT"]
    MUSETALK_ENDPOINT = env["MUSETALK_ENDPOINT"]

    connection = await connect_robust(RABBITMQ_URL)
    channel = await connection.channel()
    
    session_container = {"session": aiohttp.ClientSession()}
    
    # Declare queues
    audio_queue = await channel.declare_queue(AUDIO_QUEUE, durable=True)
    video_queue = await channel.declare_queue(VIDEO_QUEUE, durable=True)

    # Set up consumers with callbacks
    await audio_queue.consume(partial(process_audio_queue, GPT_SOVITS_ENDPOINT=GPT_SOVITS_ENDPOINT, CHARACTER_NAME=CHARACTER_NAME, session=session_container['session']))
    await video_queue.consume(partial(process_video_queue, REAL3D_ENDPOINT=REAL3D_ENDPOINT, MUSETALK_ENDPOINT=MUSETALK_ENDPOINT, session=session_container['session']))

    print(' [*] Waiting for messages. To exit press CTRL+C')
    try:
        await asyncio.Future()  # Keep the main function running
    finally:
        await connection.close()
        await session.close()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
