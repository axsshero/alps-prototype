# GitHub Pages Setup Guide for ALPS Project

This guide explains how to deploy your ALPS prototype to GitHub Pages at the root URL (without `/project/` in the path).

## 🚀 Quick Setup (Automated Deployment)

Your repository is already configured with a GitHub Actions workflow that automatically deploys the ALPS app from the `project/` folder to the root URL.

### Step 1: Enable GitHub Pages with GitHub Actions

1. Go to your GitHub repository: `https://github.com/axsshero/alps-prototype`
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select: **GitHub Actions**
4. Click **Save** (if needed)

That's it! The workflow will automatically deploy on every push to `main`.

### Step 2: Access Your Site

Your site will be available at:
```
https://axsshero.github.io/alps-prototype/
```

**No `/project/` path needed!** The workflow automatically:
- Copies all files from `project/` folder
- Renames `alps-prototype.html` to `index.html`
- Deploys to the root URL

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Look for the "Deploy ALPS to GitHub Pages" workflow
3. Wait for it to complete (green checkmark) — usually takes 1-2 minutes
4. Visit your site!

---

## 🔧 How It Works

### The Workflow (`.github/workflows/jekyll-docker.yml`)

```yaml
name: Deploy ALPS to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  deploy:
    steps:
    - name: Prepare deployment files
      run: |
        mkdir -p _deploy
        cp -r project/* _deploy/
        # Rename alps-prototype.html to index.html
        mv _deploy/alps-prototype.html _deploy/index.html
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './_deploy'
    
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
```

### What Gets Deployed

```
https://axsshero.github.io/alps-prototype/
├── index.html              (renamed from alps-prototype.html)
├── Progress.html
├── data.jsx
├── utils.jsx
├── primitives.jsx
├── app.jsx
├── screen-*.jsx
├── tweaks-panel.jsx
├── tweaks.jsx
└── uploads/
    └── *.png
```

---

## 🔄 Making Updates

Every time you push to `main`, the workflow automatically redeploys:

```bash
# Make your changes
git add .
git commit -m "Update ALPS app"
git push

# Wait 1-2 minutes, then visit:
# https://axsshero.github.io/alps-prototype/
```

---

## 🐛 Troubleshooting

### Issue: Still seeing `/project/` in the URL

**Cause**: GitHub Pages is set to "Deploy from a branch" instead of "GitHub Actions"

**Fix**:
1. Go to **Settings** → **Pages**
2. Change **Source** to: **GitHub Actions**
3. Push a new commit to trigger redeployment

### Issue: 404 Not Found

**Cause**: Workflow hasn't run yet or failed

**Fix**:
1. Check the **Actions** tab for errors
2. Manually trigger the workflow:
   - Go to **Actions** → "Deploy ALPS to GitHub Pages"
   - Click **Run workflow** → **Run workflow**
3. Wait for completion and refresh your browser

### Issue: Changes Not Appearing

**Cause**: Browser cache or GitHub Pages CDN cache

**Fix**:
1. Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
2. Wait 1-2 minutes for CDN cache to clear
3. Try incognito/private browsing mode
4. Check the **Actions** tab to confirm deployment completed

### Issue: Styles/Scripts Not Loading

**Cause**: Absolute paths in HTML files

**Fix**: Ensure all paths in `project/*.html` files are relative:
```html
<!-- ✅ Good (relative paths) -->
<script src="data.jsx"></script>
<script src="utils.jsx"></script>

<!-- ❌ Bad (absolute paths won't work) -->
<script src="/data.jsx"></script>
<script src="/project/data.jsx"></script>
```

### Issue: Progress.html Can't Navigate Back

**Cause**: Hardcoded path to `alps-prototype.html`

**Fix**: Update `project/Progress.html` to link to `index.html`:
```html
<!-- Change from: -->
<a href="alps-prototype.html">← Back to Dashboard</a>

<!-- To: -->
<a href="index.html">← Back to Dashboard</a>
```

---

## 📱 Testing Locally Before Deployment

### Using Python (simplest)
```bash
cd project
python3 -m http.server 8000
# Visit http://localhost:8000/alps-prototype.html
```

### Using Docker (matches production nginx setup)
```bash
docker-compose up
# Visit http://localhost:8080
```

### Using Node.js
```bash
npx serve project -p 8000
# Visit http://localhost:8000/alps-prototype.html
```

---

## 🔒 Security Considerations

- GitHub Pages serves everything as **public** — don't commit secrets
- All files in `/project` will be publicly accessible
- Consider adding `.gitignore` for sensitive files:
  ```
  .env
  .env.local
  *.key
  *.pem
  ```

---

## 🌐 Custom Domain (Optional)

To use a custom domain like `alps.yourdomain.com`:

### Step 1: Add CNAME File

Create `project/CNAME` (no extension):
```
alps.yourdomain.com
```

### Step 2: Configure DNS

In your DNS provider, add a CNAME record:
```
Type: CNAME
Name: alps
Value: axsshero.github.io
TTL: 3600
```

### Step 3: Enable in GitHub

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter: `alps.yourdomain.com`
3. Click **Save**
4. Wait for DNS check to complete (can take up to 24 hours)
5. Enable **Enforce HTTPS** once DNS is verified

---

## 📊 Workflow Status Badge (Optional)

Add a status badge to your README:

```markdown
[![Deploy to GitHub Pages](https://github.com/axsshero/alps-prototype/actions/workflows/jekyll-docker.yml/badge.svg)](https://github.com/axsshero/alps-prototype/actions/workflows/jekyll-docker.yml)
```

---

## 🎯 URL Structure

| Page | URL |
|------|-----|
| Main App | `https://axsshero.github.io/alps-prototype/` |
| Progress Page | `https://axsshero.github.io/alps-prototype/Progress.html` |
| Direct Access | `https://axsshero.github.io/alps-prototype/index.html` |

---

## ✅ Checklist

- [x] GitHub Actions workflow configured (`.github/workflows/jekyll-docker.yml`)
- [x] GitHub Pages source set to "GitHub Actions"
- [x] Workflow automatically renames `alps-prototype.html` → `index.html`
- [x] All files deployed to root URL (no `/project/` path)
- [x] Site accessible at `https://axsshero.github.io/alps-prototype/`

---

## 🆘 Need Help?

1. Check the **Actions** tab for workflow logs
2. Verify **Settings** → **Pages** is set to "GitHub Actions"
3. Try manually triggering the workflow
4. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
5. Check that all file paths in HTML are relative (no leading `/`)

Your ALPS prototype should now be live and accessible without the `/project/` path! 🎉
