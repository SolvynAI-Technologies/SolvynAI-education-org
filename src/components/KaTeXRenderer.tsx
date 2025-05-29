
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KaTeXRendererProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

const KaTeXRenderer = ({ content, className = '', displayMode = false }: KaTeXRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // Process the content and render with KaTeX
        const processedContent = formatMathContent(content);
        
        // Split content by math delimiters and render each part
        const parts = processedContent.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
        
        containerRef.current.innerHTML = '';
        
        parts.forEach(part => {
          const span = document.createElement('span');
          
          if (part.startsWith('$$') && part.endsWith('$$')) {
            // Display math
            const mathContent = part.slice(2, -2);
            katex.render(mathContent, span, {
              displayMode: true,
              throwOnError: false,
              output: 'html'
            });
          } else if (part.startsWith('$') && part.endsWith('$')) {
            // Inline math
            const mathContent = part.slice(1, -1);
            katex.render(mathContent, span, {
              displayMode: false,
              throwOnError: false,
              output: 'html'
            });
          } else {
            // Regular text
            span.textContent = part;
          }
          
          containerRef.current?.appendChild(span);
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = content;
        }
      }
    }
  }, [content, displayMode]);

  const formatMathContent = (text: string): string => {
    return text
      // Convert fractions
      .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
      .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
      
      // Convert trigonometric functions
      .replace(/\bsin\b/g, '\\sin')
      .replace(/\bcos\b/g, '\\cos')
      .replace(/\btan\b/g, '\\tan')
      .replace(/\bcot\b/g, '\\cot')
      .replace(/\bsec\b/g, '\\sec')
      .replace(/\bcsc\b/g, '\\csc')
      
      // Convert degree symbols
      .replace(/(\d+)°/g, '$1^\\circ')
      
      // Convert square roots
      .replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}')
      .replace(/sqrt(\d+)/g, '\\sqrt{$1}')
      
      // Convert superscripts and subscripts
      .replace(/\^(\d+)/g, '^{$1}')
      .replace(/_(\d+)/g, '_{$1}')
      
      // Convert Greek letters
      .replace(/\\(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|tau|phi|omega)\b/gi, '\\$1')
      
      // Wrap math expressions in dollar signs if not already wrapped
      .replace(/\\[a-zA-Z]+\{[^}]*\}|\\[a-zA-Z]+|\^{[^}]*}|_{[^}]*}/g, (match) => {
        if (!text.includes('$' + match + '$') && !text.includes('$$' + match + '$$')) {
          return '$' + match + '$';
        }
        return match;
      });
  };

  return (
    <div ref={containerRef} className={`katex-content ${className}`}>
      {/* Content will be rendered by KaTeX */}
    </div>
  );
};

export default KaTeXRenderer;
