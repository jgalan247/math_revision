# Deployment Troubleshooting - "Can't find the server"

## Issue: https://shark-app-qevfv.ondigitalocean.app shows "Can't find the server"

This error means the app deployment has an issue. Let's fix it step by step.

---

## 🔍 Common Causes

1. **App is still deploying** (most common)
2. **Deployment failed**
3. **App configuration issue**
4. **DNS propagation delay** (rare)

---

## ✅ Solution Steps

### Step 1: Check Deployment Status

1. **Go to DigitalOcean Dashboard:**
   ```
   https://cloud.digitalocean.com/apps
   ```

2. **Click on your app** (shark-app-qevfv)

3. **Check the "Activity" or "Deployments" tab:**
   - ✅ **Green checkmark** = Deployed successfully
   - 🔄 **Spinning icon** = Still deploying (wait 2-5 minutes)
   - ❌ **Red X** = Deployment failed (see logs)

---

### Step 2: Check Build Logs

If deployment failed:

1. Click on the **failed deployment**
2. Click **"View Logs"** or **"Build Logs"**
3. Look for error messages

**Common errors:**

#### Error: "No index.html found"
**Fix:** The app is looking in wrong directory

**Solution in DigitalOcean Dashboard:**
1. Go to **Settings** → **Components**
2. Click on your static site component
3. **Source Directory:** Should be `/` (root)
4. Click **"Save"**
5. Click **"Deploy"** at top

#### Error: "Build failed"
**Fix:** Remove build command (static sites don't need building)

**Solution in DigitalOcean Dashboard:**
1. Go to **Settings** → **Components**
2. Click on your static site component
3. **Build Command:** Leave it EMPTY or remove it
4. Click **"Save"**
5. Manually trigger redeploy

---

### Step 3: Verify App Configuration

**In DigitalOcean Dashboard → Settings → Components:**

Your static site should have:
- **Name:** math-revision-web (or any name)
- **Source Directory:** `/`
- **Build Command:** EMPTY (leave blank)
- **Output Directory:** EMPTY (leave blank for static sites)
- **Environment:** HTML (or Auto)

**If these are different, update them and redeploy.**

---

### Step 4: Manual Fix via Dashboard

If the app.yaml isn't working, configure manually:

1. **Go to your app in DigitalOcean**
2. **Settings → Components**
3. **Edit the static site component:**

   ```
   Type: Static Site
   Source: GitHub (jgalan247/math_revision, main branch)
   Source Directory: /
   Build Command: [LEAVE EMPTY]
   Output Directory: [LEAVE EMPTY]

   HTTP Routes:
   Path: /

   Environment:
   No environment variables needed
   ```

4. **Save and redeploy**

---

### Step 5: Alternative - Recreate App

If nothing works, recreate the app from scratch:

1. **Delete current app** (in DigitalOcean dashboard)

2. **Create new app:**
   - Click "Create App"
   - Source: GitHub → `jgalan247/math_revision`
   - Branch: `main`
   - **DO NOT use app.yaml for now**

3. **Configure manually:**
   - Type: **Static Site**
   - Source Directory: `/`
   - Build Command: **[LEAVE EMPTY]**
   - Output Directory: **[LEAVE EMPTY]**

4. **Deploy**

---

## 🎯 Quick Fix Configuration

### Correct DigitalOcean Settings for Static Site:

```yaml
Component Type: Static Site
Repository: jgalan247/math_revision
Branch: main
Source Directory: /
Build Command: (empty)
Output Directory: (empty)
Index Document: index.html
Error Document: index.html
```

**That's it!** No build process needed.

---

## 🔄 After Fixing

Once configured correctly:

1. **Trigger manual deploy:**
   - Top right → "Deploy" button
   - Or push a change to GitHub

2. **Wait 2-3 minutes**

3. **Check your URL:**
   ```
   https://shark-app-qevfv.ondigitalocean.app
   ```

4. **Should see:** Your index.html page with worksheet list

---

## 🧪 Test These URLs After Deployment

```
Homepage:
https://shark-app-qevfv.ondigitalocean.app/

Worksheet:
https://shark-app-qevfv.ondigitalocean.app/worksheet.html?id=quadratic-equations-compute-demo

Quadratic Plotter:
https://shark-app-qevfv.ondigitalocean.app/quadratic-demo.html
```

---

## 🐛 Still Not Working?

### Check These:

1. **Repository Access:**
   - DigitalOcean has permission to read your GitHub repo
   - Repo is public OR DigitalOcean GitHub app is authorized

2. **Branch Name:**
   - Using `main` branch (not `master`)
   - Branch exists and has code

3. **Files in Root:**
   - `index.html` is in root directory (not in subfolder)
   - Check GitHub: https://github.com/jgalan247/math_revision

4. **App Status:**
   - App isn't paused or stopped
   - Deployment completed (not stuck)

---

## 💡 Most Likely Issue

**The app.yaml configuration had an issue.**

**Quick fix in DigitalOcean Dashboard:**

1. Go to **Settings** → **App Spec**
2. **Delete or edit the app spec**
3. **OR** go to Settings → Components and manually configure:
   - Source Directory: `/`
   - Build Command: (empty)
   - Output Directory: (empty)

4. **Click Deploy**

---

## 📋 Expected Deployment Logs

Successful deployment should show:

```
Cloning repository...
✓ Repository cloned
✓ Using source directory: /
✓ No build required (static site)
✓ Deploying files...
✓ Deployment successful
✓ App is live at https://shark-app-qevfv.ondigitalocean.app
```

If you see errors, **copy the error message** and we can fix it.

---

## 🔧 Updated App Configuration

I've updated the `.do/app.yaml` file to fix the issue:

**Changes made:**
- Removed `build_command` (not needed for static sites)
- Changed `output_dir: /` to `source_dir: /`
- Simplified configuration

**Next step:**
```bash
git add .do/app.yaml
git commit -m "fix: Update DigitalOcean app configuration"
git push origin main
```

This will trigger a new deployment with correct settings.

---

## ⚡ Fastest Fix

**Option 1: Push Updated Config**
```bash
# I'll commit the fixed app.yaml
git push origin main
# Wait 2-3 minutes for auto-deploy
```

**Option 2: Manual Dashboard Fix**
1. Go to DigitalOcean → Your App → Settings → Components
2. Edit static site component
3. Set:
   - Source Directory: `/`
   - Build Command: (delete/leave empty)
   - Output Directory: (delete/leave empty)
4. Save & Deploy

**Option 3: Recreate App**
- Delete current app
- Create new app with manual configuration (no app.yaml)

---

## 📞 Need More Help?

**Check DigitalOcean logs:**
1. App Dashboard → "Runtime Logs" tab
2. App Dashboard → "Build Logs" tab
3. Look for specific error messages

**Common error solutions:**
- "No index.html" → Wrong source directory
- "Build failed" → Remove build command
- "404 on all pages" → Wrong output directory
- "Can't connect" → Still deploying or failed

---

## ✅ Success Criteria

You'll know it's working when:
- URL loads without error
- Shows your index.html homepage
- Can navigate to worksheets
- No console errors (F12)

---

**Next: I'll commit the fixed configuration and you can either wait for auto-deploy or manually trigger deployment in DigitalOcean dashboard.**
