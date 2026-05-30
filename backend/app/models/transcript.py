from app import db
from datetime import datetime, timezone


class Transcript(db.Model):
    __tablename__ = "transcripts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    text = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20), nullable=True)
    duration_seconds = db.Column(db.Float, nullable=True)
    filename = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title or f"Recording {self.id}",
            "text": self.text,
            "language": self.language,
            "duration_seconds": self.duration_seconds,
            "filename": self.filename,
            "created_at": self.created_at.isoformat(),
        }
