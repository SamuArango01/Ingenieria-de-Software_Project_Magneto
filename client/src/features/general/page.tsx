import { CandidatesView } from "./components/CandidatesView";
import { getCandidates } from "./services/candidates-service";

export default async function CandidatesPage() {
  const { data } = await getCandidates();
  
  return <CandidatesView initialCandidates={data} />;
}