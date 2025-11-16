import { Routes, Route } from 'react-router-dom';
import EmailListPage from './pages/EmailListPage';
import EmailDetailPage from './pages/EmailDetailPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<EmailListPage />} />
        <Route path="/emails/:id" element={<EmailDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;









