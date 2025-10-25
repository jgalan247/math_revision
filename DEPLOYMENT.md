# Deployment Guide - DigitalOcean App Platform

## ✅ Production Readiness Status

Your Math Revision Platform is **READY FOR PRODUCTION** deployment to DigitalOcean App Platform.

---

## 📋 Pre-Deployment Checklist

✅ **No hardcoded localhost URLs** - All URLs are relative
✅ **No API keys or secrets** - Fully static application
✅ **CDN-based dependencies** - All libraries loaded from CDN
✅ **Static site compatible** - No server-side processing required
✅ **Git repository configured** - Already pushed to GitHub
✅ **DigitalOcean config created** - `.do/app.yaml` ready

---

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

**Using the App Spec File (.do/app.yaml):**

1. **Go to DigitalOcean Dashboard**
   - Navigate to: https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create App"
   - Select "Import from existing repository"

3. **Connect GitHub Repository**
   - Authorize DigitalOcean to access your GitHub
   - Select repository: `jgalan247/math_revision`
   - Select branch: `main`
   - ✅ Check "Autodeploy" to deploy on every push

4. **Configure App**
   - DigitalOcean will detect `.do/app.yaml` automatically
   - Review the configuration:
     - **App Name:** math-revision-platform
     - **Region:** London (lon) - Change if needed
     - **Type:** Static Site
     - **Source Directory:** /
     - **Output Directory:** /

5. **Review & Deploy**
   - Review plan (Static sites are FREE on DO App Platform)
   - Click "Create Resources"
   - Wait 2-3 minutes for deployment

6. **Get Your URL**
   - DigitalOcean will provide a URL like:
   - `https://math-revision-platform-xxxxx.ondigitalocean.app`

---

### Method 2: Manual Configuration

If you prefer manual setup:

1. **Create App from GitHub**
   - Go to DigitalOcean Apps
   - Click "Create App"
   - Select "GitHub" as source

2. **Repository Settings**
   - Repository: `jgalan247/math_revision`
   - Branch: `main`
   - Source Directory: `/` (root)
   - Autodeploy: ✅ Enabled

3. **Configure Static Site**
   - Type: `Static Site`
   - Name: `math-revision-web`
   - Build Command: Leave empty (no build needed)
   - Output Directory: `/`

4. **Environment Settings**
   - No environment variables needed
   - HTTP Port: 80 (default)
   - HTTP Routes: Default (/)

5. **Choose Plan**
   - Static sites: **FREE** (3 static sites included)
   - Or: Starter Plan ($5/month) for more sites

6. **Launch**
   - Click "Create Resources"
   - Wait for deployment

---

## 🔧 Configuration Files

### .do/app.yaml
```yaml
name: math-revision-platform
region: lon
static_sites:
  - name: math-revision-web
    github:
      repo: jgalan247/math_revision
      branch: main
      deploy_on_push: true
    build_command: echo "No build required - static site"
    output_dir: /
    index_document: index.html
    error_document: index.html
    routes:
      - path: /
    environment_slug: html
    catchall_document: index.html
```

**What this does:**
- Deploys from your GitHub repository
- Auto-deploys on every push to `main`
- Serves all files from the root directory
- Uses `index.html` as the homepage
- Region: London (you can change this)

### .doignore (Optional)
Excludes development files from deployment:
- `.git`, `.claude` directories
- Markdown documentation files
- Test/debug HTML files

---

## 🌍 Regions Available

Change the `region` in `.do/app.yaml` if needed:

- `nyc` - New York City, USA
- `sfo` - San Francisco, USA
- `ams` - Amsterdam, Netherlands
- `sgp` - Singapore
- `lon` - London, UK (currently configured)
- `fra` - Frankfurt, Germany
- `tor` - Toronto, Canada
- `blr` - Bangalore, India
- `syd` - Sydney, Australia

---

## 💰 Pricing

**Static Sites on DigitalOcean App Platform:**
- **Starter Plan:** FREE (3 static sites, 1GB bandwidth)
- **Basic Plan:** $5/month (Unlimited static sites, 100GB bandwidth)
- **Professional:** $12/month (Custom domains, more bandwidth)

**For your math platform:**
- ✅ **Start with FREE tier** - Perfect for testing and moderate use
- If you exceed bandwidth, upgrade to Basic ($5/month)

---

## 🔄 Continuous Deployment

With autodeploy enabled, every time you push to GitHub:

```bash
git add .
git commit -m "Update worksheet content"
git push origin main
```

**DigitalOcean will automatically:**
1. Detect the push
2. Pull the latest code
3. Deploy the updated site
4. Usually completes in 1-2 minutes

---

## 🌐 Custom Domain Setup

After deployment, you can add a custom domain:

1. **In DigitalOcean Dashboard:**
   - Go to your app
   - Click "Settings" → "Domains"
   - Click "Add Domain"

2. **Enter your domain:**
   - Example: `mathrevision.com`
   - DigitalOcean will provide DNS records

3. **Update DNS:**
   - Add the CNAME or A records to your domain registrar
   - Wait for DNS propagation (5-60 minutes)

4. **SSL Certificate:**
   - ✅ Automatic - DigitalOcean provisions Let's Encrypt SSL
   - Your site will be available at `https://yourdomain.com`

