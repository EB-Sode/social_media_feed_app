"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
// import { useParams } from "next/navigation";
import FollowersList from "@/components/layout/FollowersList";
import UsersDirectory from "@/components/users/UsersDirectory";
import Header from "@/components/layout/Header";
import PostCreateModal from "@/components/modals/PostCreateModal";
import { useFeed } from "@/hooks/useFeed";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFeedRoute = pathname === "/feed" || pathname?.startsWith("/feed");
  // const params = useParams();
  // const userId = params.id as string;

  const { user } = useAuth();

  // ✅ IMPORTANT: don't auto-fetch feed from layout
  const { createPost } = useFeed({ autoFetch: false });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePost = async (content: string, imageFile?: File) => {
    await createPost(content, imageFile);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <Sidebar />
      </aside>

      {/* Main Feed Column */}
      <main className="main-feed">
        {/* ✅ Global Header lives in layout */}
        <Header
          onCreatePost={isFeedRoute ? () => setIsCreateModalOpen(true) : undefined}
        />

        {children}
      </main>

      {/* Right Followers Column */}
      <aside className="sidebar-right">
          <UsersDirectory
            query=""
            currentUserId={user?.id}
            limit={4}
            seeMoreHref="/users"
          />
        <div>
          <h2 className="text-xl font-bold mb-8">Your Followers</h2>
          {/* <FollowersList /> */}
          {user?.id ? (
            <>
              <FollowersList userId={user.id} mode="followers" />
              <FollowersList userId={user.id} mode="following" />
            </>
          ) : (
            <p>Please log in</p>
          )}
        </div>
        
      </aside>

      {/* ✅ Global Create Post Modal (only meaningful on feed) */}
      {user && (
        <PostCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
          userAvatar={user.profileImage}
          username={user.username}
        />
      )}

      <style jsx>{`
        .app-layout {
          display: grid;
          grid-template-columns: 200px 1fr 500px;
          min-height: 100vh;
          background: #70d686;
          gap: 0;
        }

        .sidebar-left {
          background: #70d686;
          border-right: 2px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .main-feed {
          background: #b1f5bf;
          overflow-y: auto;
          max-width: auto;
          margin: 0 auto;
          width: 100%;
          min-height: 100vh;
        }

        .sidebar-right {
          background: #70d686;
          border-left: 2px solid rgba(0, 0, 0, 0.1);
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
