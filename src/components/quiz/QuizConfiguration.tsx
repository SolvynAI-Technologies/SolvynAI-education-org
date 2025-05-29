
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Play } from 'lucide-react';

interface QuizConfigurationProps {
  onGenerateQuiz: (config: QuizConfig) => void;
  loading: boolean;
}

export interface QuizConfig {
  grade: string;
  board: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  customNumQuestions: string;
  userType: 'student' | 'teacher';
  customPrompt: string;
}

const QuizConfiguration = ({ onGenerateQuiz, loading }: QuizConfigurationProps) => {
  const [grade, setGrade] = useState('');
  const [board, setBoard] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [customNumQuestions, setCustomNumQuestions] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerateQuiz = () => {
    const config: QuizConfig = {
      grade,
      board,
      subject,
      topic,
      difficulty,
      numQuestions,
      customNumQuestions,
      userType,
      customPrompt
    };
    onGenerateQuiz(config);
  };

  const isFormValid = subject.trim() && topic.trim() && grade.trim() && board.trim();
  const isCustomQuestionsValid = numQuestions !== 0 || (customNumQuestions && parseInt(customNumQuestions) > 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            <span>AI-Powered Quiz Generator</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Create personalized quizzes powered by AI for any subject and difficulty level
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quiz Configuration</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Set up your quiz parameters and let AI create the perfect quiz for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">I am a:</Label>
                <Select value={userType} onValueChange={(value: 'student' | 'teacher') => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  placeholder="e.g., 10th, 12th, Bachelor's, etc."
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="board">Board of Education *</Label>
                <Input
                  id="board"
                  placeholder="e.g., CBSE, ICSE, State Board, IB, etc."
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, History, Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Quadratic Equations, World War II, Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="0">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {numQuestions === 0 && (
                <div className="space-y-2">
                  <Label htmlFor="customNumQuestions">Custom Number of Questions</Label>
                  <Input
                    id="customNumQuestions"
                    type="number"
                    placeholder="Enter number of questions"
                    value={customNumQuestions}
                    onChange={(e) => setCustomNumQuestions(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customPrompt">Additional Requirements (Optional)</Label>
                <Textarea
                  id="customPrompt"
                  placeholder="e.g., Focus on practical applications, Include diagrams descriptions, Cover specific chapters..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleGenerateQuiz}
              disabled={loading || !isFormValid || !isCustomQuestionsValid}
              className="bg-blue-500 hover:bg-blue-600 px-8"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizConfiguration;
