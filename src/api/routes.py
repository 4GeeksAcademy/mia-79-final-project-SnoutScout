from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Message  # Added Message import
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Messages routes
@api.route('/messages', methods=['GET'])
def get_messages():
    current_user_id = request.args.get('user_id', type=int)
    contact_id = request.args.get('contact_id', type=int)
    
    if not current_user_id:
        return jsonify({"error": "Don't know who you are!"}), 400
    
    messages = Message.query.filter(
        ((Message.message_from == current_user_id) & (Message.message_to == contact_id)) |
        ((Message.message_from == contact_id) & (Message.message_to == current_user_id))
    ).order_by(Message.created_at).all()
    
    return jsonify([msg.serialize() for msg in messages])

@api.route('/messages', methods=['POST'])
def create_message():  
    data = request.get_json()
    required_fields = ['message_from', 'message_to', 'content']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Something important is missing"}), 400
    
    try:
        new_message = Message(
            message_from=data['message_from'],
            message_to=data['message_to'],
            content=data['content'],
            created_at=datetime.now()
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify(new_message.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Something went wrong: {str(e)}"}), 500

@api.route('/contacts', methods=['GET'])
def get_contacts():
    current_user_id = request.args.get('user_id', type=int)
    
    if not current_user_id:
        return jsonify({"error": "Don't know who you are!"}), 400
    
    sent_to = db.session.query(Message.message_to).filter(
        Message.message_from == current_user_id).distinct()
    received_from = db.session.query(Message.message_from).filter(
        Message.message_to == current_user_id).distinct()

    contact_ids = {id for (id,) in sent_to.union_all(received_from)}
    contacts = User.query.filter(User.id.in_(contact_ids)).all()

    contacts_data = []
    for contact in contacts:
        last_message = Message.query.filter(
            ((Message.message_from == current_user_id) & (Message.message_to == contact.id)) |
            ((Message.message_from == contact.id) & (Message.message_to == current_user_id))
        ).order_by(Message.created_at.desc()).first()
        
        contacts_data.append({
            "id": contact.id,
            "name": contact.name,
            "last_message": last_message.content if last_message else None,
        })

    return jsonify(contacts_data)