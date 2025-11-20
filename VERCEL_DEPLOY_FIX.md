# 🔧 Complete Vercel Deployment Fix

## Issues Fixed

1. ✅ Removed `output: 'standalone'` - Vercel handles this automatically
2. ✅ Fixed i18n to work on both client and server
3. ✅ Simplified next.config.js
4. ✅ Added .vercelignore

## Step-by-Step Fix

### 1. Push These Changes

```bash
git add apps/frontend/next.config.js
git add apps/frontend/lib/i18n.ts
git add apps/frontend/.vercelignore
git commit -m "Fix Vercel deployment - remove standalone output, fix i18n SSR"
git push
```

### 2. Vercel Settings (CRITICAL!)

Go to Vercel Dashboard → Your Project → Settings → General:

**Root Directory**: `apps/frontend` ⚠️ MUST BE SET!

**Build & Development Settings**:
- Framework Preset: Next.js
- Build Command: `npm run build` (or leave empty - auto-detected)
- Output Directory: `.next` (or leave empty - auto-detected)
- Install Command: `npm install` (or leave empty - auto-detected)

### 3. Environment Variables

Go to Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

(Update with your actual backend URLs later)

### 4. Redeploy

After pushing changes:
- Vercel will auto-deploy, OR
- Go to Deployments → Click "Redeploy" on latest

## Common Build Errors & Fixes

### Error: "Cannot find module 'next/app'"
**Fix**: Dependencies not installed
```bash
cd apps/frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Error: "Module not found: Can't resolve '../styles/globals.css'"
**Fix**: Check file exists
```bash
ls apps/frontend/styles/globals.css
```
If missing, create it or fix the import path.

### Error: "Type error: Property 'X' does not exist"
**Fix**: TypeScript errors - check build logs
- Fix TypeScript errors in your code
- Or temporarily set `"strict": false` in tsconfig.json

### Error: Build succeeds but 404 on site
**Fix**: Root Directory not set correctly
- Must be exactly: `apps/frontend`
- Not: `apps/frontend/` (no trailing slash)
- Not: `./apps/frontend`

## Verify Deployment

After deployment:

1. **Check Build Logs**:
   - Should see: "✓ Compiled successfully"
   - Should see: "✓ Linting and checking validity of types"
   - Should see: "✓ Collecting page data"
   - Should see: "✓ Generating static pages"

2. **Check Deployment Status**:
   - Status should be "Ready" (green)
   - Should show deployment URL

3. **Test the Site**:
   - Visit your Vercel URL
   - Should see landing page (not 404)
   - Check browser console for errors

## If Still Not Working

### Option 1: Delete and Recreate

1. Delete project in Vercel
2. Create new project
3. Import same GitHub repo
4. **Set Root Directory to `apps/frontend`** ⚠️
5. Deploy

### Option 2: Check File Structure

Your GitHub repo should have:
```
apps/frontend/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── ...
├── lib/
│   ├── api.ts
│   └── i18n.ts
├── styles/
│   └── globals.css
├── locales/
│   ├── en.json
│   └── hi.json
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

### Option 3: Test Build Locally

```bash
cd apps/frontend
npm install
npm run build
npm start
```

If this works locally but not on Vercel, it's a configuration issue.

## Quick Checklist

- [ ] Root Directory set to `apps/frontend` in Vercel
- [ ] All files committed and pushed to GitHub
- [ ] Build logs show no errors
- [ ] Environment variables set (if needed)
- [ ] Deployment status is "Ready"
- [ ] Site loads without 404

---

**Most Important**: Set Root Directory to `apps/frontend` in Vercel Settings! ⚠️


