// src/lib/queries.ts
/**
 * GraphQL Queries, Mutations, and TypeScript Types
 * Aligned with Django + Graphene backend
 */

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export interface User {
  id: string;
  username: string;
  email?: string;
  bio?: string | null;
  profileImage?: string | null;   // ✅ Was "avatar"
  location?: string | null;        // ✅ Added
  birthDate?: string | null;       // ✅ Added
  coverImage?: string | null;      // ✅ Added
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

// export type UserProfileUI = User & {
//   role: string;
//   coverImage: string;
//   likes: string;
//   location: string;
// };

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  image?: string | null;
  author: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  comments?: Comment[];
};



export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
}

export type NotificationType = "like" | "comment" | "follow" | "mention";

export interface Notification {
  id: string;
  notificationType: NotificationType;
  sender: User;
  post?: Post | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================================================
// QUERIES
// ============================================================================

export const GET_USERS = `
  query GetUsers {
    users {
      id
      username
      email
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const GET_USER_BY_USERNAME = `
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
      email
      bio
      createdAt
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const GET_USER_BY_ID = `
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      username
      email
      bio
      profileImage
      createdAt
      location
      coverImage
    }
  }
`;

export const GET_FEED = `
  query GetFeed {
    feed {
      id
      content
      image
      createdAt
      updatedAt
      likesCount
      commentsCount
      isLikedByUser
      author {
        id
        username
        profileImage
      }
    }
  }
`;

export const GET_POST_BY_ID = `
  query GetPostById($postId: ID!) {
    post(id: $postId) {
      id
      content
      image
      author {
        id
        username
        email
      }
      createdAt
      updatedAt
      likesCount
      commentsCount
      isLiked
      comments {
        id
        content
        author {
          id
          username
        }
        createdAt
      }
    }
  }
`;

export const GET_USER_POSTS = `
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      id
      content
      image
      author {
        id
        username
      }
      createdAt
      updatedAt
      likesCount
      commentsCount
      isLikedByUser
    }
  }
`;
export const GET_FOLLOW_STATS = `
  query GetFollowStats($userId: ID!) {
    followStats(userId: $userId) {
      followersCount
      followingCount
      isFollowing
      isFollowedBy
    }
  }
`;

export const GET_NOTIFICATIONS = `
  query GetNotifications($limit: Int, $unreadOnly: Boolean) {
    notifications(limit: $limit, unreadOnly: $unreadOnly) {
      id
      message
      isRead
      createdAt
      sender {
        id
        username
        profileImage
      }
      post {
        id
        content
        image
      }
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS = `
  query GetUnreadNotifications {
    unreadNotifications {
      id
    }
  }
`;

// ============================================================================
// AUTH MUTATIONS
// ============================================================================

export const SIGNUP_MUTATION = `
  mutation Signup($username: String!, $email: String!, $password: String!, $bio: String) {
    signup(username: $username, email: $email, password: $password, bio: $bio) {
      user {
        id
        username
        email
        bio
        profileImage
        createdAt
      }
      token
      refreshToken
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        email
        bio
        profileImage
        createdAt
      }
      token
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

// ============================================================================
// POST MUTATIONS
// ============================================================================

export const CREATE_POST_MUTATION = `
  mutation CreatePost($content: String!, $image: String) {
    createPost(content: $content, image: $image) {
      post {
        id
        content
        image
        createdAt
        updatedAt
        likesCount
        commentsCount
        isLikedByUser
        author {
          id
          username
          profileImage
        }
      }
    }
  }
`;

export const LIKE_POST_MUTATION = `
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      success
      message
      post {
        id
        likesCount
        commentsCount
      }
    }
  }

`;

export const CREATE_COMMENT_MUTATION = `
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      comment {
        id
        content
        createdAt
        author {
          id
          username
          profileImage
        }
      }
    }
  }
`;

export const DELETE_POST_MUTATION = `
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;

export const UPDATE_POST_MUTATION = `
  mutation UpdatePost($postId: ID!, $content: String, $image: String) {
    updatePost(postId: $postId, content: $content, image: $image) {
      post {
        id
        content
        image
        updatedAt
        likesCount
        commentsCount
      }
    }
  }
`;

// ============================================================================
// FOLLOW MUTATIONS
// ============================================================================

export const FOLLOW_USER_MUTATION = `
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      success
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = `
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      success
    }
  }
`;

// ============================================================================
// NOTIFICATION MUTATIONS
// ============================================================================

export const MARK_NOTIFICATION_READ_MUTATION = `
  mutation MarkNotificationRead($notificationId: Int!) {
    markAsRead(notificationId: $notificationId) {
      success
    }
  }
`;


export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllNotificationsAsRead {
    markAllAsRead {
      success
    }
  }
`;
// =====================
// PROFILE QUERIES
// =====================



// Replace in lib/queries.ts

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile(
    $bio: String
    $email: String
    $profileImage: String
  ) {
    updateProfile(
      bio: $bio
      email: $email
      profileImage: $profileImage
    ) {
      user {
        id
        username
        email
        bio
        profileImage
        createdAt
        location
        birthDate
        coverImage
        followersCount
        followingCount
        postsCount
      }
    }
  }
`;