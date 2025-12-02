import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>
      {title && <h2 className="text-pmerj-dark font-bold text-lg mb-4">{title}</h2>}
      {children}
    </div>
  );
};
