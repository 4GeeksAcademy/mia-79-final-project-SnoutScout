from flask import Blueprint, request, jsonify
from .models import db, Favorite, Pet

api = Blueprint('api', __name__)

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