'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
  };
  onSignOut?: () => void;
}

const Sidebar = ({ user, onSignOut }: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'dashboard';

  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard?tab=dashboard',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      tabKey: 'dashboard',
    },
    {
      name: 'Tasks',
      href: '/dashboard?tab=tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      tabKey: 'tasks',
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-100 h-screen flex flex-col transition-all duration-300 shadow-sm`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-lg font-semibold text-gray-900">TodoPro</span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === '/dashboard' && tab === item.tabKey;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  'U'}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email || 'User'}
              </p>
              <button
                onClick={onSignOut}
                className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
