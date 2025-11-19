# Deployment Guide - Fasal Rakshak

## Overview

This application consists of multiple services that need to be deployed separately:

1. **Frontend** (Next.js) → Vercel ✅
2. **Backend** (Node.js/Express) → Railway, Render, or Heroku
3. **ML Service** (Python/FastAPI) → Railway, Render, or separate server
4. **Database** (PostgreSQL) → Managed service (Supabase, Railway, Render)
5. **Redis** → Managed service (Upstash, Railway)
6. **Storage** (MinIO/S3) → AWS S3, Cloudflare R2, or keep MinIO on server

## Quick Deploy to Vercel (Frontend Only)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Fasal Rakshak"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/fasal-rakshak.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. **Configure:**
   - **Root Directory**: `apps/frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Environment Variables** (add these in Vercel dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-service-url.com
   ```

6. Click "Deploy"

⚠️ **Note**: The frontend will deploy, but it won't work fully until you deploy the backend and ML service.

## Full Stack Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway can deploy all services easily:

1. **Backend Deployment:**
   - Connect GitHub repo
   - Select `apps/backend` as root
   - Add environment variables from `.env.example`
   - Railway auto-detects Node.js and deploys

2. **ML Service:**
   - Create new service
   - Select `apps/ml` as root
   - Railway auto-detects Python and deploys

3. **PostgreSQL:**
   - Add PostgreSQL service in Railway
   - Use connection string in backend env vars

4. **Redis:**
   - Add Redis service in Railway
   - Use connection string in backend env vars

**Railway provides**: Free tier with $5 credit, easy scaling, automatic HTTPS

### Option 2: Render

Similar to Railway:

1. **Backend:**
   - Create Web Service
   - Connect GitHub repo
   - Root Directory: `apps/backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`

2. **ML Service:**
   - Create Web Service
   - Root Directory: `apps/ml`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **PostgreSQL & Redis:**
   - Create managed services in Render dashboard

**Render provides**: Free tier, automatic SSL

### Option 3: Docker + VPS (DigitalOcean, AWS EC2, etc.)

1. **Setup VPS:**
   ```bash
   # Install Docker & Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Clone and Deploy:**
   ```bash
   git clone https://github.com/yourusername/fasal-rakshak.git
   cd fasal-rakshak
   cp .env.example .env
   # Edit .env with production values
   docker-compose up -d --build
   ```

3. **Setup Nginx Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

4. **SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables Setup

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml.railway.app
```

### Backend (Railway/Render)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret
MINIO_ENDPOINT=your-s3-endpoint
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
ML_SERVICE_URL=https://your-ml-service.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### ML Service
```
# Usually no env vars needed for basic setup
# Add if using Redis for caching
REDIS_URL=redis://host:6379
```

## Database Migration

After deploying backend, run migrations:

```bash
# If using Railway/Render, connect via CLI or use their console
psql $DATABASE_URL -f scripts/init_db.sql

# Or use backend migration script
cd apps/backend
npm run migrate
npm run seed  # Seed demo data
```

## Storage Setup

### Option 1: AWS S3
1. Create S3 bucket
2. Get access keys
3. Update backend env vars:
   ```
   MINIO_ENDPOINT=s3.amazonaws.com
   MINIO_ACCESS_KEY=your-aws-key
   MINIO_SECRET_KEY=your-aws-secret
   MINIO_BUCKET_NAME=fasal-rakshak-uploads
   ```

### Option 2: Cloudflare R2
- Similar to S3, use R2 endpoint

### Option 3: Keep MinIO on VPS
- Deploy MinIO container in docker-compose
- Use VPS IP/domain for endpoint

## Testing Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **Backend Health**: `https://your-backend.railway.app/health`
3. **ML Service**: `https://your-ml.railway.app/health`

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend CORS allows frontend domain
- Check backend is running

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is accessible from backend
- Run migrations

### Image upload fails
- Verify MinIO/S3 credentials
- Check bucket exists and is accessible
- Verify CORS settings on S3 bucket

## Cost Estimate (Free Tier)

- **Vercel**: Free (hobby plan)
- **Railway**: $5/month free credit (usually enough for small apps)
- **Render**: Free tier available
- **Supabase**: Free tier (PostgreSQL)
- **Upstash**: Free tier (Redis)
- **AWS S3**: Free tier (5GB storage)

**Total**: ~$0-5/month for small-scale deployment

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Backup strategy for database
- [ ] Monitoring setup (optional)

## Quick Start Commands

```bash
# Local development
docker-compose up

# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway (after connecting repo)
# Use Railway dashboard or CLI
railway up
```


