export function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-10 flex flex-col items-center justify-center text-center ${className}`}>
      <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-foreground/70 max-w-2xl font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
