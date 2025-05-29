import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, HelpCircle, Lightbulb, BookOpen, AlertCircle, Download } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';
import { cleanAIResponse, prepareMathContent, downloadAsPDF } from '@/utils/formatUtils';
import MathRenderer from '@/components/MathRenderer';

const DoubtSolver = () => {
  console.log('DoubtSolver component rendering');
  
  const [inputType, setInputType] = useState<'text' | 'upload'>('text');
  const { callAI, loading: isSolving, error } = useAI();
  const [question, setQuestion] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [board, setBoard] = useState('');
  const [solution, setSolution] = useState<string | null>(null);

  const solveDoubt = async () => {
    console.log('solveDoubt function called');
    
    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    try {
      const prompt = `
        I need help solving the following problem:
        
        ${question}
        
        ${grade ? `Grade level: ${grade}` : ''}
        ${subject ? `Subject: ${subject}` : ''}
        ${board ? `Board of Education: ${board}` : ''}
        
        Please provide a step-by-step solution with clear explanations. Use proper mathematical notation including fractions, symbols, and equations.
      `;

      console.log('Calling AI with prompt');
      const result = await callAI(prompt, 'doubt-solver');
      
      if (result && result.response) {
        setSolution(result.response);
        toast.success('Solution generated successfully!');
      } else {
        toast.error('Failed to generate solution');
      }
    } catch (error) {
      console.error('Error solving doubt:', error);
      toast.error('An error occurred while solving your doubt');
    }
  };

  const handleDownloadPDF = () => {
    if (!solution) {
      toast.error('No solution to download');
      return;
    }
    
    const filename = `${subject || 'Solution'}_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadAsPDF(solution, filename);
    toast.success('PDF download started!');
  };

  const renderFormattedSolution = (text: string) => {
    const cleanText = prepareMathContent(cleanAIResponse(text));
    return cleanText.split('\n\n').map((paragraph, idx) => {
      if (paragraph.trim()) {
        if (paragraph.toLowerCase().includes('step')) {
          return (
            <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                <MathRenderer content={paragraph} />
              </h4>
            </div>
          );
        }
        return (
          <div key={idx} className="text-gray-700 dark:text-gray-300 mb-3 text-base leading-relaxed">
            <MathRenderer content={paragraph} />
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <HelpCircle className="h-6 w-6" />
            <span>AI Doubt Solver</span>
          </CardTitle>
          <CardDescription className="text-green-100">
            Get step-by-step solutions and explanations for your academic doubts
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span>Error</span>
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Question Configuration</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Set up your question details for better AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={`grade-${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="board">Board of Education</Label>
              <Select value={board} onValueChange={setBoard}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                  <SelectItem value="state">State Board</SelectItem>
                  <SelectItem value="ib">IB</SelectItem>
                  <SelectItem value="cambridge">Cambridge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Input Method</Label>
              <div className="flex space-x-2">
                <Button
                  variant={inputType === 'text' ? 'default' : 'outline'}
                  onClick={() => setInputType('text')}
                  className="flex-1"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Type Question
                </Button>
                <Button
                  variant={inputType === 'upload' ? 'default' : 'outline'}
                  onClick={() => setInputType('upload')}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Input */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {inputType === 'text' ? 'Enter Your Question' : 'Upload Question Image'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {inputType === 'text' 
                ? 'Type your question or doubt clearly'
                : 'Upload a clear image of your question'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputType === 'text' ? (
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your question or doubt here. Be as specific as possible for better help..."
                  className="min-h-[300px] bg-gray-50 dark:bg-gray-700"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Question Image</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                  <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Drag and drop your question image here
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Supports JPG, PNG, or PDF files
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Solve Button */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={solveDoubt}
              disabled={isSolving}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
            >
              {isSolving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Solving...
                </>
              ) : (
                <>
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Solve My Doubt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Solution */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <BookOpen className="h-5 w-5" />
              <span>Solution</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Step-by-step solution and approach tutorial
            </CardDescription>
          </div>
          {solution && (
            <Button 
              onClick={handleDownloadPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {solution ? (
            <div className="prose dark:prose-invert max-w-none">
              {renderFormattedSolution(solution)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Step 1: Understanding the Problem
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  This section will show the first step of solving your question once you submit it.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Step 2: Solution Approach
                </h4>
                <p className="text-green-700 dark:text-green-300">
                  The AI will provide a detailed step-by-step solution approach.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  Step 3: Final Answer
                </h4>
                <p className="text-purple-700 dark:text-purple-300">
                  Complete solution with the final answer and verification.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  How to Approach Similar Questions
                </h4>
                <p className="text-orange-700 dark:text-orange-300">
                  The AI will provide general tips and strategies for solving similar types of questions.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoubtSolver;
