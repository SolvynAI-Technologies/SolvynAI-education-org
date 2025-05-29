
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { questionIndex: number; selected: number; correct: number }[];
}

interface QuizResultsProps {
  result: QuizResult;
  questions: Question[];
  onRestart: () => void;
}

const QuizResults = ({ result, questions, onRestart }: QuizResultsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <CheckCircle className="h-6 w-6" />
            <span>Quiz Completed!</span>
          </CardTitle>
          <div className="text-green-100">
            Great job! Here are your results
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900 dark:text-white">
            Your Score: {result.score}/{result.totalQuestions}
          </CardTitle>
          <div className="text-center">
            <div className={`text-4xl font-bold ${
              result.percentage >= 80 ? 'text-green-500' :
              result.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {result.percentage}%
            </div>
            <Badge className={`mt-2 ${
              result.percentage >= 80 ? 'bg-green-500' :
              result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {result.percentage >= 80 ? 'Excellent!' :
               result.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Your Answers:</h3>
            {questions.map((question, index) => {
              const userAnswer = result.answers[index];
              const isCorrect = userAnswer.selected === userAnswer.correct;
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 
                  'bg-red-50 border-red-200 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-start space-x-2">
                    {isCorrect ? 
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> :
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {question.question}
                      </p>
                      <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        Your answer: {question.options[userAnswer.selected]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Correct answer: {question.options[userAnswer.correct]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button onClick={onRestart} className="bg-blue-500 hover:bg-blue-600">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
