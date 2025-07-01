import React, { useState, useEffect } from 'react';
import '../styles/Favorites.css';

// API base URL
const API_BASE_URL = 'http://localhost:5001/api';

/**
 * PetCard component renders a single pet's card.
 * @param {Object} pet - The pet object containing name, age, location, image, gender, weight, breed, and activity.
 * @param {Function} onRemoveFavorite - Callback function to remove pet from favorites
 * @param {number} favoriteId - ID of the favorite record
 */
function PetCard({ pet, onRemoveFavorite, favoriteId }) {
    const handleRemoveFavorite = async () => {
        try {
            await onRemoveFavorite(favoriteId);
        } catch (error) {
            console.error('Error removing favorite:', error);
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
            <span className="favorites-heart" title="Favorite">
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
                {/* Remove from favorites button */}
                <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleRemoveFavorite}
                >
                    Remove from Favorites
                </button>
            </div>
        </div>
    );
}

/**
 * Favorites component renders the list of favorite pets in a responsive grid.
 * Fetches data from the backend API.
 */
function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorites from the backend API
    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Remove a pet from favorites
    const removeFavorite = async (favoriteId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
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
                    prevFavorites.filter(fav => fav.id !== favoriteId)
                );
                console.log('Pet removed from favorites successfully');
            } else {
                throw new Error(data.error || 'Failed to remove favorite');
            }
        } catch (err) {
            console.error('Error removing favorite:', err);
            throw err;
        }
    };

    // Add a pet to favorites (for future use)
    const addFavorite = async (userId, petId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
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
        } catch (err) {
            console.error('Error adding favorite:', err);
            throw err;
        }
    };

    // Fetch favorites on component mount
    useEffect(() => {
        fetchFavorites();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">My Favorites</h1>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">My Favorites</h1>
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error Loading Favorites</h4>
                    <p>{error}</p>
                    <hr />
                    <button
                        className="btn btn-outline-danger"
                        onClick={fetchFavorites}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (favorites.length === 0) {
        return (
            <div className="container py-5">
                <h1 className="favorites-heading">My Favorites</h1>
                <div className="text-center">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">No Favorites Yet</h4>
                        <p>You haven't added any pets to your favorites yet.</p>
                        <hr />
                        <p className="mb-0">
                            Browse pets and click the heart icon to add them to your favorites!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Page heading */}
            <h1 className="favorites-heading">My Favorites</h1>
            <div className="row">
                {/* Render a PetCard for each favorite */}
                {favorites.map((favorite) => (
                    <div className="col-md-3 mb-4" key={favorite.id}>
                        <PetCard
                            pet={favorite.pet}
                            onRemoveFavorite={removeFavorite}
                            favoriteId={favorite.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites; 