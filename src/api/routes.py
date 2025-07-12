"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

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

    # Route that uses the helper


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
    

@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    return jsonify({
        "message": "Login successful",
        "user": user.serialize()  # Assuming you have a serialize method in User model
    }), 200


# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
