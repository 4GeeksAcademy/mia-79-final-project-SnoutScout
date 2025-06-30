from models.database import db


class Favorite(db.Model):
   
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    
    
    # pet can be favorated one time 
    __table_args__ = (db.UniqueConstraint('user_id', 'pet_id', name='_user_pet_uc'),)
    
    def __repr__(self):
        return f'<Favorite {self.user_id}-{self.pet_id}>'
    
    def to_dict(self):
        """Convert favorite object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pet_id': self.pet_id,
            'pet': self.pet.to_dict() if self.pet else None,
           
        } 