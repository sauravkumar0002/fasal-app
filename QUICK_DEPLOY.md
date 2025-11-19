# Quick Deploy Guide - GitHub + Vercel

## Step-by-Step: Deploy Frontend to Vercel

### 1. Push Code to GitHub

```bash
# If you haven't initialized git yet
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Fasal Rakshak"

# Create a new repository on GitHub (github.com/new)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/fasal-rakshak.git
git branch -M main
git push -u origin main
```

### 2. Deploy Frontend to Vercel

1. **Sign up/Login** at [vercel.com](https://vercel.com) (use GitHub account)

2. **Click "Add New Project"**

3. **Import your GitHub repository** (select `fasal-rakshak`)

4. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" and set to `apps/frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Environment Variables** (click "Environment Variables"):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-url.railway.app
   ```
   ⚠️ **Note**: You'll need to deploy backend first to get these URLs

6. **Click "Deploy"**

✅ Your frontend will be live at `https://your-project.vercel.app`

### 3. Deploy Backend (Railway - Easiest)

1. **Sign up** at [railway.app](https://railway.app) (use GitHub)

2. **New Project** → **Deploy from GitHub repo**

3. **Select your repository**

4. **Add Service** → **Select `apps/backend` folder**

5. **Environment Variables** (add from `.env.example`):
   ```
   DATABASE_URL=postgresql://... (Railway will provide PostgreSQL)
   REDIS_URL=redis://... (Add Redis service in Railway)
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret
   ML_SERVICE_URL=https://your-ml-service.railway.app
   FRONTEND_URL=https://your-frontend.vercel.app
   MINIO_ENDPOINT=your-s3-endpoint
   MINIO_ACCESS_KEY=your-key
   MINIO_SECRET_KEY=your-secret
   ```

6. **Add PostgreSQL Service:**
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway provides `DATABASE_URL` automatically

7. **Add Redis Service:**
   - Click "+ New" → "Database" → "Redis"
   - Railway provides `REDIS_URL` automatically

8. **Deploy** - Railway auto-deploys on git push

### 4. Deploy ML Service (Railway)

1. **In same Railway project**, click "+ New" → "GitHub Repo"

2. **Select same repo**, but set **Root Directory** to `apps/ml`

3. **Environment Variables** (usually none needed for basic setup)

4. **Deploy** - Railway auto-detects Python and deploys

### 5. Update Frontend Environment Variables

1. Go back to **Vercel** → Your project → Settings → Environment Variables

2. Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml.railway.app
   ```

3. **Redeploy** (Vercel will auto-redeploy or click "Redeploy")

### 6. Run Database Migrations

```bash
# Option 1: Use Railway CLI
railway connect
psql -f scripts/init_db.sql

# Option 2: Use Railway web console
# Go to PostgreSQL service → Connect → Run SQL
# Copy contents of scripts/init_db.sql and run

# Option 3: Use backend migration (if you add migration script)
railway run npm run migrate
railway run npm run seed
```

## Testing Your Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **Backend Health**: `https://your-backend.railway.app/health`
3. **ML Service**: `https://your-ml.railway.app/health`

## Troubleshooting

### Frontend shows errors
- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS allows your Vercel domain

### Backend connection fails
- Verify `DATABASE_URL` is set correctly
- Check Railway logs for errors
- Ensure PostgreSQL service is running

### Image upload doesn't work
- Verify MinIO/S3 credentials
- For production, use AWS S3 or Cloudflare R2 instead of MinIO

## Cost

- **Vercel**: Free (hobby plan)
- **Railway**: $5/month free credit (usually enough)
- **Total**: ~$0/month for small apps

## Next Steps

- Set up custom domain (optional)
- Configure production environment variables
- Set up monitoring
- Review security settings

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.


