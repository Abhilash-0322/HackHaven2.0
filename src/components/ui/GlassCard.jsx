export default function GlassCard({ children, className = '', glow = false }) {
  return <div className={`glass rounded-xl p-5 ${glow ? 'gradient-border' : ''} ${className}`}>{children}</div>;
}
