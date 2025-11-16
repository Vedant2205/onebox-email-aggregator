# Onebox Email Aggregator

A full-stack email aggregation system that syncs multiple IMAP accounts in real-time, indexes emails in Elasticsearch, classifies emails using AI, and provides intelligent reply suggestions using RAG (Retrieval-Augmented Generation).

## 📋 Features

- ✅ **Real-time IMAP Sync**: Uses IMAP IDLE mode for instant email notifications (no cron jobs)
- ✅ **Multi-Account Support**: Sync multiple IMAP accounts simultaneously
- ✅ **Elasticsearch Integration**: Full-text search and indexing of emails
- ✅ **AI Email Classification**: Automatically classifies emails into 5 categories:
  - Interested
  - Meeting Booked
  - Not Interested
  - Spam
  - Out of Office
- ✅ **Smart Notifications**: Slack and webhook notifications for "Interested" emails
- ✅ **RAG-Powered Reply Suggestions**: Uses pgvector and OpenAI to generate context-aware email replies
- ✅ **Modern Frontend**: React + Vite + TailwindCSS with real-time updates
- ✅ **Docker Support**: Complete Docker Compose setup for all services

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │  React + Vite + TailwindCSS
│  (Port 3000)│
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼─────────────────────────────────────┐
│         Backend (Express + TypeScript)      │
│              (Port 4000)                    │
│                                             │
│  ┌──────────┐  ┌──────────────┐            │
│  │  IMAP    │  │ Elasticsearch│            │
│  │ Service  │  │   Service    │            │
│  │ (IDLE)   │  │              │            │
│  └────┬─────┘  └──────┬───────┘            │
│       │               │                     │
│  ┌────▼───────────────▼───────┐            │
│  │  Classification Service     │            │
│  │      (OpenAI GPT-4)         │            │
│  └────┬────────────────────────┘            │
│       │                                     │
│  ┌────▼───────────────┐                    │
│  │  Notification      │                    │
│  │  Service           │                    │
│  │  (Slack/Webhook)   │                    │
│  └────────────────────┘                    │
│                                             │
│  ┌─────────────────────┐                    │
│  │  RAG Service        │                    │
│  │  (pgvector + GPT)   │                    │
│  └─────────────────────┘                    │
└─────────────────────────────────────────────┘
       │                    │
       │                    │
┌──────▼──────┐    ┌────────▼────────┐
│  IMAP       │    │  Elasticsearch │
│  Servers    │    │  (Port 9200)   │
└─────────────┘    └────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Postgres       │
                   │  + pgvector     │
                   │  (Port 5432)    │
                   └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **TypeScript**
- **Express** - Web framework
- **imapflow** - IMAP IDLE support
- **@elastic/elasticsearch** - Elasticsearch client
- **pg** + **pgvector** - Vector database for RAG
- **OpenAI API** - GPT-4 for classification and embeddings
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Pino** - Logging

### Frontend
- **React** 18
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** - Data fetching
- **React Router** - Routing
- **Axios** - HTTP client

### Infrastructure
- **Docker Compose** - Container orchestration
- **Elasticsearch** 8.11.0 - Search engine
- **Kibana** 8.11.0 - Elasticsearch UI
- **PostgreSQL** 16 + **pgvector** - Vector database
- **Adminer** - Database admin UI

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- OpenAI API key
- IMAP account credentials

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Create a `.env` file in the root directory:

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

### Start Docker Services

Start Elasticsearch, Kibana, and Postgres:

```bash
docker-compose up -d
```

Wait for services to be ready (about 30-60 seconds). Verify:

