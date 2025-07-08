import React from 'react';
import '../styles/Favorites.css';

/**
 * Shared PetCard component that can be used in both Pets and Favorites pages.
 * @param {Object} pet - The pet object containing name, age, location, image, gender, weight, breed, and activity.
 * @param {Function} onHeartClick - Callback function for heart icon click (optional)
 * @param {boolean} isInFavorites - Whether the pet is in favorites (for Pets page)
 * @param {Function} onRemoveFavorite - Callback function to remove from favorites (for Favorites page)
 * @param {number} favoriteId - ID of the favorite record (for Favorites page)
 * @param {boolean} showRemoveButton - Whether to show the remove button (for Favorites page)
 */
function PetCard({
    pet,
    onHeartClick,
    isInFavorites = false,
    onRemoveFavorite,
    favoriteId,
    showRemoveButton = false
}) {
    const handleHeartClick = () => {
        if (onHeartClick) {
            onHeartClick();
        }
    };

    const handleRemoveFavorite = async () => {
        if (onRemoveFavorite) {
            try {
                await onRemoveFavorite(favoriteId);
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
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
                onClick={onHeartClick ? handleHeartClick : undefined}
                style={{ cursor: onHeartClick ? 'pointer' : 'default' }}
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
                <button className={`btn favorites-btn w-100 ${showRemoveButton ? 'mb-2' : ''}`}>
                    Apply to Adopt
                </button>

                {/* Remove from favorites button (only shown in Favorites page) */}
                {showRemoveButton && (
                    <button
                        className="btn btn-outline-danger w-100"
                        onClick={handleRemoveFavorite}
                    >
                        Remove from Favorites
                    </button>
                )}
            </div>
        </div>
    );
}

export default PetCard; 