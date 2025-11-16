# Step-by-Step Setup Guide

Follow these steps **exactly in order** to get your Onebox Email Aggregator running.

---

## ✅ Step 1: Verify Your .env File

**Location:** `E:\project\.env` (root directory, same level as `docker-compose.yml`)

**Open PowerShell and verify:**
```powershell
cd E:\project
Test-Path .env
```
**Expected:** `True`

**Check if file has content:**
```powershell
Get-Content .env | Select-Object -First 10
```

**Your .env file MUST contain these variables:**
```env
PORT=4000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=onebox
POSTGRES_HOST=localhost
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/onebox
ELASTIC_URL=http://localhost:9200
OPENAI_API_KEY=your-actual-openai-key-here
SLACK_WEBHOOK_URL=
WEBHOOK_SITE_URL=
IMAP_ACCOUNTS=[{"id":"acct1","host":"imap.gmail.com","port":993,"user":"your-email@gmail.com","pass":"your-password","tls":true}]
```

**Important Notes:**
- Replace `your-actual-openai-key-here` with your real OpenAI API key
- Replace IMAP credentials with your actual email account details
- `IMAP_ACCOUNTS` must be valid JSON on one line
- Leave `SLACK_WEBHOOK_URL` and `WEBHOOK_SITE_URL` empty if you don't have them

---

## ✅ Step 2: Start Docker Services

**Open a NEW PowerShell terminal** (keep this terminal open):

```powershell
cd E:\project
docker-compose up -d
```

**Wait 30-60 seconds** for services to start.

**Verify Docker containers are running:**
```powershell
docker ps
```

**You should see 4 containers:**
- `onebox-elasticsearch`
- `onebox-kibana`
- `onebox-postgres`
- `onebox-adminer`

**Test Elasticsearch:**
```powershell
curl http://localhost:9200
```
**Expected:** JSON response with cluster info

**Test Postgres:**
```powershell
docker exec -it onebox-postgres psql -U postgres -d onebox -c "SELECT COUNT(*) FROM knowledge;"
```
**Expected:** A number (e.g., 3)

---

## ✅ Step 3: Install Backend Dependencies

**Open a NEW PowerShell terminal** (keep this terminal open):

```powershell
cd E:\project\backend
npm install
```

**Wait for installation to complete** (may take 1-2 minutes).

**Expected output:** Lists of installed packages, no errors.

---

## ✅ Step 4: Start Backend Server

**In the SAME terminal as Step 3:**

```powershell
npm run dev
```

**Expected output:**
```
✅ Loaded .env from: E:\project\.env
Elasticsearch initialized
RAG knowledge base initialized
IMAP service started
Server running on port 4000
```

**If you see errors:**
- ❌ "ZodError" or "Required" errors → `.env` file not found or missing variables
- ❌ "ECONNREFUSED" → Docker services not running (go back to Step 2)
- ❌ "Cannot connect to Elasticsearch" → Wait longer, then restart backend

**Keep this terminal running!** Don't close it.

---

## ✅ Step 5: Install Frontend Dependencies

**Open a NEW PowerShell terminal:**

```powershell
cd E:\project\frontend
npm install
```

**Wait for installation to complete.**

---

## ✅ Step 6: Start Frontend Server

**In the SAME terminal as Step 5:**

```powershell
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal running!**

---

## ✅ Step 7: Verify Everything Works

### Test Backend:
1. Open browser: http://localhost:4000/health
   - **Expected:** `{"status":"ok","timestamp":"..."}`

2. Open browser: http://localhost:4000/api/imaps/status
   - **Expected:** `{"connectedAccounts":["acct1",...]}` or `{"connectedAccounts":[]}`

### Test Frontend:
1. Open browser: http://localhost:3000
   - **Expected:** Email list page loads (may be empty if no emails synced)

### Test Elasticsearch UI:
1. Open browser: http://localhost:5601
   - **Expected:** Kibana dashboard loads

### Test Database UI:
1. Open browser: http://localhost:8080
2. Login:
   - System: `PostgreSQL`
   - Server: `onebox-postgres`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `onebox`
   - **Expected:** Database interface loads

---

## ✅ Step 8: Test Email Sync (Optional)

If you configured IMAP accounts in `.env`, the backend should automatically:
- Connect to your email accounts
- Sync emails from last 30 days
- Index them in Elasticsearch
- Classify them with AI

**Check IMAP status:**
```powershell
curl http://localhost:4000/api/imaps/status
```

**Check emails:**
1. Go to http://localhost:3000
2. You should see emails appear (if any exist)

---

## 🎯 Summary - Your Running Services

You should now have **3 terminals open**:

**Terminal 1:** Docker (Step 2)
- Running containers

**Terminal 2:** Backend (Steps 3-4)
- Running on port 4000
- Shows logs of email processing

**Terminal 3:** Frontend (Steps 5-6)
- Running on port 3000
- Shows Vite dev server

**Web Interfaces:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Kibana: http://localhost:5601
- Adminer: http://localhost:8080

---

## 🚨 Troubleshooting

### Backend won't start / Shows "Required" errors:
```powershell
# Verify .env file exists and has content
cd E:\project
Get-Content .env
```

### Docker containers not starting:
```powershell
# Check Docker Desktop is running
docker ps

# Restart containers
cd E:\project
docker-compose down
docker-compose up -d
```

### Frontend can't connect to backend:
- Make sure backend is running on port 4000
- Check browser console for errors
- Verify `vite.config.ts` has proxy configured

### IMAP not connecting:
- Verify credentials in `.env` are correct
- For Gmail: Use App Password (not regular password)
- Check firewall/network settings

### Elasticsearch errors:
```powershell
# Check logs
docker logs onebox-elasticsearch

# Restart if needed
docker restart onebox-elasticsearch
```

---

## 📝 Next Steps

1. **Add more IMAP accounts** - Edit `.env` file
2. **Customize knowledge base** - Edit `backend/scripts/init-db.sql`
3. **Set up Slack webhook** - Add `SLACK_WEBHOOK_URL` to `.env`
4. **Test email classification** - Send test emails to synced accounts
5. **Try suggested replies** - Click "Get Suggested Reply" on any email

---

## 🎉 You're Done!

Your Onebox Email Aggregator is now running! 

- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Docs:** See `postman_collection.json` or `README.md`

Need help? Check `README.md` for detailed documentation.



