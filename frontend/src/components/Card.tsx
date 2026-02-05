import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card = ({ children, className = '', title, subtitle }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={!title && !subtitle ? 'p-6' : 'p-6 pt-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;