"""Whisper transcription engine — loads model once, reuses across requests."""
import os
import wave
import contextlib
import whisper

_model = None


def get_model():
    global _model
    if _model is None:
        model_name = os.getenv("WHISPER_MODEL", "base")
        print(f"[Whisper] Loading model: {model_name}", flush=True)
        _model = whisper.load_model(model_name)
    return _model


def transcribe_audio(wav_path: str) -> dict:
    """
    Transcribe a WAV file.
    Returns dict: { text, language, duration }
    """
    model = get_model()
    result = model.transcribe(wav_path, fp16=False, language='en')
    duration = None
    try:
        with contextlib.closing(wave.open(wav_path, "r")) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
    except Exception:
        pass

    if os.path.exists(wav_path):
        os.remove(wav_path)

    return {
        "text": result["text"].strip(),
        "language": result.get("language"),
        "duration": duration,
    }
