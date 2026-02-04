"use client";

import React from "react";
import { Heart, MessageCircle, UserPlus, AtSign, Share2, MoreHorizontal } from "lucide-react";
import type { Notification, NotificationType } from "./NotificationsList";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
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

const getNotificationText = (notification: Notification) => {
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

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`notification-item ${!notification.isRead ? "unread" : ""}`}
      onClick={handleClick}
    >
      {/* Unread Indicator */}
      {!notification.isRead && <div className="unread-dot" />}

      {/* Avatar with Icon Badge */}
      <div className="avatar-container">
        <div className="avatar">{notification.user.avatar}</div>
        <div className="icon-badge">{getNotificationIcon(notification.type)}</div>
      </div>

      {/* Content */}
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

      {/* Post Thumbnail or Follow Button */}
      {notification.postImage ? (
        <div className="post-thumbnail">
          <img
            src={notification.postImage}
            alt="Post"
            className="thumbnail-image"
          />
        </div>
      ) : notification.type === "follow" ? (
        <button className="follow-back-btn">Follow Back</button>
      ) : null}

      {/* More Options */}
      <button className="more-btn" aria-label="More options">
        <MoreHorizontal size={20} strokeWidth={2} />
      </button>

      <style jsx>{`
        .notification-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .notification-item:hover {
          background: rgba(43, 135, 97, 0.03);
        }

        .notification-item.unread {
          background: rgba(43, 135, 97, 0.05);
        }

        .notification-item.unread:hover {
          background: rgba(43, 135, 97, 0.08);
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #2b8761;
          border-radius: 50%;
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 16px;
        }

        .icon-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-text {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .user-name {
          font-weight: 600;
          color: #1f2937;
        }

        .action-text {
          font-weight: 400;
          color: #6b7280;
        }

        .comment-preview {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: #6b7280;
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
          color: #9ca3af;
          font-weight: 400;
        }

        .post-thumbnail {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .follow-back-btn {
          background: #2b8761;
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
          background: #1f6949;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(43, 135, 97, 0.2);
        }

        .follow-back-btn:active {
          transform: translateY(0);
        }

        .more-btn {
          background: transparent;
          border: none;
          color: #9ca3af;
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
          background: rgba(0, 0, 0, 0.05);
          color: #6b7280;
        }

        .more-btn :global(svg) {
          color: currentColor;
        }
      `}</style>
    </div>
  );
}