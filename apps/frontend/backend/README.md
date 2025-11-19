# Backend API - Fasal Rakshak

Node.js + Express + TypeScript backend service.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

**Important for deployment:**
- `FRONTEND_URL`: Comma-separated list of allowed frontend URLs (e.g., `https://app.vercel.app,https://app.com`)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (min 32 chars)
- `ML_SERVICE_URL`: URL of ML inference service

## Database

```bash
# Run migrations
npm run migrate

# Seed demo data
npm run seed
```

## API Documentation

See `/docs/API.md` for complete API documentation.

## Deployment

### Railway
1. Connect GitHub repo
2. Set root directory to `apps/backend`
3. Add environment variables
4. Add PostgreSQL and Redis services
5. Deploy

### Render
1. Create Web Service
2. Connect GitHub repo
3. Root Directory: `apps/backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`

## Health Check

```bash
curl http://localhost:5000/health
```


