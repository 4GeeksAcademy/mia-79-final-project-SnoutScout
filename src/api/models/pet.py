from models.database import db


class Pet(db.Model):
    """
    Pet model for storing pet information
    """
    __tablename__ = 'pets'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # Pet information
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    gender = db.Column(db.String(25), nullable=False)
    weight = db.Column(db.String(15), nullable=False)
    breed = db.Column(db.String(45), nullable=False)
    activity = db.Column(db.String(45), nullable=False)
    


    

    image_url = db.Column(db.String(500), nullable=False)

    
    
    # Relationship with favorites
    favorites = db.relationship('Favorite', backref='pet', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Pet {self.name}>'
    
    def to_dict(self):
        """Convert pet object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'location': self.location,
            'image_url': self.image_url,
            'tags': [tag.name for tag in self.tags],
            
        } 