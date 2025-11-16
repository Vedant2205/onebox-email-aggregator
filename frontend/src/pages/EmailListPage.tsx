import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import EmailList from '../components/EmailList';
import { useEmails } from '../hooks/useEmails';

export default function EmailListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useEmails({
    q: activeQuery || undefined,
    account: selectedAccount,
    folder: selectedFolder,
    page,
    size: 20,
  });

  const handleSearch = () => {
    setActiveQuery(searchQuery);
    setPage(1);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedAccount={selectedAccount}
        selectedFolder={selectedFolder}
        onAccountChange={(account) => {
          setSelectedAccount(account);
          setPage(1);
        }}
        onFolderChange={(folder) => {
          setSelectedFolder(folder);
          setPage(1);
        }}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Emails</h1>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
          <EmailList emails={data?.emails || []} loading={isLoading} />
          {data && data.total > 20 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}









