import calmLogo from '../../assets/Calm.png';
import ThemeToggle from '../ui/ThemeToggle';
export default function AuthShell({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-organic-gradient dark:bg-organic-gradient-dark bg-leaf-pattern">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mint-200/30 to-sage-200/20" />
        <div className="relative text-center max-w-md">
          <img src={calmLogo} alt="ZenHeaven" className="h-20 w-20 mx-auto mb-6 rounded-2xl object-cover" />
          <h2 className="font-display text-4xl font-semibold text-forest mb-4">Your calm space awaits</h2>
          <p className="text-sage-600 text-lg">Breathe, reflect, and grow gently.</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-6 flex justify-end"><ThemeToggle /></div>
        <div className="mx-auto w-full max-w-md organic-card p-8">
          {title && <><h1 className="font-display text-2xl font-semibold text-forest mb-2">{title}</h1>{subtitle && <p className="text-sage-600 mb-6">{subtitle}</p>}</>}
          {children}
        </div>
      </div>
    </div>
  );
}
