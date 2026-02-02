import React from "react";

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl text-primary mb-4">
        Post ID: {params.id}
      </h1>
      {/* Post content, comments, actions */}
    </div>
  );
}