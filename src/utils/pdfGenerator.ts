
interface PDFOptions {
  content: string;
  filename?: string;
  title?: string;
  subtitle?: string;
  date?: string;
}

export const generatePDFWithKaTeX = (options: PDFOptions) => {
  const { 
    content, 
    filename = 'document.pdf',
    title = filename.replace('.pdf', ''),
    subtitle = '',
    date = new Date().toLocaleDateString()
  } = options;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  // Clean and format the content for better PDF output
  const formatContentForPDF = (text: string): string => {
    return text
      // Clean markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Format questions and sections
      .replace(/^\d+\.\s*(.*?)$/gm, '<div class="question"><strong>$&</strong></div>')
      .replace(/^#{1,3}\s*(.*?)$/gm, '<h3 class="section-header">$1</h3>')
      
      // Handle mathematical expressions - convert to KaTeX format
      .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
      .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
      .replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}')
      .replace(/\^(\d+)/g, '^{$1}')
      .replace(/_(\d+)/g, '_{$1}')
      .replace(/(\d+)°/g, '$1^{\\circ}')
      
      // Trigonometric functions
      .replace(/\b(sin|cos|tan|cot|sec|csc)\b/g, '\\$1')
      
      // Wrap math expressions in delimiters
      .replace(/(\\[a-zA-Z]+(?:\{[^}]*\})*|\^{[^}]*}|_{[^}]*})/g, ' $$$1$$ ')
      
      // Clean up formatting
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  const formattedContent = formatContentForPDF(content);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
      <style>
        @page {
          margin: 1in;
          size: A4;
        }
        
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #333;
          font-size: 14px;
          max-width: 100%;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        
        .header h2 {
          margin: 8px 0 0 0;
          font-size: 16px;
          font-weight: normal;
          color: #555;
        }
        
        .section-header {
          font-size: 18px;
          font-weight: bold;
          margin: 25px 0 15px 0;
          color: #2563eb;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        
        .question {
          margin: 15px 0;
          padding: 10px 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #3b82f6;
          border-radius: 0 4px 4px 0;
        }
        
        .content {
          line-height: 1.8;
        }
        
        .content p {
          margin: 10px 0;
          text-align: justify;
        }
        
        .katex {
          font-size: 1.1em;
        }
        
        .katex-display {
          margin: 1em 0;
          text-align: center;
        }
        
        strong {
          font-weight: 600;
        }
        
        .instructions {
          background-color: #f0f7ff;
          border: 1px solid #cce5ff;
          border-radius: 4px;
          padding: 10px 15px;
          margin-bottom: 20px;
          font-style: italic;
        }
        
        @media print {
          body { 
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { 
            display: none; 
          }
          .question {
            break-inside: avoid;
          }
          .section-header {
            break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        ${subtitle ? `<h2>${subtitle}</h2>` : ''}
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Generated on ${date}</p>
      </div>
      
      <div class="content">
        <p>${formattedContent}</p>
      </div>
      
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // Render KaTeX after content loads
          if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
              delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
              ],
              throwOnError: false,
              errorColor: '#cc0000',
              strict: false
            });
          }
          
          // Auto-print after rendering
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 1500);
        });
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
