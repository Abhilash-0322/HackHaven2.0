const variants = {
  default: 'bg-terracotta-muted text-terracotta',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  neutral: 'bg-cream-dark text-charcoal-light',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`editorial-badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
