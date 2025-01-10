export default function BookCardSkeleton() {
  return (
    <div className="relative w-[180px] bg-background px-4 py-2 transition-shadow rounded-lg">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted animate-pulse" />

      <div className="flex justify-between items-center p-4 space-x-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
      </div>
    </div>
  );
}
