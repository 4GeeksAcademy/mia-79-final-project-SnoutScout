import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

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

    // Fetch favorites on component mount
    useEffect(() => {
        fetchFavorites();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">My Favorites</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary">
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success" disabled>
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">My Favorites</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary">
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success" disabled>
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">My Favorites</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary">
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success" disabled>
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
            {/* Page heading with navigation buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="favorites-heading">My Favorites</h1>
                <div className="d-flex gap-2">
                    <Link to="/pets">
                        <button className="btn btn-primary">
                            🐾 Browse Pets
                        </button>
                    </Link>
                    <Link to="/favorites">
                        <button className="btn btn-success" disabled>
                            ❤️ My Favorites
                        </button>
                    </Link>
                </div>
            </div>

            <div className="row">
                {/* Render a PetCard for each favorite */}
                {favorites.map((favorite) => (
                    <div className="col-md-3 mb-4" key={favorite.id}>
                        <PetCard
                            pet={favorite.pet}
                            isInFavorites={true}
                            onRemoveFavorite={removeFavorite}
                            favoriteId={favorite.id}
                            showRemoveButton={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites; 