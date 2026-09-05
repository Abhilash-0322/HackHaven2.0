export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div className={`editorial-card ${padding ? '' : 'p-0'} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, children, className = '' }) {
  return (
    <div className={`mb-4 flex items-start justify-between gap-4 ${className}`}>
      {children || (
        <div>
          {title && <h3 className="font-display text-xl text-editorial-ink">{title}</h3>}
          {description && <p className="font-serif text-sm text-charcoal-light mt-1">{description}</p>}
        </div>
      )}
      {action}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-display text-xl text-editorial-ink ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`font-serif text-sm text-charcoal-light mt-1 ${className}`}>{children}</p>;
}
