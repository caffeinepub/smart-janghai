import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { DashboardMetrics, RecentActivity, MonthlyGrowth } from '@/backend';

export function useGetDashboardMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DashboardMetrics>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useGetRecentActivity(limit: number = 10) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecentActivity[]>({
    queryKey: ['recentActivity', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRecentActivity(BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useGetMonthlyGrowth(months: number = 12) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MonthlyGrowth[]>({
    queryKey: ['monthlyGrowth', months],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMonthlyGrowth(BigInt(months));
    },
    enabled: !!actor && !actorFetching,
  });
}
