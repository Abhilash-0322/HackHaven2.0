const styles = {
  default: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-50 text-brand-700',
  agent: 'bg-agent-50 text-agent-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-rose-50 text-rose-700',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
