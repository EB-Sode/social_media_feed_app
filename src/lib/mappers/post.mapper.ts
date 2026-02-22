import type { Post } from "@/lib/queries";


/**
 * UI representation of a post
 * This format is optimized for rendering in components
 */
export interface UIPost {
  id: string;
  content: string;
  imageUrl?: string | null;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  timestamp: string;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
}

/**
 * Map a Post from the API to UIPost format
 * Handles date formatting and data transformation
 */
export function mapPostToUI(post: Post): UIPost {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    authorId: post.author?.id ?? "unknown",
    authorName: post.author?.username ?? "Unknown User",
    authorAvatar: post.author?.profileImage ?? "",
    timestamp: formatTimestamp(post.createdAt),
    likes: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: post.isLikedByUser ?? false,
  };
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 * Falls back to formatted date for older posts
 */
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  // More than a week - show formatted date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}