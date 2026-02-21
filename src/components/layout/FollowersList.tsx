"use client";

import React from "react";
import { useFollowersList } from "@/hooks/useFollowers";

interface FollowersListProps {
  userId: string;
  mode?: "followers" | "following";
  limit?: number;
  seeMoreHref?: string;
  showSeeMore?: boolean;
  refreshKey?: number; // ✅
}

export default function FollowersList({
  userId,
  mode = "followers",

  refreshKey = 0, // ✅
}: FollowersListProps) {
  const { users, loading, error } = useFollowersList(userId, mode, refreshKey); // ✅

  return (
    <div className="followers-container">
      <div className="followers-header">
        <h2 className="followers-title">
          {mode === "followers" ? "Followers" : "Following"}
        </h2>
      </div>

      <div className="followers-list">
        {loading && <span>Loading...</span>}

        {!loading &&
          users.map((user) => (
            <div key={user.id} className="follower-item">
              <span className="follower-name">{user.username}</span>
            </div>
          ))}

        {!loading && users.length === 0 && (
          <span style={{ textAlign: "center", opacity: 0.6 }}>
            No users yet
          </span>
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
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    text-align: center;
    padding: 12px 16px;
    background: var(--surface);
    border-radius: 12px;
    box-shadow: 0 2px 8px var(--shadow);
    border: 1px solid var(--border);
  }

  .followers-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .follower-item {
    background: var(--surface);
    padding: 14px 16px;
    border-radius: 10px;
    box-shadow: 0 2px 6px var(--shadow);
    border: 1px solid var(--border);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .follower-item:hover {
    transform: translateX(-4px);
    box-shadow: 0 4px 12px var(--shadow);
    background: var(--surface-2);
  }

  .follower-name {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }
`}</style>

    </div>
  );
}
