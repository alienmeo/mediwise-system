import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-soft border border-gray-100 p-6 transition-all duration-300 hover:shadow-md ${className}`}>
      {children}
    </div>
  );
};