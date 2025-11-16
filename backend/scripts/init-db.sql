-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge table for RAG
CREATE TABLE IF NOT EXISTS knowledge (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_embedding_idx ON knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Insert sample knowledge base documents
INSERT INTO knowledge (content) VALUES 
('Our product is an innovative email management platform that helps teams aggregate, classify, and respond to emails efficiently. It uses AI to automatically categorize emails and suggest intelligent replies.'),
('We are reaching out to schedule a demo of our email aggregator platform. The demo will cover real-time email syncing, AI-powered classification, and intelligent reply suggestions. Please let us know your availability.'),
('Here is a sample booking link for scheduling a meeting: https://calendly.com/demo/30min. You can also reply to this email with your preferred time slots.');









