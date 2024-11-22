const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

export default GradientText;
