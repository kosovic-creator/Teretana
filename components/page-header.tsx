export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-green-700">{eyebrow}</p><h1 className="text-3xl font-extrabold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{action}</header>;
}
