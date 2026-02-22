"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon, Menu, LogOut, Moon, Sun} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type ProfileSidebarProps = {
  /** route user to first post when clicked */
  firstPostId?: string;
  /** disable messages button when no post */
  hasPosts?: boolean;
  /** open settings overlay in parent */
  onOpenSettings: () => void;
  /** optional: route home */
  homeHref?: string; // default: "/feed"
};

export default function ProfileSidebar({
  // firstPostId,
  // hasPosts = true,
  onOpenSettings,
  homeHref = "/feed",
}: ProfileSidebarProps) {
  const router = useRouter();

  const { isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);        // small dropdown
  const [theme, setTheme] = useState<"light" | "dark">("light");


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
    <div className="sidebar-nav">
  <div className="nav-top">
    <button className="nav-icon" aria-label="Home" onClick={() => router.push(homeHref)} type="button">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* SETTINGS → overlay */}
      <button className="nav-icon" aria-label="Settings" onClick={onOpenSettings} type="button">
      <SettingsIcon size={22} strokeWidth={2} />
    </button>

      {/* PROFILE (stays) */}
      <button className="nav-icon" aria-label="Profile" type="button">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      </div>

       <div className="nav-footer">
           <button type="button" className={`nav-icon ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen((v) => !v)}>
              <Menu size={24} strokeWidth={2} />
            </button>

            {menuOpen && (
              <div className="menu-popover" role="menu">
                <button className="menu-btn" onClick={toggleTheme} type="button">
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
                </button>
                <button className="menu-btn danger" onClick={() => { setMenuOpen(false); logout(); }} type="button" disabled={!isAuthenticated}>
                  <LogOut size={18} />
                  <span>Logout</span>
              </button>
            </div> 
          )}
        </div>

     <style jsx>{`
      .sidebar-nav {
        position: sticky;
        top: 90px;
        height: calc(100vh - 90px); /* ← gives it height so margin-top: auto works */
        display: flex;
        flex-direction: column;
        align-self: start;
        z-index: 3;
        padding-bottom: 24px;
      }

      .nav-top {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .nav-footer {
        margin-top: auto; /* ← now works because parent has height */
        position: relative;
      }

      .nav-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        border-radius: 10px;
        transition: color 0.2s, background 0.2s;
      }

      .nav-icon:hover,
      .nav-icon.active {
        color: var(--brand);
        background: rgba(43, 135, 97, 0.12);
      }

      .nav-icon:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        background: none;
      }

      .menu-popover {
        position: absolute;
        bottom: 48px; /* just above the menu button */
        left: 0;
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
        padding: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 10px;
        font-family: "Inter", sans-serif;
        font-size: 13px;
        color: var(--text);
        transition: background 0.2s;
      }

      .menu-btn:hover {
        background: var(--hover);
      }

      .menu-btn.danger {
        color: #ef4444;
      }

      .menu-btn.danger:hover {
        background: rgba(239, 68, 68, 0.08);
      }

      @media (max-width: 1024px) {
        .sidebar-nav {
          position: relative;
          top: 0;
          height: auto; /* ← reset on mobile */
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
        }

        .nav-top {
          flex-direction: row;
          gap: 8px;
        }

        .menu-popover {
          bottom: 48px;
          left: auto;
          right: 0; /* ← anchors to right on mobile so it doesn't go offscreen */
        }
      }

     `}</style>

    </div>
  );
}
