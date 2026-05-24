const styles = {
  primary: "bg-coral text-white shadow-card hover:bg-[#c8503a]",
  secondary: "bg-white text-bark border border-oat hover:border-clay hover:text-ink",
  urgent: "bg-[#d32f2f] text-white shadow-card hover:bg-[#b71c1c]",
  ghost: "bg-transparent text-bark hover:bg-sage",
  outline: "bg-white text-coral border border-coral/25 hover:bg-mist",
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
