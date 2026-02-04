/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    author: {
      name: string;
      location?: string;
      avatar: string;
    };
    image?: string;
    content?: string;
    caption?: string;
    timestamp: string;
    likes: number;
    comments: number;
    hasImage?: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="author-section">
          <div className="avatar">{post.author.avatar}</div>
          <div className="author-info">
            <h3 className="author-name">{post.author.name}</h3>
            {post.author.location && (
              <p className="location">{post.author.location}</p>
            )}
          </div>
        </div>
        <button className="more-btn" aria-label="More options">
          <MoreHorizontal size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Post Image (if exists) */}
      {post.hasImage !== false && post.image && (
        <div className="post-image-container">
          <img 
            src={post.image} 
            alt="Post content" 
            className="post-image"
          />
          <button className="learn-more">
            En savoir plus
            <span className="arrow">→</span>
          </button>
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions">
        <div className="actions-left">
          <button
            className={`action-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label="Like post"
          >
            <Heart
              size={24}
              fill={liked ? "#000" : "none"}
              strokeWidth={2}
            />
          </button>

          <button className="action-btn" aria-label="Comment">
            <MessageCircle size={24} strokeWidth={2} />
          </button>

          <button className="action-btn" aria-label="Share">
            <Send size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="actions-right">
          <button
            className={`action-btn ${bookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmark}
            aria-label="Bookmark"
          >
            <Bookmark
              size={24}
              fill={bookmarked ? "#000" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Post Caption */}
      {(post.caption || post.content) && (
        <div className="post-caption">
          <p className="caption-text">
            {post.caption || post.content}
          </p>
          {post.comments > 0 && (
            <button className="view-comments">
              Voir les {post.comments} commentaires
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .post-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.3s ease;
        }

        .post-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .post-header {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .author-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.3;
        }

        .location {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .more-btn {
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .post-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .learn-more {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .learn-more:hover {
          background: rgba(0, 0, 0, 0.85);
          transform: translateX(2px);
        }

        .arrow {
          font-size: 16px;
        }

        .post-actions {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .actions-left,
        .actions-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .action-btn.liked :global(svg),
        .action-btn.bookmarked :global(svg) {
          color: #1f2937;
        }

        .post-caption {
          padding: 0 16px 16px 16px;
        }

        .caption-text {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #1f2937;
          margin: 0 0 8px 0;
          white-space: pre-line;
        }

        .view-comments {
          background: transparent;
          border: none;
          color: #6b7280;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }

        .view-comments:hover {
          color: #1f2937;
        }
      `}</style>
    </article>
  );
}