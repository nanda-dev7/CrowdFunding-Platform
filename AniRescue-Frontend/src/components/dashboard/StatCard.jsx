import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, hint, tone = "moss" }) {
  const toneClasses = tone === "coral" ? "bg-coral/10 text-coral" : tone === "teal" ? "bg-mist text-teal-700" : "bg-sage text-moss";
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses}`}>{Icon && <Icon size={22} />}</div>
      <p className="text-sm font-medium text-bark/60">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs font-semibold text-moss">{hint}</p>}
    </motion.div>
  );
}
