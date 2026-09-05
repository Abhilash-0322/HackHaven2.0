export default function Button({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled, ...props }) {
  const variants = { primary: 'editorial-btn-primary', secondary: 'editorial-btn-secondary', ghost: 'editorial-btn-ghost' };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: '', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
      {children}
    </button>
  );
}
