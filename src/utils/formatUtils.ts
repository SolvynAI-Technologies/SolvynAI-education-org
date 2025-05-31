// Clean up AI response formatting by removing special characters and converting markdown-style formatting
export const cleanAIResponse = (text: string): string => {
  return text
    // Remove markdown headers
    .replace(/#{1,6}\s*/g, '')
    // Remove bullet points and list markers
    .replace(/^\s*[-*+]\s*/gm, '')
    // Remove numbered list markers
    .replace(/^\s*\d+\.\s*/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code block markers
    .replace(/```[a-zA-Z]*\n?/g, '')
    // Remove other special characters but keep mathematical symbols and LaTeX

    // Clean up multiple spaces and newlines
    .replace(/\s{2,}/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

// Prepare text for KaTeX rendering by converting common patterns to LaTeX
export const prepareMathContent = (text: string): string => {
  return text
    // Convert LaTeX fractions that are already properly formatted
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$\\frac{$1}{$2}$')
    
    // Convert basic fraction patterns
    .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '$\\frac{$1}{$2}$')
    .replace(/frac(\d+)(\d+)/g, '$\\frac{$1}{$2}$')
    .replace(/(\d+)\/(\d+)/g, '$\\frac{$1}{$2}$')
    
    // Convert trigonometric functions
    .replace(/\bsin\s*/g, '$\\sin$ ')
    .replace(/\bcos\s*/g, '$\\cos$ ')
    .replace(/\btan\s*/g, '$\\tan$ ')
    .replace(/\bcot\s*/g, '$\\cot$ ')
    .replace(/\bsec\s*/g, '$\\sec$ ')
    .replace(/\bcsc\s*/g, '$\\csc$ ')
    
    // Convert degree symbols
    .replace(/(\d+)°/g, '$1^{\\circ}$')
    
    // Convert square roots
    .replace(/sqrt\{([^}]+)\}/g, '$\\sqrt{$1}$')
    .replace(/\\sqrt(\d+)/g, '$\\sqrt{$1}$')
    .replace(/sqrt(\d+)/g, '$\\sqrt{$1}$')
    
    // Convert superscripts and subscripts
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/_(\d+)/g, '_{$1}')
    // Wrap common math patterns in $...$ for KaTeX rendering
    .replace(/([a-zA-Z])\^\{([^}]+)\}|([a-zA-Z])_\{([^}]+)\}|\\(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|tau|phi|omega|pm|mp|times|div|cdot|infty|sum|int|geq|leq|neq|approx|sin|cos|tan|cot|sec|csc)\b|\b([a-zA-Z])(\d+)\b/g, (match, p1, p2, p3, p4, p5, p6, p7) => {
      // Avoid double wrapping if already inside $...$ or $$...$$
      if (match.startsWith('$') || match.startsWith('$$')) {
        return match;
      }
      // Handle cases like x2, y3 as x_2, y_3
      if (p6 && p7 && !isNaN(Number(p7))) {
        return `$${p6}_{${p7}}$`;
      }
      return `$${match}$`;
    })
    // Remove curly braces from Q_{1} to Q1
    .replace(/Q_\{(\d+)\}\./g, 'Q$1.')
    
    // Convert Greek letters
    .replace(/\\alpha\b/gi, '$\\alpha$')
    .replace(/\\beta\b/gi, '$\\beta$')
    .replace(/\\gamma\b/gi, '$\\gamma$')
    .replace(/\\delta\b/gi, '$\\delta$')
    .replace(/\\epsilon\b/gi, '$\\epsilon$')
    .replace(/\\theta\b/gi, '$\\theta$')
    .replace(/\\lambda\b/gi, '$\\lambda$')
    .replace(/\\mu\b/gi, '$\\mu$')
    .replace(/\\pi\b/gi, '$\\pi$')
    .replace(/\\sigma\b/gi, '$\\sigma$')
    .replace(/\\tau\b/gi, '$\\tau$')
    .replace(/\\phi\b/gi, '$\\phi$')
    .replace(/\\omega\b/gi, '$\\omega$')
    
    // Convert mathematical operators
    .replace(/\\pm\b/g, '$\\pm$')
    .replace(/\\mp\b/g, '$\\mp$')
    .replace(/\\times\b/g, '$\\times$')
    .replace(/\\div\b/g, '$\\div$')
    .replace(/\\cdot\b/g, '$\\cdot$')
    .replace(/\\infty\b/g, '$\\infty$')
    .replace(/\\sum\b/g, '$\\sum$')
    .replace(/\\int\b/g, '$\\int$')
    
    // Convert comparison operators
    .replace(/\\geq\b/g, '$\\geq$')
    .replace(/\\leq\b/g, '$\\leq$')
    .replace(/\\neq\b/g, '$\\neq$')
    .replace(/\\approx\b/g, '$\\approx$')
    .replace(/>=/g, '$\\geq$')
    .replace(/<=/g, '$\\leq$')
    .replace(/!=/g, '$\\neq$')
    .replace(/~=/g, '$\\approx$');
};

// Legacy function for backward compatibility
export const formatMathematicalSymbols = (text: string): string => {
  return prepareMathContent(text);
};

// Generate and download PDF with properly formatted math using KaTeX
export const downloadAsPDF = (content: string, filename: string = 'document.pdf') => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  // Clean and format the content
  const cleanContent = prepareMathContent(cleanAIResponse(content));
  
  // Create HTML content for PDF with KaTeX support
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
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .content {
          font-size: 14px;
        }
        .step {
          margin: 20px 0;
          padding: 15px;
          border-left: 3px solid #007bff;
          background-color: #f8f9fa;
        }
        .katex {
          font-size: 1.1em;
        }
        .katex-display {
          margin: 1em 0;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AI Generated Solution</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="content">
        ${cleanContent.split('\n\n').map((paragraph, index) => {
          if (paragraph.trim().toLowerCase().includes('step')) {
            return `<div class="step"><strong>Step ${index + 1}:</strong> ${paragraph}</div>`;
          }
          return `<p>${paragraph}</p>`;
        }).join('')}
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          renderMathInElement(document.body, {
            delimiters: [
              {left: "$$", right: "$$", display: true},
              {left: "$", right: "$", display: false}
            ]
          });
          
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 1000);
        });
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
