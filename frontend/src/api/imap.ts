import { apiClient } from './client';

export const imapApi = {
  reconnect: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/imaps/reconnect');
    return response.data;
  },

  getStatus: async (): Promise<{ connectedAccounts: string[] }> => {
    const response = await apiClient.get<{ connectedAccounts: string[] }>('/api/imaps/status');
    return response.data;
  },
};









