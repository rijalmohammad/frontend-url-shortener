# URL Shortener - Frontend

Modern Next.js frontend application for the URL shortener service with QR code generation, clipboard functionality, and comprehensive testing.

## 📋 Overview

A responsive web application built with Next.js 16 that provides an intuitive interface for creating and managing shortened URLs. Features include real-time validation, QR code generation, and seamless backend integration.

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   ├── page.tsx              # Home page (main UI)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles
├── components/
│   ├── Header/               # App header
│   ├── UrlShortenerForm/     # URL input form with validation
│   ├── ShortLinksList/       # List container
│   └── ShortLinkItem/        # Individual link card with QR code
├── context/
│   └── UrlShortenerContext.tsx  # Global state management
├── hooks/
│   └── useUrlShortener.ts    # Custom hook for context
├── lib/
│   └── api.ts                # API client with error handling
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    └── validation.ts         # URL validation logic
```

### State Management
- **React Context API**: Global state for short links, loading, and errors
- **Custom Hook**: `useUrlShortener()` provides access to context
- **Local State**: Component-level state for UI interactions (copy status, QR visibility)

### Data Flow
```
User Input → Validation → API Call → Context Update → UI Render
     ↓
  Success/Error Feedback
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.2 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Lucide icons
- **QR Codes**: qrcode.react
- **Testing**: Vitest 4.1.2, React Testing Library
- **HTTP Client**: Native Fetch API
- **State**: React Context API

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# From project root
cd apps/web

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env
```

## 🔧 Environment Configuration

Create `.env` in the `apps/web` directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 💻 Usage

### Development

```bash
# From apps/web directory
pnpm dev

# Or from root directory
pnpm -F web dev
```

Access at: http://localhost:3000

### Production Build

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## 🔌 API Integration

### API Client (`src/lib/api.ts`)

The frontend uses a centralized API client with:
- Environment-based base URL configuration
- Custom `ApiError` class for error handling
- TypeScript interfaces for type safety
- Automatic JSON parsing

### Example Usage

```typescript
import { api } from '@/lib/api';

// Create short link
const link = await api.createShortLink('https://example.com');

// Get all links
const links = await api.getAllShortLinks();

// Get specific link
const link = await api.getShortLink('abc123');
```

### API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shortlinks` | Create new short link |
| GET | `/api/shortlinks` | Get all short links |
| GET | `/api/shortlinks/:id` | Get link details |
| GET | `/shortlinks/:id` | Redirect to original URL |

### Request/Response Examples

**Create Short Link:**
```typescript
// Request
POST /api/shortlinks
{ "original_url": "https://example.com" }

// Response
{
  "id": "mro0Dg",
  "original_url": "https://example.com",
  "short_url": "http://localhost:8080/shortlinks/mro0Dg",
  "created_at": "2026-04-06T06:43:19Z"
}
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

### Test Structure

```
src/
├── components/
│   ├── Header/__tests__/Header.test.tsx
│   ├── ShortLinkItem/__tests__/ShortLinkItem.test.tsx
│   ├── ShortLinksList/__tests__/ShortLinksList.test.tsx
│   └── UrlShortenerForm/__tests__/UrlShortenerForm.test.tsx
├── hooks/__tests__/useUrlShortener.test.tsx
├── lib/__tests__/api.test.ts
└── utils/__tests__/validation.test.ts
```

### Test Coverage (58 tests)

- ✅ **Component Tests**: Rendering, interactions, state changes
- ✅ **Form Validation**: URL format, required fields, error messages
- ✅ **API Integration**: Mocked responses, error handling
- ✅ **User Interactions**: Copy to clipboard, QR code toggle, link opening
- ✅ **Loading States**: Button disabled, loading indicators
- ✅ **Timer-based UI**: Auto-hide messages, copy state reset

### Testing Tools

- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **vitest.setup.ts**: Global test configuration and mocks

## 📁 Project Structure

```
apps/web/
├── public/                   # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── Header/
│   │   ├── UrlShortenerForm/
│   │   ├── ShortLinksList/
│   │   └── ShortLinkItem/
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API client
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── .env              # Environment variables
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest configuration
└── package.json            # Dependencies and scripts
```

## 🎯 Features

### Core Features
- ✅ URL shortening with real-time validation
- ✅ View all created short links
- ✅ Copy short URLs to clipboard
- ✅ Test links (open in new tab)
- ✅ Display creation timestamps

### Enhanced Features
- ✅ QR code generation for each short link
- ✅ QR code download functionality
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states and error handling
- ✅ Auto-hide success messages
- ✅ Visual feedback (checkmarks, animations)
- ✅ Gradient backgrounds and modern UI

## 🎨 UI/UX Highlights

- **Modern Design**: Gradient backgrounds, smooth transitions
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **User Feedback**: Loading spinners, success/error messages, visual confirmations
- **Icons**: Lucide React icons for consistent visual language

## 🔍 Key Components

### UrlShortenerForm
- URL input with validation
- Submit button with loading state
- Success/error message display
- Auto-clear on success

### ShortLinkItem
- Original and short URL display
- Copy to clipboard button
- Open link button
- QR code toggle and download
- Formatted creation date

### UrlShortenerContext
- Global state management
- API call handling
- Error state management
- Loading state tracking

## 📝 Scripts

```json
{
  "dev": "next dev -p 3000",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "test": "vitest",
  "test:coverage": "vitest --coverage"
}
```

## 🚀 Deployment

This Next.js app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **Docker** containers
- Any Node.js hosting platform

Ensure `NEXT_PUBLIC_API_BASE_URL` is set in production environment variables.