/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Search, Menu, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationsLive } from "@/hooks/useNotifications";

import Image from "next/image";
import { imgSrc } from "@/lib/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const { unreadCount, loading: notificationsLoading } = useNotificationsLive();
  const notificationCount = isAuthenticated && !notificationsLoading ? unreadCount : 0;

  const [menuOpen, setMenuOpen] = useState(false);        // small dropdown
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const isActive = (path: string) => pathname === path;
  const profileLink = user?.id ? `/profile/${user.id}` : "/login";
  // const postlink = isAuthenticated ? `/post/${user?.id}` : "/login";
  

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark" | null) ?? "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // close if click outside the footer menu area
      if (!target.closest(".nav-footer")) setMenuOpen(false);
    }

    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setMenuOpen(false);
  };


  return (
    <>
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Image
                src="/RB.png"
                alt="App logo"
                width={60}
                height={60}
                priority
              />
          </div>
        </div>

        <div className="nav-items">
          <Link href={profileLink} className="nav-item" aria-label="Profile">
            <div className="profile-avatar">
              <img
                src={imgSrc(user?.profileImage, "/default-avatar.png")}
                alt={user?.username ?? "User"}
                className="profile-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
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
            href="/search"
            className={`nav-item ${isActive("/search") ? "active" : ""}`}
            aria-label="Search"
          >
            <Search size={24} strokeWidth={2} />
          </Link>
        </div>

        <div className="nav-footer">
          <button
            type="button"
            className={`nav-item ${menuOpen ? "active" : ""}`}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={24} strokeWidth={2} />
          </button>

          {menuOpen && (
            <div className="menu-popover" role="menu" aria-label="Footer menu">
              <button className="menu-btn" onClick={toggleTheme} role="menuitem" type="button">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
              </button>

              <button
                className="menu-btn danger"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                role="menuitem"
                type="button"
                disabled={!isAuthenticated}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
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
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Poppins", sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .menu-popover {
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          background: var(--surface);
          border-radius: 14px;
          padding: 8px;
          box-shadow: 0 12px 30px var(--shadow);
          border: 1px solid var(--border);
          z-index: 10000;
        }

        .menu-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 10px;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: var(--text);
        }

        .menu-btn:hover {
          background: var(--hover);
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
          color: var(--text);
          transition: all 0.2s ease;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          border: none;
          background: transparent;
        }

        .nav-item:hover {
          background: var(--hover);
          transform: scale(1.05);
        }

        .nav-item.active {
          background: var(--hover);
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
          font-family: "Inter", sans-serif;
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
          position: relative;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          overflow: hidden;
          display: block;
          position: relative;
          z-index: 1;
          background: rgba(0,0,0,0.06);
        }

        .profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Full-screen settings overlay */
        .settings-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: var(--bg);
        }

        .settings-panel {
          width: 100%;
          height: 100%;
          overflow-y: auto;
        }

        .settings-header {
          position: sticky;
          top: 0;
          z-index: 2;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }

        .settings-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          font-family: "Poppins", sans-serif;
          color: var(--text);
        }

        .back-btn,
        .close-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 12px var(--shadow);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .back-btn:hover,
        .close-btn:hover {
          background: var(--surface-2);
          transform: scale(1.05);
        }
      `}</style>

      </nav>
    </>
  );
}
