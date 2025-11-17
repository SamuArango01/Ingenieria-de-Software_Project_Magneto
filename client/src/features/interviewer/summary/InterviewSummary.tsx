'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewContext } from '../contexts/InterviewContext';
import { useEvaluateInterview } from './hooks/useEvaluateInterview';
import { InterviewSummaryCard } from './components/InterviewSummaryCard';

export function InterviewSummary() {
  const router = useRouter();
  const {
    interviewId,
    candidateName,
    interviewHistory,
    candidateMetricsHistory,
    resetInterview
  } = useInterviewContext();

  const { evaluateInterview, isLoading } = useEvaluateInterview();
  const [evaluation, setEvaluation] = useState<{
    wouldPass: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (!interviewId || interviewHistory.length === 0) {
      router.push('/entrevistador/init');
      return;
    }

    const fetchEvaluation = async () => {
      try {
        const result = await evaluateInterview({
          interviewHistory,
          candidateMetricsHistory,
          interviewId,
        });
        setEvaluation(result);
      } catch (error) {
        console.error('Error evaluando entrevista:', error);
      }
    };

    fetchEvaluation();
  }, [interviewId, interviewHistory, candidateMetricsHistory, evaluateInterview, router]);

  const handleNewInterview = () => {
    resetInterview();
    router.push('/entrevistador/init');
  };

  if (!interviewId) {
    return null;
  }

  return (
    <div className="min-h-screen pt-4 pb-12 px-6 lg:px-8">
      <InterviewSummaryCard
        candidateName={candidateName || 'Candidato'}
        evaluation={evaluation}
        isLoading={isLoading}
        onNewInterview={handleNewInterview}
      />
    </div>
  );
}
