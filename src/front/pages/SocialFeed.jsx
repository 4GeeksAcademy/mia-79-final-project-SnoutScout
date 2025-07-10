import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import '../styles/SocialFeed.css';

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * SocialFeed component renders a social feed where users can share posts about their dogs
 */
function SocialFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Fetch posts from the backend API
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/social/posts`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setPosts(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch posts');
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle post creation
    const handleCreatePost = async (postData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Add the new post to the beginning of the list
                setPosts(prevPosts => [data.data, ...prevPosts]);
                setShowCreateModal(false);
            } else {
                throw new Error(data.error || 'Failed to create post');
            }
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post: ' + err.message);
        }
    };

    // Handle post deletion
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
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
                // Remove the post from the list
                setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            } else {
                throw new Error(data.error || 'Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post: ' + err.message);
        }
    };

    // Handle post like/unlike
    const handleToggleLike = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Update the post's like status and count
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                is_liked_by_current_user: data.action === 'liked',
                                likes_count: data.likes_count
                            }
                            : post
                    )
                );
            } else {
                throw new Error(data.error || 'Failed to toggle like');
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            alert('Failed to update like: ' + err.message);
        }
    };

    // Handle comment addition
    const handleAddComment = async (postId, commentContent) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: commentContent }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Refresh the posts to get updated comment count
                await fetchPosts();
            } else {
                throw new Error(data.error || 'Failed to add comment');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment: ' + err.message);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/comments/${commentId}`, {
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
                // Refresh the posts to get updated comment count
                await fetchPosts();
            } else {
                throw new Error(data.error || 'Failed to delete comment');
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Failed to delete comment: ' + err.message);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="social-feed-container">
                <div className="social-header">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <h1 className="social-title">

                                    Social Feed
                                </h1>
                                <p className="social-subtitle">Share your furry friend's adventures with the community</p>
                            </div>
                            <div className="col-md-6">

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <h3 className="loading-title">Loading Posts</h3>
                        <p className="loading-text">Fetching the latest dog stories...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="social-feed-container">
                <div className="social-header">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <h1 className="social-title">
                                    <span className="dog-emoji">🐕</span>
                                    Social Feed
                                </h1>
                                <p className="social-subtitle">Share your furry friend's adventures with the community</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h3 className="error-title">Error Loading Posts</h3>
                        <p className="error-text">{error}</p>
                        <button
                            className="error-retry-button"
                            onClick={fetchPosts}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="social-feed-container">
            {/* Modern Header */}
            <div className="social-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="social-title">

                                Social Feed
                            </h1>
                            <p className="social-subtitle">Share your furry friend's adventures with the community</p>
                        </div>
                        <div className="col-md-6">

                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Create Post Section */}
                <div className="create-post-section">
                    <div className="create-post-card">
                        <div className="create-post-content">
                            <div className="create-post-avatar">
                                <span className="avatar-text">U</span>
                            </div>
                            <button
                                className="create-post-button"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <span className="create-icon">✏️</span>
                                <span className="create-text">Share something about your Pet...</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="posts-feed">
                    {posts.length === 0 ? (
                        <div className="empty-state">

                            <h3 className="empty-state-title">No Posts Yet</h3>
                            <p className="empty-state-text">
                                Be the first to share a post about your dog! Start the conversation and inspire others.
                            </p>
                            <button
                                className="empty-state-button"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Your First Post
                            </button>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {posts.map((post) => (
                                <div className="post-item" key={post.id}>
                                    <PostCard
                                        post={post}
                                        onDelete={handleDeletePost}
                                        onToggleLike={handleToggleLike}
                                        onAddComment={handleAddComment}
                                        onDeleteComment={handleDeleteComment}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreatePost}
                />
            )}
        </div>
    );
}

export default SocialFeed; 