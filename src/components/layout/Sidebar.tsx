"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus, Calendar, Search, Menu, User, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const notificationCount = 3; // This would come from your state management

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <div className="logo">RD</div>
      </div>

      <div className="nav-items">
        <Link 
          href="/" 
          className={`nav-item ${isActive("/") ? "active" : ""}`}
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
          href="/upload" 
          className={`nav-item ${isActive("/upload") ? "active" : ""}`}
          aria-label="Upload"
        >
          <Plus size={24} strokeWidth={2} />
        </Link>

        <Link 
          href="/calendar" 
          className={`nav-item ${isActive("/calendar") ? "active" : ""}`}
          aria-label="Calendar"
        >
          <Calendar size={24} strokeWidth={2} />
        </Link>

        <Link 
          href="/search" 
          className={`nav-item ${isActive("/search") ? "active" : ""}`}
          aria-label="Search"
        >
          <Search size={24} strokeWidth={2} />
        </Link>

        <Link 
          href="/menu" 
          className={`nav-item ${isActive("/menu") ? "active" : ""}`}
          aria-label="Menu"
        >
          <Menu size={24} strokeWidth={2} />
        </Link>
      </div>

      <div className="nav-footer">
        <Link 
          href="/profile" 
          className="nav-item" 
          aria-label="Profile"
        >
          <div className="profile-avatar">
            <img 
              src="/api/placeholder/40/40" 
              alt="Profile"
              className="avatar-img"
            />
          </div>
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