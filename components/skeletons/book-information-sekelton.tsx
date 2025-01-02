export default function BookInformationSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background p-2">
      <div className="mx-auto max-w-6xl">
        <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="h-[450px] w-full bg-muted animate-pulse rounded" />

          <div className="space-y-6">
            <div>
              <div className="h-10 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-6 w-1/2 bg-muted animate-pulse rounded mt-2" />
            </div>

            <div>
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            </div>

            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, colIndex) => (
                <div key={colIndex} className="space-y-4">
                  {[...Array(3)].map((_, rowIndex) => (
                    <div key={rowIndex}>
                      <div className="h-5 w-2/3 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
