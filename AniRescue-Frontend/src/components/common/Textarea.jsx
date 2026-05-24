export default function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-bark">{label}</span>}
      <textarea
        className={`min-h-32 w-full resize-y rounded-2xl border border-transparent bg-sage px-4 py-3 text-sm text-ink transition placeholder:text-bark/40 focus:border-coral focus:bg-white focus:outline-none focus:ring-4 focus:ring-coral/10 ${className}`}
        {...props}
      />
    </label>
  );
}
