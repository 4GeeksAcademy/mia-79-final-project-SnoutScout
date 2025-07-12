from flask import Flask
from .models import db
from .routes import api


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///snoutscout.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(favorites_bp)

    with app.app_context():
        db.create_all()

    return app
