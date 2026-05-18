const styles = {
  primary: "bg-moss text-white shadow-card hover:bg-[#3f604f]",
  secondary: "bg-white text-bark border border-bark/10 hover:border-moss/30 hover:text-moss",
  urgent: "bg-coral text-white shadow-card hover:bg-[#c95b4d]",
  ghost: "bg-transparent text-bark hover:bg-white/70",
  outline: "bg-white text-moss border border-moss/25 hover:bg-sage",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export default function Button({ children, variant = "primary", size = "md", className = "", as: Tag = "button", ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
