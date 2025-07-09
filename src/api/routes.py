from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Message  # Added Message import
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask import Blueprint, request, jsonify
from .models import db, Favorite, Pet, User

api = Blueprint('api', __name__)


@api.route('/pets', methods=['GET'])
def get_pets():
    """Get all pets"""
    pets = Pet.query.all()
    result = [pet.to_dict() for pet in pets]
    return jsonify({"success": True, "data": result})

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
def create_message():  # Fixed naming
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
@api.route('/pets', methods=['POST'])
def create_pet():
    """Create a new pet"""
    data = request.get_json()

    # Validate required fields
    required_fields = ['name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"success": False, "error": f"{field} is required"}), 400

    # Create new pet
    pet = Pet(
        name=data.get('name'),
        age=data.get('age'),
        location=data.get('location'),
        image_url=data.get('image_url'),
        gender=data.get('gender'),
        weight=data.get('weight'),
        breed=data.get('breed'),
        activity=data.get('activity')
    )

    db.session.add(pet)
    db.session.commit()

    return jsonify({"success": True, "data": pet.to_dict()}), 201


@api.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    """Get a single pet by ID"""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"success": False, "error": "Pet not found"}), 404
    return jsonify({"success": True, "data": pet.to_dict()})


@api.route('/favorites', methods=['GET'])
def get_favorites():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({"success": False, "error": "user_id is required"}), 400
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    result = [fav.to_dict() for fav in favorites]
    return jsonify({"success": True, "data": result})


@api.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    pet_id = data.get('pet_id')
    if not user_id or not pet_id:
        return jsonify({"success": False, "error": "user_id and pet_id required"}), 400

    # Check if favorite already exists
    existing_favorite = Favorite.query.filter_by(
        user_id=user_id, pet_id=pet_id).first()
    if existing_favorite:
        return jsonify({"success": False, "error": "Pet is already in favorites"}), 400

    favorite = Favorite(user_id=user_id, pet_id=pet_id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"success": True, "data": favorite.to_dict()}), 201


@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = Favorite.query.get(favorite_id)
    if not favorite:
        return jsonify({"success": False, "error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"success": True, "message": "Favorite deleted"})


@api.route('/users', methods=['GET'])
def get_users():
    """Get all users"""
    users = User.query.all()
    result = [user.to_dict() for user in users]
    return jsonify({"success": True, "data": result})


@api.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    if not username or not email:
        return jsonify({"success": False, "error": "username and email required"}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "error": "User with this email already exists"}), 400

    user = User(username=username, email=email)
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "data": user.to_dict()}), 201
