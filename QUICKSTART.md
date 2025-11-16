# Quick Start Guide

## 1. Prerequisites Check

- [ ] Node.js 20+ installed
- [ ] Docker and Docker Compose installed
- [ ] OpenAI API key ready
- [ ] IMAP account credentials ready

## 2. Environment Setup

1. Copy environment variables:
   ```bash
   # Create .env file in root directory
   # See ENV_SETUP.md for template
   ```

2. Configure IMAP accounts in `.env`:
   ```json
   IMAP_ACCOUNTS=[
     {
       "id": "acct1",
       "host": "imap.gmail.com",
       "port": 993,
       "user": "your-email@gmail.com",
       "pass": "your-app-password",
       "tls": true
     }
   ]
   ```

## 3. Start Docker Services

```bash
docker-compose up -d
```

Wait 30-60 seconds for services to initialize.

Verify services:
```bash
# Elasticsearch
curl http://localhost:9200

# Postgres (from Docker)
docker exec -it onebox-postgres psql -U postgres -d onebox -c "SELECT COUNT(*) FROM knowledge;"
```

## 4. Start Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
- Elasticsearch initialized
- RAG knowledge base initialized
- IMAP accounts connected
- Server running on port 4000

## 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

## 6. Test the System

1. **Check IMAP Status**: Visit http://localhost:4000/api/imaps/status
2. **Search Emails**: Visit http://localhost:3000 and search for emails
3. **View Email**: Click on any email to see details
4. **Get Suggested Reply**: Click "Get Suggested Reply" button
5. **Test Notifications**: 
   ```bash
   curl -X POST http://localhost:4000/api/test/slack
   curl -X POST http://localhost:4000/api/test/webhook
   ```

## Troubleshooting

### IMAP Not Connecting
- Verify credentials in `.env`
- For Gmail: Use App Password (not regular password)
- Check firewall/network settings

### Elasticsearch Errors
- Ensure Docker has 2GB+ memory
- Check logs: `docker logs onebox-elasticsearch`

### RAG Not Working
- Verify OpenAI API key is set
- Check Postgres connection
- Verify embeddings were generated (check logs)

### Frontend Not Loading
- Ensure backend is running on port 4000
- Check browser console for errors
- Verify API proxy in `vite.config.ts`

## Next Steps

- Add more IMAP accounts
- Customize knowledge base in `backend/scripts/init-db.sql`
- Configure Slack webhook for notifications
- Set up webhook.site URL for testing

For detailed documentation, see README.md









