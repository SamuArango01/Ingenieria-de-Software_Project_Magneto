// src/app/(Dashboard)/entrevistador/components/InterviewHistory/InterviewHistory.tsx
import ReactMarkdown from 'react-markdown';

interface InterviewHistoryProps {
  transcribedText: string;
  aiResponse: string;
  interviewHistory: Array<{ user: string; ai: string }>;
  initialQuestion?: string;
}

export function InterviewHistory({ 
  transcribedText, 
  aiResponse, 
  interviewHistory,
  initialQuestion 
}: InterviewHistoryProps) {
  

  const getCurrentQuestion = () => {

    if (aiResponse) {
      return aiResponse;
    }
    
    if (initialQuestion) {
      return initialQuestion;
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="mt-6">
  
      <div className="p-6 bg-blue-900/30 border border-blue-700 rounded-lg">
        <h4 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
          <span className="bg-blue-600 p-1 rounded">🤖</span>
          {interviewHistory.length === 0 ? "Primera Pregunta" : "Siguiente Pregunta"}
        </h4>
        <div className="text-white text-base leading-relaxed bg-gray-800/50 p-4 rounded-lg">
          <ReactMarkdown
            components={{
              strong: ({children}) => <strong className="font-bold text-blue-100">{children}</strong>,
              p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({children}) => <li className="ml-2">{children}</li>
            }}
          >
            {currentQuestion}
          </ReactMarkdown>
        </div>
      </div>

  
      <div className="text-center text-gray-400 text-sm mt-3">
        {interviewHistory.length > 0 ? 
          `Pregunta ${interviewHistory.length + 1} en progreso` :
          "Comienza respondiendo la primera pregunta"
        }
      </div>
    </div>
  );
}