import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-16 w-full" /> {/* Header */}
      <Skeleton className="h-12 w-full mt-2" /> {/* Categories */}
      <div className="max-w-[1600px] mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
