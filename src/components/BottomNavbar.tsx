
import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  CheckSquare,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import FeatureNavbar from './FeatureNavbar';

const BottomNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isFeatureNavbarOpen, setIsFeatureNavbarOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Sparkles, label: 'Features', onClick: () => setIsFeatureNavbarOpen(!isFeatureNavbarOpen) },
    { icon: CheckSquare, label: 'Todo', path: '/todo' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          
          return item.path ? (
            <Link key={item.path} to={item.path} className="flex-1">
              <div className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${isActive ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </div>
            </Link>
          ) : (
            <div
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 cursor-pointer flex-1 ${isFeatureNavbarOpen ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
      <FeatureNavbar isOpen={isFeatureNavbarOpen} onClose={() => setIsFeatureNavbarOpen(false)} />
    </div>
  );
};

export default BottomNavbar;
