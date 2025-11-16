import { useState } from 'react';
import { EmailDocument } from '../api/emails';
import { emailApi } from '../api/emails';
import SuggestedReplyModal from './SuggestedReplyModal';

interface EmailDetailProps {
  email: EmailDocument;
}

export default function EmailDetail({ email }: EmailDetailProps) {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const handleClassify = async () => {
    setClassifying(true);
    try {
      await emailApi.classifyEmail(email.id);
      window.location.reload();
    } catch (error) {
      console.error('Error classifying email:', error);
      alert('Failed to classify email');
    } finally {
      setClassifying(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const primaryLabel = email.labels && email.labels.length > 0 ? email.labels[0] : undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{email.subject}</h1>
          {primaryLabel && (
            <span className={`px-3 py-1 text-sm rounded ${getLabelColor(primaryLabel)}`}>
              {primaryLabel}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">From:</span> {email.from}
          </div>
          <div>
            <span className="font-medium">To:</span> {email.to.join(', ')}
          </div>
          <div>
            <span className="font-medium">Date:</span> {formatDate(email.date)}
          </div>
          <div>
            <span className="font-medium">Account:</span> {email.accountId} |{' '}
            <span className="font-medium">Folder:</span> {email.folder}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowReplyModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Suggested Reply
        </button>
        <button
          onClick={handleClassify}
          disabled={classifying}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {classifying ? 'Classifying...' : 'Re-classify Email'}
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="prose max-w-none">
          {email.html ? (
            <div dangerouslySetInnerHTML={{ __html: email.html }} />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{email.text}</pre>
          )}
        </div>
      </div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
          <div className="space-y-1">
            {email.attachments.map((att, idx) => (
              <div key={idx} className="text-sm text-gray-600">
                📎 {att.filename} ({Math.round(att.size / 1024)} KB)
              </div>
            ))}
          </div>
        </div>
      )}

      {showReplyModal && (
        <SuggestedReplyModal
          emailId={email.id}
          onClose={() => setShowReplyModal(false)}
        />
      )}
    </div>
  );
}









