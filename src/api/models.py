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

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }



# class Favorite(db.Model):
#     __tablename__ = 'favorites'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)

#     # Relationship to access the pet and user from a favorite
#     user = db.relationship('User', back_populates='favorites')
#     pet = db.relationship('Pet', back_populates='favorites')

#     def __repr__(self):
#         return f'<Favorite {self.id} - User {self.user_id} - Pet {self.pet_id}>'

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "user_id": self.user_id,
#             "pet_id": self.pet_id,
#             "pet": self.pet.to_dict() if self.pet else None
#         }

# # User model


# class User(db.Model):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)

#     # Relationship to access a user's favorites
#     favorites = db.relationship(
#         'Favorite', back_populates='user', cascade='all, delete-orphan')

#     # Social feed relationships
#     posts = db.relationship('Post', back_populates='user',
#                             cascade='all, delete-orphan')
#     post_likes = db.relationship(
#         'PostLike', back_populates='user', cascade='all, delete-orphan')
#     post_comments = db.relationship(
#         'PostComment', back_populates='user', cascade='all, delete-orphan')

#     def __repr__(self):
#         return f'<User {self.id} - {self.username}>'

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "username": self.username,
#             "email": self.email,
#             "favorites": [favorite.to_dict() for favorite in self.favorites]
#         }

# # Pet model


# class Pet(db.Model):
#     __tablename__ = 'pets'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     age = db.Column(db.String(50))
#     location = db.Column(db.String(100))
#     image_url = db.Column(db.String(255))
#     gender = db.Column(db.String(20))
#     weight = db.Column(db.String(50))
#     breed = db.Column(db.String(100))
#     activity = db.Column(db.String(100))

#     # Additional fields for Petfinder integration
#     # Petfinder's animal ID
#     petfinder_id = db.Column(db.String(50), unique=True)
#     description = db.Column(db.Text)  # Petfinder description
#     status = db.Column(db.String(50))  # adoptable, adopted, found, etc.
#     organization_id = db.Column(db.String(50))  # Petfinder organization ID
#     url = db.Column(db.String(255))  # Petfinder URL
#     published_at = db.Column(db.String(100))  # When published on Petfinder
#     contact = db.Column(db.Text)  # JSON string of contact info

#     # Relationship to access all favorites for this pet
#     favorites = db.relationship(
#         'Favorite', back_populates='pet', cascade='all, delete-orphan')

#     def __repr__(self):
#         return f'<Pet {self.id} - {self.name}>'

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "age": self.age,
#             "location": self.location,
#             "image_url": self.image_url,
#             "gender": self.gender,
#             "weight": self.weight,
#             "breed": self.breed,
#             "activity": self.activity,
#             "petfinder_id": self.petfinder_id,
#             "description": self.description,
#             "status": self.status,
#             "url": self.url,
#             "published_at": self.published_at
#         }

# Social Feed Models

# Post model for user posts about their dogs


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))  # Optional image URL
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ), onupdate=db.func.current_timestamp())

    # Relationships
    user = db.relationship('User', back_populates='posts')
    likes = db.relationship(
        'PostLike', back_populates='post', cascade='all, delete-orphan')
    comments = db.relationship(
        'PostComment', back_populates='post', cascade='all, delete-orphan')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)

    # Relationship to access
    user = db.relationship('User', back_populates='favorites')
    pet = db.relationship('Pet', back_populates='favorites')

    def __repr__(self):
        return f'<Post {self.id} - {self.title}>'

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
    message_from: Mapped[int] = mapped_column(
        db.ForeignKey('user.id'), nullable=False)
    message_to: Mapped[int] = mapped_column(
        db.ForeignKey('user.id'), nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "message_from": self.message_from,
            "message_to": self.message_to,
            "content": self.content,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user": self.user.to_dict() if self.user else None,
            "likes_count": len(self.likes),
            "comments_count": len(self.comments),
            "is_liked_by_current_user": False  # Will be set by the API
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

    def to_dict(self):
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


# Post Like model


class PostLike(db.Model):
    __tablename__ = 'post_likes'
    id = db.Column(db.Integer, primary_key=True)
    petfinder_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(50))
    location = db.Column(db.String(256))
    image_url = db.Column(db.String(512))
    gender = db.Column(db.String(20))
    weight = db.Column(db.String(50), nullable=True)
    breed = db.Column(db.String(100))
    activity = db.Column(db.String(512))

    # Relationships
    user = db.relationship('User', back_populates='post_likes')
    post = db.relationship('Post', back_populates='likes')

    # Ensure a user can only like a post once
    __table_args__ = (db.UniqueConstraint(
        'user_id', 'post_id', name='unique_user_post_like'),)

    def __repr__(self):
        return f'<PostLike {self.id} - User {self.user_id} - Post {self.post_id}>'

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# Post Comment model


class PostComment(db.Model):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(
    ), onupdate=db.func.current_timestamp())

    # Relationships
    user = db.relationship('User', back_populates='post_comments')
    post = db.relationship('Post', back_populates='comments')

    def __repr__(self):
        return f'<PostComment {self.id} - User {self.user_id} - Post {self.post_id}>'

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user": self.user.to_dict() if self.user else None
        }
