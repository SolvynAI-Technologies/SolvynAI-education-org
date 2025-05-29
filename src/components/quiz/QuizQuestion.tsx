
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizQuestionProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
}

const QuizQuestion = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLastQuestion
}: QuizQuestionProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Brain className="h-6 w-6" />
            <span>Quiz in Progress</span>
          </CardTitle>
          <div className="text-purple-100">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress: {Math.round(progress)}%</span>
              <span>{currentQuestionIndex + 1}/{totalQuestions}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {question.question}
            </h2>
            
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => onAnswerSelect(parseInt(value))}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={onNext}
                disabled={selectedAnswer === null}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizQuestion;
