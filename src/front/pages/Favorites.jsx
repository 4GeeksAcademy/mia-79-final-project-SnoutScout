import React, { useState, useEffect } from 'react';
import '../styles/Favorites.css';
import useGlobalReducer from '../hooks/useGlobalReducer';

// API base URL
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

/**
 * PetCard component 
 * @param {Object} pet - The pet object 
 * @param {Function} onRemoveFavorite - Callback function to remove pet from favorites
 * @param {number} favoriteId - ID of the favorite record
 */
function PetCard({ pet, onRemoveFavorite, favoriteId, onContactClick }) {
    const [emailCopySuccess, setEmailCopySuccess] = useState(false);
    const [phoneCopySuccess, setPhoneCopySuccess] = useState(false);

    const handleRemoveFavorite = async () => {
        try {
            await onRemoveFavorite(favoriteId);
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const handleCopyEmail = async () => {
        if (pet.email) {
            try {
                await navigator.clipboard.writeText(pet.email);
                setEmailCopySuccess(true);
                // Reset success message after 2 seconds
                setTimeout(() => setEmailCopySuccess(false), 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = pet.email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setEmailCopySuccess(true);
                setTimeout(() => setEmailCopySuccess(false), 2000);
            }
        }
    };

    const handleCopyPhone = async () => {
        if (pet.phone) {
            try {
                await navigator.clipboard.writeText(pet.phone);
                setPhoneCopySuccess(true);
                // Reset success message after 2 seconds
                setTimeout(() => setPhoneCopySuccess(false), 2000);
            } catch (err) {
                console.error('Failed to copy phone:', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = pet.phone;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setPhoneCopySuccess(true);
                setTimeout(() => setPhoneCopySuccess(false), 2000);
            }
        }
    };

    // Create unique modal ID using pet.id
    const modalId = `petModal-${pet.id}`;

    return (
        <div className="card favorites-card position-relative h-100">
            {/* Pet image */}
            <img
                src={pet.image_url}
                className="card-img-top favorites-img"
                alt={pet.name}
            />

            <span className="favorites-heart" title="Favorite">
                ♥
            </span>
            <div className="card-body">
                <h5 className="favorites-card-title card-title mb-1">{pet.name}</h5>

                <div className="text-muted" style={{ fontSize: '0.95rem' }}>{pet.age}</div>

                <div className="favorites-location mb-2">
                    <span className="me-1" role="img" aria-label="Location">📍</span>
                    {pet.location}
                </div>

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

                {/* Dynamic Bootstrap modal trigger */}
                <button 
                    type="button" 
                    className="btn btn-warning w-100 mb-2" 
                    data-bs-toggle="modal" 
                    data-bs-target={`#${modalId}`}
                >
                    Contact Shelter for {pet.name}
                </button>

                {/* Dynamic Bootstrap modal with unique ID */}
                <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={`${modalId}Label`}>
                                    Contact Shelter for {pet.name}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex align-items-center mb-3">
                                    <img 
                                        src={pet.image_url} 
                                        alt={pet.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        className="rounded me-3"
                                    />
                                    <div>
                                        <h6 className="mb-1">{pet.name}</h6>
                                    </div>
                                </div>
                                
                                <p><strong>Email:</strong> {pet.email || "Email not available"}</p>
                                <p><strong>Phone:</strong> {pet.phone || "Phone not available"}</p>
                                <p><strong>Location:</strong> {pet.location || "Not specified"}</p>
                                <p><strong>City:</strong> {pet.city || "Not specified"}</p>
                                <p><strong>State:</strong> {pet.state || "Not specified"}</p>
                                
                                {pet.description && (
                                    <div>
                                        <strong>About {pet.name}:</strong>
                                        <p className="mt-1">{pet.description}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                {pet.email && (
                                    <button 
                                        type="button"
                                        className={`btn ${emailCopySuccess ? 'btn-success' : 'btn-warning'}`}
                                        onClick={handleCopyEmail}
                                    >
                                        {emailCopySuccess ? 'Email Copied!' : 'Click to Save Email'}
                                    </button>
                                )}
                                {pet.phone && (
                                    <button 
                                        type="button"
                                        className={`btn ${phoneCopySuccess ? 'btn-success' : 'btn-warning'}`}
                                        onClick={handleCopyPhone}
                                    >
                                        {phoneCopySuccess ? 'Phone Copied!' : 'Click to Save Phone'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, dispatch } = useGlobalReducer();

    // Fetch favorites 
    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}api/favorite`,
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
        });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log

            if (data.success) {
                console.log('Favorites data:', data.data); // Debug log
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
            const response = await fetch(`${API_BASE_URL}api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
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
            const response = await fetch(`${API_BASE_URL}api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
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
};

export default Favorites;