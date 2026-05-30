"""Audio conversion utilities — converts any format to 16kHz mono WAV for Whisper."""
import os
import subprocess

# Hardcoded ffmpeg path for Windows (winget install)
FFMPEG_PATH = r"C:\Users\aadit\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"


def convert_to_wav(input_path: str) -> str:
    """Convert any supported audio file to 16kHz mono WAV using ffmpeg."""
    output_path = os.path.splitext(input_path)[0] + "_converted.wav"

    # Use hardcoded path if ffmpeg not in PATH
    ffmpeg = FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else "ffmpeg"

    cmd = [
        ffmpeg, "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        "-f", "wav",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg conversion failed: {result.stderr}")
    return output_path