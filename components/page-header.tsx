export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 rounded-[28px] border border-emerald-800/40 bg-[#0e211d]/90 p-5 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)] sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-50">{title}</h1>
        <p className="mt-2 text-sm text-emerald-100/70">{description}</p>
      </div>
      {action}
    </header>
  );
}
