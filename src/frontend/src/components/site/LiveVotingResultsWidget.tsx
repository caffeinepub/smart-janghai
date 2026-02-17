import { useGetAllVotingResults } from '@/hooks/votingResults';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, TrendingUp, Clock } from 'lucide-react';

export default function LiveVotingResultsWidget() {
  const { data: results = [], isLoading, isError, error } = useGetAllVotingResults();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              Unable to load voting results. {error instanceof Error ? error.message : 'Please try again later.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="border-muted bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">
              Voting results will be displayed here once available.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for live updates!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4 text-green-600" />
        <span>Live results updating automatically</span>
        <Badge variant="outline" className="ml-auto">
          {results.length} {results.length === 1 ? 'Result' : 'Results'}
        </Badge>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Village</TableHead>
              <TableHead className="font-semibold">Candidate</TableHead>
              <TableHead className="font-semibold text-right">Votes</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{result.village}</TableCell>
                <TableCell>{result.candidate}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    {result.votes.toString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(result.lastUpdated)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
