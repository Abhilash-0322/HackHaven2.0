import Sidebar from './Sidebar';

export default function AppShell({ children, title, subtitle, actions }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border/40 bg-void/80 backdrop-blur-xl px-4 lg:px-8 py-4 flex flex-wrap gap-3 justify-between items-center">
          <div>
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-500 font-mono mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
