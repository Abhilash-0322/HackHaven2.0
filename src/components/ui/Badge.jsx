const variants = {
  default: 'border-charcoal/20 bg-cream-muted text-charcoal',
  accent: 'border-terracotta/30 bg-terracotta/10 text-terracotta-dark',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return <span className={`inline-flex items-center rounded-sm border px-2.5 py-0.5 font-sans text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
}
