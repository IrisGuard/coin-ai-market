
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

const DirectDealerButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dealer-direct');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 z-50"
    >
      <Store className="w-5 h-5" />
      Dealer Panel
    </button>
  );
};

export default DirectDealerButton;
