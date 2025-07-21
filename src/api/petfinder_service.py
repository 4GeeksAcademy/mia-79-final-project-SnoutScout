# import os
# import requests
# import time
# from datetime import datetime, timedelta


# class PetfinderService:
#     def __init__(self):
#         self.api_key = os.getenv('PETFINDER_API_KEY')
#         self.api_secret = os.getenv('PETFINDER_API_SECRET')
#         self.base_url = 'https://api.petfinder.com/v2'
#         self.access_token = None
#         self.token_expires_at = None

#     def _get_access_token(self):
#         """Get OAuth access token from Petfinder API"""
#         if (self.access_token and self.token_expires_at and
#                 datetime.now() < self.token_expires_at):
#             return self.access_token

#         if not self.api_key or not self.api_secret:
#             raise Exception("Petfinder API credentials not configured")

#         token_url = f"{self.base_url}/oauth2/token"
#         data = {
#             'grant_type': 'client_credentials',
#             'client_id': self.api_key,
#             'client_secret': self.api_secret
#         }

#         response = requests.post(token_url, data=data)
#         if response.status_code != 200:
#             raise Exception(f"Failed to get access token: {response.text}")

#         token_data = response.json()
#         self.access_token = token_data['access_token']
#         self.token_expires_at = datetime.now(
#         ) + timedelta(seconds=token_data['expires_in'] - 60)

#         return self.access_token

#     def _make_request(self, endpoint, params=None):
#         """Make authenticated request to Petfinder API"""
#         token = self._get_access_token()
#         headers = {
#             'Authorization': f'Bearer {token}',
#             'Content-Type': 'application/json'
#         }

#         url = f"{self.base_url}/{endpoint}"
#         response = requests.get(url, headers=headers, params=params)

#         if response.status_code != 200:
#             raise Exception(
#                 f"Petfinder API error: {response.status_code} - {response.text}")

#         return response.json()

#     def get_animals(self, limit=20, location=None, animal_type=None, breed=None, size=None, gender=None, age=None, coat=None, color=None, status=None, name=None, organization=None, good_with_children=None, good_with_dogs=None, good_with_cats=None, house_trained=None, declawed=None, special_needs=None, distance=None, sort=None, page=None):
#         """
#         Get animals from Petfinder API
#         https://www.petfinder.com/developers/v2/docs/#get-animals
#         """
#         params = {
#             'limit': limit
#         }

#         # Add optional parameters if provided
#         optional_params = {
#             'location': location,
#             'type': animal_type,
#             'breed': breed,
#             'size': size,
#             'gender': gender,
#             'age': age,
#             'coat': coat,
#             'color': color,
#             'status': status,
#             'name': name,
#             'organization': organization,
#             'good_with_children': good_with_children,
#             'good_with_dogs': good_with_dogs,
#             'good_with_cats': good_with_cats,
#             'house_trained': house_trained,
#             'declawed': declawed,
#             'special_needs': special_needs,
#             'distance': distance,
#             'sort': sort,
#             'page': page
#         }

#         for key, value in optional_params.items():
#             if value is not None:
#                 params[key] = value

#         return self._make_request('animals', params)

#     def get_animal(self, animal_id):
#         """Get a specific animal by ID"""
#         return self._make_request(f'animals/{animal_id}')

#     def get_animal_types(self):
#         """Get available animal types"""
#         return self._make_request('types')

#     def get_breeds(self, animal_type):
#         """Get breeds for a specific animal type"""
#         return self._make_request(f'types/{animal_type}/breeds')

#     def transform_petfinder_animal(self, animal):
#         """Transform Petfinder animal data to match our Pet model format"""
#         # Get the first photo if available
#         primary_photo = animal.get('photos', [{}])[
#             0] if animal.get('photos') else {}

#         # Extract location information
#         location_parts = []
#         if animal.get('contact', {}).get('address', {}).get('city'):
#             location_parts.append(animal['contact']['address']['city'])
#         if animal.get('contact', {}).get('address', {}).get('state'):
#             location_parts.append(animal['contact']['address']['state'])
#         location = ', '.join(location_parts) if location_parts else 'Unknown'

#         # Map Petfinder fields to our Pet model fields
#         return {
#             'name': animal.get('name', 'Unknown'),
#             'age': animal.get('age', 'Unknown'),
#             'location': location,
#             'image_url': primary_photo.get('full', ''),
#             'gender': animal.get('gender', 'Unknown'),
#             'weight': f"{animal.get('weight', {}).get('min', 'Unknown')} - {animal.get('weight', {}).get('max', 'Unknown')} lbs" if animal.get('weight') else 'Unknown',
#             'breed': animal.get('breeds', {}).get('primary', 'Unknown'),
#             'activity': 'Medium',  # Default since Petfinder doesn't provide this
#             # Store Petfinder ID for reference
#             'petfinder_id': animal.get('id'),
#             'description': animal.get('description', ''),
#             'status': animal.get('status', ''),
#             'organization_id': animal.get('organization_id', ''),
#             'url': animal.get('url', ''),
#             'published_at': animal.get('published_at', ''),
#             'contact': animal.get('contact', {})
#         }
