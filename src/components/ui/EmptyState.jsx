export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      {Icon && <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-cream-dark text-terracotta"><Icon className="h-6 w-6" /></div>}
      <h3 className="font-serif text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-charcoal-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
