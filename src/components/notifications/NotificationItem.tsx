"use client";

import React from "react";
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Share2,
  MoreHorizontal,
} from "lucide-react";

export type UINotificationType = "like" | "comment" | "follow" | "mention" | "share";

export interface UINotification {
  id: string;
  type: UINotificationType;
  user: {
    name: string;
    profileImage?: string | null;
  };
  content?: string;
  postImage?: string | null;
  timestamp: string;
  isRead: boolean;
}

interface NotificationItemProps {
  notification: UINotification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: UINotificationType) => {
  switch (type) {
    case "like":
      return <Heart size={20} fill="#ef4444" strokeWidth={0} />;
    case "comment":
      return <MessageCircle size={20} fill="#3b82f6" strokeWidth={0} />;
    case "follow":
      return <UserPlus size={20} fill="#2b8761" strokeWidth={0} />;
    case "mention":
      return <AtSign size={20} fill="#f59e0b" strokeWidth={0} />;
    case "share":
      return <Share2 size={20} fill="#8b5cf6" strokeWidth={0} />;
    default:
      return null;
  }
};

const getNotificationText = (notification: UINotification) => {
  switch (notification.type) {
    case "like":
      return "liked your post";
    case "comment":
      return "commented:";
    case "follow":
      return "started following you";
    case "mention":
      return notification.content || "mentioned you";
    case "share":
      return "shared your post";
    default:
      return "";
  }
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const markReadIfNeeded = () => {
    if (!notification.isRead) onMarkAsRead(notification.id);
  };

  return (
    <article className={`notification-item ${!notification.isRead ? "unread" : ""}`}>
      {!notification.isRead && <div className="unread-dot" />}

      {/* Main clickable area (real button) */}
      <button
        type="button"
        className="notification-main"
        onClick={markReadIfNeeded}
        aria-label={`Notification from ${notification.user.name}: ${getNotificationText(notification)}`}
      >
        <div className="avatar-container">
          <div className="avatar">
            {notification.user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={notification.user.profileImage}
                alt={notification.user.name}
                className="avatar-image"
              />
            ) : (
              notification.user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="icon-badge">{getNotificationIcon(notification.type)}</div>
        </div>

        <div className="notification-content">
          <div className="notification-text">
            <span className="user-name">{notification.user.name}</span>{" "}
            <span className="action-text">{getNotificationText(notification)}</span>
          </div>

          {notification.content && notification.type === "comment" && (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="comment-preview">"{notification.content}"</p>
          )}

          <time className="timestamp">{notification.timestamp}</time>
        </div>
      </button>

      {/* Right side actions (NOT nested in the main button) */}
      {notification.postImage ? (
        <div className="post-thumbnail" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={notification.postImage} alt="Post" className="thumbnail-image" />
        </div>
      ) : notification.type === "follow" ? (
        <button
          type="button"
          className="follow-back-btn"
          onClick={() => {
            // hook up later (follow mutation)
          }}
        >
          Follow Back
        </button>
      ) : null}

      <button type="button" className="more-btn" aria-label="More options">
        <MoreHorizontal size={20} strokeWidth={2} />
      </button>

      <style jsx>{`
  .notification-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
    position: relative;
  }

  .notification-item:hover {
    background: var(--hover);
  }

  .notification-item.unread {
    background: var(--surface);
  }

  html.dark .notification-item.unread {
    background: rgba(43, 135, 97, 0.14);
  }

  .notification-item.unread:hover {
    background: rgba(43, 135, 97, 0.12);
  }

  html.dark .notification-item.unread:hover {
    background: rgba(43, 135, 97, 0.18);
  }

  .unread-dot {
    width: 8px;
    height: 8px;
    background: var(--brand);
    border-radius: 50%;
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  .notification-main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    color: inherit;
  }

  .notification-main:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 4px;
    border-radius: 12px;
  }

  .avatar-container {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--muted) 0%, rgba(31, 41, 55, 0.75) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 16px;
    overflow: hidden;
  }

  html.dark .avatar {
    background: linear-gradient(135deg, rgba(148, 163, 184, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%);
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 24px;
    height: 24px;
    background: var(--surface);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px var(--shadow);
    border: 1px solid var(--border);
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-text {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text);
    margin-bottom: 4px;
  }

  .user-name {
    font-weight: 600;
    color: var(--text);
  }

  .action-text {
    font-weight: 400;
    color: var(--muted);
  }

  .comment-preview {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: var(--muted);
    margin: 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .timestamp {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    opacity: 0.85;
  }

  .post-thumbnail {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--border);
    background: var(--surface-2);
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .follow-back-btn {
    background: var(--brand);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .follow-back-btn:hover {
    background: var(--brand-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(43, 135, 97, 0.2);
  }

  .follow-back-btn:active {
    transform: translateY(0);
  }

  .more-btn {
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .more-btn:hover {
    background: var(--hover);
    color: var(--text);
  }

  .more-btn :global(svg) {
    color: currentColor;
  }
`}</style>

    </article>
  );
}
