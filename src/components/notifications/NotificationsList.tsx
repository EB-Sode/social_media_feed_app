"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotificationItem from "./NotificationItem";

export type NotificationType = "like" | "comment" | "follow" | "mention" | "share";

export interface Notification {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    profileImage?: string;
  };
  content?: string;
  postImage?: string;
  timestamp: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Johnson",
      profileImage: "/api/placeholder/60/60",
    },
    timestamp: "2m ago",
    isRead: false,
    postImage: "/api/placeholder/60/60",
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Michael Chen",
      profileImage: "MO",
    },
    content: "Amazing shot! Where was this taken?",
    timestamp: "15m ago",
    isRead: false,
    postImage: "/api/placeholder/60/60",
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Emma Williams",
      profileImage: "EW",
    },
    timestamp: "1h ago",
    isRead: false,
  },
  {
    id: "4",
    type: "mention",
    user: {
      name: "David Park",
      profileImage: "DP",
    },
    content: "mentioned you in a comment",
    timestamp: "2h ago",
    isRead: true,
    postImage: "/api/placeholder/60/60",
  },
  {
    id: "5",
    type: "like",
    user: {
      name: "Olivia Martinez",
      profileImage: "OM",
    },
    timestamp: "3h ago",
    isRead: true,
    postImage: "/api/placeholder/60/60",
  },
  {
    id: "6",
    type: "follow",
    user: {
      name: "James Wilson",
      profileImage: "JW",
    },
    timestamp: "5h ago",
    isRead: true,
  },
  {
    id: "7",
    type: "comment",
    user: {
      name: "Sophia Anderson",
      profileImage: "SA",
    },
    content: "Love your content! Keep it up! 🔥",
    timestamp: "6h ago",
    isRead: true,
    postImage: "/api/placeholder/60/60",
  },
  {
    id: "8",
    type: "share",
    user: {
      name: "Liam Thompson",
      profileImage: "LT",
    },
    timestamp: "1d ago",
    isRead: true,
    postImage: "/api/placeholder/60/60",
  },
];

export default function NotificationsList() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((notif) =>
    filter === "all" ? true : !notif.isRead
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleBack = () => {
    router.push("/feed");
  };

  return (
    <div className="notifications-wrapper">
      {/* Header */}
      <header className="notifications-header">
        <div className="header-top">
          <div className="header-left">
            <button 
              className="back-button" 
              onClick={handleBack}
              aria-label="Back to feed"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
            <h1 className="page-title">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
            <span className="count">{notifications.length}</span>
          </button>
          <button
            className={`filter-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread
            {unreadCount > 0 && (
              <span className="count unread-count">{unreadCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p className="empty-text">No {filter === "unread" ? "unread" : ""} notifications</p>
            <p className="empty-subtext">
              {filter === "unread" 
                ? "You're all caught up!" 
                : "When you get notifications, they'll show up here"}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .notifications-wrapper {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fffe 0%, #ffffff 100%);
        }

        .notifications-header {
          background: white;
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .back-button:hover {
          background: rgba(31, 41, 55, 0.1);
          transform: translateX(-2px);
        }

        .back-button:active {
          transform: translateX(0);
        }

        .back-button :global(svg) {
          color: currentColor;
        }

        .page-title {
          font-family: "Poppins", sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .mark-all-btn {
          background: transparent;
          border: none;
          color: #2b8761;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .mark-all-btn:hover {
          background: rgba(43, 135, 97, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.06);
        }

        .filter-tab {
          background: transparent;
          border: none;
          padding: 12px 16px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }

        .filter-tab:hover {
          color: #1f2937;
        }

        .filter-tab.active {
          color: #2b8761;
          border-bottom-color: #2b8761;
        }

        .count {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-tab.active .count {
          background: rgba(43, 135, 97, 0.15);
          color: #2b8761;
        }

        .unread-count {
          background: #ef4444;
          color: white;
        }

        .notifications-list {
          max-width: 700px;
          margin: 0 auto;
          padding: 16px 0;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .empty-text {
          font-family: "Poppins", sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .empty-subtext {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }

          .mark-all-btn {
            font-size: 12px;
            padding: 6px 10px;
          }

          .notifications-header {
            padding: 16px 16px 0 16px;
          }

          .header-top {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}