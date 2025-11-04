import { InterviewTTSProvider } from "@/features/interviewer-tts/contexts/InterviewTTSContext";

export default function EntrevistadorTTSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InterviewTTSProvider>{children}</InterviewTTSProvider>;
}
