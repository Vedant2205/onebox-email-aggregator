import { apiClient } from './client';

export interface EmailDocument {
  id: string;
  accountId: string;
  folder: string;
  subject: string;
  from: string;
  to: string[];
  text: string;
  html: string;
  date: string;
  labels?: string[];
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export interface SearchEmailsParams {
  q?: string;
  account?: string;
  folder?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface SearchEmailsResponse {
  emails: EmailDocument[];
  total: number;
}

export const emailApi = {
  searchEmails: async (params: SearchEmailsParams): Promise<SearchEmailsResponse> => {
    const response = await apiClient.get<SearchEmailsResponse>('/api/emails', { params });
    return response.data;
  },

  getEmailById: async (id: string): Promise<EmailDocument> => {
    const response = await apiClient.get<EmailDocument>(`/api/emails/${id}`);
    return response.data;
  },

  classifyEmail: async (id: string): Promise<{ emailId: string; label: string }> => {
    const response = await apiClient.post<{ emailId: string; label: string }>(
      `/api/emails/${id}/classify`
    );
    return response.data;
  },

  suggestReply: async (emailId: string): Promise<{ emailId: string; suggestedReply: string }> => {
    const response = await apiClient.post<{ emailId: string; suggestedReply: string }>(
      '/api/rag/suggest-reply',
      { emailId }
    );
    return response.data;
  },
};









