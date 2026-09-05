import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const icons = { error: AlertCircle, danger: AlertCircle, success: CheckCircle, info: Info, warning: AlertTriangle };
const styles = {
  error: 'border-red-200 bg-red-50 text-red-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-editorial-border bg-cream-light text-charcoal',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function Alert({ children, variant = 'info', title, className = '' }) {
  const Icon = icons[variant] || Info;
  return (
    <div className={`flex gap-3 p-4 border rounded-sm font-sans text-sm ${styles[variant] || styles.info} ${className}`}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div>{title && <p className="font-medium mb-1">{title}</p>}<div>{children}</div></div>
    </div>
  );
}
