from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Message, Pet  # Added Message import
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask import Blueprint, request, jsonify
from .models import db, Favorite, Pet, User, Questionnaire
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

    if questionnaire.size and questionnaire.size.lower() in (pet["size"] or "").lower():
        score + - 1
    if questionnaire.activity and questionnaire.activity.lower() in (pet["activity"] or "").lower():
        score += 1
    if questionnaire.location and questionnaire.location.lower() in (pet["location"] or "").lower():
        score += 1
    if questionnaire.other_pets and questionnaire.other_pets.lower() in (pet["other_pets"] or "").lower():
        score += 1
    if questionnaire.hypoallergenic and questionnaire.hypoallergenic.lower() in (pet["hypoallergenic"] or "").lower():
        score += 1
    if questionnaire.gender and questionnaire.gender.lower() in (pet["gender"] or "").lower():
        score += 1
    if questionnaire.yard and questionnaire.yard.lower() in (pet["yard"] or "").lower():
        score += 1
    if questionnaire.owned_pets_before and questionnaire.owned_pets_before.lower() in (pet["owned_pets_before"] or "").lower():
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
    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "token": token,
        "user": new_user.to_dict()
    }), 201


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
        "user": user.to_dict()  # Assuming you have a serialize method in User model
    }), 200


@api.route('/pets', methods=['GET'])
@jwt_required()
def get_pets():
    """Get all pets"""
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
    bearer_token = f"Bearer {body['access_token']}"
    animals_response = requests.get(
        url="https://api.petfinder.com/v2/animals?type=Dog&limit=100",
        headers=dict({
            "Authorization": bearer_token,
            "Content-Type": "application/json"
        })
    )
    body = animals_response.json()
    animals = body["animals"]
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.questionnaire:
        return jsonify({"error": "User or questionnaire not found"}), 404
    questionnaire = user.questionnaire
    current_favorites = user.favorites
    current_favorite_ids_set = set(
        [favorite.pet.petfinder_id for favorite in current_favorites])
    # {77451, 2731, 77462, 8823}
    animals = list(filter(
        lambda pet: not set([pet["id"]]).issubset(current_favorite_ids_set),
        animals
    ))
    print(">>> animals without favorites", len(animals))
    # here is where dogs from petfinder will be filtered
    # or scored based on the question answers for this user
    # and the dogs information from petfinder
    # scored_pets = []
    # for pet in animals:
    #     score = score_pet_against_questionnaire(pet, questionnaire)
    #     scored_pets.append({
    #         "score": score,
    #         "pet": pet
    #     })
    # scored_pets.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(animals), 200


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

    return jsonify([msg.to_dict() for msg in messages])


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
        return jsonify(new_message.to_dict()), 201
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
        favorites = Favorite.query.options(db.joinedload(
            Favorite.pet)).filter_by(user_id=user_id).all()
        result = [fav.to_dict() for fav in favorites]
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": "Internal server error"}), 500


@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    pet = data.get('pet')
    user_id = int(get_jwt_identity())
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
            petfinder_id=pet_id,
            name=pet["name"],
            age=pet['age'],
            location=pet['contact']['address']['address1'],
            image_url=pet['photos'][0]['full'] if pet['photos'] else None,
            gender=pet['gender'],
            breed=pet['breeds']['primary'],
            activity=str(pet['tags']),
            size=pet["size"],   
            email=pet["contact"].get("email",""),
            phone=pet["contact"].get("phone",""),      
        )
        db.session.add(new_pet)
        db.session.commit()
        db.session.refresh(new_pet)

    favorite = Favorite(user_id=user_id, pet_id=new_pet.id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"success": True, "data": favorite.to_dict()}), 201

# @api.route('/favorites', methods=['POST'])
# @jwt_required()
# def add_favorite():
    try:
        print("=== FAVORITE ROUTE DEBUG ===")
        
        # Get data
        data = request.get_json()
        print(f"Request data: {data}")
        
        pet = data.get('pet')
        user_id = int(get_jwt_identity())
        pet_id = data.get('pet_id')  # This is the Petfinder ID
        
        print(f"User ID: {user_id}")
        print(f"Pet ID (from Petfinder): {pet_id}")
        print(f"Pet data keys: {pet.keys() if pet else 'No pet data'}")
        
        # Validate required data
        if not user_id or not pet_id:
            print("ERROR: Missing user_id or pet_id")
            return jsonify({"success": False, "error": "user_id and pet_id required"}), 400
        
        if not pet:
            print("ERROR: Missing pet data")
            return jsonify({"success": False, "error": "pet data required"}), 400

        # Check if pet already exists in database
        existing_pet = Pet.query.filter_by(petfinder_id=pet_id).first()
        print(f"Existing pet found: {existing_pet is not None}")
        
        if existing_pet:
            print(f"Using existing pet with DB ID: {existing_pet.id}")
            pet_db_id = existing_pet.id
        else:
            print("Creating new pet...")
            
            # Extract location safely
            location = "Unknown"
            if pet.get('contact') and pet['contact'].get('address'):
                address = pet['contact']['address']
                if address.get('city') and address.get('state'):
                    location = f"{address['city']}, {address['state']}"
                elif address.get('address1'):
                    location = address['address1']
            
            # Extract image URL safely
            image_url = None
            if pet.get('photos') and len(pet['photos']) > 0:
                image_url = pet['photos'][0].get('full')
            
            # Extract breed safely
            breed = "Mixed"
            if pet.get('breeds') and pet['breeds'].get('primary'):
                breed = pet['breeds']['primary']
            
            print(f"Creating pet with: name={pet.get('name')}, location={location}, breed={breed}")
            
            new_pet = Pet(
                petfinder_id=pet_id,
                name=pet.get("name", "Unknown"),
                age=pet.get('age', 'Unknown'),
                location=location,
                image_url=image_url,
                gender=pet.get('gender', 'Unknown'),
                breed=breed,
                activity=str(pet.get('tags', [])),
                size=pet.get("size", "Unknown")
            )
            
            db.session.add(new_pet)
            db.session.flush()  # Get ID without committing
            pet_db_id = new_pet.id
            print(f"New pet created with DB ID: {pet_db_id}")

        # Check if favorite already exists
        existing_favorite = Favorite.query.filter_by(
            user_id=user_id, pet_id=pet_db_id).first()
        
        if existing_favorite:
            print("ERROR: Favorite already exists")
            return jsonify({"success": False, "error": "Pet is already in favorites"}), 400

        # Create favorite
        print(f"Creating favorite: user_id={user_id}, pet_id={pet_db_id}")
        favorite = Favorite(user_id=user_id, pet_id=pet_db_id)
        db.session.add(favorite)
        db.session.commit()
        
        print("SUCCESS: Favorite saved to database!")
        print(f"Favorite ID: {favorite.id}")
        
        return jsonify({"success": True, "data": favorite.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"ERROR in add_favorite: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500

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

    user = User(username=username, email=email,
                hashed_password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "data": user.to_dict()}), 201


@api.route("/questionnaire", methods=["POST"])
@jwt_required()
def create_user_questionnaire():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if user is None:
        return "no such user 😐", 404
    data = request.json
    questionnaire = Questionnaire(
        user_id=user_id,
        size=data["size"],
        activity=data["activity"],
        travel=data["travel"],
        other_pets=data["other_pets"],
        hypoallergenic=data["hypoallergenic"],
        gender_preference=data["gender_preference"],
        yard=data["yard"],
        owned_pets_before=data["owned_pets_before"]
    )
    db.session.add(questionnaire)
    db.session.commit()
    return jsonify(questionnaire.to_dict()), 201
