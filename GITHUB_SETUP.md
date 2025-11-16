# GitHub Repository Setup Guide

Follow these steps to push your Onebox Email Aggregator to GitHub.

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `onebox-email-aggregator` (or your preferred name)
3. Description: `Full-stack email aggregation system with AI classification and RAG-powered reply suggestions`
4. Visibility: Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

---

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these instead (already run locally):

### Option A: If repository is empty (recommended)

```powershell
# Already initialized and committed locally
# Just add remote and push:

git remote add origin https://github.com/YOUR_USERNAME/onebox-email-aggregator.git
git branch -M main
git push -u origin main
```

### Option B: If you already have a remote

```powershell
# Remove old remote (if exists)
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/onebox-email-aggregator.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 3: Verify Push

After pushing, verify:

1. Go to your GitHub repository page
2. You should see all files:
   - ✅ backend/
   - ✅ frontend/
   - ✅ docker-compose.yml
   - ✅ README.md
   - ✅ All other files

---

## Step 4: Add Repository Badges (Optional)

Add these to your README.md for a professional look:

```markdown
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/onebox-email-aggregator)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/onebox-email-aggregator)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/onebox-email-aggregator)
```

---

## Important Notes

### ⚠️ Files NOT pushed to GitHub:
- `.env` - Contains sensitive credentials (already in .gitignore)
- `node_modules/` - Dependencies (install with `npm install`)
- `dist/` - Build outputs (generated files)

### ✅ Files pushed to GitHub:
- All source code
- Configuration files
- Documentation
- Docker Compose config

---

## After Pushing

### Clone on another machine:
```bash
git clone https://github.com/YOUR_USERNAME/onebox-email-aggregator.git
cd onebox-email-aggregator
```

### Setup:
```bash
# Create .env file (copy from ENV_SETUP.md)
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
# Start Docker
docker-compose up -d
```

---

## Troubleshooting

### Authentication Error
If you get authentication errors, use:
1. **Personal Access Token** (recommended):
   - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Use token as password when pushing

2. **SSH** (alternative):
   ```powershell
   git remote set-url origin git@github.com:YOUR_USERNAME/onebox-email-aggregator.git
   ```

### Large Files
If files are too large:
```powershell
# Check file sizes
git ls-files -z | xargs -0 du -sh | sort -h
```

---

## Repository Settings (Recommended)

After pushing, configure:

1. **Description**: Full-stack email aggregation system
2. **Topics**: Add tags like: `email`, `imap`, `elasticsearch`, `openai`, `rag`, `typescript`, `react`, `docker`
3. **About**: Add website if deployed
4. **Social preview**: Upload a screenshot of the UI

---

That's it! Your project is now on GitHub! 🎉

