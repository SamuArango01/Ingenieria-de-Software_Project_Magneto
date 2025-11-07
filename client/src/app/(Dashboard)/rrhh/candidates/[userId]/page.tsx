import { CandidateProfile } from "@/features/profile/CandidateProfile";

interface PageProps {
  params: {
    userId: string;
  };
}

export default function CandidateProfilePage({ params }: Readonly<PageProps>) {
  const { userId } = params;

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: ID de candidato no proporcionado</p>
      </div>
    );
  }

  return <CandidateProfile candidateId={userId} />;
}
