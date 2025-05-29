
import { CheckCircle } from 'lucide-react';

interface FocusTreeVisualizationProps {
  treeGrowth: number;
}

const FocusTreeVisualization = ({ treeGrowth }: FocusTreeVisualizationProps) => {
  return (
    <div className="relative bg-gradient-to-t from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8 h-64 overflow-hidden">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-200 dark:bg-green-800 rounded-b-lg"></div>
      
      {/* Tree */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        {/* Trunk */}
        <div className="w-4 h-16 bg-yellow-800 dark:bg-yellow-900 mx-auto mb-0"></div>
        
        {/* Tree Crown */}
        <div className="relative">
          <div 
            className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full mx-auto transition-all duration-1000 ease-out"
            style={{
              transform: `scale(${0.3 + (treeGrowth / 100) * 0.7})`,
              opacity: Math.max(0.3, treeGrowth / 100)
            }}
          ></div>
          
          {/* Leaves (appear as tree grows) */}
          {treeGrowth > 50 && (
            <>
              <div 
                className="absolute -top-4 -left-6 w-8 h-8 bg-green-400 dark:bg-green-500 rounded-full transition-all duration-1000"
                style={{ opacity: (treeGrowth - 50) / 50 }}
              ></div>
              <div 
                className="absolute -top-4 -right-6 w-8 h-8 bg-green-400 dark:bg-green-500 rounded-full transition-all duration-1000"
                style={{ opacity: (treeGrowth - 50) / 50 }}
              ></div>
            </>
          )}
          
          {/* Flowers (appear when tree is fully grown) */}
          {treeGrowth === 100 && (
            <>
              <div className="absolute -top-2 left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute top-4 left-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </>
          )}
        </div>
      </div>
      
      {/* Completion Message */}
      {treeGrowth === 100 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border">
            <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Session Complete!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTreeVisualization;
