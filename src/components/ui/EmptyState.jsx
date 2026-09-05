export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-clinical-100 text-clinical-400">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-clinical-900">{title}</h3>}
      {description && <p className="mt-2 max-w-md text-sm text-clinical-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
