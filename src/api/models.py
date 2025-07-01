from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(String(80), nullable=False)
    last_name = db.Column(String(80), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    questionnaire = db.relationship('Questionnaire', back_populates='user', uselist=False)