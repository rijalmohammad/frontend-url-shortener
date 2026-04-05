# URL Shortener - Full Stack Application

A modern, full-stack URL shortener application built with Next.js and Go, featuring a clean UI, QR code generation, and comprehensive testing.

## � Project Overview

This monorepo contains a complete URL shortener solution with:
- **Monorepo**: Turborepo for build orchestration and caching
- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, and Lucide icons
- **Backend**: Go with Gin framework and in-memory storage
- **Features**: URL shortening, QR code generation, clipboard copy, link management

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Next.js)     │ ◄─────► │    (Go/Gin)     │
│   Port: 3000    │  HTTP   │   Port: 8080    │
└─────────────────┘         └─────────────────┘
        │                           │
        ▼                           ▼
  React Context              In-Memory Store
  State Management           (Map-based)
```

### Monorepo Structure

Built with **Turborepo** for efficient task running and caching:

```
frontend-url-shortener/
├── apps/
│   ├── web/              # Next.js frontend (see apps/web/README.md)
│   └── backend/          # Go backend (see apps/backend/README.md)
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # PNPM workspace config
└── turbo.json           # Turborepo pipeline configuration
```

**📖 For detailed documentation:**
- [Frontend Documentation](./apps/web/README.md) - Component architecture, testing, API integration
- [Backend Documentation](./apps/backend/README.md) - API endpoints, storage, deployment

## 🛠️ Tech Stack

### Monorepo
- **Build System**: Turborepo
- **Package Manager**: pnpm with workspaces
- **Task Orchestration**: Parallel execution with caching

### Frontend (`apps/web`)
- **Framework**: Next.js 16.2.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **QR Codes**: qrcode.react
- **Testing**: Vitest, React Testing Library
- **State**: React Context API

### Backend (`apps/backend`)
- **Language**: Go 1.23+
- **Framework**: Gin
- **Storage**: In-memory (map-based)
- **CORS**: Enabled for localhost:3000
- **ID Generation**: Custom base62 encoding

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Go 1.23+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend-url-shortener

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd apps/backend
go mod tidy
cd ../..
```

## 🔧 Environment Configuration

### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Backend
No environment configuration required. Backend runs on port 8080 by default.

## 💻 Usage

### Development Mode

Run both frontend and backend concurrently:
```bash
# From root directory
pnpm dev
```

Or run individually:
```bash
# Frontend only (from root)
pnpm -F web dev

# Backend only (from root)
pnpm -F backend dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

### Production Build

```bash
# Build frontend
pnpm -F web build
pnpm -F web start

# Build backend
cd apps/backend
go build -o bin/server main.go
./bin/server
```

## 🔌 API Integration

### How Frontend Connects to Backend

The frontend uses a centralized API client (`apps/web/src/lib/api.ts`) that:
1. Reads `NEXT_PUBLIC_API_BASE_URL` from environment
2. Makes HTTP requests using native `fetch` API
3. Handles errors with custom `ApiError` class
4. Returns typed responses based on TypeScript interfaces

### API Endpoints & Request/Response Format

#### 1. Create Short Link
**Request:**
```bash
POST http://localhost:8080/api/shortlinks
Content-Type: application/json

{
  "original_url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "id": "mro0Dg",
  "original_url": "https://example.com/very/long/url",
  "short_url": "http://localhost:8080/shortlinks/mro0Dg",
  "created_at": "2026-04-06T06:43:19Z"
}
```

#### 2. Get All Short Links
**Request:**
```bash
GET http://localhost:8080/api/shortlinks
```

**Response:**
```json
[
  {
    "id": "mro0Dg",
    "original_url": "https://example.com",
    "short_url": "http://localhost:8080/shortlinks/mro0Dg",
    "created_at": "2026-04-06T06:43:19Z"
  }
]
```

#### 3. Get Short Link Details
**Request:**
```bash
GET http://localhost:8080/api/shortlinks/{id}
```

**Response:**
```json
{
  "id": "mro0Dg",
  "original_url": "https://example.com",
  "short_url": "http://localhost:8080/shortlinks/mro0Dg",
  "created_at": "2026-04-06T06:43:19Z"
}
```

#### 4. Redirect to Original URL
**Request:**
```bash
GET http://localhost:8080/shortlinks/{id}
```

**Response:**
```
HTTP/1.1 301 Moved Permanently
Location: https://example.com
```

#### 5. Health Check
**Request:**
```bash
GET http://localhost:8080/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

## 🧪 Testing

### Run Tests

```bash
# Frontend tests (from root)
pnpm test

# Or from web directory
cd apps/web
pnpm test

# Run with coverage
pnpm test:coverage
```

### Test Coverage

The frontend includes 58 comprehensive tests covering:
- ✅ Component rendering and interactions
- ✅ Form validation logic
- ✅ API integration (mocked responses)
- ✅ Copy-to-clipboard functionality
- ✅ QR code generation
- ✅ Error handling
- ✅ Loading states
- ✅ Timer-based UI updates

### Test Files
```
apps/web/src/
├── components/
│   ├── Header/__tests__/
│   ├── ShortLinkItem/__tests__/
│   ├── ShortLinksList/__tests__/
│   └── UrlShortenerForm/__tests__/
├── hooks/__tests__/
├── lib/__tests__/
└── utils/__tests__/
```

## 📦 Project Structure

See individual README files for detailed structure:
- [Frontend Documentation](./apps/web/README.md)
- [Backend Documentation](./apps/backend/README.md)

## 🎯 Features

- ✅ URL shortening with custom IDs
- ✅ QR code generation for short URLs
- ✅ Copy to clipboard functionality
- ✅ Link management (view all links)
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time validation
- ✅ Error handling with user feedback
- ✅ Loading states
- ✅ Auto-hide success messages
- ✅ Comprehensive test coverage

## 📝 License

MIT
