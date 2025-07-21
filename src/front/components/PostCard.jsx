import React, { useState, useEffect } from 'react';

/**
 * PostCard component displays a single post with like and comment functionality
 */
function PostCard({ post, onDelete, onToggleLike, onAddComment, onDeleteComment }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // API base URL
    const API_BASE_URL = 'http://localhost:3001/api';

    // Fetch comments for this post
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await fetch(`${API_BASE_URL}/social/posts/${post.id}/comments`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setComments(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch comments');
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoadingComments(false);
        }
    };

    // Load comments when comments section is opened
    useEffect(() => {
        if (showComments && comments.length === 0) {
            fetchComments();
        }
    }, [showComments]);

    // Handle comment submission
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            await onAddComment(post.id, newComment.trim());
            setNewComment('');
            // Refresh comments
            await fetchComments();
        } catch (err) {
            console.error('Error submitting comment:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await onDeleteComment(commentId);
            // Refresh comments
            await fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="post-card">
            {/* Post Header */}
            <div className="post-header">
                <div className="post-user-info">
                    <div className="post-avatar">
                        <span className="avatar-text">
                            {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="post-meta">
                        <h6 className="post-author">{post.user?.username || 'Unknown User'}</h6>
                        <span className="post-time">{formatDate(post.created_at)}</span>
                    </div>
                </div>
                <button
                    className="post-delete-btn"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                            onDelete(post.id);
                        }
                    }}
                    title="Delete post"
                >
                    <span className="delete-icon">×</span>
                </button>
            </div>

            {/* Post Image */}
            {post.image_url && (
                <div className="post-image-container">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="post-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Post Content */}
            <div className="post-content">
                <h5 className="post-title">{post.title}</h5>
                <p className="post-text">{post.content}</p>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
                <div className="action-buttons">
                    <button
                        className={`action-btn like-btn ${post.is_liked_by_current_user ? 'liked' : ''}`}
                        onClick={() => onToggleLike(post.id)}
                    >
                        <span className="action-icon">
                            {post.is_liked_by_current_user ? '❤️' : '🤍'}
                        </span>
                        <span className="action-count">{post.likes_count}</span>
                    </button>
                    <button
                        className="action-btn comment-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <span className="action-icon">💬</span>
                        <span className="action-count">{post.comments_count}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-divider"></div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleSubmitComment} className="comment-form">
                        <div className="comment-input-group">
                            <input
                                type="text"
                                className="comment-input"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={submittingComment}
                            />
                            <button
                                className="comment-submit-btn"
                                type="submit"
                                disabled={!newComment.trim() || submittingComment}
                            >
                                {submittingComment ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    {loadingComments ? (
                        <div className="comments-loading">
                            <div className="loading-dots"></div>
                            <span className="loading-text">Loading comments...</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="no-comments">
                            <p className="no-comments-text">No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <div className="comment-avatar">
                                                <span className="comment-avatar-text">
                                                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="comment-meta">
                                                <span className="comment-author">{comment.user?.username || 'Unknown User'}</span>
                                                <span className="comment-time">{formatDate(comment.created_at)}</span>
                                            </div>
                                            {comment.user?.id === 1 && (
                                                <button
                                                    className="comment-delete-btn"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    title="Delete comment"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostCard; 