export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-sm font-sans font-medium text-charcoal">{label}</label>}
      <input id={inputId} className={`editorial-input ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-sm text-red-600 font-sans">{error}</p>}
    </div>
  );
}
