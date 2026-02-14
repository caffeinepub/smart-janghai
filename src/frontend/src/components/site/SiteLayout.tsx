import { type ReactNode } from 'react';
import SiteFooter from './SiteFooter';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
