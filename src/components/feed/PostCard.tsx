/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { UIPost } from "@/lib/mappers/post.mapper";

interface PostCardProps {
  post: UIPost;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void; // UPDATED: Added delete callback
}

export default function PostCard({ post, onLike, onDelete }: PostCardProps) {
  /**
   * Handle like button click
   */
  const handleLike = () => {
    onLike?.(post.id);
  };

  /**
   * Handle delete (would show confirmation modal in production)
   */
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.id);
    }
  };

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="author-section">
          <Link href={`/profile/${post.authorId}`} className="avatar">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName} />
            ) : (
              post.authorName.charAt(0).toUpperCase()
            )}
          </Link>

          <div className="author-info">
            <Link href={`/profile/${post.authorId}`}>
              <h3 className="author-name">{post.authorName}</h3>
            </Link>
            <p className="timestamp">{post.timestamp}</p>
          </div>
        </div>

        {/* UPDATED: Added delete functionality if callback provided */}
        {onDelete && (
          <button 
            className="icon-btn" 
            onClick={handleDelete}
            aria-label="Delete post"
          >
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>

      {/* Content - UPDATED: Show content before image for better layout */}
      {post.content && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <Link href={`/post/${post.id}`} className="post-image-container">
          <img src={post.image} alt="Post image" />
        </Link>
      )}

      {/* Actions */}
      <div className="post-actions">
        <div className="actions-left">
          <button
            className={`icon-btn ${post.isLiked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
          >
            <Heart size={22} fill={post.isLiked ? "#ef4444" : "none"} />
          </button>

          <Link
            href={`/post/${post.id}`}
            className="icon-btn"
            aria-label="View comments"
          >
            <MessageCircle size={22} />
          </Link>

          <button className="icon-btn" aria-label="Share post">
            <Send size={22} />
          </button>
        </div>

        <button className="icon-btn" aria-label="Save post">
          <Bookmark size={22} />
        </button>
      </div>

      {/* Meta */}
      <div className="post-meta">
        <p className="likes">
          {post.likes} {post.likes === 1 ? "like" : "likes"}
        </p>

        {post.commentsCount > 0 && (
          <Link href={`/post/${post.id}`} className="view-comments">
            View all {post.commentsCount} comments
          </Link>
        )}
      </div>

      <style jsx>{`
        .post-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .post-header {
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2b8761, #1f6949);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          overflow: hidden;
          text-decoration: none;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-info a {
          text-decoration: none;
          color: inherit;
        }

        .author-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          transition: color 0.2s;
        }

        .author-name:hover {
          color: #2b8761;
        }

        .timestamp {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .post-content {
          padding: 0 16px 12px;
        }

        .post-content p {
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .post-image-container {
          display: block;
        }

        .post-image-container img {
          width: 100%;
          display: block;
          object-fit: cover;
          max-height: 600px;
        }

        .post-actions {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .actions-left {
          display: flex;
          gap: 14px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          color: inherit;
          text-decoration: none;
        }

        .icon-btn:hover {
          opacity: 0.7;
        }

        .icon-btn.liked :global(svg) {
          fill: #ef4444;
          stroke: #ef4444;
        }

        .post-meta {
          padding: 0 16px 16px;
        }

        .likes {
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .view-comments {
          font-size: 13px;
          color: #6b7280;
          text-decoration: none;
          display: inline-block;
          transition: color 0.2s;
        }

        .view-comments:hover {
          color: #1f2937;
        }
      `}</style>
    </article>
  );
}