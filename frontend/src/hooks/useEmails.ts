import { useQuery } from '@tanstack/react-query';
import { emailApi, SearchEmailsParams } from '../api/emails';

export const useEmails = (params: SearchEmailsParams) => {
  return useQuery({
    queryKey: ['emails', params],
    queryFn: () => emailApi.searchEmails(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useEmail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => (id ? emailApi.getEmailById(id) : null),
    enabled: !!id,
  });
};

