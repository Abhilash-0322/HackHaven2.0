export default function Card({ children, className = '', padding = true, ...props }) {
  return <div className={`editorial-card ${padding ? 'p-6' : ''} ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      {title && <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>}
      {action}
    </div>
  );
}
