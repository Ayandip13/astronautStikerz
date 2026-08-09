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
        <div key={i} className="animate-pulse flex flex-col">
          <div className="aspect-square w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </ProductGrid>
  );
}
