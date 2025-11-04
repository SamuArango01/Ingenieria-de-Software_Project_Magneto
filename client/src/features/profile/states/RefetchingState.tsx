import { RefreshCw } from "lucide-react";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsCards } from "../components/StatsCards";
import { ProgressChart } from "../components/ProgressChart";
import { StrengthsWeaknesses } from "../components/StrengthsWeaknesses";
import { CandidateProfile } from "../types/candidate";

interface RefetchingStateProps {
  readonly profile: CandidateProfile;
  readonly performance: {
    readonly level: string;
    readonly color: string;
  };
  readonly formatDuration: (seconds: number) => string;
}

export function RefetchingState({ profile, performance, formatDuration }: RefetchingStateProps) {
  return (
    <div className="min-h-screen bg-gray-900 p-6 relative">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-400">Actualizando...</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-8 opacity-50">
        <ProfileHeader profile={profile} performance={performance} />
        <StatsCards 
          profile={profile} 
          performance={performance}
          formatDuration={formatDuration}
        />
        <ProgressChart interviewHistory={profile.interviewHistory} />
        <StrengthsWeaknesses 
          strengths={profile.strengths} 
          weaknesses={profile.weaknesses} 
        />
      </div>
    </div>
  );
}