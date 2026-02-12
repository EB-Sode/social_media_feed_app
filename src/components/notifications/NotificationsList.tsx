/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotificationItem, { type UINotification, type UINotificationType } from "./NotificationItem";
import { useNotificationsLive } from "@/hooks/useNotifications";
import type { Notification as ApiNotification } from "@/lib/queries";

function formatTimeAgo(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
function inferTypeFromMessage(message?: string | null): "like" | "comment" | "follow" | "mention" {
  const m = (message ?? "").toLowerCase();

  if (m.includes("liked")) return "like";
  if (m.includes("comment")) return "comment";
  if (m.includes("follow")) return "follow";
  if (m.includes("mention")) return "mention";

    return "mention";
}
export default function NotificationsList() {
  const router = useRouter();

  const {
    notifications: apiNotifications,
    filter,
    setFilter,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotificationsLive();

  const uiNotifications: UINotification[] = useMemo(() => {
    return (apiNotifications ?? []).map((n: ApiNotification) => {
      // const type = (n.notificationType as UINotificationType) ?? "mention";

      const rawType = String(n.notificationType ?? "mention").toLowerCase();

      const type: UINotificationType =
        rawType === "like" || rawType === "comment" || rawType === "follow" || rawType === "mention"
          ? (rawType as UINotificationType)
          : "mention";

      return {
        id: n.id,
        // type,
        user: {
          name: n.sender?.username ?? "Unknown",
          profileImage: n.sender?.profileImage ?? undefined,
        },
        type: inferTypeFromMessage(n.message),
        content: n.message || undefined,

        // if your post has image field and you include it in query, use it here
        postImage: n.post?.imageUrl ?? null,
        timestamp: n.createdAt ? formatTimeAgo(n.createdAt) : "now",
        isRead: n.isRead,
      };
    });
  }, [apiNotifications]);

  const filteredNotifications = uiNotifications.filter((notif) =>
    filter === "all" ? true : !notif.isRead
  );

  const handleBack = () => router.push("/feed");

  return (
    <div className="notifications-wrapper">
      <header className="notifications-header">
        <div className="header-top">
          <div className="header-left">
            <button className="back-button" onClick={handleBack} aria-label="Back to feed">
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

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All <span className="count">{uiNotifications.length}</span>
          </button>

          <button
            className={`filter-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread{" "}
            {unreadCount > 0 && <span className="count unread-count">{unreadCount}</span>}
          </button>
        </div>
      </header>

      <div className="notifications-list">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p className="empty-text">Loading notifications…</p>
            <p className="empty-subtext">Please wait</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p className="empty-text">Couldn’t load notifications</p>
            <p className="empty-subtext">{error}</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
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
            <p className="empty-text">
              No {filter === "unread" ? "unread" : ""} notifications
            </p>
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
