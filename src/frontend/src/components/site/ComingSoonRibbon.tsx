import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

export default function ComingSoonRibbon() {
  return (
    <section className="bg-accent/30 border-y border-accent">
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Megaphone className="w-5 h-5 text-primary" />
              <p className="text-sm md:text-base font-semibold text-foreground">
                Gram Pradhan Voting Results - Coming Soon!
              </p>
              <Badge variant="default" className="animate-pulse">
                Stay Tuned
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
