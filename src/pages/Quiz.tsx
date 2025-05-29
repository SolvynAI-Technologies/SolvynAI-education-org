
import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';
import QuizConfiguration, { QuizConfig } from '@/components/quiz/QuizConfiguration';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { questionIndex: number; selected: number; correct: number }[];
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { callAI, loading } = useAI();

  const generateQuiz = async (config: QuizConfig) => {
    const finalNumQuestions = config.numQuestions === 0 ? parseInt(config.customNumQuestions) || 5 : config.numQuestions;

    const prompt = `Create a ${config.difficulty} level quiz for ${config.grade} grade students following ${config.board} board curriculum about ${config.topic} in ${config.subject}. 
    Generate exactly ${finalNumQuestions} multiple choice questions with 4 options each.
    ${config.userType === 'teacher' ? 'Make this suitable for testing students and include detailed explanations.' : 'Make this educational and engaging for learning.'}
    ${config.customPrompt ? `Additional requirements: ${config.customPrompt}` : ''}
    
    Format the response as a JSON array with this structure:
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation of why this is correct"
      }
    ]
    
    Make sure:
    - Questions are appropriate for ${config.grade} grade level
    - Content aligns with ${config.board} board curriculum standards
    - Questions are clear and unambiguous
    - Options are plausible but only one is clearly correct
    - Include explanations for each correct answer
    - Questions cover different aspects of the topic
    - Difficulty matches the requested level`;

    try {
      const response = await callAI(prompt, 'question-generator');
      
      if (response?.response) {
        try {
          const jsonMatch = response.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedQuestions = JSON.parse(jsonMatch[0]);
            setQuestions(parsedQuestions);
            setQuizStarted(true);
            setCurrentQuestionIndex(0);
            setSelectedAnswers(new Array(parsedQuestions.length).fill(-1));
            setSelectedAnswer(null);
            setQuizCompleted(false);
            setQuizResult(null);
            toast.success('Quiz generated successfully!');
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.error('Error parsing questions:', parseError);
          toast.error('Error parsing quiz questions. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setSelectedAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(newAnswers[currentQuestionIndex + 1] !== -1 ? newAnswers[currentQuestionIndex + 1] : null);
      } else {
        completeQuiz(newAnswers);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex - 1] !== -1 ? selectedAnswers[currentQuestionIndex - 1] : null);
    }
  };

  const completeQuiz = (finalAnswers: number[]) => {
    let correctCount = 0;
    const answerDetails = finalAnswers.map((selected, index) => {
      const correct = questions[index].correctAnswer;
      if (selected === correct) correctCount++;
      return {
        questionIndex: index,
        selected,
        correct
      };
    });

    const result: QuizResult = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      answers: answerDetails
    };

    setQuizResult(result);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setSelectedAnswer(null);
    setQuizResult(null);
  };

  if (quizCompleted && quizResult) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <QuizResults 
          result={quizResult} 
          questions={questions} 
          onRestart={resetQuiz} 
        />
      </div>
    );
  }

  if (quizStarted && questions.length > 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNextQuestion}
          onPrevious={handlePreviousQuestion}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <QuizConfiguration onGenerateQuiz={generateQuiz} loading={loading} />
    </div>
  );
};

export default Quiz;
