import { simpleParser, ParsedMail } from 'mailparser';

export interface EmailMetadata {
  id: string;
  accountId: string;
  folder: string;
  subject: string;
  from: string;
  to: string[];
  text: string;
  html: string;
  date: Date;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export const parseEmail = async (
  rawEmail: string | Buffer,
  accountId: string,
  folder: string
): Promise<EmailMetadata> => {
  const parsed: ParsedMail = await simpleParser(rawEmail);

  return {
    id: parsed.messageId || `${Date.now()}-${Math.random()}`,
    accountId,
    folder,
    subject: parsed.subject || '(No Subject)',
    from: parsed.from?.text || 'unknown@example.com',
    to: parsed.to ? (Array.isArray(parsed.to) ? parsed.to.map((a) => a.text) : [parsed.to.text]) : [],
    text: parsed.text || '',
    html: parsed.html || parsed.textAsHtml || '',
    date: parsed.date || new Date(),
    attachments: parsed.attachments?.map((att) => ({
      filename: att.filename || 'unnamed',
      contentType: att.contentType || 'application/octet-stream',
      size: att.size || 0,
    })),
  };
};

