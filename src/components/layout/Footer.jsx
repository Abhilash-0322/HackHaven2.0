import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-white">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Bot className="h-4 w-4 text-brand-600" />
          <span>ZenHeaven — a little more calm, every day.</span>
        </div>
        <p className="text-xs text-slate-400">
          For educational use. In crisis, call{' '}
          <a href="tel:988" className="font-medium text-rose-600 hover:underline">988</a>
          {' '}or your local emergency services.
        </p>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link to="/chat" className="hover:text-brand-600">Support</Link>
          <Link to="/therapists" className="hover:text-brand-600">Therapists</Link>
        </div>
      </div>
    </footer>
  );
}
