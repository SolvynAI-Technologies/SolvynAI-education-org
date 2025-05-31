import React, { useState, useEffect } from 'react';
// Remove unused import since uuidv4 is not used in this component
import { useAI } from '@/hooks/useAI';
import { generatePDFWithKaTeX } from '@/utils/pdfGenerator';
import MathRenderer from '@/components/MathRenderer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, Eye, FileText, Plus, Trash2, Printer, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cleanAIResponse, prepareMathContent } from '@/utils/formatUtils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
  const { generateText, loading: isGenerating, error } = useAI();
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [board, setBoard] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [paperTitle, setPaperTitle] = useState('');
  const [timeAllowed, setTimeAllowed] = useState('3 hours');
  const [maxMarks, setMaxMarks] = useState(0);

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
      setMaxMarks(totalMarks);
      
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

      // Set default paper title if not provided
      if (!paperTitle) {
        setPaperTitle(`${subject || 'General Subject'} Question Paper - ${grade || 'High School'}`);
      }

      const prompt = `
Generate a complete question paper with the following requirements:

Subject: ${subject || 'General Subject'}
Grade: ${grade || 'High School'}
Board: ${board || 'General Board'}
Total Marks: ${totalMarks}
Time Allowed: ${timeAllowed}

Chapter-wise distribution:
${chaptersDetails}

Please format the question paper with:
1. Clear section headers (like "Section A: MCQs", "Section B: Short Answer", etc.)
2. Properly numbered questions (1, 2, 3, etc.)
3. Marking scheme shown next to each question in parentheses, e.g., "(5 marks)"
4. General instructions at the beginning

IMPORTANT FORMATTING INSTRUCTIONS:
- For mathematical expressions, use proper LaTeX notation:
  * Fractions: \frac{numerator}{denominator}
  * Powers: x^{2} or x^2
  * Subscripts: x_{1} or x_1
  * Square roots: \sqrt{x}
  * Trigonometric functions: \sin, \cos, \tan
  * Greek letters: \alpha, \beta, \gamma, \theta, \pi
  * Integrals: \int_{a}^{b}
  * Summations: \sum_{i=1}^{n}
  * Limits: \lim_{x \to 0}
  * Wrap all mathematical expressions in $ symbols, e.g., $\frac{1}{2}$

Generate actual questions that are appropriate for the subject and grade level. Each question should be clear, concise, and academically rigorous.
`;

      console.log('Calling AI for question generation');
      const response = await generateText(prompt);
      
      if (response) {
        setGeneratedQuestions(response);
        setActiveTab('preview');
        toast.success('Question paper generated successfully!');
      } else {
        toast.error('Failed to generate question paper');
      }
    } catch (error) {
      console.error('Error generating question paper:', error);
      toast.error('An error occurred while generating the question paper');
    }
  };

  const downloadQuestionPaper = async () => {
    if (!generatedQuestions) return;
    
    try {
      setPdfGenerating(true);
      
      // Prepare title and metadata for the PDF
      const title = paperTitle || `${subject || 'Subject'} Question Paper - ${grade || 'Grade'}`;
      const subtitle = `${board || 'General Board'} - ${timeAllowed} - ${maxMarks} Marks`;
      const date = new Date().toLocaleDateString();
      
      // Generate the PDF with proper formatting
      await generatePDFWithKaTeX({
        content: generatedQuestions,
        title: title,
        subtitle: subtitle,
        date: date,
        filename: `${subject || 'Subject'}_Question_Paper_${grade || 'Grade'}.pdf`
      });

      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setPdfGenerating(false);
    }
  };

  const renderFormattedQuestions = () => {
    if (!generatedQuestions) return null;

    const sections = generatedQuestions.split(/\n(?=Section [A-Z]:)/).filter(s => s.trim() !== '');

    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      const sectionTitle = lines[0];
      const sectionContent = lines.slice(1);

      // Separate instructions from questions within the section
      let instructions: string[] = [];
      let questions: string[] = [];
      let currentQuestion: string[] = [];
      let inInstructions = true;

      sectionContent.forEach(line => {
        // Check if the line starts with a number followed by a period, indicating a new question
        if (/^\d+\./.test(line.trim())) {
          if (currentQuestion.length > 0) {
            questions.push(currentQuestion.join('\n'));
            currentQuestion = [];
          }
          inInstructions = false;
        }

        if (inInstructions) {
          instructions.push(line);
        } else {
          currentQuestion.push(line);
        }
      });

      if (currentQuestion.length > 0) {
        questions.push(currentQuestion.join('\n'));
      }

      return (
        <div key={sectionIndex} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
          {instructions.length > 0 && (
            <Card className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
              <CardContent>
                {instructions.map((instruction, i) => (
                  <MathRenderer key={i} content={instruction} className="text-sm text-gray-700 dark:text-gray-300" />
                ))}
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            {questions.map((question, questionIndex) => {
              const questionNumberMatch = question.match(/^(\d+)\./);
              const questionNumber = questionNumberMatch ? questionNumberMatch[1] : '';
              const questionText = questionNumberMatch ? question.substring(questionNumberMatch[0].length).trim() : question.trim();

              const markMatch = questionText.match(/\((\d+)\s*marks?\)/);
              const marks = markMatch ? parseInt(markMatch[1], 10) : null;
              const displayQuestionText = markMatch ? questionText.replace(markMatch[0], '').trim() : questionText;

              return (
                <Card key={questionIndex} className="p-4">
                  <CardHeader className="flex flex-row items-start justify-between p-0 mb-2">
                    <CardTitle className="text-lg font-semibold">
                      {questionNumber && <span className="mr-2">{questionNumber}.</span>}
                      <MathRenderer content={displayQuestionText} />
                    </CardTitle>
                    {marks !== null && (
                      <Badge variant="secondary" className="ml-auto">
                        {marks} Mark{marks !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Additional content for question if needed */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Question Paper Generator 📝</h1>
        <p className="text-purple-100 text-lg">Generate custom question papers with AI in minutes!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Paper Configuration</CardTitle>
              <CardDescription>Set up the details for your question paper.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paperTitle">Paper Title</Label>
                  <Input
                    id="paperTitle"
                    placeholder="e.g., Midterm Exam - Algebra I"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timeAllowed">Time Allowed</Label>
                  <Input
                    id="timeAllowed"
                    placeholder="e.g., 3 hours"
                    value={timeAllowed}
                    onChange={(e) => setTimeAllowed(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Middle School">Middle School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="board">Board/Curriculum</Label>
                  <Select value={board} onValueChange={setBoard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                      <SelectItem value="Cambridge">Cambridge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Chapters and Marks Distribution</CardTitle>
              <CardDescription>Add chapters and specify marks for each question type.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add new chapter e.g., 'Algebra'"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addChapter();
                    }
                  }}
                />
                <Button onClick={addChapter}><Plus className="mr-2 h-4 w-4" />Add Chapter</Button>
              </div>
              <div className="space-y-4">
                {chapters.map(chapter => (
                  <Card key={chapter.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{chapter.name}</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeChapter(chapter.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {Object.keys(chapter).filter(key => key !== 'id' && key !== 'name').map(key => (
                        <div key={key}>
                          <Label htmlFor={`${chapter.id}-${key}`}>{key.replace(/([A-Z])/g, ' $1').trim()} ({key === 'mcq' ? '1' : key === 'twoMark' ? '2' : key === 'threeMark' ? '3' : key === 'fourMark' ? '4' : key === 'fiveMark' ? '5' : '6'} Mark)</Label>
                          <Input
                            id={`${chapter.id}-${key}`}
                            type="number"
                            min="0"
                            value={chapter[key as keyof Omit<Chapter, 'id' | 'name'>]}
                            onChange={(e) => updateChapterQuestions(chapter.id, key as keyof Omit<Chapter, 'id' | 'name'>, parseInt(e.target.value) || 0)}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
              <p className="text-lg font-semibold">Total Marks: {getTotalMarks()}</p>
              <Button onClick={generateQuestionPaper} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Question Paper'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Question Paper Preview</span>
                <div className="flex space-x-2">
                  <Button onClick={downloadQuestionPaper} disabled={pdfGenerating || !generatedQuestions}>
                    {pdfGenerating ? 'Generating PDF...' : <><Download className="mr-2 h-4 w-4" />Download PDF</>}
                  </Button>
                  <Button variant="outline" onClick={() => console.log('Share clicked')} disabled={!generatedQuestions}>
                    <Share2 className="mr-2 h-4 w-4" />Share
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Review the generated question paper before downloading.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedQuestions ? (
                <div>
                  <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-xl font-bold mb-1">{paperTitle}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time Allowed: {timeAllowed} | Max Marks: {maxMarks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  {renderFormattedQuestions()}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>No question paper generated yet. Go to the Editor tab to create one.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionGenerator;
