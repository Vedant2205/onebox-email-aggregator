import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

// Load .env from project root (same level as docker-compose.yml)
// Try multiple possible locations
const currentDir = process.cwd(); // When running: E:\project\backend
const rootEnvPath = path.resolve(currentDir, '../.env'); // E:\project\.env
const currentDirEnvPath = path.resolve(currentDir, '.env'); // E:\project\backend\.env
const relativeEnvPath = path.resolve(__dirname, '../../../.env'); // From compiled code

// Try root directory first (when running from backend/)
let envPath: string | undefined;
if (existsSync(rootEnvPath)) {
  envPath = rootEnvPath;
} else if (existsSync(currentDirEnvPath)) {
  envPath = currentDirEnvPath;
} else if (existsSync(relativeEnvPath)) {
  envPath = relativeEnvPath;
}

if (envPath) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded .env from: ${envPath}`);
} else {
  console.error('❌ .env file not found. Tried:');
  console.error(`   1. ${rootEnvPath}`);
  console.error(`   2. ${currentDirEnvPath}`);
  console.error(`   3. ${relativeEnvPath}`);
  console.error('\n💡 Make sure .env file exists in the project root directory!');
  // Still try default location
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.string().default('4000'),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_URL: z.string(),
  ELASTIC_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  SLACK_WEBHOOK_URL: z.string().optional(),
  WEBHOOK_SITE_URL: z.string().optional(),
  IMAP_ACCOUNTS: z.string(),
});

const parseImapAccounts = (accountsStr: string) => {
  try {
    return JSON.parse(accountsStr);
  } catch {
    return [];
  }
};

const env = envSchema.parse(process.env);

export const config = {
  port: parseInt(env.PORT, 10),
  postgres: {
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    url: env.POSTGRES_URL,
  },
  elasticsearch: {
    url: env.ELASTIC_URL,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  notifications: {
    slackWebhookUrl: env.SLACK_WEBHOOK_URL,
    webhookSiteUrl: env.WEBHOOK_SITE_URL,
  },
  imap: {
    accounts: parseImapAccounts(env.IMAP_ACCOUNTS),
  },
};

