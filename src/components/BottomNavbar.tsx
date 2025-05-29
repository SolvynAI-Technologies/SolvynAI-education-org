
import { 
  Home, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Timer, 
  User,
  Brain
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileText, label: 'Generate', path: '/question-generator' },
    { icon: BookOpen, label: 'Analyze', path: '/answer-analyzer' },
    { icon: CheckSquare, label: 'Todo', path: '/todo' },
    { icon: Timer, label: 'Focus', path: '/focus' },
    { icon: Brain, label: 'Quiz', path: '/quiz' },
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
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <div className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'text-green-500' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
