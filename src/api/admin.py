import os
from flask_admin import Admin
from .models import db, User, Message, Pet, Favorite, Questionnaire
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='SnoutScout Admin', template_mode='bootstrap3')

   
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Questionnaire, db.session))

    
    admin.add_view(ModelView(Message, db.session))
    admin.add_view(ModelView(Pet, db.session))
    admin.add_view(ModelView(Favorite, db.session))

 
