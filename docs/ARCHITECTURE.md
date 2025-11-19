# Fasal Rakshak Architecture

## System Overview

```
┌─────────────┐
│   Frontend  │ (Next.js + React + TypeScript)
│  (Port 3000)│
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │ (Node.js + Express + TypeScript)
│  (Port 5000)│
└──────┬──────┘
       │
       ├──► PostgreSQL (Port 5432)
       ├──► Redis (Port 6379)
       ├──► MinIO/S3 (Port 9000)
       │
       └──► ML Service (Port 8000)
            (Python + FastAPI)
```

## Components

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS (mobile-first)
- **State Management**: React Query + Zustand
- **i18n**: react-i18next (English, Hindi)
- **Features**: 
  - Landing page
  - Auth (login/signup)
  - Dashboard
  - Scan upload & results
  - Admin heatmap (placeholder)

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14
- **Cache**: Redis
- **Storage**: MinIO (S3-compatible)
- **Auth**: JWT with refresh tokens
- **APIs**: RESTful endpoints
- **Rate Limiting**: express-rate-limit

### ML Service
- **Framework**: FastAPI (Python)
- **Current**: Deterministic inference stub
- **Future**: PyTorch/TorchScript model
- **Endpoint**: `/infer` (multipart form-data)

### Database Schema
- `users`: User accounts (farmers, experts, admins)
- `farms`: Farm locations and metadata
- `scans`: Disease detection results
- `products`: E-commerce catalog
- `orders`: Purchase orders
- `claims`: Insurance claims
- `posts`: Community feed
- `comments`: Post comments

## Data Flow

### Scan Flow
1. User uploads image via frontend
2. Frontend sends to backend `/api/v1/scan`
3. Backend uploads image to MinIO
4. Backend calls ML service `/infer`
5. ML service returns disease + confidence
6. Backend stores result in PostgreSQL
7. Backend returns result to frontend
8. Frontend displays disease, confidence, treatment

### Authentication Flow
1. User submits credentials
2. Backend validates and generates JWT
3. Token stored in localStorage (frontend)
4. Token sent in Authorization header for subsequent requests
5. Backend validates token on protected routes

## Deployment

### Docker Compose
All services containerized and orchestrated via `docker-compose.yml`:
- Frontend (Next.js)
- Backend (Node.js)
- ML Service (Python)
- PostgreSQL
- Redis
- MinIO

### CI/CD
GitHub Actions workflow:
- Lint checks
- Unit tests
- Docker image builds (on main branch)

## Future Enhancements

1. **Real ML Model**: Replace stub with trained PyTorch model
2. **Offline Support**: IndexedDB + Service Worker
3. **Real Integrations**: Twilio, Razorpay, Blockchain
4. **Mobile App**: React Native implementation
5. **Advanced Analytics**: PostGIS for spatial queries
6. **Caching**: Redis caching for frequently accessed data
7. **Background Jobs**: Bull/BullMQ for async tasks


