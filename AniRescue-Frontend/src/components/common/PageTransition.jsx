import { motion } from "framer-motion";
import { pageVariants } from "../../animations/motionVariants";

export default function PageTransition({ children, className = "" }) {
  return (
    <motion.main initial="initial" animate="animate" exit="exit" variants={pageVariants} className={className}>
      {children}
    </motion.main>
  );
}
