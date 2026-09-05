import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const icons = { info: Info, success: CheckCircle, warning: AlertTriangle, error: AlertCircle };
const styles = {
  info: 'border-terracotta/30 bg-terracotta/5 text-charcoal',
  success: 'border-green-300 bg-green-50 text-green-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
  error: 'border-red-300 bg-red-50 text-red-800',
};

export default function Alert({ children, variant = 'info', className = '', onClose }) {
  const Icon = icons[variant];
  return (
    <div className={`flex items-start gap-3 rounded-sm border p-4 ${styles[variant]} ${className}`} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 text-sm">{children}</div>
      {onClose && <button onClick={onClose} aria-label="Dismiss">×</button>}
    </div>
  );
}
