
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import "./App.css";

const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const TodoList = lazy(() => import("@/pages/TodoList"));
const QuestionGenerator = lazy(() => import("@/pages/QuestionGenerator"));
const AnswerAnalyzer = lazy(() => import("@/pages/AnswerAnalyzer"));
const DoubtSolver = lazy(() => import("@/pages/DoubtSolver"));
const FocusMode = lazy(() => import("@/pages/FocusMode"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Auth = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <div className="w-full h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="question-generator" element={<QuestionGenerator />} />
            <Route path="answer-analyzer" element={<AnswerAnalyzer />} />
            <Route path="doubt-solver" element={<DoubtSolver />} />
            <Route path="todo" element={<TodoList />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="quiz" element={<Quiz />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
