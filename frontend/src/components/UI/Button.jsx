import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95 focus:outline-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary-dark shadow-sm",
    outline: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};