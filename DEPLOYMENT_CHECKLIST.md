# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

- [ ] All code pushed to GitHub
- [ ] `.env.example` file is complete and accurate
- [ ] No secrets committed to git (check `.gitignore`)
- [ ] Database migrations are ready
- [ ] Seed script tested locally

## Frontend (Vercel)

- [ ] Repository connected to Vercel
- [ ] Root directory set to `apps/frontend`
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_ML_SERVICE_URL`
- [ ] Build succeeds without errors
- [ ] Custom domain configured (optional)

## Backend (Railway/Render)

- [ ] Service deployed and running
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `REDIS_URL`
  - [ ] `JWT_SECRET` (strong, 32+ chars)
  - [ ] `JWT_REFRESH_SECRET`
  - [ ] `ML_SERVICE_URL`
  - [ ] `FRONTEND_URL` (comma-separated if multiple)
  - [ ] `MINIO_ENDPOINT` / S3 credentials
- [ ] PostgreSQL service added and connected
- [ ] Redis service added and connected
- [ ] Database migrations run
- [ ] Health endpoint working: `/health`
- [ ] CORS configured correctly

## ML Service

- [ ] Service deployed and running
- [ ] Health endpoint working: `/health`
- [ ] Inference endpoint tested: `/infer`
- [ ] Model file uploaded (if using real model)

## Database

- [ ] PostgreSQL instance created
- [ ] Connection string configured
- [ ] Migrations run successfully
- [ ] Demo data seeded (optional)
- [ ] Backup strategy configured

## Storage (S3/MinIO)

- [ ] S3 bucket created (or MinIO configured)
- [ ] CORS configured on bucket
- [ ] Access keys configured in backend
- [ ] Test upload works

## Testing

- [ ] Frontend loads correctly
- [ ] User can register/login
- [ ] Image upload works
- [ ] Disease detection returns results
- [ ] API endpoints respond correctly
- [ ] No CORS errors in browser console

## Security

- [ ] All secrets in environment variables (not in code)
- [ ] JWT secrets are strong and unique
- [ ] CORS only allows trusted domains
- [ ] Rate limiting enabled
- [ ] HTTPS enabled (automatic on Vercel/Railway)

## Monitoring

- [ ] Error logging configured
- [ ] Health checks set up
- [ ] Uptime monitoring (optional)

## Post-Deployment

- [ ] Test complete user flow:
  - [ ] Sign up
  - [ ] Login
  - [ ] Upload scan
  - [ ] View results
  - [ ] View dashboard
- [ ] Check logs for errors
- [ ] Verify all services are running
- [ ] Test on mobile device (if applicable)

## Troubleshooting Common Issues

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend CORS allows frontend domain
- Check backend is running and accessible

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is accessible from backend
- Ensure migrations have run

### Image upload fails
- Check S3/MinIO credentials
- Verify bucket exists and is accessible
- Check CORS settings on storage bucket

### ML service errors
- Verify ML service is running
- Check `ML_SERVICE_URL` is correct
- Test ML service health endpoint directly

---

**Ready to deploy?** Follow [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions.


