import { useParams, Link } from 'react-router-dom';
import { useEmail } from '../hooks/useEmails';
import EmailDetail from '../components/EmailDetail';

export default function EmailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: email, isLoading } = useEmail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading email...</div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Email not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/"
        className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Emails
      </Link>
      <EmailDetail email={email} />
    </div>
  );
}









