# Environment Variables Setup

Create a `.env` file in the **root directory** (same level as `docker-compose.yml`) with the following variables:

```env
PORT=4000

# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=onebox
POSTGRES_HOST=localhost
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/onebox

# Elasticsearch
ELASTIC_URL=http://localhost:9200

# AI
OPENAI_API_KEY=your-openai-api-key-here

# Notifications (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
WEBHOOK_SITE_URL=https://webhook.site/your-unique-url

# IMAP accounts (JSON array)
IMAP_ACCOUNTS=[
  {
    "id": "acct1",
    "host": "imap.gmail.com",
    "port": 993,
    "user": "your-email@gmail.com",
    "pass": "your-app-password",
    "tls": true
  },
  {
    "id": "acct2",
    "host": "imap.outlook.com",
    "port": 993,
    "user": "your-email@outlook.com",
    "pass": "your-password",
    "tls": true
  }
]
```

## Notes

- For Gmail, you need to use an **App Password** instead of your regular password. Generate one at: https://myaccount.google.com/apppasswords
- For Outlook/Hotmail, you may need to enable "Less secure app access" or use an app password
- The `IMAP_ACCOUNTS` must be valid JSON. Make sure there are no trailing commas.
- `SLACK_WEBHOOK_URL` and `WEBHOOK_SITE_URL` are optional. If not provided, notifications will be skipped.

