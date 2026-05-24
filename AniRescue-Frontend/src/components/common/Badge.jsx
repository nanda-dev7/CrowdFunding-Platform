const variants = {
  default: "bg-white text-bark border border-oat",
  urgent: "bg-mist text-coral",
  success: "bg-white text-moss border border-oat",
  teal: "bg-mist text-coral",
  dark: "bg-ink text-white",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
