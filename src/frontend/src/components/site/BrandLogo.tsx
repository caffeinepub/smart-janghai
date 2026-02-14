import { useState } from 'react';
import { LOGO_IMAGE } from '@/assets/generatedAssets';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 md:h-10',
    md: 'h-12 md:h-16',
    lg: 'h-20 md:h-28 lg:h-36',
    xl: 'h-24 md:h-32 lg:h-40',
  };

  // Graceful fallback if image fails to load
  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-lg md:text-xl font-bold text-primary">SMART JANGHAI</span>
      </div>
    );
  }

  return (
    <img
      src={LOGO_IMAGE}
      alt="Smart Janghai"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
