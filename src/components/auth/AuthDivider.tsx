
import React from 'react';

interface AuthDividerProps {
  text: string;
}

const AuthDivider = ({ text }: AuthDividerProps) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;
