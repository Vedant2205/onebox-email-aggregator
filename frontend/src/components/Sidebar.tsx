import { useState, useEffect } from 'react';
import { imapApi } from '../api/imap';

interface SidebarProps {
  selectedAccount?: string;
  selectedFolder?: string;
  onAccountChange: (account: string | undefined) => void;
  onFolderChange: (folder: string | undefined) => void;
}

export default function Sidebar({
  selectedAccount,
  selectedFolder,
  onAccountChange,
  onFolderChange,
}: SidebarProps) {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await imapApi.getStatus();
        setAccounts(status.connectedAccounts);
      } catch (error) {
        console.error('Error fetching IMAP status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  const folders = ['INBOX', 'Sent', 'Drafts', 'Trash'];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Account</h3>
        <div className="space-y-1">
          <button
            onClick={() => onAccountChange(undefined)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              !selectedAccount
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Accounts
          </button>
          {loading ? (
            <div className="text-sm text-gray-500 px-3 py-2">Loading...</div>
          ) : (
            accounts.map((account) => (
              <button
                key={account}
                onClick={() => onAccountChange(account)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedAccount === account
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {account}
              </button>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Folder</h3>
        <div className="space-y-1">
          <button
            onClick={() => onFolderChange(undefined)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              !selectedFolder
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Folders
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderChange(folder)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                selectedFolder === folder
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}









