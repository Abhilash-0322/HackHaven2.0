import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const config = {
  info: { icon: Info, classes: 'border-slate-200 bg-slate-50 text-slate-700' },
  success: { icon: CheckCircle, classes: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  warning: { icon: AlertTriangle, classes: 'border-amber-200 bg-amber-50 text-amber-900' },
  danger: { icon: AlertCircle, classes: 'border-rose-200 bg-rose-50 text-rose-900' },
};

export default function Alert({ children, variant = 'info', title, className = '' }) {
  const { icon: Icon, classes } = config[variant];
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${classes} ${className}`} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <div className={title ? 'mt-1 text-sm opacity-90' : 'text-sm'}>{children}</div>
      </div>
    </div>
  );
}
