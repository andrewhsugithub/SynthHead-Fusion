import requests
class GPTSoVITSClient:
    def __init__(self, api_endpoint, max_pool_connections=10) -> None:
        self.base_url = api_endpoint
                
        # Create a session with a connection pool
        self.session = requests.Session()
        self.adapter = requests.adapters.HTTPAdapter(pool_connections=max_pool_connections, pool_maxsize=max_pool_connections)
        self.session.mount('http://', self.adapter)
        self.session.mount('https://', self.adapter)
        
    def get_character_list(self):
        url = f"{self.base_url}/character_list"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def get_audio_with_post(self, character, emotion, text, text_language="zh", format="mp3"):
        data = {
            "character": character,
            "emotion": emotion,
            "text": text,
            "text_language": text_language,
            "format": format
        }
        url = f"{self.base_url}/tts"
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.content
    
    def get_audio_with_get(self, data):
        data = data.parse.quote(data) # format chinese characters to url encoding
        url = f"{self.base_url}/tts?character={data['character']}&text={data['text']}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.content

    def close(self):
        self.session.close()
