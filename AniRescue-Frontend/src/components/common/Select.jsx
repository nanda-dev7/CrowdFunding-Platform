export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-bark">{label}</span>}
      <select
        className={`h-12 w-full rounded-2xl border border-transparent bg-sage px-4 text-sm text-ink transition focus:border-coral focus:bg-white focus:outline-none focus:ring-4 focus:ring-coral/10 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
