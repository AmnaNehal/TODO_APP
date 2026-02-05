'use client';

import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Header = ({ title, subtitle, actions }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-100 py-5">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </header>
  );
};

export default Header;