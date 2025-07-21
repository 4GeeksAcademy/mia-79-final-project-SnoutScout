from flask import Blueprint, request, jsonify
from .models import db, Favorite, Pet, User
from .petfinder_service import PetfinderService
import json

api = Blueprint('api', __name__)


# @api.route('/pets', methods=['GET'])
# def get_pets():
#     """Get all pets from database"""
#     pets = Pet.query.all()
#     result = [pet.to_dict() for pet in pets]
#     return jsonify({"success": True, "data": result})


# @api.route('/pets/petfinder', methods=['GET'])
# def get_pets_from_petfinder():
#     """Get pets from Petfinder API"""
#     try:
#         # Get query parameters
#         limit = request.args.get('limit', 20, type=int)
#         location = request.args.get('location')
#         animal_type = request.args.get('type')
#         breed = request.args.get('breed')
#         size = request.args.get('size')
#         gender = request.args.get('gender')
#         age = request.args.get('age')

#         # Initialize Petfinder service
#         petfinder = PetfinderService()

#         # Get animals from Petfinder
#         response = petfinder.get_animals(
#             limit=limit,
#             location=location,
#             animal_type=animal_type,
#             breed=breed,
#             size=size,
#             gender=gender,
#             age=age
#         )

#         # Transform Petfinder animals to our format
#         animals = response.get('animals', [])
#         transformed_animals = []

#         for animal in animals:
#             transformed_animal = petfinder.transform_petfinder_animal(animal)
#             transformed_animals.append(transformed_animal)

#         return jsonify({
#             "success": True,
#             "data": transformed_animals,
#             "pagination": response.get('pagination', {}),
#             "source": "petfinder"
#         })

#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @api.route('/pets/sync-petfinder', methods=['POST'])
# def sync_pets_from_petfinder():
#     """Sync pets from Petfinder API to local database"""
#     try:
#         # Get query parameters
#         limit = request.args.get('limit', 20, type=int)
#         location = request.args.get('location')
#         animal_type = request.args.get('type')

#         # Initialize Petfinder service
#         petfinder = PetfinderService()

#         # Get animals from Petfinder
#         response = petfinder.get_animals(
#             limit=limit,
#             location=location,
#             animal_type=animal_type
#         )

#         animals = response.get('animals', [])
#         synced_count = 0

#         for animal in animals:
#             # Check if pet already exists by petfinder_id
#             existing_pet = Pet.query.filter_by(
#                 petfinder_id=str(animal.get('id'))).first()

#             if not existing_pet:
#                 # Transform and create new pet
#                 pet_data = petfinder.transform_petfinder_animal(animal)

#                 # Convert contact dict to JSON string
#                 if pet_data.get('contact'):
#                     pet_data['contact'] = json.dumps(pet_data['contact'])

#                 pet = Pet(**pet_data)
#                 db.session.add(pet)
#                 synced_count += 1

#         db.session.commit()

#         return jsonify({
#             "success": True,
#             "message": f"Synced {synced_count} new pets from Petfinder",
#             "total_animals": len(animals),
#             "synced_count": synced_count
#         })

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"success": False, "error": str(e)}), 500


# @api.route('/pets', methods=['POST'])
# def create_pet():
#     """Create a new pet"""
#     data = request.get_json()

#     # Validate required fields
#     required_fields = ['name']
#     for field in required_fields:
#         if not data.get(field):
#             return jsonify({"success": False, "error": f"{field} is required"}), 400

#     # Create new pet
#     pet = Pet(
#         name=data.get('name'),
#         age=data.get('age'),
#         location=data.get('location'),
#         image_url=data.get('image_url'),
#         gender=data.get('gender'),
#         weight=data.get('weight'),
#         breed=data.get('breed'),
#         activity=data.get('activity'),
#         petfinder_id=data.get('petfinder_id'),
#         description=data.get('description'),
#         status=data.get('status'),
#         organization_id=data.get('organization_id'),
#         url=data.get('url'),
#         published_at=data.get('published_at'),
#         contact=data.get('contact')
#     )

#     db.session.add(pet)
#     db.session.commit()

#     return jsonify({"success": True, "data": pet.to_dict()}), 201


# @api.route('/pets/<int:pet_id>', methods=['GET'])
# def get_pet(pet_id):
#     """Get a single pet by ID"""
#     pet = Pet.query.get(pet_id)
#     if not pet:
#         return jsonify({"success": False, "error": "Pet not found"}), 404
#     return jsonify({"success": True, "data": pet.to_dict()})


# @api.route('/pets/<int:pet_id>', methods=['DELETE'])
# def delete_pet(pet_id):
#     """Delete a pet by ID"""
#     pet = Pet.query.get(pet_id)
#     if not pet:
#         return jsonify({"success": False, "error": "Pet not found"}), 404

#     # Delete associated favorites first (to maintain referential integrity)
#     favorites = Favorite.query.filter_by(pet_id=pet_id).all()
#     for favorite in favorites:
#         db.session.delete(favorite)

#     # Delete the pet
#     db.session.delete(pet)
#     db.session.commit()

#     return jsonify({"success": True, "message": "Pet deleted successfully"})


# @api.route('/favorites', methods=['GET'])
# def get_favorites():
#     user_id = request.args.get('user_id', type=int)
#     if not user_id:
#         return jsonify({"success": False, "error": "user_id is required"}), 400
#     favorites = Favorite.query.filter_by(user_id=user_id).all()
#     result = [fav.to_dict() for fav in favorites]
#     return jsonify({"success": True, "data": result})


# @api.route('/favorites', methods=['POST'])
# def add_favorite():
#     data = request.get_json()
#     user_id = data.get('user_id')
#     pet_id = data.get('pet_id')
#     if not user_id or not pet_id:
#         return jsonify({"success": False, "error": "user_id and pet_id required"}), 400

#     # Check if favorite already exists
#     existing_favorite = Favorite.query.filter_by(
#         user_id=user_id, pet_id=pet_id).first()
#     if existing_favorite:
#         return jsonify({"success": False, "error": "Pet is already in favorites"}), 400

#     favorite = Favorite(user_id=user_id, pet_id=pet_id)
#     db.session.add(favorite)
#     db.session.commit()
#     return jsonify({"success": True, "data": favorite.to_dict()}), 201


# @api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
# def delete_favorite(favorite_id):
#     favorite = Favorite.query.get(favorite_id)
#     if not favorite:
#         return jsonify({"success": False, "error": "Favorite not found"}), 404
#     db.session.delete(favorite)
#     db.session.commit()
#     return jsonify({"success": True, "message": "Favorite deleted"})


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
