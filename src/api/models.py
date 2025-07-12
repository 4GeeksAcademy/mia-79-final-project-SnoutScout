from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(String(80), nullable=False)
    last_name = db.Column(String(80), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    questionnaire = db.relationship(
        "Questionnaire", backref="user", uselist=False)

    def _init_(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = generate_password_hash(password)

    def check_password(self, password_input):
        return check_password_hash(self.password, password_input)


def serialize (self):
    return {
        "id": self.id,
        "first_name": self.first_name,
        "last_name": self.last_name,
        "email": self.email,
        "created_at": self.created_at.isoformat()
    }


class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(50))
    activity = db.Column(db.String(50))
    travel = db.Column(db.String(50))
    other_pets = db.Column(db.String(100))
    hypoallergenic = db.Column(db.String(10))
    gender_preference = db.Column(db.String(50))
    yard = db.Column(db.String(10))
    owned_pets_before = db.Column(db.String(10))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


def seralize (self):
    return {
        "id": self.id,
        "size": self.size,
        "activity": self.activity,
        "travel": self.travel,
        "other_pets": self.other_pets,
        "hypoallergenic": self.hypoallergenic,
        "gender_preference": self.gender_preference,
        "yard": self.yard,
        "owned_pets_before": self.owned_pets_before,
        "user_id": self.user_id
    }
