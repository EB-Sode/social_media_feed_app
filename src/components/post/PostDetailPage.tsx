// components/post/PostDetailPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_POST_BY_ID,
  LIKE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  type Post,
  type Comment,
} from "@/lib/queries";
import { useAuth } from "@/context/AuthContext";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user: currentUser } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch post
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const client = getAuthenticatedClient();
        const data = await client.request<{ post: Post }>(GET_POST_BY_ID, { postId });
        setPost(data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    if (postId) fetchPost();
  }, [postId]);

  // Like post
  const handleLike = async () => {
    if (!post) return;

    try {
      const client = getAuthenticatedClient();
      const data = await client.request<{ likePost: { post: Post; liked: boolean } }>(
        LIKE_POST_MUTATION,
        { postId }
      );

      const updatedPost = data.likePost.post;
      setPost((prev) =>
        prev
          ? { ...prev, likesCount: updatedPost.likesCount, isLikedByUser: updatedPost.isLikedByUser }
          : prev
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);

    try {
      const client = getAuthenticatedClient();
      const data = await client.request<{ createComment: { comment: Comment } }>(
        CREATE_COMMENT_MUTATION,
        { postId, content: commentText }
      );

      const newComment = data.createComment.comment;

      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment],
          commentsCount: prev.commentsCount + 1,
        };
      });

      setCommentText("");
    } catch (err) {
      console.error("Error creating comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <div className="loading-state">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="error-state">
          <h1>Post not found</h1>
          <p>{error || "This post does not exist"}</p>
          <button onClick={() => router.back()} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      {/* Header */}
      <header className="post-header">
        <button onClick={() => router.back()} className="back-button" aria-label="Go back">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h1 className="header-title">Post</h1>
        <button className="more-button" aria-label="More options">
          <MoreVertical size={24} strokeWidth={2} />
        </button>
      </header>

      {/* Content */}
      <div className="post-content-wrapper">
        {/* Author Info */}
        <div className="author-section">
          <Link href={`/profile/${post.author.id}`} className="author-link">
            <div className="author-avatar">
              {post.author.profileImage ? (
                <img src={post.author.profileImage} alt={post.author.username} />
              ) : (
                <div className="avatar-placeholder">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="author-info">
              <h2 className="author-name">{post.author.username}</h2>
              <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        </div>

        {/* Post Body */}
        <div className="post-body">
          <p className="post-text">{post.content}</p>
          {post.image && (
            <div className="post-image-container">
              <img src={post.image} alt="Post content" className="post-image" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${post.isLikedByUser ? "liked" : ""}`}
            onClick={handleLike}
          >
            <Heart
              size={22}
              fill={post.isLikedByUser ? "#ef4444" : "none"}
              strokeWidth={2}
            />
            <span>{post.likesCount}</span>
          </button>

          <button className="action-btn">
            <MessageCircle size={22} strokeWidth={2} />
            <span>{post.commentsCount}</span>
          </button>

          <button className="action-btn">
            <Share2 size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({post.commentsCount})</h3>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-input-wrapper">
              <div className="current-user-avatar">
                {currentUser?.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="comment-input"
                disabled={submittingComment}
              />
            </div>
            {commentText.trim() && (
              <button
                type="submit"
                className="submit-comment-btn"
                disabled={submittingComment}
              >
                {submittingComment ? "Posting..." : "Post"}
              </button>
            )}
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <Link href={`/profile/${comment.author.id}`} className="comment-avatar">
                    {comment.author.profileImage ? (
                      <img src={comment.author.profileImage} alt={comment.author.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="comment-body">
                    <div className="comment-header">
                      <Link href={`/profile/${comment.author.id}`} className="comment-author">
                        {comment.author.username}
                      </Link>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

    <style jsx>{`
        .post-detail-page {
          width: 100%;
          min-height: 100vh;
          background: #f9fafb;
        }

        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 40px;
        }

        .error-state h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .back-btn {
          margin-top: 20px;
          padding: 10px 24px;
          background: #2b8761;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Header */
        .post-header {
          background: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-button,
        .more-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #1f2937;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .back-button:hover,
        .more-button:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .header-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        /* Content */
        .post-content-wrapper {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          margin-top: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Author */
        .author-section {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .author-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2b8761, #1f6949);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 20px;
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .post-time {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        /* Post Body */
        .post-body {
          padding: 20px;
        }

        .post-text {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;
          margin: 0 0 16px 0;
          white-space: pre-wrap;
        }

        .post-image-container {
          border-radius: 12px;
          overflow: hidden;
          margin-top: 16px;
        }

        .post-image {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }

        /* Actions */
        .post-actions {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: none;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(43, 135, 97, 0.08);
          color: #2b8761;
        }

        .action-btn.liked {
          color: #ef4444;
        }

        .action-btn.liked:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        /* Comments */
        .comments-section {
          padding: 20px;
        }

        .comments-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 20px 0;
        }

        .comment-form {
          margin-bottom: 24px;
        }

        .comment-input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .current-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .current-user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .current-user-avatar .avatar-placeholder {
          font-size: 16px;
        }

        .comment-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1f2937;
          transition: border-color 0.2s;
        }

        .comment-input:focus {
          outline: none;
          border-color: #2b8761;
        }

        .submit-comment-btn {
          padding: 8px 24px;
          background: #2b8761;
          color: white;
          border: none;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-comment-btn:hover:not(:disabled) {
          background: #1f6949;
        }

        .submit-comment-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .no-comments {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          padding: 40px 20px;
        }

        .comment-item {
          display: flex;
          gap: 12px;
        }

        .comment-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .comment-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .comment-avatar .avatar-placeholder {
          font-size: 14px;
        }

        .comment-body {
          flex: 1;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .comment-author {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          text-decoration: none;
        }

        .comment-author:hover {
          text-decoration: underline;
        }

        .comment-time {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #9ca3af;
        }

        .comment-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
          margin: 0;
        }

        @media (max-width: 768px) {
          .post-content-wrapper {
            margin-top: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
