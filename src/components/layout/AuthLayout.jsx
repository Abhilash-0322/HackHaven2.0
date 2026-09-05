import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-glow to-cyan-glow flex items-center justify-center shadow-lg shadow-violet-glow/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-2 font-mono">{subtitle}</p>}
        </div>
        <div className="glass gradient-border rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
