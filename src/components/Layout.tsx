
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import Loader from './Loader'; // Import the Loader component

const LayoutContent = () => {
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Display loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <Loader onAnimationEnd={handleAnimationEnd} />
      ) : (
        <>
          <Sidebar />
          <main className={`flex-1 h-full w-full overflow-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${
            isMobile 
              ? 'pb-20 ml-0' 
              : isCollapsed 
                ? 'ml-16' 
                : 'ml-64'
          }`}>
            <Outlet />
          </main>
          <BottomNavbar />
        </>
      )}
    </div>
  );
};

const Layout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default Layout;
