import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4 bg-gray-700 rounded" />
            <Skeleton className="h-3 w-1/6 bg-gray-700 rounded" />
          </div>
          <Skeleton className="h-8 w-20 bg-gray-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
}