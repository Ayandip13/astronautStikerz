export function ProductGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 ${className}`}>
      {children}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <ProductGrid>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col group relative flex-1 h-full rounded-[2rem] bg-white border border-foreground/5 p-4 shadow-sm">
          <div className="w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" style={{ paddingBottom: '100%' }} />
          <div className="mt-4 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </ProductGrid>
  );
}
