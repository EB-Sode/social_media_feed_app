# SocialApp Design System & Implementation Guide

## Overview
This guide documents the updated design system for your SocialApp, matching modern social media aesthetics with improved visual hierarchy, spacing, and interactive elements.

## Color Palette

### Primary Colors
- **Brand Green**: `#2b8761` (Primary buttons, active states, branding)
- **Dark Green**: `#1f6949` (Hover states, gradients)
- **Accent Red**: `#ef4444` (Like button active state)

### Neutral Colors
- **Text Primary**: `#1f2937` (Headings, important text)
- **Text Secondary**: `#6b7280` (Body text, timestamps)
- **Text Muted**: `#374151` (Post content)
- **Border**: `rgba(43, 135, 97, 0.08)` (Card borders, dividers)

### Background Colors
- **Canvas**: `linear-gradient(135deg, #e0f4e8 0%, #b1f5bf 50%, #a8e6cf 100%)`
- **Surface**: `#ffffff` (Cards, header)
- **Surface Gradient**: `linear-gradient(180deg, #f8fffe 0%, #ffffff 100%)`

## Typography

### Font Families
```css
/* Headings & Emphasis */
font-family: 'Poppins', sans-serif;

/* Body Text */
font-family: 'Inter', sans-serif;
```

### Type Scale
- **Logo**: 24px / 700 / Poppins
- **Feed Title**: 32px / 700 / Poppins
- **Author Name**: 16px / 600 / Poppins
- **Post Content**: 15px / 400 / Inter
- **Timestamp**: 13px / 400 / Inter
- **Actions**: 14px / 500 / Inter

## Spacing System

### Component Spacing
- **Container Padding**: 20px horizontal
- **Card Margin**: 12px horizontal, 12px vertical
- **Card Padding**: 20px
- **Element Gap**: 12px (medium), 8px (small), 6px (tight)

### Border Radius
- **Mobile Frame**: 32px
- **Cards**: 16px
- **Buttons**: 12px (primary), 20px (icon buttons), 10px (nav icons)
- **Avatar**: 50% (circular)

## Components

### PostCard
**Features:**
- Hover elevation effect (translateY -2px)
- Smooth transitions (0.3s cubic-bezier)
- Interactive like button with color change
- Clean action buttons with hover states
- Gradient avatar badges
- Top border accent on hover

**Layout:**
- Avatar: 48px × 48px circular
- Action buttons: Flex with 8px gap
- Border top on actions: 1px solid accent color

### Header
**Features:**
- Sticky positioning
- Icon-based navigation
- Active state indication
- Smooth hover effects

**Layout:**
- Max-width: 390px
- Padding: 16px 20px
- Icon size: 22px
- Navigation gap: 4px

### Feed List
**Features:**
- Gradient header background
- Scrollable post area
- Consistent spacing

## Interactions & Animations

### Hover States
```css
/* Card Hover */
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

/* Button Hover */
background: rgba(43, 135, 97, 0.08);
color: #2b8761;
```

### Transitions
- Default: `all 0.2s ease`
- Cards: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Icons: `all 0.2s ease`

### Micro-interactions
- Like button: Heart fill animation
- Footer heart: Continuous heartbeat animation
- Primary buttons: Lift on hover with enhanced shadow

## Shadows

### Elevation System
```css
/* Card Default */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

/* Card Hover */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

/* Mobile Frame */
box-shadow: 
  0 20px 60px rgba(0, 0, 0, 0.15),
  0 0 0 1px rgba(0, 0, 0, 0.08);

/* Avatar */
box-shadow: 0 2px 8px rgba(43, 135, 97, 0.2);
```

## Accessibility Features

1. **Keyboard Navigation**: Focus-visible states with 2px outline
2. **ARIA Labels**: All interactive elements properly labeled
3. **Color Contrast**: WCAG AA compliant text colors
4. **Touch Targets**: Minimum 44px for mobile interactions

## Responsive Behavior

### Mobile (<430px)
- Full-screen layout
- Remove border radius from frame
- Remove padding from wrapper
- Maintain all component spacing

### Desktop (>430px)
- Centered mobile frame
- 32px border radius
- Gradient background visible
- Maximum width: 390px

## File Structure
```
src/
├── app/
│   └── (main)/
│       ├── layout.tsx          # Main layout wrapper
│       └── feed/
│           └── page.tsx        # Feed page
├── components/
│   ├── feed/
│   │   ├── FeedList.tsx       # Feed container
│   │   └── PostCard.tsx       # Individual post
│   └── layout/
│       ├── Header.tsx          # Top navigation
│       └── Footer.tsx          # Bottom info
└── styles/
    └── globals.css             # Global styles & utilities
```

## Implementation Notes

### Using lucide-react Icons
```typescript
import { Heart, MessageCircle, Share2 } from "lucide-react";

<Heart 
  size={20} 
  fill={liked ? "#ef4444" : "none"}
  strokeWidth={2}
/>
```

### Styled JSX
All components use styled-jsx for scoped styling:
```jsx
<style jsx>{`
  .component {
    /* styles here */
  }
`}</style>
```

### State Management
```typescript
const [liked, setLiked] = useState(false);
const [likeCount, setLikeCount] = useState(post.likes);
```

## Best Practices

1. **Consistent Spacing**: Use the spacing system throughout
2. **Animation Performance**: Use CSS transforms for animations
3. **Color Variables**: Keep colors consistent with the palette
4. **Typography Hierarchy**: Maintain the type scale
5. **Accessibility First**: Always include ARIA labels and keyboard navigation
6. **Mobile First**: Design for mobile, enhance for desktop

## Future Enhancements

1. Dark mode support with CSS variables
2. Image posts with aspect ratio containers
3. Comments section with nested replies
4. User profiles with bio and stats
5. Infinite scroll with skeleton loading
6. Pull-to-refresh functionality
7. Story/Status feature at top of feed
8. Reactions beyond like (love, laugh, etc.)

---

**Version**: 1.0  
**Last Updated**: February 2026  
**Design System**: SocialApp Material
