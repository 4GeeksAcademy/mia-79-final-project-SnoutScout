from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean  
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[int] = mapped_column(String(50), nullable=True) # for sign up form, make sure to include input for name
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
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

# User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # Relationship to access a user's favorites
    favorites = db.relationship(
        'Favorite', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.id} - {self.username}>'

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

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
