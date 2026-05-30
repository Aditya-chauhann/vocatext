import os
import requests

def transcribe_audio(wav_path: str) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    with open(wav_path, "rb") as f:
        response = requests.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {api_key}"},
            files={"file": ("audio.wav", f, "audio/wav")},
            data={"model": "whisper-large-v3-turbo", "language": "en"}
        )
    if os.path.exists(wav_path):
        os.remove(wav_path)
    result = response.json()
    return {"text": result.get("text", ""), "language": "en", "duration": None}