from models.database import db


# Association
pet_tags = db.Table('pet_tags',
                    db.Column('pet_id', db.Integer, db.ForeignKey(
                        'pets.id'), primary_key=True),
                    db.Column('tag_id', db.Integer, db.ForeignKey(
                        'tags.id'), primary_key=True)
                    )


class Tag(db.Model):

    __tablename__ = 'tags'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Tag information
    name = db.Column(db.String(50), unique=True, nullable=False)
    # Bootstrap color class
    color = db.Column(db.String(20), default='primary')

    # Many-to-many relationship with pets
    pets = db.relationship('Pet', secondary=pet_tags,
                           backref=db.backref('tags', lazy='dynamic'))

    def __repr__(self):
        return f'<Tag {self.name}>'

    def to_dict(self):
        """Convert tag object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
