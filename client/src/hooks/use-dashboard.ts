"use client";

import { useState, useEffect, useCallback } from "react";
import {
  statsApi,
  alertsApi,
  ticketsApi,
  type SummaryStats,
  type GrowthData,
  type MetricsData,
  type ActivityLogItem,
  type Alert,
  type Ticket,
  type TicketStats,
} from "@/lib/api";

interface DashboardData {
  summary: SummaryStats | null;
  growth: GrowthData | null;
  metrics: MetricsData | null;
  activityLog: ActivityLogItem[];
  alerts: Alert[];
  tickets: Ticket[];
  ticketStats: TicketStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): DashboardData {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summaryData, growthData, metricsData, activityData, alertsData, ticketsData, ticketStatsData] =
        await Promise.all([
          statsApi.getSummary(),
          statsApi.getGrowth(6),
          statsApi.getMetrics(),
          statsApi.getActivityLog(5),
          alertsApi.getPriority(5),
          ticketsApi.get({ limit: 3 }),
          ticketsApi.getStats(),
        ]);

      setSummary(summaryData);
      setGrowth(growthData);
      setMetrics(metricsData);
      setActivityLog(activityData);
      setAlerts(alertsData);
      setTickets(ticketsData);
      setTicketStats(ticketStatsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de chargement";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, growth, metrics, activityLog, alerts, tickets, ticketStats, loading, error, refetch: fetchAll };
}
