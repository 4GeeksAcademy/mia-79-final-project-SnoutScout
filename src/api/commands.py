import click
from api.models import db, User, Pet

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.username = "test_user" + str(x)
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        """Insert sample pets and users for testing"""
        print("Creating sample data...")

        # Create a test user
        test_user = User(username="test_user", email="test@example.com")
        db.session.add(test_user)
        db.session.commit()
        print(f"Created test user: {test_user.username}")

        # Create sample pets
        sample_pets = [
            {
                "name": "Buddy",
                "age": "3 years",
                "location": "New York, NY",
                "image_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
                "gender": "Male",
                "weight": "45 lbs",
                "breed": "Golden Retriever",
                "activity": "High"
            },
            {
                "name": "Luna",
                "age": "2 years",
                "location": "Los Angeles, CA",
                "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
                "gender": "Female",
                "weight": "8 lbs",
                "breed": "Persian Cat",
                "activity": "Low"
            },
            {
                "name": "Max",
                "age": "1 year",
                "location": "Chicago, IL",
                "image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
                "gender": "Male",
                "weight": "30 lbs",
                "breed": "Beagle",
                "activity": "Medium"
            },
            {
                "name": "Bella",
                "age": "4 years",
                "location": "Miami, FL",
                "image_url": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
                "gender": "Female",
                "weight": "12 lbs",
                "breed": "Siamese Cat",
                "activity": "Medium"
            },
            {
                "name": "Rocky",
                "age": "5 years",
                "location": "Seattle, WA",
                "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
                "gender": "Male",
                "weight": "60 lbs",
                "breed": "German Shepherd",
                "activity": "High"
            },
            {
                "name": "Milo",
                "age": "2 years",
                "location": "Austin, TX",
                "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
                "gender": "Male",
                "weight": "15 lbs",
                "breed": "Maine Coon",
                "activity": "Medium"
            }
        ]

        for pet_data in sample_pets:
            pet = Pet(**pet_data)
            db.session.add(pet)
            print(f"Created pet: {pet.name}")

        db.session.commit()
        print("Sample data created successfully!")
        print(f"Created {len(sample_pets)} pets and 1 test user")
        print("Test user ID: 1 (use this for testing favorites)")
