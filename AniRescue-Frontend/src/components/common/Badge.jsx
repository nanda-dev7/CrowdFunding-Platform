const variants = {
  default: "bg-oat text-bark",
  urgent: "bg-coral/10 text-coral ring-1 ring-coral/20",
  success: "bg-sage text-moss",
  teal: "bg-mist text-teal-700",
  dark: "bg-bark text-white",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