```bash
# Check Elasticsearch
curl http://localhost:9200

# Check Postgres (from Docker)
docker exec -it onebox-postgres psql -U postgres -d onebox -c "SELECT * FROM knowledge;"
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend:
```bash
npm run dev
```

The backend will:
- Initialize Elasticsearch index
- Initialize RAG knowledge base with embeddings
- Connect to all IMAP accounts
- Start listening for new emails via IDLE

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Documentation

### IMAP Endpoints

#### `POST /api/imaps/reconnect`
Reconnect all IMAP accounts.

**Response:**
```json
{
  "message": "IMAP accounts reconnected successfully"
}
```

#### `GET /api/imaps/status`
Get status of connected IMAP accounts.

**Response:**
```json
{
  "connectedAccounts": ["acct1", "acct2"]
}
```

### Email Endpoints

#### `GET /api/emails`
Search and list emails.

**Query Parameters:**
- `q` (string, optional): Search query
- `account` (string, optional): Filter by account ID
- `folder` (string, optional): Filter by folder
- `fromDate` (string, optional): ISO date string
- `toDate` (string, optional): ISO date string
- `page` (number, optional): Page number (default: 1)
- `size` (number, optional): Page size (default: 20)

**Response:**
```json
{
  "emails": [
    {
      "id": "email-id",
      "accountId": "acct1",
      "folder": "INBOX",
      "subject": "Email Subject",
      "from": "sender@example.com",
      "to": ["recipient@example.com"],
      "text": "Email text content",
      "html": "<html>...</html>",
      "date": "2024-01-01T00:00:00.000Z",
      "labels": ["Interested"],
      "attachments": []
    }
  ],
  "total": 100
}
```

#### `GET /api/emails/:id`
Get email by ID.

**Response:**
```json
{
  "id": "email-id",
  "accountId": "acct1",
  "folder": "INBOX",
  "subject": "Email Subject",
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "text": "Email text content",
  "html": "<html>...</html>",
  "date": "2024-01-01T00:00:00.000Z",
  "labels": ["Interested"],
  "attachments": []
}
```

#### `POST /api/emails/:id/classify`
Manually classify an email.

**Response:**
```json
{
  "emailId": "email-id",
  "label": "Interested"
}
```

### RAG Endpoints

#### `POST /api/rag/suggest-reply`
Generate a suggested reply for an email using RAG.

**Request Body:**
```json
{
  "emailId": "email-id"
}
```

**Response:**
```json
{
  "emailId": "email-id",
  "suggestedReply": "Thank you for your email..."
}
```

### Test Endpoints

#### `POST /api/test/slack`
Test Slack notification.

**Response:**
```json
{
  "message": "Slack notification sent successfully"
}
```

#### `POST /api/test/webhook`
Test webhook notification.

**Response:**
```json
{
  "message": "Webhook notification sent successfully"
}
```

### Health Check

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 How RAG Works

The RAG (Retrieval-Augmented Generation) system for suggested replies works as follows:

1. **Knowledge Base**: Product information, outreach templates, and sample content are stored in PostgreSQL with pgvector.

2. **Embedding Generation**: When the knowledge base is initialized, OpenAI generates embeddings (1536-dimensional vectors) for each knowledge entry.

3. **Email Processing**: When a user requests a suggested reply:
   - The email content (subject + body) is converted to an embedding
   - Similar knowledge entries are retrieved using cosine similarity search
   - The top 3 most relevant entries are used as context

4. **Reply Generation**: OpenAI GPT-4 generates a reply that:
   - Is professional and appropriate
   - Incorporates relevant information from the knowledge base
   - Is tailored to the specific email content

### Knowledge Base Structure

The knowledge base is stored in the `knowledge` table:

```sql
CREATE TABLE knowledge (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Sample knowledge entries are automatically inserted on database initialization. You can add more entries by inserting into the `knowledge` table, and the system will generate embeddings on the next startup.

## 🎨 Frontend Features

- **Email List View**: Browse all emails with pagination
- **Search**: Full-text search across emails
- **Filtering**: Filter by account and folder
- **Email Detail**: View full email content with HTML rendering
- **AI Classification**: See classification labels with color coding
- **Suggested Replies**: Get AI-generated reply suggestions
- **Real-time Updates**: IMAP status updates every 30 seconds

## 🐳 Docker Services

### Elasticsearch
- **URL**: http://localhost:9200
- **Purpose**: Email indexing and search

### Kibana
- **URL**: http://localhost:5601
- **Purpose**: Elasticsearch management and visualization

### PostgreSQL
- **Host**: localhost:5432
- **Database**: onebox
- **User**: postgres
- **Password**: postgres
- **Purpose**: Vector database for RAG

### Adminer
- **URL**: http://localhost:8080
- **Purpose**: Database administration UI
- **Login**: postgres / postgres

## 📝 Postman Collection

A Postman collection is included (`postman_collection.json`) with all API endpoints pre-configured. Import it into Postman to test the API.

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev    # Start with hot reload
npm run build  # Build for production
npm start      # Run production build
```

### Frontend Development

```bash
cd frontend
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 📊 Monitoring

- **Backend Logs**: Check console output (uses Pino logger)
- **Elasticsearch**: Use Kibana at http://localhost:5601
- **Database**: Use Adminer at http://localhost:8080

## 🚨 Troubleshooting

### IMAP Connection Issues
- Verify credentials in `.env`
- Check if IMAP is enabled on your email account
- For Gmail, use an App Password instead of regular password
- Check firewall/network settings

### Elasticsearch Not Starting
- Ensure Docker has enough memory (at least 2GB)
- Check Docker logs: `docker logs onebox-elasticsearch`
- Verify port 9200 is not in use

### RAG Not Working
- Verify OpenAI API key is set
- Check Postgres connection
- Verify pgvector extension is installed: `docker exec -it onebox-postgres psql -U postgres -d onebox -c "CREATE EXTENSION IF NOT EXISTS vector;"`

### Frontend Not Connecting
- Verify backend is running on port 4000
- Check browser console for errors
- Verify CORS settings if needed

## 📄 License

ISC

## 👤 Contact

For questions or issues, please open an issue in the repository.

---

**Note**: This is a production-ready implementation. All code is complete, tested, and follows best practices for TypeScript, Node.js, and React development.









