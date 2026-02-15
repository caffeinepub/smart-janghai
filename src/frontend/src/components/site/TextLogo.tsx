interface TextLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'light' | 'dark';
}

export default function TextLogo({ size = 'md', className = '', variant = 'light' }: TextLogoProps) {
  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl',
  };

  const variantClasses = {
    light: 'text-white',
    dark: 'text-foreground',
  };

  return (
    <h1 
      className={`font-bold tracking-tight ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ textShadow: variant === 'light' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none' }}
    >
      SMART JANGHAI
    </h1>
  );
}
