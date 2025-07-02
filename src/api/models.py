from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association table for favorites


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)

    # Relationship to access the pet and user from a favorite
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
            "favorites": [favorite.to_dict() for favorite in self.favorites]
        }

# Pet model


class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(50))
    location = db.Column(db.String(100))
    image_url = db.Column(db.String(255))
    gender = db.Column(db.String(20))
    weight = db.Column(db.String(50))
    breed = db.Column(db.String(100))
    activity = db.Column(db.String(100))

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
