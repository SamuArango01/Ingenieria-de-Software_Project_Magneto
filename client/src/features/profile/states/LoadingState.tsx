import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-32 w-full bg-gray-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton key="stats-1" className="h-32 bg-gray-800 rounded-xl" />
          <Skeleton key="stats-2" className="h-32 bg-gray-800 rounded-xl" />
          <Skeleton key="stats-3" className="h-32 bg-gray-800 rounded-xl" />
        </div>
        <Skeleton className="h-96 bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}