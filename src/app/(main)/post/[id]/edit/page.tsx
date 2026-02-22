/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { imgSrc } from "@/lib/image";
import { graphqlUploadRequest } from "@/lib/utils/imageUpload";
import { UPDATE_POST_MUTATION } from "@/lib/queries";


export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { post, loading, error } = usePost(id);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post?.content) setContent(post.content);
  }, [post]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = process.env.NEXT_PUBLIC_API_URL!; // your /graphql/ endpoint
      const token = localStorage.getItem("accessToken");

      const data = await graphqlUploadRequest<{
        updatePost: { post: { id: string; content: string; image: string } };
      }>({
        endpoint,
        query: UPDATE_POST_MUTATION,
        variables: {
          postId: String(id),
          content: content.trim(),
        },
        file: imageFile, // if null, only content updates
        fileVar: "image",
        token,
      });

      router.push(`/post/${id}`);
      router.refresh();
    } catch (e) {
      console.error("Update post failed:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error || !post) return <div style={{ padding: 20 }}>Post not found</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft />
        </button>
        <h1 style={{ margin: 0 }}>Edit post</h1>
      </div>

      {post.imageUrl && (
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <img src={imgSrc(post.imageUrl)} alt="Post" style={{ width: "100%", display: "block" }} />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 12, borderRadius: 12 }}
      />

      <button
        onClick={handleSave}
        disabled={saving || !content.trim()}
        style={{ marginTop: 12, display: "inline-flex", gap: 8, alignItems: "center" }}
      >
        <Save size={18} /> {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
