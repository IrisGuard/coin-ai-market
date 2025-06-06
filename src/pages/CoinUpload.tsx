
import { Navigate } from 'react-router-dom';

// This page has been consolidated into the main Upload page
// Redirect to the main upload page to avoid duplication
const CoinUpload = () => {
  return <Navigate to="/upload" replace />;
};

export default CoinUpload;
