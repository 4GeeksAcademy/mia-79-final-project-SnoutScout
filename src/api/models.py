from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association table for favorites


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

    def __repr__(self):
        return f'<Post {self.id} - {self.title}>'

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "content": self.content,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user": self.user.to_dict() if self.user else None,
            "likes_count": len(self.likes),
            "comments_count": len(self.comments),
            "is_liked_by_current_user": False  # Will be set by the API
        }

# Post Like model


class PostLike(db.Model):
    __tablename__ = 'post_likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

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
