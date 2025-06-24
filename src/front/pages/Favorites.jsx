import React from 'react';
import '../styles/Favorites.css';

// Hardcoded list of favorite pets
const pets = [
    {
        name: 'Jack',
        age: '3 years',
        location: 'Miami, Florida',
        image: 'https://www.thebestpets.net/wp-content/uploads/2021/07/parallax-3.jpg',
        tags: ['Loyal', 'Active', 'Friendly'],
    },
    {
        name: 'Charlie',
        age: '1 years',
        location: 'Orlando, Florida',
        image: 'https://www.croftsvetsurgery.co.uk/images/labrador_dog_lying_down_on_pavement.jpg',
        tags: ['Loyal', 'Active', 'Friendly'],
    },
    {
        name: 'Max',
        age: '2 years',
        location: 'Miami, Florida',
        image: 'https://sweetspirevetclinic.com/wp-content/uploads/2023/04/Aggressive-Pet-Policy.jpg',
        tags: ['Loyal', 'Active', 'Friendly'],
    },
    {
        name: 'Buddy',
        age: '2 years',
        location: 'Miami, Florida',
        image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=400&q=80',
        tags: ['Loyal', 'Active', 'Friendly'],
    },
];

// Mapping of tag names to Bootstrap color classes
const tagColors = {
    Loyal: 'danger',
    Active: 'warning',
    Friendly: 'info',
};


//  PetCard component renders a single pet's card

function PetCard({ pet }) {
    return (
        <div className="card favorites-card position-relative h-100">

            <img
                src={pet.image}
                className="card-img-top favorites-img"
                alt={pet.name}
            />

            <button className="favorites-heart" title="Favorite">
                ♥
            </button>
            <div className="card-body">

                <h5 className="favorites-card-title card-title mb-1">{pet.name}</h5>

                <div className="text-muted" style={{ fontSize: '0.95rem' }}>{pet.age}</div>

                <div className="favorites-location mb-2">
                    <span className="me-1" role="img" aria-label="Location">📍</span>
                    {pet.location}
                </div>

                <div className="favorites-tags mb-3">
                    {pet.tags.map(tag => (
                        <span
                            key={tag}
                            className={`badge bg-${tagColors[tag]}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <button className="btn favorites-btn w-100">
                    Apply to Adopt
                </button>
            </div>
        </div>
    );
}


//Favorites component 

function Favorites() {
    return (
        <div className="container py-5">

            <h1 className="favorites-heading">My Favorites</h1>
            <div className="row">

                {pets.map((pet) => (
                    <div className="col-md-3 mb-4" key={pet.name}>
                        <PetCard pet={pet} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites; 