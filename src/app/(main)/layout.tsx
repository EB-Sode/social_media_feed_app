"use client";

import Sidebar from "@/components/layout/Sidebar";
import FollowersList from "@/components/layout/FollowersList";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <Sidebar />
      </aside>

      {/* Main Feed Column */}
      <main className="main-feed">
        {children}
      </main>

      {/* Right Followers Column */}
      <aside className="sidebar-right">
        <FollowersList />
      </aside>

      <style jsx>{`
        .app-layout {
          display: grid;
          grid-template-columns: 200px 1fr 500px;
          min-height: 100vh;
          background: #70D686;
          gap: 0;
        }

        .sidebar-left {
          background: #70D686;
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .main-feed {
          background: #b1f5bf;
          overflow-y: auto;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .sidebar-right {
          background: #70D686;
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .app-layout {
            grid-template-columns: 80px 1fr;
          }

          .sidebar-right {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

          .sidebar-left {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}