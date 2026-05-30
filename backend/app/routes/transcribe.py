import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.transcript import Transcript
from app.utils.audio import convert_to_wav
from app.utils.whisper_engine import transcribe_audio
from werkzeug.utils import secure_filename

transcribe_bp = Blueprint("transcribe", __name__)

ALLOWED = {"wav", "mp3", "webm", "ogg", "m4a", "mp4", "mkv", "flac"}


def allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED


@transcribe_bp.post("/transcribe")
@jwt_required()
def transcribe():
    user_id = int(get_jwt_identity())

    if "file" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    f = request.files["file"]
    if not f.filename or not allowed(f.filename):
        return jsonify({"error": "Unsupported file format"}), 415

    upload_dir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_dir, exist_ok=True)

    filename = secure_filename(f.filename)
    raw_path = os.path.join(upload_dir, f"raw_{user_id}_{filename}")
    f.save(raw_path)

    try:
        wav_path = convert_to_wav(raw_path)
        result = transcribe_audio(wav_path)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500
    finally:
        if os.path.exists(raw_path):
            os.remove(raw_path)

    title = request.form.get("title") or None
    transcript = Transcript(
        user_id=user_id,
        title=title,
        text=result["text"],
        language=result.get("language"),
        duration_seconds=result.get("duration"),
        filename=filename,
    )
    db.session.add(transcript)
    db.session.commit()

    return jsonify({"transcript": transcript.to_dict()})
