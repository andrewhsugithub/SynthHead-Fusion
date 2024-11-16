import aiohttp
import asyncio

class GPTSoVITSClient:
    def __init__(self, api_endpoint) -> None:
        self.base_url = api_endpoint

    async def get_character_list(self):
        url = f"{self.base_url}/character_list"
        async with self.session.get(url) as response:
            response.raise_for_status()
            return await response.json()

    async def get_audio_with_post(self, character, emotion, text, text_language="zh", format="mp3", session=None):
        data = {
            "character": character,
            "emotion": emotion,
            "text": text,
            "text_language": text_language,
            "format": format
        }
        url = f"{self.base_url}/tts"
        async with session.post(url, json=data) as response:
            response.raise_for_status()
            return await response.read() 

    async def get_audio_with_get(self, character, text, session=None):
        # Ensure that Chinese characters in the query string are URL-encoded
        character = aiohttp.helpers.quote(character, safe='')
        text = aiohttp.helpers.quote(text, safe='')
        url = f"{self.base_url}/tts?character={character}&text={text}"
        
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.read()