---

## 🔍 Post-Deployment Verification

After deployment, test these URLs:

1. **Homepage:**
   ```
   https://your-app-url.ondigitalocean.app/
   ```

2. **Enhanced Worksheet:**
   ```
   https://your-app-url.ondigitalocean.app/worksheet.html?id=quadratic-equations-compute-demo
   ```

3. **Quadratic Plotter:**
   ```
   https://your-app-url.ondigitalocean.app/quadratic-demo.html
   ```

4. **Prompt Builder:**
   ```
   https://your-app-url.ondigitalocean.app/prompt-builder.html
   ```

### Expected Behavior:
- ✅ All CDN resources load (Tailwind, KaTeX, MathLive)
- ✅ Worksheets load from `/worksheets/*.json`
- ✅ MathLive keyboards work
- ✅ Answer checking works
- ✅ Progress tracking works
- ✅ No console errors

---

## 🐛 Troubleshooting

### Issue: App fails to deploy

**Check:**
- Repository access: DigitalOcean has permission to read repo
- Branch name: Ensure `main` branch exists
- File structure: `index.html` is in root directory

**Fix:**
- Go to App Settings → Source
- Verify repository and branch
- Manually trigger a deploy

### Issue: 404 errors for worksheets

**Cause:** `/worksheets/*.json` files not found

**Fix:**
- Ensure `worksheets/` directory is in root
- Check `.doignore` doesn't exclude JSON files
- Verify files are committed to Git

### Issue: MathLive keyboard not loading

**Cause:** CDN blocked or slow

**Check:**
- Open browser console (F12)
- Look for failed requests to `unpkg.com`
- Check browser compatibility

**Fix:**
- Usually resolves itself (CDN caching)
- Try different browser
- Clear browser cache

### Issue: Styles not loading

**Check:**
- `css/worksheet.css` exists and is committed
- Tailwind CDN is loading
- No CORS errors in console

---

## 📊 Monitoring

**DigitalOcean provides:**
- ✅ Deployment logs
- ✅ Build logs
- ✅ Runtime metrics
- ✅ Bandwidth usage

**Access monitoring:**
1. Go to your app in DO dashboard
2. Click "Insights" tab
3. View metrics and logs

---

## 🔐 Security

Your app is secure for production:

✅ **HTTPS by default** - DigitalOcean provides SSL
✅ **No server-side code** - Fully static, no attack surface
✅ **No secrets** - No API keys or credentials
✅ **CDN dependencies** - Trusted sources (Tailwind, KaTeX, MathLive)
✅ **No user data storage** - All processing client-side

**Additional security (optional):**
- Enable "Force HTTPS" in DO settings
- Add Content Security Policy headers
- Enable CORS if needed for future API integration

---

## 🚀 Quick Deployment Steps

**TL;DR:**

1. **Push latest code to GitHub** (already done ✅)
   ```bash
   git push origin main
   ```

2. **Go to DigitalOcean:**
   - https://cloud.digitalocean.com/apps
   - Click "Create App"

3. **Connect repository:**
   - Select `jgalan247/math_revision`
   - Branch: `main`
   - Enable autodeploy ✅

4. **Let DigitalOcean detect `.do/app.yaml`**
   - Review settings
   - Click "Create Resources"

5. **Wait 2-3 minutes** ⏱️
   - Deployment completes
   - Get your URL

6. **Test your app** 🎉
   - Visit the provided URL
   - Test the workflow
   - Everything should work!

---

## 📝 Next Steps After Deployment

1. **Test thoroughly:**
   - Try all worksheet types
   - Test MathLive keyboards
   - Verify answer checking
   - Test on mobile devices

2. **Monitor usage:**
   - Check bandwidth in DO dashboard
   - Monitor for errors in logs

3. **Add custom domain** (optional):
   - Point your domain to DO app
   - SSL automatically configured

4. **Share with students:**
   - Your platform is live!
   - Fully functional and ready to use

---

## 🆘 Support

**DigitalOcean Documentation:**
- https://docs.digitalocean.com/products/app-platform/

**Your App Configuration:**
- Location: `.do/app.yaml`
- Type: Static Site
- Cost: FREE (Starter tier)

**Common Commands:**

```bash
# Update and redeploy
git add .
git commit -m "Update content"
git push origin main

# Check deployment status
# (Use DigitalOcean dashboard)

# View logs
# (Use DigitalOcean dashboard → App → Logs)
```

---

## ✅ Production Readiness Summary

**Your app is production-ready:**
- ✅ No hardcoded URLs
- ✅ No secrets or API keys
- ✅ All dependencies are CDN-based
- ✅ Static site (no server required)
- ✅ Git repository configured
- ✅ DigitalOcean config created
- ✅ Documentation complete
- ✅ All features tested locally

**Deployment Time:** ~3 minutes
**Cost:** FREE (Starter tier)
**Maintenance:** Automatic deploys on push

---

**Ready to deploy? Follow the Quick Deployment Steps above!** 🚀

---

**Deployment Date:** 2025-10-24
**Platform:** DigitalOcean App Platform
**Status:** ✅ READY FOR PRODUCTION
