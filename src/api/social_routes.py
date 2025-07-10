from flask import Blueprint, request, jsonify
from .models import db, Post, PostLike, PostComment, User
from datetime import datetime

# Create a new blueprint for social feed routes
social_bp = Blueprint('social', __name__, url_prefix='/api/social')

# Helper function to get current user (for demo purposes, using user_id=1)


def get_current_user_id():
    # In a real app, this would come from authentication
    return 1

# GET /api/social/posts - Get all posts


@social_bp.route('/posts', methods=['GET'])
def get_posts():
    try:
        current_user_id = get_current_user_id()

        # Get all posts with user info, ordered by newest first
        posts = Post.query.order_by(Post.created_at.desc()).all()

        # Convert to dict and check if current user liked each post
        posts_data = []
        for post in posts:
            post_dict = post.to_dict()
            # Check if current user liked this post
            like = PostLike.query.filter_by(
                user_id=current_user_id, post_id=post.id).first()
            post_dict['is_liked_by_current_user'] = like is not None
            posts_data.append(post_dict)

        return jsonify({
            "success": True,
            "data": posts_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# POST /api/social/posts - Create a new post


@social_bp.route('/posts', methods=['POST'])
def create_post():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({
                "success": False,
                "error": "Title and content are required"
            }), 400

        current_user_id = get_current_user_id()

        # Create new post
        new_post = Post(
            user_id=current_user_id,
            title=data['title'],
            content=data['content'],
            image_url=data.get('image_url')  # Optional
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": new_post.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# DELETE /api/social/posts/<post_id> - Delete a post


@social_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        current_user_id = get_current_user_id()

        # Find the post
        post = Post.query.get(post_id)
        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        # Check if user owns the post
        if post.user_id != current_user_id:
            return jsonify({
                "success": False,
                "error": "You can only delete your own posts"
            }), 403

        # Delete the post (cascade will handle likes and comments)
        db.session.delete(post)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Post deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# POST /api/social/posts/<post_id>/like - Like/unlike a post


@social_bp.route('/posts/<int:post_id>/like', methods=['POST'])
def toggle_post_like(post_id):
    try:
        current_user_id = get_current_user_id()

        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        # Check if user already liked the post
        existing_like = PostLike.query.filter_by(
            user_id=current_user_id,
            post_id=post_id
        ).first()

        if existing_like:
            # Unlike the post
            db.session.delete(existing_like)
            action = "unliked"
        else:
            # Like the post
            new_like = PostLike(user_id=current_user_id, post_id=post_id)
            db.session.add(new_like)
            action = "liked"

        db.session.commit()

        return jsonify({
            "success": True,
            "action": action,
            "likes_count": len(post.likes)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# GET /api/social/posts/<post_id>/comments - Get comments for a post


@social_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    try:
        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        # Get comments ordered by newest first
        comments = PostComment.query.filter_by(post_id=post_id).order_by(
            PostComment.created_at.desc()).all()

        return jsonify({
            "success": True,
            "data": [comment.to_dict() for comment in comments]
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# POST /api/social/posts/<post_id>/comments - Add a comment to a post


@social_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_post_comment(post_id):
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('content'):
            return jsonify({
                "success": False,
                "error": "Comment content is required"
            }), 400

        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        current_user_id = get_current_user_id()

        # Create new comment
        new_comment = PostComment(
            user_id=current_user_id,
            post_id=post_id,
            content=data['content']
        )

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": new_comment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# DELETE /api/social/comments/<comment_id> - Delete a comment


@social_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    try:
        current_user_id = get_current_user_id()

        # Find the comment
        comment = PostComment.query.get(comment_id)
        if not comment:
            return jsonify({
                "success": False,
                "error": "Comment not found"
            }), 404

        # Check if user owns the comment
        if comment.user_id != current_user_id:
            return jsonify({
                "success": False,
                "error": "You can only delete your own comments"
            }), 403

        # Delete the comment
        db.session.delete(comment)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Comment deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
