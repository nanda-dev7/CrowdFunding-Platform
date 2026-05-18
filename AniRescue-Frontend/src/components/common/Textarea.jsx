export default function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-bark">{label}</span>}
      <textarea
        className={`min-h-32 w-full resize-y rounded-2xl border border-bark/10 bg-white px-4 py-3 text-sm text-ink shadow-sm transition placeholder:text-bark/35 focus:border-moss ${className}`}
        {...props}
      />
    </label>
  );
}
