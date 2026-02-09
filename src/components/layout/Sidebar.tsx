/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus, Search, Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const notificationCount = 3; // This would come from your notification hook

  const isActive = (path: string) => pathname === path;

  // Profile link - use user ID if authenticated, otherwise go to login
  const profileLink = user?.id ? `/profile/${user.id}` : "/login";
  const postlink = isAuthenticated ? `/post/${user?.id}` : "/login";
  const profileAvatar = user?.profileImage || "https://via.placeholder.com/40";

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <div className="logo">RD</div>
      </div>

      <div className="nav-items">
        <Link 
          href={profileLink}
          className="nav-item" 
          aria-label="Profile"
        >
          <div className="profile-avatar">
            <img 
              src={profileAvatar} 
              alt="Profile"
              className="avatar-img"
            />
          </div>
        </Link>
        <Link 
          href="/feed" 
          className={`nav-item ${isActive("/feed") ? "active" : ""}`}
          aria-label="Home"
        >
          <Home size={24} strokeWidth={2} />
        </Link>

        <Link 
          href="/notifications" 
          className={`nav-item ${isActive("/notifications") ? "active" : ""}`}
          aria-label="Notifications"
        >
          <div className="notification-wrapper">
            <Bell size={24} strokeWidth={2} />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>
        </Link>

        <Link 
          href={postlink} 
          className={`nav-item ${isActive("/post") ? "active" : ""}`}
          aria-label="Upload"
        >
          <Plus size={24} strokeWidth={2} />
        </Link>
{/* 
        <Link 
          href="/calendar" 
          className={`nav-item ${isActive("/calendar") ? "active" : ""}`}
          aria-label="Calendar"
        >
          <Calendar size={24} strokeWidth={2} />
        </Link> */}

        <Link 
          href="/search" 
          className={`nav-item ${isActive("/search") ? "active" : ""}`}
          aria-label="Search"
        >
          <Search size={24} strokeWidth={2} />
        </Link>
      </div>

      <div className="nav-footer">
        <Link 
          href="/menu" 
          className={`nav-item ${isActive("/menu") ? "active" : ""}`}
          aria-label="Menu"
        >
          <Menu size={24} strokeWidth={2} />
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          height: 100%;
        }

        .logo-container {
          margin-bottom: 40px;
        }

        .logo {
          width: 48px;
          height: 48px;
          background: #1f2937;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .nav-items {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }

        .nav-item {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          transition: all 0.2s ease;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(31, 41, 55, 0.1);
          transform: scale(1.05);
        }

        .nav-item.active {
          background: rgba(31, 41, 55, 0.15);
        }

        .nav-item :global(svg) {
          color: currentColor;
        }

        .notification-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .nav-footer {
          margin-top: auto;
          padding-bottom: 40px;
        }

        .profile-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #1f2937;
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .profile-avatar:hover {
          transform: scale(1.05);
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </nav>
  );
}