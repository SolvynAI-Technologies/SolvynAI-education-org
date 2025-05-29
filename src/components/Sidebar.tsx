
import { 
  Home, 
  User, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  Timer, 
  Sun, 
  Moon, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Brain
} from 'lucide-react';
import logoLight from '../../public/logo light.png';
import logoDark from '../../public/aa698e7f-a6ed-420f-9a12-a76da65118f5.png';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Question Generator', path: '/question-generator' },
    { icon: BookOpen, label: 'Answer Analyzer', path: '/answer-analyzer' },
    { icon: HelpCircle, label: 'Doubt Solver', path: '/doubt-solver' },
    { icon: CheckSquare, label: 'To Do List', path: '/todo' },
    { icon: Timer, label: 'Focus Mode', path: '/focus' },
    { icon: Brain, label: 'Quiz', path: '/quiz' },
  ];

  const userName = profile?.full_name || "User";
  const userInitials = userName.split(' ').map(name => name[0]).join('').slice(0, 2);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  // Don't render sidebar on mobile - we'll use bottom nav instead
  if (isMobile) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-full flex flex-col fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img
                src={theme === 'dark' ? logoDark : logoLight}
                alt="SolvynAI Logo"
                className="h-10 w-auto"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0 flex items-center justify-center"
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${isCollapsed ? 'justify-center' : ''}`}>
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 flex-shrink-0">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-full h-10 ${isCollapsed ? 'px-0 justify-center' : 'justify-start'} text-gray-700 dark:text-gray-300`}
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {!isCollapsed && <span>Toggle Theme</span>}
          </div>
        </Button>

        {/* Profile */}
        <Link to="/profile">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full h-10 ${isCollapsed ? 'px-0 justify-center' : 'justify-start'} text-gray-700 dark:text-gray-300`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {userInitials}
              </div>
              {!isCollapsed && <span>Profile</span>}
            </div>
          </Button>
        </Link>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={`w-full h-10 ${isCollapsed ? 'px-0 justify-center' : 'justify-start'} text-gray-700 dark:text-gray-300 hover:text-red-500`}
        >
          <div className="flex items-center space-x-3">
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
