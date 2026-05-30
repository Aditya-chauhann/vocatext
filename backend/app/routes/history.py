from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.transcript import Transcript

history_bp = Blueprint("history", __name__)


@history_bp.get("/transcripts")
@jwt_required()
def list_transcripts():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    search = request.args.get("q", "").strip()

    query = Transcript.query.filter_by(user_id=user_id)
    if search:
        query = query.filter(Transcript.text.ilike(f"%{search}%"))

    paginated = query.order_by(Transcript.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "transcripts": [t.to_dict() for t in paginated.items],
        "total": paginated.total,
        "pages": paginated.pages,
        "current_page": page,
    })


@history_bp.get("/transcripts/<int:tid>")
@jwt_required()
def get_transcript(tid):
    user_id = int(get_jwt_identity())
    t = Transcript.query.filter_by(id=tid, user_id=user_id).first_or_404()
    return jsonify(t.to_dict())


@history_bp.delete("/transcripts/<int:tid>")
@jwt_required()
def delete_transcript(tid):
    user_id = int(get_jwt_identity())
    t = Transcript.query.filter_by(id=tid, user_id=user_id).first_or_404()
    db.session.delete(t)
    db.session.commit()
    return jsonify({"deleted": True})
