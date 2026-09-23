"use client";

import { useState, useEffect, useCallback } from "react";
import {
  statsApi,
  alertsApi,
  ticketsApi,
  healthApi,
  type SummaryStats,
  type GrowthData,
  type MetricsData,
  type ActivityLogItem,
  type Alert,
  type Ticket,
  type TicketStats,
  type SystemHealth,
} from "@/lib/api";

interface DashboardData {
  summary: SummaryStats | null;
  growth: GrowthData | null;
  metrics: MetricsData | null;
  activityLog: ActivityLogItem[];
  alerts: Alert[] | null;
  tickets: Ticket[];
  ticketStats: TicketStats | null;
  systemHealth: SystemHealth | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): DashboardData {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      statsApi.getSummary(),
      statsApi.getGrowth(6),
      statsApi.getMetrics(),
      statsApi.getActivityLog(5),
      alertsApi.getPriority(5),
      ticketsApi.get({ limit: 4 }),
      ticketsApi.getStats(),
      healthApi.getSystemHealth(),
    ]);

    const failedRequests: string[] = [];
    const valueOrNull = <T,>(
      result: PromiseSettledResult<T>,
      label: string,
    ): T | null => {
      if (result.status === "fulfilled") return result.value;
      failedRequests.push(label);
      return null;
    };

    const summaryData = valueOrNull(results[0], "statistiques générales");
    const growthData = valueOrNull(results[1], "croissance");
    const metricsData = valueOrNull(results[2], "indicateurs");
    const activityData = valueOrNull(results[3], "journal d’activité");
    const alertsData = valueOrNull(results[4], "alertes");
    const ticketsData = valueOrNull(results[5], "tickets");
    const ticketStatsData = valueOrNull(results[6], "statistiques des tickets");
    const systemHealthData = valueOrNull(results[7], "état du service");

    setSummary(summaryData);
    setGrowth(growthData);
    setMetrics(metricsData);
    setActivityLog(activityData ?? []);
    setAlerts(alertsData);
    setTickets(ticketsData ?? []);
    setTicketStats(ticketStatsData);
    setSystemHealth(systemHealthData);
    setError(
      failedRequests.length > 0
        ? `Certaines données n’ont pas pu être chargées : ${failedRequests.join(", ")}.`
        : null,
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, growth, metrics, activityLog, alerts, tickets, ticketStats, systemHealth, loading, error, refetch: fetchAll };
}
