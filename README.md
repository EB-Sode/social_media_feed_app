# Social Media Frontend Web Application

## Project Overview

This project is a **modern social media frontend web application** built with **Next.js**. It consumes a custom-built **GraphQL backend API built with the Django framework** and focuses on delivering a performant, scalable, and user-friendly social experience. The application supports **text and image-based posts**, **comments**, and **user follow functionality**, with authentication handled via **JWT**.

The frontend is designed with a **mobile-first approach**, following a component-driven UI workflow derived from **Figma designs**.

---

## Project Objectives

The primary objectives of this project are:

* Build a production-ready social media frontend using **Next.js (App Router)**
* Consume a **GraphQL API built with the Django framework** via a clearly defined frontend–backend contract
* Implement secure JWT-based authentication
* Deliver a clean, responsive, and accessible UI based on Figma designs
* Apply modern frontend engineering best practices
* Ensure scalability, maintainability, and performance

---

## Core Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes and authenticated user state

### Social Features

* Create text and image posts
* View posts in a personalized feed
* Comment on posts
* Follow and unfollow users
* View user profiles and profile feeds

### UI & UX

* Responsive layouts (mobile-first)
* Reusable UI components
* Loading, empty, and error states
* Optimistic UI updates for interactions

---

## Planned Implementation

### 1. UI Design (Figma)

* Design system (colors, typography, spacing)
* Reusable components (buttons, inputs, cards, modals)
* Page layouts (auth, feed, profile, post details)

### 2. Frontend Setup

* Next.js with App Router
* TypeScript for type safety
* Tailwind CSS for styling
* ESLint and Prettier for code quality

### 3. API Integration

* Integration with a GraphQL API (Django backend)
* Centralized GraphQL client setup
* Typed queries and mutations
* Secure JWT token handling
* Consistent error handling and status management

### 4. State Management

* Server-side data fetching for feeds and profiles
* Client-side state for UI interactions
* Optimistic updates for likes, follows, and comments

### 5. Performance & UX Enhancements

* Cursor-based pagination for infinite scrolling
* Image optimization
* Route-level loading states

---

## Application Architecture

### High-Level Architecture

```
UI (Next.js App Router)
│
├── Server Components (data fetching)
├── Client Components (interactions)
│
└── Django GraphQL API (JWT Auth)
```

---

### Folder Structure

```
src/
 ├── app/
 │   ├── (auth)/
 │   ├── (main)/
 │   ├── layout.tsx
 │   └── page.tsx
 │
 ├── components/
 │   ├── ui/
 │   ├── post/
 │   ├── feed/
 │   └── profile/
 │
 ├── lib/
 │   ├── api.ts
 │   ├── auth.ts
 │   └── fetcher.ts
 │
 ├── hooks/
 ├── store/
 ├── types/
 └── styles/
```

---

## Data Flow Strategy

* **Server Components** handle initial data fetching for feeds and profiles
* **Client Components** manage user interactions (likes, comments, follows)
* API responses are mapped to strict TypeScript models
* Pagination uses cursor-based fetching for scalability

---

## API Contract Summary

* GraphQL API built with Django
* JWT-based authentication
* Queries for feeds, profiles, and comments
* Mutations for posts, comments, and follow actions
* Consistent error response structure
* Cursor-based pagination for feeds

The frontend strictly relies on the GraphQL schema and API contract to avoid tight coupling and ensure maintainability.

---

## Security Considerations

* JWT tokens handled securely
* Protected routes via middleware
* No sensitive logic exposed on the client
* Input validation handled on both frontend and backend

---

## Challenges Anticipated

* Managing authenticated and unauthenticated states cleanly
* Handling optimistic UI updates without data inconsistencies
* Designing scalable component architecture
* Balancing server and client components effectively

---

## Best Practices Applied

* Component-driven development
* Separation of concerns
* Type-safe API integration
* Mobile-first responsive design
* Scalable folder structure

---

## Future Enhancements

* Notifications system
* Real-time updates (WebSockets)
* Post reactions beyond likes
* Media optimization and CDN integration
* Accessibility improvements

---

## Conclusion

This project demonstrates a real-world approach to building a modern social media frontend application using **Next.js**. It emphasizes clean architecture, thoughtful API integration, and scalable design principles suitable for production environments.


.
├── app
│   ├── (auth)
│   │   ├── AuthForm.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── reset-password
│   │   │   └── page.tsx
│   │   ├── signup
│   │   │   └── page.tsx
│   │   └── types.ts
│   ├── (main)
│   │   ├── feed
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── post
│   │       └── [id]
│   │           └── pages.tsx
│   ├── layout.tsx
│   ├── notifications
│   │   └── page.tsx
│   ├── page.tsx
│   ├── profile
│   │   ├── [username]
│   │   └── page.tsx
│   └── test
│       └── page.tsx
├── components
│   ├── SignupButton.tsx
│   ├── feed
│   │   ├── FeedList.tsx
│   │   └── PostCard.tsx
│   ├── layout
│   │   ├── FollowersList.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── notifications
│   │   ├── NotificationItem.tsx
│   │   └── NotificationsList.tsx
│   └── profile
│       ├── EditProfile.tsx
│       └── Settings.tsx
├── context
│   └── AuthContext.tsx
├── hooks
│   ├── useFeed.ts
│   ├── useNotifications.ts
│   └── useProfile.ts
├── lib
│   ├── auth-utils.ts
│   ├── graphql.ts
│   └── queries.ts
├── store
└── styles
    └── global.css

