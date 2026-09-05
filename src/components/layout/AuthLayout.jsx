import { Link } from 'react-router-dom';
import calmLogo from '../../assets/Calm.png';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-clinical-900 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <img src={calmLogo} alt="ZenHeaven" className="h-10 w-10 rounded-xl object-cover" />
          <span className="text-xl font-semibold">ZenHeaven</span>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Clinical-precision mental wellness</h1>
          <p className="mt-4 max-w-md text-clinical-300">Evidence-informed tools for journaling, AI-guided support, therapist booking, and personalized wellness recommendations.</p>
        </div>
        <p className="text-sm text-clinical-400">&copy; {new Date().getFullYear()} ZenHeaven. Your data is private and secure.</p>
      </div>
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={calmLogo} alt="ZenHeaven" className="h-9 w-9 rounded-lg" />
            <span className="text-lg font-semibold text-clinical-900">ZenHeaven</span>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-md">
          {title && <h2 className="text-2xl font-semibold text-clinical-900">{title}</h2>}
          {subtitle && <p className="mt-2 text-sm text-clinical-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
