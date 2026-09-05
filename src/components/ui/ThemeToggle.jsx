import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return <button onClick={toggle} className="p-2.5 rounded-2xl bg-sage-100/80" aria-label="Toggle theme">{dark ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-sage-600" />}</button>;
}
