/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import type { UIPost } from "@/lib/mappers/post.mapper";
import { imgSrc } from "@/lib/image";

interface PostCardProps {
  post: UIPost;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onDelete,
  onEdit,
}: PostCardProps) {
  const router = useRouter();
  const isOwner = currentUserId && String(currentUserId) === String(post.authorId);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const goToPost = () => router.push(`/post/${post.id}`);

  // Close menu if user clicks outside
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(ev.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(post.id);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((v) => !v);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(post.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!onDelete) return;

    if (confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  const avatar = imgSrc(post.authorAvatar, "");

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const postUrl = `${window.location.origin}/post/${String(post.id)}`;

    const shareText = post.content
      ? `${post.content}\n\n${postUrl}`
      : postUrl;

    try {
      // Mobile native share if available
      if (navigator.share) {
        await navigator.share({
          title: "Post",
          text: shareText,
        });
        return;
      }

      // Desktop fallback: copy "text + link" but NOT inside the URL path
      await navigator.clipboard.writeText(shareText);
      alert("Copied!");
    } catch (err) {
      console.error("Share failed:", err);
      alert("Could not share this post.");
    }
  };


  return (
    <article
      className="post-card"
      role="button"
      tabIndex={0}
      onClick={goToPost}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goToPost();
      }}
    >
      {/* Header */}
      <div className="post-header">
        <div className="author-section">
          <Link
            href={`/profile/${post.authorId}`}
            className="avatar"
            onClick={(e) => e.stopPropagation()}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={post.authorName}
                className="avatar-img"
                width={40}
                height={40}
              />
            ) : (
              <span className="avatar-fallback">
                {post.authorName?.charAt(0).toUpperCase()}
              </span>
            )}
          </Link>

          <div className="author-info">
            <Link href={`/profile/${post.authorId}`} onClick={(e) => e.stopPropagation()}>
              <h3 className="author-name">{post.authorName}</h3>
            </Link>
            <p className="timestamp">{post.timestamp}</p>
          </div>
        </div>

        {/* Options menu (owner only) */}
        {isOwner && (onDelete || onEdit) && (
          <div className="menu-wrap" ref={menuRef}>
            <button className="icon-btn" onClick={toggleMenu} aria-label="Post options">
              <MoreHorizontal size={20} />
            </button>

            {menuOpen && (
              <div className="menu" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <button className="menu-item" onClick={handleEdit}>
                    <Pencil size={16} />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button className="menu-item danger" onClick={handleDelete}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
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
          <img src={imgSrc(post.imageUrl)} alt="Post image" />
        </div>
      )}
      
      {/* Actions */}
      <div className="post-actions" onClick={(e) => e.stopPropagation()}>
        <div className="actions-left">
          <button
            className={`icon-btn ${post.isLiked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
            type="button"
          >
            <Heart size={22} fill={post.isLiked ? "#ef4444" : "none"} />
          </button>

          <button
            className="icon-btn"
            onClick={() => router.push(`/post/${post.id}`)}
            aria-label="View comments"
            type="button"
          >
            <MessageCircle size={22} />
          </button>

          <button
            className="icon-btn"
            onClick={handleShare}
            aria-label="Share post"
            type="button"
          >
            <Send size={22} />
          </button>
        </div>

        <button className="icon-btn" aria-label="Save post" type="button">
          <Bookmark size={22} />
        </button>
      </div>

      {/* Counts row */}
      <div className="post-meta" onClick={(e) => e.stopPropagation()}>
        <span className="meta-item">{post.likes} likes</span>
        <span className="dot">•</span>
        <button
          className="meta-link"
          type="button"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          {post.commentsCount} comments
        </button>
      </div>


      <style jsx>{`
        .post-card {
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 16px;
          box-shadow: 2px 2px 8px var(--shadow);
          overflow: hidden;
          cursor: pointer;
          outline: none;
          max-width: 600px;
          margin: 0 auto;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .post-card:focus-visible {
          box-shadow: 0 0 0 3px var(--focus-offset);
        }

        .post-header {
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .author-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          max-width: 40px;
          max-height: 40px;
          border-radius: 9999px;
          overflow: hidden;
          display: block;        
          flex: 0 0 40px;
          text-decoration: none;
          background: var(--surface-2);
          border: 3px solid var(--border);
        }

        .avatar-img {
          width: 40px !important;
          height: 40px !important;
          object-fit: cover;
          display: block;
          border-radius: 9999px;
        }

        .avatar-fallback {
          font-weight: 700;
          color: var(--text);
        }


        .author-info a {
          text-decoration: none;
          color: inherit;
        }

        .author-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          color: var(--text);
        }

        .timestamp {
          font-size: 12px;
          color: var(--muted);
          margin: 0;
        }

        .post-content {
          padding: 0 16px 12px;
          color: var(--text);
        }

        .post-image-container img {
          width: 100%;
          display: block;
          object-fit: cover;
          max-height: 600px;
        }

        .post-image-container img {
          width: 100%;
          display: block;
          max-height: 300px;
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

        .post-meta {
          padding: 0 16px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--muted);
          font-size: 13px;
        }

        .meta-item {
          color: var(--muted);
        }

        .dot {
          opacity: 0.6;
        }

        .meta-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--muted);
          font-size: 13px;
        }

        .meta-link:hover {
          text-decoration: underline;
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

        /* menu */
        .menu-wrap {
          position: relative;
        }

        .menu {
          position: absolute;
          right: 0;
          top: 36px;
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: 0 8px 20px var(--shadow);
          border-radius: 12px;
          overflow: hidden;
          min-width: 160px;
          z-index: 20;
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
          font-size: 14px;
          color: var(--text);
        }

        .menu-item:hover {
          background: var(--hover);
        }

        .menu-item.danger {
          color: #ef4444;
        }

        .menu-item.danger:hover {
          background: rgba(239, 68, 68, 0.06);
        }
      `}</style>

    </article>
  );
}
