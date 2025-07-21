from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Message, Pet  # Added Message import
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask import Blueprint, request, jsonify
from .models import db, Favorite, Pet, User
import os
import requests
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)

PETFINDER_API_KEY = os.getenv("PETFINDER_API_KEY")
PETFINDER_API_SECRET = os.getenv("PETFINDER_API_SECRET")

# Get petfinder API token


def get_petfinder_token():
    url = "https://api.petfinder.com/v2/oauth2/token"
    payload = {
        'grant_type': 'client_credentials',
        'client_id': PETFINDER_API_KEY,
        'client_secret': PETFINDER_API_SECRET
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=payload, headers=headers)

    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception(
            "Failed to retrieve Petfinder API token: " + response.text)


# ===== PET QUESTIONNAIRE =====
def score_pet_against_questionnaire(pet, questionnaire):
    score = 0

    if questionnaire.size and questionnaire.size.lower() in (pet.size or "").lower():
        score + - 1
    if questionnaire.activity and questionnaire.activit.lower() in (pet.activity or "").lower():
        score += 1
    if questionnaire.locatioin and questionnaire.location.lower() in (pet.location or "").lower():
        score += 1
    if questionnaire.other_pets and questionnaire.other_pets.lower() in (pet.other_pets or "").lower():
        score += 1
    if questionnaire.hypoallergenic and questionnaire.hypoallergenc.lower() in (pet.hypoallergenic or "").lower():
        score += 1
    if questionnaire.gender and questionnaire.gender.lower() in (pet.gender or "").lower():
        score += 1
    if questionnaire.yard and questionnaire.yard.lower() in (pet.yard or "").lower():
        score += 1
    if questionnaire.owned_pets_before and questionnaire.owned_pets_before.lower() in (pet.owned_pets_before or "").lower():
        score += 1

        return score

# ===== PET MATCHING ROUTES =====


@api.route('/match/<int:user_id>', methods=['GET'])
@jwt_required()
def mtch_pets(user_id):
    user = User.query.get(user_id)

    if not user or not user.questionnaire:
        return jsonify({"error": "User or questionnaire not found"}), 404

    questionnaire = user.questionnaire
    pets = Pet.query.all()

    results = []

    scored_pets = []
    for pet in pets:
        score = score_pet_against_questionnaire(pet, questionnaire)
        scored_pets.append({
            "score": score,
            "pet": pet.to.dict()
        })
    results.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(results), 200


# ======= USER REGISTRATION ROUTES =======
@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    if not data or not all(k in data for k in ("first_name", "last_name", "email", "password")):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 400

    new_user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        password=data["password"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.serialize()}), 201


# ===== ZIP CODE ROUTES =====
@api.route('/shelters/<zip_code>', methods=['GET'])
def get_shelters(zip_code):
    try:
        token = get_petfinder_token()
        headers = {"Authorization": f"Bearer {token}"}
        url = f"https://api.petfinder.com/v2/shelters?location={zip_code}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== LOGIN ROUTES =====
@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.serialize()  # Assuming you have a serialize method in User model
    }), 200


@api.route('/pets', methods=['GET'])
def get_pets():
    """Get all pets"""
    print("hello")

    grant_type = "client_credentials"
    client_id = os.environ.get("PET_FINDER_CLIENT_ID", None)
    client_secret = os.environ.get("PET_FINDER_SECRET", None)
    login_response = requests.post(
        url="https://api.petfinder.com/v2/oauth2/token",
        json=dict(
            grant_type=grant_type,
            client_id=client_id,
            client_secret=client_secret
        )
    )
    body = login_response.json()
    print(body)
    bearer_token = f"Bearer {body['access_token']}"
    animals_response = requests.get(
        url="https://api.petfinder.com/v2/animals?type=Dog",
        headers=dict({
            "Authorization": bearer_token,
            "Content-Type": "application/json"
        })
    )
    body = animals_response.json()
    print(body)
    return jsonify(body["animals"]), 200


@api.route('/messages', methods=['GET'])
def get_messages():
    current_user_id = request.args.get('user_id', type=int)
    contact_id = request.args.get('contact_id', type=int)

    if not current_user_id:
        return jsonify({"error": "Don't know who you are!"}), 400

    messages = Message.query.filter(
        ((Message.message_from == current_user_id) & (Message.message_to == contact_id)) |
        ((Message.message_from == contact_id) &
         (Message.message_to == current_user_id))
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
            ((Message.message_from == contact.id) &
             (Message.message_to == current_user_id))
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

@api.route('/favorite', methods=['GET'])
def get_test():
    user_id = 1
    if not user_id:
        return jsonify({"success": False, "error": "user_id is required"}), 400
    
    try:
        favorites = Favorite.query.options(db.joinedload(Favorite.pet)).filter_by(user_id=user_id).all()
        result = [fav.to_dict() for fav in favorites]
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": "Internal server error"}), 500









@api.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    pet = data.get('pet')
    user_id = data.get('user_id')
    pet_id = data.get('pet_id')
    if not user_id or not pet_id:
        return jsonify({"success": False, "error": "user_id and pet_id required"}), 400

    # Check if favorite already exists
    existing_favorite = Favorite.query.filter_by(
        user_id=user_id, pet_id=pet_id).first()
    if existing_favorite:
        return jsonify({"success": False, "error": "Pet is already in favorites"}), 400
    pet_exists = Pet.query.get(pet_id)
    if not pet_exists:
        new_pet = Pet(
            id=pet_id,
            name=pet["name"],
            age=pet['age'],
            location=pet['contact']['address']['address1'],
            image_url=pet['photos'][0]['full'] if pet['photos'] else None,
            gender=pet['gender'],
            breed=pet['breeds']['primary'],
            activity=str(pet['tags']))
        db.session.add(new_pet)
        db.session.commit()
        db.session.refresh(new_pet)

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
    # ========== Create a new user =========
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"success": False, "error": "username, email and password are required"}), 400

    # ===== CHECK IF USER ALREADY EXISTS ======
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "error": "User with this email already exists"}), 400
    
    # ===== HASH THE PASSWORD =====
    hashed_password = generate_password_hash(password)

    user = User(username=username, email=email, hashed_password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "data": user.to_dict()}), 201
