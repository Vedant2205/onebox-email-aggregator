import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailApi } from '../api/emails';

interface SuggestedReplyModalProps {
  emailId: string;
  onClose: () => void;
}

export default function SuggestedReplyModal({ emailId, onClose }: SuggestedReplyModalProps) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['suggestedReply', emailId],
    queryFn: () => emailApi.suggestReply(emailId),
    enabled: !!emailId,
  });

  const handleCopy = () => {
    if (data?.suggestedReply) {
      navigator.clipboard.writeText(data.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Suggested Reply</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Generating suggested reply...</div>
            </div>
          )}

          {error && (
            <div className="text-red-600">
              Error generating suggested reply. Please try again.
            </div>
          )}

          {data?.suggestedReply && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {data.suggestedReply}
                </pre>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

