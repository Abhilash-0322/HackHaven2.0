export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-terracotta-muted flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-terracotta" />
        </div>
      )}
      <h3 className="font-display text-xl text-editorial-ink mb-2">{title}</h3>
      {description && <p className="font-serif text-charcoal-light max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
