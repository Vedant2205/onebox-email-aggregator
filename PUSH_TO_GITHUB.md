# 🚀 Push to GitHub - Quick Commands

Your local git repository is ready! Follow these steps:

---

## ✅ Step 1: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `onebox-email-aggregator` (or your choice)
3. **Description:** `Full-stack email aggregation system with AI classification and RAG-powered reply suggestions`
4. **Visibility:** Choose Public or Private
5. **⚠️ IMPORTANT:** Do NOT check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (We already have these files!)

6. Click **"Create repository"**

---

## ✅ Step 2: Copy Your Repository URL

After creating, GitHub will show you a URL like:
```
https://github.com/YOUR_USERNAME/onebox-email-aggregator.git
```

**Copy this URL!** You'll need it in the next step.

---

## ✅ Step 3: Add Remote and Push

**Open PowerShell in E:\project and run these commands:**

### Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:

```powershell
# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/onebox-email-aggregator.git

# Push to GitHub
git push -u origin main
```

### Example:
```powershell
git remote add origin https://github.com/johndoe/onebox-email-aggregator.git
git push -u origin main
```

---

## ✅ Step 4: Verify

1. Go to your GitHub repository page
2. You should see all 57 files uploaded
3. Check that these folders are there:
   - ✅ `backend/`
   - ✅ `frontend/`
   - ✅ `docker-compose.yml`
   - ✅ `README.md`

---

## 🔐 Authentication

If you get authentication errors:

### Option 1: Personal Access Token (Recommended)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy token
5. When pushing, use:
   - Username: Your GitHub username
   - Password: The token (not your GitHub password)

### Option 2: GitHub CLI
```powershell
# Install GitHub CLI first
gh auth login
git push -u origin main
```

---

## ✅ Done!

Your project is now on GitHub! 🎉

**Next steps:**
- Add repository description
- Add topics/tags (email, imap, elasticsearch, openai, rag, typescript, react)
- Enable Issues and Discussions (optional)
- Set up GitHub Actions for CI/CD (optional)

---

## 📝 Quick Reference

```powershell
# Check status
git status

# See remote
git remote -v

# Push updates (in future)
git add .
git commit -m "Your commit message"
git push
```


