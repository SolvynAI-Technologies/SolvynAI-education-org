
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer = ({ content, className = '' }: MathRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      document.head.appendChild(script);

      const mathJaxScript = document.createElement('script');
      mathJaxScript.id = 'MathJax-script';
      mathJaxScript.async = true;
      mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      document.head.appendChild(mathJaxScript);

      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true,
          processEnvironments: true
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        }
      };
    }

    // Process the content when MathJax is ready
    const processContent = () => {
      if (containerRef.current && window.MathJax && window.MathJax.typesetPromise) {
        containerRef.current.innerHTML = formatMathContent(content);
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          console.error('MathJax typeset failed:', err);
        });
      }
    };

    if (window.MathJax && window.MathJax.typesetPromise) {
      processContent();
    } else {
      // Wait for MathJax to load
      const checkMathJax = setInterval(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          clearInterval(checkMathJax);
          processContent();
        }
      }, 100);

      return () => clearInterval(checkMathJax);
    }
  }, [content]);

  const formatMathContent = (text: string): string => {
    return text
      // Convert common fraction patterns to LaTeX
      .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
      .replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}')
      .replace(/\bfrac(\d+)(\d+)/g, '\\frac{$1}{$2}')
      
      // Convert basic fractions to LaTeX
      .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
      
      // Convert degree symbols
      .replace(/(\d+)°/g, '$1^\\circ')
      
      // Convert trigonometric functions
      .replace(/\bsin\b/g, '\\sin')
      .replace(/\bcos\b/g, '\\cos')
      .replace(/\btan\b/g, '\\tan')
      .replace(/\bcot\b/g, '\\cot')
      .replace(/\bsec\b/g, '\\sec')
      .replace(/\bcsc\b/g, '\\csc')
      
      // Convert superscripts
      .replace(/\^(\d+)/g, '^{$1}')
      .replace(/\^2/g, '^2')
      .replace(/\^3/g, '^3')
      
      // Convert subscripts
      .replace(/_(\d+)/g, '_{$1}')
      
      // Convert square roots
      .replace(/sqrt(\d+)/g, '\\sqrt{$1}')
      .replace(/\bsqrt\b/g, '\\sqrt')
      
      // Wrap math expressions in proper delimiters
      .replace(/([\\][a-zA-Z]+|[\\]frac\{[^}]+\}\{[^}]+\}|[\\]sqrt\{[^}]+\}|\d+\^\{\d+\}|\d+_\{\d+\})/g, '$$$1$$')
      
      // Clean up multiple dollar signs
      .replace(/\$+/g, '$');
  };

  return (
    <div ref={containerRef} className={`math-content ${className}`}>
      {/* Content will be rendered by MathJax */}
    </div>
  );
};

export default MathRenderer;
