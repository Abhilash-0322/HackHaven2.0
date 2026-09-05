export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white shadow-soft ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
