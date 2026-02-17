import LiveVotingResultsWidget from './LiveVotingResultsWidget';
import LivePollWidget from './LivePollWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function VotingPromoSection() {
  return (
    <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b-2 border-primary/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Live Poll Section - Always visible */}
        <div className="min-h-[200px]">
          <LivePollWidget />
        </div>

        <Separator className="my-8" />

        {/* Existing Voting Results Section */}
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Vote className="w-8 h-8 text-primary animate-pulse" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                GRAM PRADHAN VOTING LIVE RESULT OF WHOLE VILLAGES AROUND JANGHAI
              </CardTitle>
            </div>
            <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">
              Coming Soon - Stay Tuned With Us...
            </p>
          </CardHeader>
          <CardContent>
            <LiveVotingResultsWidget />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
