
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, FileText } from 'lucide-react';
import KaTeXRenderer from '@/components/KaTeXRenderer';

interface PDFPreviewProps {
  content: string;
  title: string;
  onDownload: () => void;
  onBack?: () => void;
}

const PDFPreview = ({ content, title, onDownload, onBack }: PDFPreviewProps) => {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    // Process content to ensure proper formatting for PDF
    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\d+\.\s*/gm, '<br><strong>$&</strong>')
      .replace(/^#{1,3}\s*(.*?)$/gm, '<h3>$1</h3>')
      .replace(/\n\n/g, '<br><br>');
    
    setProcessedContent(cleanContent);
  }, [content]);

  const generatePDFPreview = () => {
    return (
      <div className="pdf-preview bg-white p-8 rounded-lg border shadow-sm max-h-96 overflow-y-auto">
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm mt-2">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="content space-y-4">
          {content.split('\n\n').map((paragraph, index) => {
            if (paragraph.trim()) {
              const isHeading = paragraph.toLowerCase().includes('section') || 
                               paragraph.toLowerCase().includes('part') || 
                               paragraph.match(/^\d+\./);
              
              if (isHeading) {
                return (
                  <div key={index} className="font-bold text-lg text-gray-900 mt-6 mb-3">
                    <KaTeXRenderer content={paragraph} />
                  </div>
                );
              } else if (paragraph.match(/^\d+\./)) {
                return (
                  <div key={index} className="mb-4 pl-4 border-l-4 border-blue-400 bg-blue-50 p-3 rounded-r">
                    <KaTeXRenderer content={paragraph} />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="text-gray-800 leading-relaxed">
                    <KaTeXRenderer content={paragraph} />
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <FileText className="h-5 w-5" />
            <span>PDF Preview</span>
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <Eye className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
          )}
          <Button onClick={onDownload} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {generatePDFPreview()}
      </CardContent>
    </Card>
  );
};

export default PDFPreview;
