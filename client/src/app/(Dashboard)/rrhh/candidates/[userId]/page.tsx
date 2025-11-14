import { CandidateProfile } from "@/features/profile/CandidateProfile";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function CandidateProfilePage({ params }: Readonly<PageProps>) {
  const { userId } = await params;

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: ID de candidato no proporcionado</p>
      </div>
    );
  }

  return <CandidateProfile candidateId={userId} />;
}
