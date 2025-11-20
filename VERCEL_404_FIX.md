# 🔧 Fix 404 Error on Vercel - Build Succeeds but Site Shows 404

## Problem
- ✅ Build completes successfully
- ✅ Deployment completes
- ❌ Site shows "404: NOT FOUND"

## Root Cause
Vercel is not finding the Next.js pages. This usually means:
1. **Root Directory not set correctly** in Vercel settings
2. Build output is in wrong location
3. Vercel is looking in the wrong directory

## Solution

### Step 1: Remove vercel.json (Let Vercel Auto-Detect)

I've removed `apps/frontend/vercel.json` - Vercel will auto-detect Next.js better without it.

### Step 2: CRITICAL - Set Root Directory in Vercel

**This is the most important step:**

1. Go to **Vercel Dashboard** → Your Project (`fasal-app`)
2. Click **Settings** (gear icon)
3. Go to **General** tab
4. Scroll to **Root Directory**
5. **Set it to**: `apps/frontend` (exactly this, no trailing slash)
6. Click **Save**

### Step 3: Verify Build Settings

In the same Settings → General page, check:

- **Framework Preset**: Should be "Next.js" (auto-detected)
- **Build Command**: Leave empty (auto-detected) OR set to `npm run build`
- **Output Directory**: Leave empty (auto-detected) OR set to `.next`
- **Install Command**: Leave empty (auto-detected) OR set to `npm install`

### Step 4: Push Changes and Redeploy

```bash
git add .
git commit -m "Remove vercel.json, let Vercel auto-detect"
git push
```

Or manually redeploy:
- Go to **Deployments** tab
- Click **⋯** (three dots) on latest deployment
- Click **Redeploy**

## Alternative: If Root Directory Doesn't Work

### Option 1: Move Frontend to Root

If Vercel keeps having issues, you can temporarily move frontend to root:

```bash
# Backup current structure
# Then move files
mv apps/frontend/* .
mv apps/frontend/.* . 2>/dev/null || true
```

But this is not recommended - better to fix Root Directory setting.

### Option 2: Use Project Settings

1. In Vercel, go to **Settings** → **General**
2. Under **Build & Development Settings**:
   - **Root Directory**: `apps/frontend`
   - **Framework Preset**: Next.js
   - **Override**: Check this and manually set:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

## Verify File Structure

Your GitHub repo should have this structure:

```
your-repo/
├── apps/
│   └── frontend/
│       ├── pages/
│       │   ├── _app.tsx      ← Must exist
│       │   ├── index.tsx     ← Must exist (homepage)
│       │   ├── login.tsx
│       │   └── ...
│       ├── package.json      ← Must exist
│       ├── next.config.js    ← Must exist
│       └── tsconfig.json
```

## Test Locally First

Before deploying, test locally:

```bash
cd apps/frontend
npm install
npm run build
npm start
```

Visit `http://localhost:3000` - should see the landing page.

If local works but Vercel doesn't, it's definitely the Root Directory setting.

## Expected Result After Fix

After setting Root Directory to `apps/frontend`:

1. ✅ Build completes
2. ✅ Deployment completes  
3. ✅ Visiting your URL shows the landing page (not 404)
4. ✅ Navigation works

## Still Getting 404?

1. **Double-check Root Directory**: Must be exactly `apps/frontend` (case-sensitive)
2. **Check Build Logs**: Look for "✓ Generating static pages" - should list your pages
3. **Verify pages exist**: Check GitHub repo has `apps/frontend/pages/index.tsx`
4. **Try deleting and recreating project** in Vercel with correct Root Directory from start

---

**Most Important**: Set Root Directory to `apps/frontend` in Vercel Settings! ⚠️

This is 99% of the time the issue when build succeeds but site shows 404.

