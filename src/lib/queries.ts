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
  profileImage?: string | null;  
  location?: string | null;   
  birthDate?: string | null; 
  coverImage?: string | null;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

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
  imageUrl?: string | null;
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

export const GET_ME = `
  query Me {
    me {
      id
      username
    }
  }
`;

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

export const GET_ALL_USERS = `
  query GetAllUsers {
    users {
      id
      username
      bio
      profileImage
      coverImage
      location
    }
  }
`;

export const SEARCH_USERS = `
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      bio
      profileImage
      coverImage
      location
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
      imageUrl
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
      imageUrl
      createdAt
      updatedAt
      likesCount
      commentsCount
      isLikedByUser
      author {
        id
        username
        email
        profileImage
      }
    }

    comments(postId: $postId) {
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
`;


export const GET_USER_POSTS = `
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      id
      content
      imageUrl
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

export const GET_FOLLOWERS = `
  query GetFollowers($userId: ID!) {
    followers(userId: $userId) {
      id
      follower {
        id
        username
        profileImage
        bio
      }
    }
  }
`;

export const GET_FOLLOWING = `
  query GetFollowing($userId: ID!) {
    following(userId: $userId) {
      id
      followed {
        id
        username
        profileImage
        bio
      }
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
        imageUrl
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
  mutation CreatePost($content: String!, $image: Upload) {
    createPost(content: $content, image: $image) {
      post {
        id
        content
        imageUrl
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
      success
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
      message
    }
  }
`;

export const DELETE_ALL_USER_POSTS_MUTATION = `
  mutation DeleteAllPosts {
    deleteAllPosts {
      success
      message
    }
  }
`;

export const UPDATE_POST_MUTATION = `
  mutation UpdatePost($postId: ID!, $content: String, $image: Upload) {
    updatePost(postId: $postId, content: $content, image: $image) {
      post {
        id
        content
        imageUrl
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
      follow {
        id
      }
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

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile(
    $bio: String
    $email: String
    $location: String
    $profileImage: String
  ) {
    updateProfile(
      bio: $bio
      email: $email
      location: $location
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

export const UPDATE_USER_IMAGES = `
  mutation UpdateUserImages($profile: Upload, $cover: Upload) {
    updateUserImages(profile: $profile, cover: $cover) {
      success
      message
      profileImage
      coverImage
    }
  }
`;