import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'editorial-btn-primary',
  secondary: 'editorial-btn-secondary',
  ghost: 'editorial-btn-ghost',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: '',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
