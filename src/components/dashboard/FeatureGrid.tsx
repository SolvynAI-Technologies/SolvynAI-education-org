
import FeatureCard from '@/components/FeatureCard';
import { FileText, BookOpen, HelpCircle, CheckSquare, Layout, Timer } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: FileText,
      title: 'Question Generator',
      description: 'Generate custom question papers with AI for any subject and grade',
      path: '/question-generator',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Answer Analyzer',
      description: 'Get expert analysis and feedback on your answer sheets',
      path: '/answer-analyzer',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: HelpCircle,
      title: 'Doubt Solver',
      description: 'Solve your doubts with step-by-step AI explanations',
      path: '/doubt-solver',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: CheckSquare,
      title: 'To Do List',
      description: 'Organize your tasks and boost productivity',
      path: '/todo',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      icon: Layout,
      title: 'Kanban Board',
      description: 'Visualize your workflow with our kanban system',
      path: '/kanban',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      icon: Timer,
      title: 'Focus Mode',
      description: 'Enhance concentration with pomodoro sessions',
      path: '/focus',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
