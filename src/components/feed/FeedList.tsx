"use client";

import React from "react";
import PostCard from "./PostCard";
import { Plus, Heart, Send } from "lucide-react";

// Mock data for posts
const POSTS = [
  {
    id: "1",
    author: {
      name: "Arneo Paris",
      location: "Arneo",
      avatar: "AP",
    },
    image: "/api/placeholder/400/400",
    caption: "Aimé par Gabdu et d'autres personnes\nArthurHazan Quel plaisir de retrouver mes étudiants du Web 2 ! Ils ont tellement progressés depuis l'année dernière, bravo à tous !",
    likes: 45,
    comments: 10,
    timestamp: "2h ago",
  },
  {
    id: "2",
    author: {
      name: "Arneo Paris",
      location: "Arneo",
      avatar: "AP",
    },
    image: "/api/placeholder/400/400",
    caption: "Aimé par Gabdu et d'autres personnes\nArthurHazan Quel plaisir de retrouver mes étudiants du Web 2 ! Ils ont tellement progressés depuis l'année dernière, bravo à tous !",
    likes: 32,
    comments: 10,
    timestamp: "4h ago",
  },
  {
    id: "3",
    author: {
      name: "Arneo Paris",
      location: "Arneo",
      avatar: "AP",
    },
    content: "There is bound to be a massive improvement in every tech industry branch due to the presence of AI",
    likes: 28,
    comments: 7,
    timestamp: "6h ago",
    hasImage: false,
  },
];

export default function FeedList() {
  return (
    <div className="feed-wrapper">
      {/* Top Header */}
      <header className="feed-header">
        <div className="header-left">
          <span className="app-name">RD</span>
        </div>
        <div className="header-actions">
          <button className="header-btn" aria-label="Add post">
            <Plus size={24} strokeWidth={2} />
          </button>
          <button className="header-btn" aria-label="Notifications">
            <Heart size={24} strokeWidth={2} />
          </button>
          <button className="header-btn" aria-label="Messages">
            <Send size={24} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Posts Feed */}
      <div className="posts-container">
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <style jsx>{`
        .feed-wrapper {
          width: 100%;
          min-height: 100vh;
        }

        .feed-header {
          background: white;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .app-name {
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .header-btn:hover {
          background: rgba(31, 41, 55, 0.1);
        }

        .header-btn :global(svg) {
          color: currentColor;
        }

        .posts-container {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}