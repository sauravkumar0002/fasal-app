# 🔧 Fix 404 Error on Vercel - Step by Step

## Immediate Actions

### Step 1: Check Vercel Root Directory ⚠️ MOST IMPORTANT

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (`fasal-app`)
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. **Set it to**: `apps/frontend` (exactly this, no trailing slash)
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### Step 2: Check Build Logs

1. In Vercel, go to your deployment
2. Click **Build Logs** button (top right)
3. Look for errors like:
   - `Cannot find module`
   - `TypeScript errors`
   - `Build failed`

**Common Build Errors & Fixes:**

```bash
# Error: Cannot find module 'next/app'
# Fix: Dependencies not installed
# Solution: Push package-lock.json to GitHub
```

### Step 3: Verify Files Are Committed

Make sure these files exist in your GitHub repo:

```bash
# Check on GitHub:
apps/frontend/pages/_app.tsx    ✅ Must exist
apps/frontend/pages/index.tsx   ✅ Must exist
apps/frontend/package.json       ✅ Must exist
apps/frontend/next.config.js     ✅ Must exist
```

### Step 4: Push Updated Config

I've updated your `next.config.js` to fix i18n routing issues. Push the changes:

```bash
git add apps/frontend/next.config.js
git add apps/frontend/vercel.json
git commit -m "Fix Vercel deployment config"
git push
```

Vercel will auto-redeploy.

## Configuration Checklist

### ✅ Vercel Project Settings

- [ ] **Root Directory**: `apps/frontend`
- [ ] **Framework Preset**: Next.js
- [ ] **Build Command**: `npm run build` (auto-detected)
- [ ] **Output Directory**: `.next` (auto-detected)
- [ ] **Install Command**: `npm install` (auto-detected)

### ✅ Environment Variables

Add these in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

(Update these later with your actual backend URLs)

## Test Locally First

Before deploying, test the build locally:

```bash
cd apps/frontend
npm install
npm run build
npm start
```

Visit `http://localhost:3000` - if it works locally, the issue is Vercel config.

## If Still 404 After Above Steps

### Option 1: Delete & Recreate Project

1. Delete project in Vercel
2. Create new project
3. Import same GitHub repo
4. **Set Root Directory to `apps/frontend`** (critical!)
5. Deploy

### Option 2: Check Build Output

1. In Vercel Build Logs, look for:
   ```
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ```

2. If you see errors, fix them first.

### Option 3: Check File Structure

Your repo structure should be:
```
your-repo/
├── apps/
│   └── frontend/
│       ├── pages/
│       │   ├── _app.tsx
│       │   └── index.tsx
│       ├── package.json
│       └── next.config.js
```

**NOT:**
```
your-repo/
└── apps/
    └── frontend/
        └── frontend/  ← Wrong! Nested folder
```

## Quick Diagnostic Commands

Run these to check your setup:

```bash
# 1. Check if pages exist
ls apps/frontend/pages/

# 2. Check package.json
cat apps/frontend/package.json | grep "next"

# 3. Test build
cd apps/frontend && npm run build
```

## Expected Result

After fixing:
- ✅ Vercel build succeeds
- ✅ Deployment shows "Ready" (green)
- ✅ Visiting your URL shows the landing page
- ✅ No 404 errors

## Still Stuck?

1. **Share Build Logs**: Copy the full build log from Vercel
2. **Check GitHub**: Verify files are in the repo
3. **Test Locally**: If local build works, it's a Vercel config issue

---

**Most Common Issue**: Root Directory not set to `apps/frontend` in Vercel settings! ⚠️


