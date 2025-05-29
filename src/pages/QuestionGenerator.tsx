import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Download, Eye, AlertCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';
import { cleanAIResponse, prepareMathContent, downloadAsPDF } from '@/utils/formatUtils';
import MathRenderer from '@/components/MathRenderer';

interface Chapter {
  id: string;
  name: string;
  mcq: number;
  twoMark: number;
  threeMark: number;
  fourMark: number;
  fiveMark: number;
  sixMark: number;
}

const QuestionGenerator = () => {
  console.log('QuestionGenerator component rendering');
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterInput, setChapterInput] = useState('');
  const { callAI, loading: isGenerating, error } = useAI();
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [board, setBoard] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const addChapter = () => {
    if (chapterInput.trim()) {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        name: chapterInput.trim(),
        mcq: 0,
        twoMark: 0,
        threeMark: 0,
        fourMark: 0,
        fiveMark: 0,
        sixMark: 0,
      };
      setChapters([...chapters, newChapter]);
      setChapterInput('');
    }
  };

  const removeChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  const updateChapterQuestions = (id: string, field: keyof Omit<Chapter, 'id' | 'name'>, value: number) => {
    setChapters(chapters.map(chapter => 
      chapter.id === id ? { ...chapter, [field]: value } : chapter
    ));
  };

  const getTotalMarks = () => {
    let total = 0;
    chapters.forEach(chapter => {
      total += chapter.mcq * 1;
      total += chapter.twoMark * 2;
      total += chapter.threeMark * 3;
      total += chapter.fourMark * 4;
      total += chapter.fiveMark * 5;
      total += chapter.sixMark * 6;
    });
    return total;
  };

  const generateQuestionPaper = async () => {
    console.log('generateQuestionPaper function called');
    
    if (chapters.length === 0) {
      toast.error('Please add at least one chapter');
      return;
    }

    try {
      const totalMarks = getTotalMarks();
      let chaptersDetails = chapters.map(chapter => {
        return `
Chapter: ${chapter.name}
- 1 Mark Questions (MCQ): ${chapter.mcq}
- 2 Mark Questions: ${chapter.twoMark}
- 3 Mark Questions: ${chapter.threeMark}
- 4 Mark Questions: ${chapter.fourMark}
- 5 Mark Questions: ${chapter.fiveMark}
- 6 Mark Questions: ${chapter.sixMark}
        `;
      }).join('\n');

      const prompt = `
Generate a complete question paper with the following requirements:

Subject: ${subject || 'General Subject'}
Grade: ${grade || 'High School'}
Board: ${board || 'General Board'}
Total Marks: ${totalMarks}

Chapter-wise distribution:
${chaptersDetails}

Please format the question paper with:
1. Clear section headers
2. Properly numbered questions
3. Marking scheme shown next to each question
4. Time duration recommendation
5. General instructions at the beginning

Generate actual questions that are appropriate for the subject and grade level. Use proper mathematical notation where applicable, including fractions using \frac{numerator}{denominator} format, trigonometric functions, and mathematical symbols.
`;

      console.log('Calling AI for question generation');
      const result = await callAI(prompt, 'question-generator');
      
      if (result && result.response) {
        setGeneratedQuestions(result.response);
        setShowPreview(true);
        toast.success('Question paper generated successfully!');
      } else {
        toast.error('Failed to generate question paper');
      }
    } catch (error) {
      console.error('Error generating question paper:', error);
      toast.error('An error occurred while generating the question paper');
    }
  };

  const downloadQuestionPaper = () => {
    if (!generatedQuestions) return;
    
    const filename = `${subject || 'Subject'}_${grade || 'Grade'}_Question_Paper.pdf`;
    downloadAsPDF(generatedQuestions, filename);
    toast.success('Question paper PDF downloaded!');
  };

  const renderFormattedQuestions = (text: string) => {
    const cleanText = prepareMathContent(cleanAIResponse(text));
    return cleanText.split('\n\n').map((paragraph, idx) => {
      if (paragraph.trim()) {
        if (paragraph.toLowerCase().includes('section') || paragraph.toLowerCase().includes('part')) {
          return (
            <h3 key={idx} className="font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 text-lg">
              <MathRenderer content={paragraph} />
            </h3>
          );
        } else if (paragraph.match(/^\d+\./)) {
          return (
            <div key={idx} className="mb-4 pl-4 border-l-3 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-r-lg">
              <div className="text-gray-800 dark:text-gray-200 font-medium">
                <MathRenderer content={paragraph} />
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="text-gray-700 dark:text-gray-300 mb-3 text-base leading-relaxed">
              <MathRenderer content={paragraph} />
            </div>
          );
        }
      }
      return <br key={idx} />;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <FileText className="h-6 w-6" />
            <span>AI Question Paper Generator</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Generate custom question papers using AI for any subject and grade
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

      {showPreview && generatedQuestions ? (
        <>
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Generated Question Paper</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  AI-generated questions based on your specifications
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Back to Editor
                </Button>
                <Button 
                  onClick={downloadQuestionPaper}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="prose dark:prose-invert max-w-none">
                  {renderFormattedQuestions(generatedQuestions)}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Paper Configuration</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Set up your question paper requirements
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="chapters">Add Chapters</Label>
                    <Badge variant="outline" className="text-blue-500">
                      Total: {getTotalMarks()} marks
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      id="chapters"
                      placeholder="Enter chapter name"
                      value={chapterInput}
                      onChange={(e) => setChapterInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addChapter()}
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                    <Button onClick={addChapter} size="sm" className="bg-green-500 hover:bg-green-600">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapters Table */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Chapter Questions</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Configure number of questions for each chapter
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chapters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chapters added yet. Start by adding chapters above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chapters.map((chapter) => (
                      <div key={chapter.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">{chapter.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChapter(chapter.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <Label>1M (MCQ)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.mcq}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'mcq', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label>2M</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.twoMark}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'twoMark', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label>3M</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.threeMark}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'threeMark', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label>4M</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.fourMark}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'fourMark', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label>5M</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.fiveMark}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'fiveMark', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label>6M</Label>
                            <Input
                              type="number"
                              min="0"
                              value={chapter.sixMark}
                              onChange={(e) => updateChapterQuestions(chapter.id, 'sixMark', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          {chapters.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  <Button
                    onClick={generateQuestionPaper}
                    disabled={isGenerating}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 mr-2" />
                        Generate Question Paper
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionGenerator;
