export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label htmlFor={inputId} className="block font-sans text-sm font-medium text-charcoal">{label}</label>}
      <input id={inputId} className={`editorial-input ${error ? 'border-red-400' : ''}`} {...props} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
