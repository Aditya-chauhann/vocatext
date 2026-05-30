import os
import sys

# Add ffmpeg to PATH for this process before anything else imports
FFMPEG_BIN = r"C:\Users\aadit\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
if FFMPEG_BIN not in os.environ.get("PATH", ""):
    os.environ["PATH"] = FFMPEG_BIN + os.pathsep + os.environ.get("PATH", "")

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)