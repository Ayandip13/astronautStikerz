export function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-8 flex flex-col items-center justify-center text-center ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
