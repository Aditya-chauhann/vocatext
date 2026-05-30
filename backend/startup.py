from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    db.session.execute(text("DROP TABLE IF EXISTS transcripts CASCADE"))
    db.session.execute(text("DROP TABLE IF EXISTS users CASCADE"))
    db.session.commit()
    db.create_all()
    print("Tables recreated successfully")