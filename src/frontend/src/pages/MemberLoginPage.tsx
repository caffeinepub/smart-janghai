import { useState } from 'react';
import TextLogo from '@/components/site/TextLogo';
import MemberLoginCard from '@/components/auth/MemberLoginCard';
import LoginFooter from '@/components/auth/LoginFooter';
import { LOGIN_BACKGROUND } from '@/assets/generatedAssets';

interface MemberLoginPageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard') => void;
}

export default function MemberLoginPage({ onNavigate }: MemberLoginPageProps) {
  const [bgImageError, setBgImageError] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {!bgImageError ? (
          <img
            src={LOGIN_BACKGROUND}
            alt="Janghai aerial view"
            className="w-full h-full object-cover"
            onError={() => setBgImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
        )}
        {/* Soft blue overlay */}
        <div className="absolute inset-0 bg-primary/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Top branding */}
        <div className="text-center mb-8">
          <TextLogo size="lg" variant="light" />
          <p className="text-white/90 text-lg md:text-xl mt-3 font-light tracking-wide">
            Your Trusted Information Hub
          </p>
        </div>

        {/* Login Card */}
        <MemberLoginCard onNavigate={onNavigate} />
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <LoginFooter />
      </div>
    </div>
  );
}
