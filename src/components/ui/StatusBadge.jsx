export default function StatusBadge({ status = 'online', label }) {
  const colors = {
    online: 'bg-emerald-500',
    thinking: 'bg-amber-400 animate-pulse',
    streaming: 'bg-cyan-glow animate-pulseGlow',
    offline: 'bg-gray-500',
  };
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono text-gray-400">
      <span className={`w-2 h-2 rounded-full ${colors[status] || colors.online}`} />
      {label || status}
    </span>
  );
}
