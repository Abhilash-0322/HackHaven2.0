import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin text-violet-glow" />
      <span className="text-xs font-mono">{label}</span>
    </div>
  );
}
