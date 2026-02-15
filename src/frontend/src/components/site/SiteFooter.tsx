import { Separator } from '@/components/ui/separator';
import { Heart, Mail } from 'lucide-react';
import TextLogo from './TextLogo';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'smart-janghai';

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TextLogo size="sm" variant="dark" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your trusted information hub
            </p>
          </div>
          
          <Separator className="w-24" />
          
          {/* Support Section */}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground mb-2">Support</p>
            <a
              href="mailto:SMARTCARE01@GMAIL.COM"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span>SMARTCARE01@GMAIL.COM</span>
            </a>
          </div>
          
          <Separator className="w-24" />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear}. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
