export default function DashboardShell({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">AniRescue Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-bark/70">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
