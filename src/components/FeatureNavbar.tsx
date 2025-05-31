import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, BookOpen, HelpCircle, Timer, Brain } from 'lucide-react';

interface FeatureNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureNavbar: React.FC<FeatureNavbarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const featureItems = [
    { icon: FileText, label: 'Generate', path: '/question-generator' },
    { icon: BookOpen, label: 'Analyze', path: '/answer-analyzer' },
    { icon: HelpCircle, label: 'Doubt', path: '/doubt-solver' },
    { icon: Timer, label: 'Focus', path: '/focus' },
    { icon: Brain, label: 'Quiz', path: '/quiz' },
  ];

  return (
    <div className={`fixed bottom-16 left-1/2 -translate-x-1/2 transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
      <div className="relative w-64 h-32 bg-white dark:bg-gray-800 rounded-t-full shadow-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-around px-4">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex flex-col items-center justify-center w-1/5 h-full text-center transition-colors duration-200 ${isActive ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureNavbar;