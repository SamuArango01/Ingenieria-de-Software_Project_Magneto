'use client';

import { InterviewProvider } from '@/features/interviewer/contexts/InterviewContext';

export default function EntrevistadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
