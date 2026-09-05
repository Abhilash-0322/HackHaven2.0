export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-clinical-700">
          {label}
        </label>
      )}
      <input id={inputId} className={`clinical-input ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
