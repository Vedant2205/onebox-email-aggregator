import { Link } from 'react-router-dom';
import { EmailDocument } from '../api/emails';

interface EmailCardProps {
  email: EmailDocument;
}

export default function EmailCard({ email }: EmailCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLabelColor = (label?: string) => {
    switch (label) {
      case 'Interested':
        return 'bg-green-100 text-green-800';
      case 'Meeting Booked':
        return 'bg-blue-100 text-blue-800';
      case 'Not Interested':
        return 'bg-gray-100 text-gray-800';
      case 'Spam':
        return 'bg-red-100 text-red-800';
      case 'Out of Office':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const primaryLabel = email.labels && email.labels.length > 0 ? email.labels[0] : undefined;

  return (
    <Link
      to={`/emails/${email.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{email.subject}</h3>
          <p className="text-sm text-gray-600 truncate mt-1">{email.from}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className="text-xs text-gray-500">{formatDate(email.date)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mt-2">{email.text || '(No content)'}</p>
      {primaryLabel && (
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 text-xs rounded ${getLabelColor(primaryLabel)}`}>
            {primaryLabel}
          </span>
        </div>
      )}
    </Link>
  );
}









