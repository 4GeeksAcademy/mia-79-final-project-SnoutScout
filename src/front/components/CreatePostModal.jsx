import React, { useState } from 'react';

/**
 * CreatePostModal component provides a form for creating new posts
 */
function CreatePostModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        // Optional: validate image URL format
        if (formData.image_url && !isValidUrl(formData.image_url)) {
            newErrors.image_url = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Simple URL validation
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit(formData);
            // Form will be reset by parent component when modal closes
        } catch (err) {
            console.error('Error creating post:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <span className="modal-icon">🐕</span>
                            Create New Post
                        </h5>
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            <span className="close-icon">×</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">
                                    Title <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Give your post a catchy title..."
                                    disabled={submitting}
                                    maxLength={200}
                                />
                                {errors.title && (
                                    <div className="error-message">{errors.title}</div>
                                )}
                                <div className="char-count">
                                    {formData.title.length}/200 characters
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="content" className="form-label">
                                    Content <span className="required">*</span>
                                </label>
                                <textarea
                                    className={`form-textarea ${errors.content ? 'error' : ''}`}
                                    id="content"
                                    name="content"
                                    rows="6"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Share your dog's story, updates, or anything you'd like to tell the community..."
                                    disabled={submitting}
                                ></textarea>
                                {errors.content && (
                                    <div className="error-message">{errors.content}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="image_url" className="form-label">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    className={`form-input ${errors.image_url ? 'error' : ''}`}
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={submitting}
                                />
                                {errors.image_url && (
                                    <div className="error-message">{errors.image_url}</div>
                                )}
                                <div className="form-help">
                                    Add a URL to an image of your dog or anything related to your post
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.image_url && !errors.image_url && (
                                <div className="form-group">
                                    <label className="form-label">Image Preview:</label>
                                    <div className="image-preview">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="preview-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="preview-error" style={{ display: 'none' }}>
                                            Unable to load image preview
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modal-btn cancel-btn"
                                onClick={handleClose}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="modal-btn submit-btn"
                                disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <span className="submit-spinner"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Post'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal; 