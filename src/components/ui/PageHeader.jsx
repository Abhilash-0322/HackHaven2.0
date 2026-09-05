export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="font-display text-3xl font-semibold text-forest">{title}</h1>{subtitle && <p className="mt-2 text-sage-600">{subtitle}</p>}</div>
      {action}
    </div>
  );
}
