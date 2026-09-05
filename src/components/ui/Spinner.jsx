export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={`${s[size]} animate-spin rounded-full border-2 border-cream-dark border-t-terracotta ${className}`} />;
}
