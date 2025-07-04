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


    def serialize(self):
        return {
            "id": self.id,
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