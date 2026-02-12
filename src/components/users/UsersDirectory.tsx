/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useUsersDirectory } from "@/hooks/useUsersDirectory";

function safeImg(src?: string | null) {
  return src && src.trim().length > 0 ? src : "/default-avatar.png";
}

export default function UsersDirectory({
  query,
  currentUserId,
  limit, // <-- no default
  seeMoreHref = "/users",
  showSeeMore = true,
  onFollowChanged,
}: {
  query?: string;
  currentUserId?: string;
  limit?: number;          // <-- optional
  seeMoreHref?: string;
  showSeeMore?: boolean;
  onFollowChanged?: () => void;
}) {
  const { users, loading, error, follow, unfollow } = useUsersDirectory(
    query,
    currentUserId
  );

  const shown = typeof limit === "number" ? users.slice(0, limit) : users;
  const hasMore = typeof limit === "number" ? users.length > limit : false;

  return (
    <div className="followers-container">
      <div className="followers-header">
        <h2 className="followers-title">
          {query?.trim() ? `Results for “${query}”` : "All users"}
        </h2>
      </div>

      <div className="followers-list">
        {loading && <span className="status-text">Loading users...</span>}
        {error && <span className="status-text error-text">{error}</span>}

        {!loading &&
          !error &&
          shown.map((u) => {
            const stats = u.followStats;
            const isFollowing = !!stats?.isFollowing;

            return (
              <div key={u.id} className="follower-item">
                <Link href={`/profile/${u.id}`} className="user-left">
                  <img
                    src={safeImg(u.profileImage)}
                    alt={u.username}
                    className="avatar"
                  />

                  <div className="user-info">
                    <span className="follower-name">{u.username}</span>

                    {u.bio ? <p className="bio-text">{u.bio}</p> : null}

                    <div className="stats-row">
                      <span>
                        <b>{stats?.followersCount ?? 0}</b> followers
                      </span>
                      <span>
                        <b>{stats?.followingCount ?? 0}</b> following
                      </span>
                    </div>
                  </div>
                </Link>

                  <button
                    onClick={async () => {
                    if (isFollowing) await unfollow(u.id);
                    else await follow(u.id);
                    onFollowChanged?.();                  
                    }}
                    className={`follow-btn ${isFollowing ? "btn-outline" : "btn-solid"}`}
                    disabled={!stats}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
{/* 
                <button
                  onClick={() => (isFollowing ? unfollow(u.id) : follow(u.id))}
                  className={`follow-btn ${
                    isFollowing ? "btn-outline" : "btn-solid"
                  }`}
                  disabled={!stats}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button> */}
              </div>
            );
          })}

        {!loading && !error && users.length === 0 && (
          <span className="status-text">No users yet</span>
        )}

        {!loading && !error && showSeeMore && hasMore && (
          <Link href={seeMoreHref} className="see-more-item">
            See more →
          </Link>
        )}
      </div>

      <style jsx>{`
        .followers-container {
          padding: 24px 16px;
        }

        .followers-header {
          margin-bottom: 20px;
        }

        .followers-title {
          font-family: "Poppins", sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .followers-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .follower-item {
          background: white;
          padding: 14px 16px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .follower-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .user-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          text-decoration: none;
          flex: 1;
        }

        .avatar {
          height: 40px;
          width: 40px;
          border-radius: 9999px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f3f4f6;
        }

        .user-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .follower-name {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bio-text {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #6b7280;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .stats-row {
          margin-top: 4px;
          display: flex;
          gap: 12px;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #4b5563;
        }

        .follow-btn {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-solid {
          background: #70d686;
          color: white;
        }

        .btn-solid:hover {
          opacity: 0.9;
        }

        .btn-outline {
          background: #70d686;
          color: #111827;
          border-color: rgba(17, 24, 39, 0.2);
        }

        .btn-outline:hover {
          background: rgba(17, 24, 39, 0.04);
        }

        .follow-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-text {
          text-align: center;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          padding: 8px 0;
        }

        .error-text {
          color: #dc2626;
        }

        .see-more-item {
          background: white;
          padding: 14px 16px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          cursor: pointer;

          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          text-decoration: none;
          text-align: center;
        }

        .see-more-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
