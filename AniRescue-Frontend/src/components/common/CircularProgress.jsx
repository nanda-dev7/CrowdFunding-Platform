import { motion } from "framer-motion";

export default function CircularProgress({ value = 0, size = 120 }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} stroke="#f2e3ce" strokeWidth="12" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#49705b"
          strokeLinecap="round"
          strokeWidth="12"
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute text-xl font-extrabold text-ink">{Math.round(value)}%</span>
    </div>
  );
}
