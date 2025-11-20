# Fixing 404 Error on Vercel

## Common Causes & Solutions

### 1. ✅ Root Directory Not Set
**Problem**: Vercel is looking in the wrong directory.

**Solution**: 
- Go to Vercel Dashboard → Your Project → Settings → General
- Set **Root Directory** to `apps/frontend`
- Save and redeploy

### 2. ✅ Build Errors
**Problem**: Build is failing silently.

**Solution**:
- Check **Build Logs** in Vercel dashboard
- Look for TypeScript errors or missing dependencies
- Common issues:
  - Missing `node_modules` (run `npm install` locally first)
  - TypeScript errors
  - Missing environment variables

### 3. ✅ i18n Routing Issue
**Problem**: Next.js i18n config causing routing problems.

**Solution**: I've temporarily disabled i18n routing in `next.config.js`. 
- The app will work without locale prefixes
- Language switching still works via react-i18next

### 4. ✅ Missing Dependencies
**Problem**: Some packages not installed.

**Solution**: 
```bash
cd apps/frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### 5. ✅ Environment Variables
**Problem**: Missing env vars causing runtime errors.

**Solution**: Add in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

## Quick Fix Steps

1. **Update Vercel Settings:**
   - Root Directory: `apps/frontend`
   - Framework: Next.js (auto-detected)

2. **Check Build Logs:**
   - Go to Deployment → Build Logs
   - Look for errors
   - Fix any TypeScript/build errors

3. **Redeploy:**
   - Push a new commit, OR
   - Click "Redeploy" in Vercel dashboard

4. **Test:**
   - Visit your Vercel URL
   - Should see the landing page

## If Still Getting 404

1. **Check if pages exist:**
   ```bash
   ls apps/frontend/pages/
   ```
   Should see: `index.tsx`, `_app.tsx`, `login.tsx`, etc.

2. **Test build locally:**
   ```bash
   cd apps/frontend
   npm install
   npm run build
   npm start
   ```
   If this works locally, the issue is Vercel config.

3. **Check Vercel Build Logs:**
   - Look for "Build Completed" message
   - Check for any warnings or errors
   - Verify output directory is `.next`

4. **Verify Root Directory:**
   - In Vercel: Settings → General → Root Directory
   - Must be exactly: `apps/frontend`
   - Not: `apps/frontend/` (no trailing slash)

## Expected File Structure

```
apps/frontend/
├── pages/
│   ├── _app.tsx      ← Must exist
│   ├── index.tsx     ← Must exist
│   ├── login.tsx
│   └── ...
├── package.json      ← Must exist
├── next.config.js    ← Must exist
└── tsconfig.json
```

## Still Not Working?

1. **Delete and Recreate Project:**
   - Delete project in Vercel
   - Create new project
   - Import same GitHub repo
   - Set root to `apps/frontend`

2. **Check GitHub Repository:**
   - Ensure all files are committed
   - Verify `apps/frontend/pages/index.tsx` exists in repo

3. **Contact Support:**
   - Share build logs
   - Share your repository structure


