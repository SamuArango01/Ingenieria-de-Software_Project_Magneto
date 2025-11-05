import { CandidatesView } from "./components/CandidatesView";
import { getCandidates } from "./services/candidates-service";

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  
  return <CandidatesView initialCandidates={candidates} />;
}