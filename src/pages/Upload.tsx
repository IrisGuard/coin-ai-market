
import CoinUploadForm from '@/components/upload/CoinUploadForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Upload = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CoinUploadForm />
    </div>
  );
};

export default Upload;
