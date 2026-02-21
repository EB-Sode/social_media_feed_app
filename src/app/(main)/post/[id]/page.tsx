/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePost } from "@/hooks/usePost";
import { ArrowLeft, Heart, Send } from "lucide-react";
import Link from "next/link";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { post, comments, loading, error, likePost, createComment } = usePost(postId);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle like button click
   */
  const handleLike = async () => {
    try {
      await likePost();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  /**
   * Handle comment submission
   */
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(commentText);
      setCommentText(""); // Clear input on success
    } catch (err) {
      console.error("Failed to create comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="post-container">
        <div className="loading-state">
          <p>Loading post...</p>
        </div>
        <style jsx>{`
          .post-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          .loading-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-container">
        <div className="error-state">
          <p>{error || "Post not found"}</p>
        </div>
        <style jsx>{`
          .post-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          .error-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            color: #ef4444;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="post-container">
      {/* Header */}
      
      <div className="post-header">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1>Post</h1>
        <div style={{ width: 40 }} /> {/* Spacer for centering */}
      </div>

      {/* Post Card */}
      <div className="post-card">
        {/* Author */}
        <div className="author-section">
          <Link href={`/profile/${post.author.id}`} className="avatar">
            {post.author.profileImage ? (
              <img src={post.author.profileImage} alt={post.author.username} />
            ) : (
              post.author.username.charAt(0).toUpperCase()
            )}
          </Link>

          <div className="author-info">
            <Link href={`/profile/${post.author.id}`}>
              <h3 className="author-name">{post.author.username}</h3>
            </Link>
            <p className="timestamp">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        )}

        {/* Image */}
          {post.imageUrl && (
            <div className="post-image-container">
              <img src={post.imageUrl} alt="Post image" />
            </div>
          )}
        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${post.isLikedByUser ? "liked" : ""}`}
            onClick={handleLike}
          >
            <Heart 
              size={24} 
              fill={post.isLikedByUser ? "#ef4444" : "none"} 
            />
            <span>{post.likesCount} likes</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="section-title">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
            className="comment-input"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="submit-btn"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="empty-state">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <Link href={`/profile/${comment.author.id}`} className="comment-avatar">
                  {comment.author.profileImage ? (
                    <img
                      src={comment.author.profileImage}
                      alt={comment.author.username}
                    />
                  ) : (
                    comment.author.username.charAt(0).toUpperCase()
                  )}
                </Link>

                <div className="comment-content">
                  <div className="comment-header">
                    <Link href={`/profile/${comment.author.id}`}>
                      <span className="comment-author">{comment.author.username}</span>
                    </Link>
                    <span className="comment-timestamp">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
      .post-container {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        min-height: 100vh;
        color: var(--text);
      }

      .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
        margin-bottom: 24px;
      }

      .post-header h1 {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        color: var(--text);
      }

      .back-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.2s;
        color: var(--text);
      }

      .back-btn:hover {
        background: var(--hover);
      }

      .post-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px var(--shadow);
      }

      .author-section {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 16px;
      }

      .avatar,
      .comment-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--brand), var(--brand-2));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        overflow: hidden;
        text-decoration: none;
        flex-shrink: 0;
      }

      .avatar img,
      .comment-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .author-info a {
        text-decoration: none;
        color: inherit;
      }

      .author-name,
      .comment-author {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        transition: color 0.2s;
        color: var(--text);
      }

      .author-name:hover,
      .comment-author:hover {
        color: var(--brand);
      }

      .timestamp,
      .comment-timestamp {
        font-size: 12px;
        color: var(--muted);
        margin: 0;
      }

      .post-content {
        margin-bottom: 16px;
      }

      .post-content p {
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
        color: var(--text);
      }

      .post-image-container {
        margin-bottom: 16px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--surface-2);
      }

      .post-image-container img {
        width: 100%;
        display: block;
        object-fit: cover;
      }

      .post-actions {
        display: flex;
        gap: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        opacity: 0.85;
        transition: color 0.2s, opacity 0.2s;
      }

      .action-btn:hover {
        color: var(--text);
        opacity: 1;
      }

      .action-btn.liked {
        color: #ef4444;
        opacity: 1;
      }

      .action-btn.liked :global(svg) {
        fill: #ef4444;
        stroke: #ef4444;
      }

      .comments-section {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 8px var(--shadow);
        color: var(--text);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 20px 0;
        color: var(--text);
      }

      .comment-form {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
      }

      .comment-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid var(--border);
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        background: var(--surface);
        color: var(--text);
      }

      .comment-input::placeholder {
        color: var(--muted);
      }

      .comment-input:focus {
        border-color: var(--brand);
      }

      .comment-input:disabled {
        background: var(--surface-2);
        cursor: not-allowed;
        color: var(--muted);
      }

      .submit-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--brand);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .submit-btn:hover:not(:disabled) {
        background: var(--brand-2);
      }

      .submit-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      html.dark .submit-btn:disabled {
        background: rgba(148, 163, 184, 0.35);
      }

      .comments-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .comment {
        display: flex;
        gap: 12px;
      }

      .comment-content {
        flex: 1;
      }

      .comment-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .comment-header a {
        text-decoration: none;
      }

      .comment-text {
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
        color: var(--text);
        opacity: 0.9;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--muted);
      }
    `}</style>

    </div>
  );
}