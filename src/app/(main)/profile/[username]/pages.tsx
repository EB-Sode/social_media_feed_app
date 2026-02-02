import React from "react";

interface ProfilePageProps {
  params: { username: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-heading text-2xl text-primary mb-4">
        {params.username}&apos;s Profile
      </h1>
      {/* User info, posts, stats */}
    </div>
  );
}