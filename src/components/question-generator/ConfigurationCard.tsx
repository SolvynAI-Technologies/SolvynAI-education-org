
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ConfigurationCardProps {
  grade: string;
  subject: string;
  board: string;
  chapterInput: string;
  totalMarks: number;
  onGradeChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onBoardChange: (value: string) => void;
  onChapterInputChange: (value: string) => void;
  onAddChapter: () => void;
}

const ConfigurationCard = ({
  grade,
  subject,
  board,
  chapterInput,
  totalMarks,
  onGradeChange,
  onSubjectChange,
  onBoardChange,
  onChapterInputChange,
  onAddChapter
}: ConfigurationCardProps) => {
  return (
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
            <Select value={grade} onValueChange={onGradeChange}>
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
            <Select value={subject} onValueChange={onSubjectChange}>
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
          <Select value={board} onValueChange={onBoardChange}>
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
              Total: {totalMarks} marks
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Input
              id="chapters"
              placeholder="Enter chapter name"
              value={chapterInput}
              onChange={(e) => onChapterInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddChapter()}
              className="bg-gray-50 dark:bg-gray-700"
            />
            <Button onClick={onAddChapter} size="sm" className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationCard;
