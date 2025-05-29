
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  gradient: string;
}

const FeatureCard = ({ icon: Icon, title, description, path, gradient }: FeatureCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={path}>
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Get Started
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
