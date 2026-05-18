import { motion } from "framer-motion";

export default function ProgressBar({ value = 0, className = "" }) {
  return (
    <div className={`h-3 overflow-hidden rounded-full bg-oat ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-lime-200 via-green-400 to-green-800"
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(value, 100)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}
