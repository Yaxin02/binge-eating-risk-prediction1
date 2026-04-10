from datetime import datetime
from database import db

class EDEQSubmission(db.Model):
    __tablename__ = "edeq_submissions"

    id = db.Column(db.Integer, primary_key=True)
    q1 = db.Column(db.Integer, nullable=False)
    q2 = db.Column(db.Integer, nullable=False)
    q3 = db.Column(db.Integer, nullable=False)
    q4 = db.Column(db.Integer, nullable=False)
    q5 = db.Column(db.Integer, nullable=False)
    q6 = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)
    level = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)