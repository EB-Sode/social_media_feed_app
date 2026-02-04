"use client";

import React from "react";

const FOLLOWERS = [
  { id: 1, name: "Dr. saillivan Ochenaze" },
  { id: 2, name: "Francis Ricardo" },
  { id: 3, name: "Chideathem williams" },
  { id: 4, name: "Mbuotidem Etuk" },
];

export default function FollowersList() {
  return (
    <div className="followers-container">
      <div className="followers-header">
        <h2 className="followers-title">Followers/Following</h2>
      </div>

      <div className="followers-list">
        {FOLLOWERS.map((follower) => (
          <div key={follower.id} className="follower-item">
            <span className="follower-name">{follower.name}</span>
          </div>
        ))}
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
        }

        .follower-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .follower-name {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}