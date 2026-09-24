"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  statsApi,
  ticketsApi,
  healthApi,
  type SummaryStats,
  type GrowthData,
  type MetricsData,
  type ActivityLogItem,
  type Alert,
  type Ticket,
  type SystemHealth,
} from "@/lib/api";
import { fetchPriorityAlerts, setCachedPriorityAlerts } from "@/lib/priority-alerts";

export type DashboardSection =
  | "summary"
  | "growth"
  | "metrics"
  | "activity"
  | "alerts"
  | "tickets"
  | "health";

export type SectionStatus = "idle" | "loading" | "success" | "error";

export type SectionErrors = Record<DashboardSection, string | null>;
export type SectionStatuses = Record<DashboardSection, SectionStatus>;

const SECTION_LABELS: Record<DashboardSection, string> = {
  summary: "statistiques générales",
  growth: "croissance",
  metrics: "indicateurs",
  activity: "journal d’activité",
  alerts: "alertes",
  tickets: "tickets",
  health: "état du service",
};

function initialStatuses(): SectionStatuses {
  return {
    summary: "idle",
    growth: "idle",
    metrics: "idle",
    activity: "idle",
    alerts: "idle",
    tickets: "idle",
    health: "idle",
  };
}

function initialErrors(): SectionErrors {
  return {
    summary: null,
    growth: null,
    metrics: null,
    activity: null,
    alerts: null,
    tickets: null,
    health: null,
  };
}

interface DashboardData {
  summary: SummaryStats | null;
  growth: GrowthData | null;
  metrics: MetricsData | null;
  activityLog: ActivityLogItem[];
  /** Timestamp (ms) de la dernière mise à jour réussie du journal d'activité. */
  activityUpdatedAt: number | null;
  alerts: Alert[] | null;
  tickets: Ticket[];
  systemHealth: SystemHealth | null;
  statuses: SectionStatuses;
  errors: SectionErrors;
  /** Vrai uniquement au tout premier chargement (avant toute donnée). */
  loading: boolean;
  /** Liste des sections en échec pour le bandeau global. */
  error: string | null;
  refetch: () => void;
  refetchSection: (section: DashboardSection) => void;
}

export function useDashboard(): DashboardData {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [activityUpdatedAt, setActivityUpdatedAt] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [statuses, setStatuses] = useState<SectionStatuses>(initialStatuses);
  const [errors, setErrors] = useState<SectionErrors>(initialErrors);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const mountedRef = useRef(true);
  const statusesRef = useRef(statuses);

  useEffect(() => {
    statusesRef.current = statuses;
  }, [statuses]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const applyResult = useCallback(
    <T,>(
      section: DashboardSection,
      result: PromiseSettledResult<T>,
      onSuccess: (value: T) => void,
      onClear: () => void,
    ) => {
      if (!mountedRef.current) return;

      if (result.status === "fulfilled") {
        setStatuses((prev) => ({ ...prev, [section]: "success" }));
        setErrors((prev) => ({ ...prev, [section]: null }));
        onSuccess(result.value);
        if (section === "alerts" && Array.isArray(result.value)) {
          setCachedPriorityAlerts(result.value as Alert[]);
        }
      } else {
        const reason =
          result.reason instanceof Error
            ? result.reason.message
            : "Échec de la requête";
        setStatuses((prev) => ({ ...prev, [section]: "error" }));
        setErrors((prev) => ({
          ...prev,
          [section]: `${SECTION_LABELS[section]} — ${reason}`,
        }));
        onClear();
      }
    },
    [],
  );

  const fetchSection = useCallback(
    async (section: DashboardSection) => {
      setStatuses((prev) => ({ ...prev, [section]: "loading" }));
      setErrors((prev) => ({ ...prev, [section]: null }));

      try {
        switch (section) {
          case "summary":
            applyResult(section, await settle(statsApi.getSummary()), (v) => setSummary(v), () => setSummary(null));
            break;
          case "growth":
            applyResult(section, await settle(statsApi.getGrowth(6)), (v) => setGrowth(v), () => setGrowth(null));
            break;
          case "metrics":
            applyResult(section, await settle(statsApi.getMetrics()), (v) => setMetrics(v), () => setMetrics(null));
            break;
          case "activity":
            applyResult(
              section,
              await settle(statsApi.getActivityLog(5)),
              (v) => {
                setActivityLog(v);
                setActivityUpdatedAt(Date.now());
              },
              () => setActivityLog([]),
            );
            break;
          case "alerts":
            applyResult(
              section,
              await settle(fetchPriorityAlerts()),
              (v) => setAlerts(v),
              () => setAlerts(null),
            );
            break;
          case "tickets":
            applyResult(
              section,
              await settle(ticketsApi.get({ limit: 4 })),
              (v) => setTickets(v),
              () => setTickets([]),
            );
            break;
          case "health":
            applyResult(
              section,
              await settle(healthApi.getSystemHealth()),
              (v) => setSystemHealth(v),
              () => setSystemHealth(null),
            );
            break;
        }
      } finally {
        if (mountedRef.current) setHasLoadedOnce(true);
      }
    },
    [applyResult],
  );

  const refetchSection = useCallback(
    (section: DashboardSection) => {
      void fetchSection(section);
    },
    [fetchSection],
  );

  const fetchAll = useCallback(() => {
    const sections: DashboardSection[] = [
      "summary",
      "growth",
      "metrics",
      "activity",
      "alerts",
      "tickets",
      "health",
    ];
    void Promise.all(sections.map((s) => fetchSection(s)));
  }, [fetchSection]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Actualisation périodique du journal — sans chevauchement, nettoyée au démontage
  useEffect(() => {
    if (!hasLoadedOnce) return;
    const ACTIVITY_REFRESH_MS = 60_000;
    const timer = setInterval(() => {
      if (statusesRef.current.activity === "loading" || statusesRef.current.activity === "idle") {
        return;
      }
      void fetchSection("activity");
    }, ACTIVITY_REFRESH_MS);
    return () => clearInterval(timer);
  }, [hasLoadedOnce, fetchSection]);

  const failedSections = (Object.keys(SECTION_LABELS) as DashboardSection[]).filter(
    (s) => statuses[s] === "error",
  );
  const error =
    failedSections.length > 0
      ? `Certaines données n’ont pas pu être chargées : ${failedSections
          .map((s) => SECTION_LABELS[s])
          .join(", ")}.`
      : null;

  const loading = !hasLoadedOnce && Object.values(statuses).some((s) => s === "loading" || s === "idle");

  return {
    summary,
    growth,
    metrics,
    activityLog,
    activityUpdatedAt,
    alerts,
    tickets,
    systemHealth,
    statuses,
    errors,
    loading,
    error,
    refetch: fetchAll,
    refetchSection,
  };
}

async function settle<T>(promise: Promise<T>): Promise<PromiseSettledResult<T>> {
  try {
    return { status: "fulfilled", value: await promise };
  } catch (reason) {
    return { status: "rejected", reason: reason as unknown };
  }
}
