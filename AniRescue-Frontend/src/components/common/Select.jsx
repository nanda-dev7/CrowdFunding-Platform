export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-bark">{label}</span>}
      <select
        className={`h-12 w-full rounded-2xl border border-bark/10 bg-white px-4 text-sm text-ink shadow-sm transition focus:border-moss ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
