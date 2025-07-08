import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">Available Pets</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary" disabled>
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success">
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">Available Pets</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary" disabled>
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success">
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="favorites-heading">Available Pets</h1>
                    <div className="d-flex gap-2">
                        <Link to="/pets">
                            <button className="btn btn-primary" disabled>
                                🐾 Browse Pets
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="btn btn-success">
                                ❤️ My Favorites
                            </button>
                        </Link>
                    </div>
                </div>
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
            {/* Page heading with navigation buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="favorites-heading">Available Pets</h1>
                <div className="d-flex gap-2">
                    <Link to="/pets">
                        <button className="btn btn-primary" disabled>
                            🐾 Browse Pets
                        </button>
                    </Link>
                    <Link to="/favorites">
                        <button className="btn btn-success">
                            ❤️ My Favorites
                        </button>
                    </Link>
                </div>
            </div>

            <div className="row">
                {/* Render a PetCard for each pet */}
                {pets.map((pet) => (
                    <div className="col-md-3 mb-4" key={pet.id}>
                        <PetCard
                            pet={pet}
                            isInFavorites={isPetInFavorites(pet.id)}
                            onToggleFavorite={addFavorite}
                            petId={pet.id}
                            showRemoveButton={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pets; 