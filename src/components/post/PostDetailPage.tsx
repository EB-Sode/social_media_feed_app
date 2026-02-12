/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_POST_BY_ID,
  LIKE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  type Post,
  type Comment,
} from "@/lib/queries";
import { useAuth } from "@/context/AuthContext";
import { imgSrc } from "@/lib/image";

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const isOwner =
    !!currentUser?.id &&
    !!post?.author?.id &&
    String(currentUser.id) === String(post.author.id);
    console.log("currentUser.id", currentUser?.id);
    console.log("post.author.id", post?.author?.id);
    console.log("isOwner", isOwner);

  // Fetch post
  useEffect(() => {
    let mounted = true;

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const client = getAuthenticatedClient();
        const data = await client.request<{ post: Post }>(GET_POST_BY_ID, { postId });
        if (!mounted) return;
        setPost(data.post);
        setEditText(data.post?.content ?? "");
      } catch (err) {
        console.error("Error fetching post:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    if (postId) fetchPost();

    return () => {
      mounted = false;
    };
  }, [postId]);

  // Close menu on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          ? {
              ...prev,
              likesCount: updatedPost.likesCount,
              isLikedByUser: updatedPost.isLikedByUser,
            }
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

  const handleStartEdit = () => {
    if (!post) return;
    setEditText(post.content ?? "");
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(post?.content ?? "");
  };

  const handleSaveEdit = async () => {
    if (!post) return;

    const next = editText.trim();
    if (!next) {
      alert("Post content cannot be empty.");
      return;
    }

    try {
      const client = getAuthenticatedClient();

      const res = await client.request<{
        updatePost: { success: boolean; message?: string; post: { id: string; content: string; updatedAt?: string } };
      }>(UPDATE_POST_MUTATION, { postId, content: next });

      const updatedContent = res.updatePost?.post?.content ?? next;
      const updatedAt = res.updatePost?.post?.updatedAt;

      setPost((prev) => (prev ? { ...prev, content: updatedContent, updatedAt: updatedAt ?? prev.updatedAt } : prev));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!confirm("Delete this post? This can’t be undone.")) return;

    try {
      const client = getAuthenticatedClient();
      await client.request(DELETE_POST_MUTATION, { postId });

      router.push("/feed");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    } finally {
      setMenuOpen(false);
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
    <div className="post-detail-page" onClick={() => setMenuOpen(false)}>
      {/* Header */}
      <header className="post-header" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => router.back()} className="back-button" aria-label="Go back">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>

        <h1 className="header-title">Post</h1>

        {isOwner ? (
          <div className="menu-wrap">
            <button
              className="more-button"
              aria-label="More options"
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              <MoreVertical size={24} strokeWidth={2} />
            </button>

            {menuOpen && (
              <div className="menu" role="menu">
                <button className="menu-item" onClick={handleStartEdit} type="button">
                  <Pencil size={16} /> Edit
                </button>
                <button className="menu-item danger" onClick={handleDeletePost} type="button">
                  <Trash2 size={16} /> Delete
                </button>
                <button className="menu-item" onClick={() => setMenuOpen(false)} type="button">
                  <X size={16} /> Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </header>

      {/* Content */}
      <div className="post-content-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Author Info */}
        <div className="author-section">
          <Link href={`/profile/${post.author.id}`} className="author-link">
            <div className="author-avatar">
              <img
                src={imgSrc(post.author.profileImage)}
                alt={post.author.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="author-info">
              <h2 className="author-name">{post.author.username}</h2>
              <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        </div>

        {/* Post Body */}
        <div className="post-body">
          {isEditing ? (
            <div className="edit-box">
              <textarea
                className="edit-textarea"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={4}
              />
              <div className="edit-actions">
                <button className="edit-cancel" onClick={handleCancelEdit} type="button">
                  Cancel
                </button>
                <button className="edit-save" onClick={handleSaveEdit} type="button">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="post-text">{post.content}</p>
          )}

          {post.imageUrl && (
            <div className="post-image-container">
              <img src={imgSrc(post.imageUrl)} alt="Post image" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button className={`action-btn ${post.isLikedByUser ? "liked" : ""}`} onClick={handleLike}>
            <Heart size={22} fill={post.isLikedByUser ? "#ef4444" : "none"} strokeWidth={2} />
            <span>{post.likesCount}</span>
          </button>

          <button className="action-btn" type="button">
            <MessageCircle size={22} strokeWidth={2} />
            <span>{post.commentsCount}</span>
          </button>

          <button className="action-btn" type="button">
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
                  <img src={imgSrc(currentUser?.profileImage)} alt={currentUser?.username ?? "You"} />
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
              <button type="submit" className="submit-comment-btn" disabled={submittingComment}>
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
                      <img src={imgSrc(comment.author.profileImage)} alt={comment.author.username} />
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
          font-family: "Poppins", sans-serif;
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
          font-family: "Inter", sans-serif;
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
          font-family: "Poppins", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        /* menu */
        .menu-wrap {
          position: relative;
        }

        .menu {
          position: absolute;
          right: 0;
          top: 52px;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          overflow: hidden;
          min-width: 160px;
          z-index: 50;
        }

        .menu-item {
          width: 100%;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: #111827;
          text-align: left;
        }

        .menu-item:hover {
          background: #f9fafb;
        }

        .menu-item.danger {
          color: #ef4444;
        }

        .menu-item.danger:hover {
          background: rgba(239, 68, 68, 0.08);
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
          font-family: "Poppins", sans-serif;
          font-weight: 700;
          font-size: 20px;
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          font-family: "Poppins", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .post-time {
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        /* Post Body */
        .post-body {
          padding: 20px;
        }

        .post-text {
          font-family: "Inter", sans-serif;
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

        .post-image-container img {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }

        /* Edit mode */
        .edit-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .edit-textarea {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          resize: vertical;
        }

        .edit-textarea:focus {
          outline: none;
          border-color: #2b8761;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .edit-cancel {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          font-weight: 600;
        }

        .edit-save {
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: #2b8761;
          color: white;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          font-weight: 600;
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
          font-family: "Inter", sans-serif;
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
          font-family: "Poppins", sans-serif;
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
          font-family: "Inter", sans-serif;
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
          font-family: "Inter", sans-serif;
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
          font-family: "Inter", sans-serif;
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
          font-family: "Poppins", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          text-decoration: none;
        }

        .comment-author:hover {
          text-decoration: underline;
        }

        .comment-time {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #9ca3af;
        }

        .comment-text {
          font-family: "Inter", sans-serif;
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
