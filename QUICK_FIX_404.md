# ⚡ Quick Fix for 404 Error

## The Problem
Build succeeds ✅ but site shows 404 ❌

## The Solution (2 Steps)

### Step 1: Set Root Directory in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **fasal-app**
3. Click **Settings** (⚙️ icon)
4. Click **General** tab
5. Scroll down to **Root Directory**
6. **Click "Edit"** and set it to: `apps/frontend`
7. Click **Save**

### Step 2: Redeploy

After saving:
- Go to **Deployments** tab
- Click **⋯** (three dots) on the latest deployment
- Click **Redeploy**

OR push a new commit:
```bash
git add .
git commit -m "Fix: Remove vercel.json for auto-detection"
git push
```

## That's It!

After setting Root Directory to `apps/frontend` and redeploying, your site should work!

---

**Why this fixes it:**
- Vercel was looking in the root directory (`/`)
- But your Next.js app is in `apps/frontend/`
- Setting Root Directory tells Vercel where to find your app

