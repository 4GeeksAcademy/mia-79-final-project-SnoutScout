from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import String, Boolean  
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

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
    favorites = db.relationship(
        'Favorite', back_populates='user', cascade='all, delete-orphan')

    def __init__(self, first_name, last_name, email, password):
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

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)

    # Relationship to access 
    user = db.relationship('User', back_populates='favorites')
    pet = db.relationship('Pet', back_populates='favorites')

    def __repr__(self):
        return f'<Favorite {self.id} - User {self.user_id} - Pet {self.pet_id}>'

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pet_id": self.pet_id,
            "pet": self.pet.to_dict() if self.pet else None
        }
# "favorites": [favorite.to_dict() for favorite in self.favorites]


class Message(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    message_from: Mapped[int] = mapped_column(db.ForeignKey('user.id'), nullable=False)
    message_to: Mapped[int] = mapped_column(db.ForeignKey('user.id'), nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now)

    def serialize(self):
        return {
            "id": self.id,
            "message_from": self.message_from,
            "message_to": self.message_to,
            "content": self.content,
            "created_at": self.created_at,
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
    
              

# Pet model
class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(50))
    location = db.Column(db.String(256))
    image_url = db.Column(db.String(512))
    gender = db.Column(db.String(20))
    weight = db.Column(db.String(50), nullable=True)
    breed = db.Column(db.String(100))
    activity = db.Column(db.String(512))

    # Relationship to access all favorites for this pet
    favorites = db.relationship(
        'Favorite', back_populates='pet', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Pet {self.id} - {self.name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "location": self.location,
            "image_url": self.image_url,
            "gender": self.gender,
            "weight": self.weight,
            "breed": self.breed,
            "activity": self.activity
        }
