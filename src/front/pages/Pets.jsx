import React, { useState, useEffect } from 'react';
import '../styles/Favorites.css';

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * PetCard component renders a single pet's card with add to favorites functionality.
 * @param {Object} pet - The pet object containing name, age, location, image, gender, weight, breed, and activity.
 * @param {Function} onAddFavorite - Callback function to add pet to favorites
 * @param {boolean} isInFavorites - Whether the pet is already in favorites
 */
function PetCard({ pet, onAddFavorite, isInFavorites }) {
    const handleAddFavorite = async () => {
        try {
            await onAddFavorite(pet.id);
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    return (
        <div className="card favorites-card position-relative h-100">
            {/* Pet image */}
            <img
                src={pet.image_url}
                className="card-img-top favorites-img"
                alt={pet.name}
            />
            {/* Heart icon in the top-right corner */}
            <span
                className={`favorites-heart ${isInFavorites ? 'favorites-heart-active' : ''}`}
                title={isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
                onClick={handleAddFavorite}
                style={{ cursor: 'pointer' }}
            >
                ♥
            </span>
            <div className="card-body">
                {/* Pet name */}
                <h5 className="favorites-card-title card-title mb-1">{pet.name}</h5>
                {/* Pet age */}
                <div className="text-muted" style={{ fontSize: '0.95rem' }}>{pet.age}</div>
                {/* Pet location */}
                <div className="favorites-location mb-2">
                    <span className="me-1" role="img" aria-label="Location">📍</span>
                    {pet.location}
                </div>

                {/* Pet details */}
                <div className="mb-3">
                    {pet.breed && (
                        <div className="mb-1">
                            <strong>Breed:</strong> {pet.breed}
                        </div>
                    )}
                    {pet.gender && (
                        <div className="mb-1">
                            <strong>Gender:</strong> {pet.gender}
                        </div>
                    )}
                    {pet.weight && (
                        <div className="mb-1">
                            <strong>Weight:</strong> {pet.weight}
                        </div>
                    )}
                    {pet.activity && (
                        <div className="mb-1">
                            <strong>Activity Level:</strong> {pet.activity}
                        </div>
                    )}
                </div>

                {/* Apply to Adopt button */}
                <button className="btn favorites-btn w-100 mb-2">
                    Apply to Adopt
                </button>
                {/* Add/Remove from favorites button */}
                <button
                    className={`btn w-100 ${isInFavorites ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                    onClick={handleAddFavorite}
                >
                    {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    );
}

/**
 * Pets component renders the list of all pets in a responsive grid.
 * Fetches data from the backend API and manages favorites state.
 */
function Pets() {
    const [pets, setPets] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all pets from the backend API
    const fetchPets = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/pets`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setPets(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch pets');
            }
        } catch (err) {
            console.error('Error fetching pets:', err);
            setError(err.message);
        }
    };

    // Fetch favorites from the backend API
    const fetchFavorites = async () => {
        try {
            // For demo purposes, using user_id = 1 (the sample user created by the backend)
            const response = await fetch(`${API_BASE_URL}/favorites?user_id=1`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setFavorites(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch favorites');
            }
        } catch (err) {
            console.error('Error fetching favorites:', err);
            // Don't set error for favorites, just log it
        }
    };

    // Add a pet to favorites
    const addFavorite = async (petId) => {
        try {
            // Check if pet is already in favorites
            const existingFavorite = favorites.find(fav => fav.pet_id === petId);

            if (existingFavorite) {
                // Remove from favorites
                const response = await fetch(`${API_BASE_URL}/favorites/${existingFavorite.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Remove the favorite from the local state
                    setFavorites(prevFavorites =>
                        prevFavorites.filter(fav => fav.id !== existingFavorite.id)
                    );
                    console.log('Pet removed from favorites successfully');
                } else {
                    throw new Error(data.error || 'Failed to remove favorite');
                }
            } else {
                // Add to favorites
                const response = await fetch(`${API_BASE_URL}/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 1, // For demo purposes
                        pet_id: petId
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Add the new favorite to the local state
                    setFavorites(prevFavorites => [...prevFavorites, data.data]);
                    console.log('Pet added to favorites successfully');
                } else {
                    throw new Error(data.error || 'Failed to add favorite');
                }
            }
        } catch (err) {
            console.error('Error managing favorite:', err);
            throw err;
        }
    };

    // Check if a pet is in favorites
    const isPetInFavorites = (petId) => {
        return favorites.some(fav => fav.pet_id === petId);
    };

    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                await Promise.all([fetchPets(), fetchFavorites()]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">Available Pets</h1>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading pets...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">Available Pets</h1>
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error Loading Pets</h4>
                    <p>{error}</p>
                    <hr />
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (pets.length === 0) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">Available Pets</h1>
                <div className="text-center">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">No Pets Available</h4>
                        <p>There are no pets available for adoption at the moment.</p>
                        <hr />
                        <p className="mb-0">
                            Please check back later for new pets!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Page heading */}
            <h1 className="favorites-heading">Available Pets</h1>
            <div className="row">
                {/* Render a PetCard for each pet */}
                {pets.map((pet) => (
                    <div className="col-md-3 mb-4" key={pet.id}>
                        <PetCard
                            pet={pet}
                            onAddFavorite={addFavorite}
                            isInFavorites={isPetInFavorites(pet.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pets; 