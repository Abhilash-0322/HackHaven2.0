export default function PageHeader({ number, title, subtitle, actions, className = '' }) {
  return (
    <header className={`mb-8 md:mb-12 ${className}`}>
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div className="max-w-2xl">
          {number && <p className="editorial-section-number">{number}</p>}
          <h1 className="font-display text-3xl md:text-4xl text-editorial-ink mb-3">{title}</h1>
          {subtitle && <p className="font-serif text-lg text-charcoal-light leading-relaxed">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="editorial-rule mt-8" />
    </header>
  );
}
