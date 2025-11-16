import { EmailDocument } from '../api/emails';
import EmailCard from './EmailCard';

interface EmailListProps {
  emails: EmailDocument[];
  loading?: boolean;
}

export default function EmailList({ emails, loading }: EmailListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading emails...</div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No emails found</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}









