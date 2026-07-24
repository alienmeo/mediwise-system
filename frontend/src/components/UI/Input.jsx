import React from 'react';

export const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-gray-600 mb-2 ml-2">{label}</label>}
      <input 
        className={`w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200 bg-gray-50/50 ${className}`}
        {...props}
      />
    </div>
  );
};