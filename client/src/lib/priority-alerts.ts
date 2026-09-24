import { alertsApi, type Alert } from "@/lib/api";

/** Limite unique partagée : topbar + dashboard. */
export const PRIORITY_ALERTS_LIMIT = 8;
const CACHE_TTL_MS = 30_000;

let cache: { data: Alert[]; at: number } | null = null;
let inflight: Promise<Alert[]> | null = null;
const listeners = new Set<(alerts: Alert[]) => void>();

function notify(data: Alert[]) {
  listeners.forEach((fn) => fn(data));
}

export async function fetchPriorityAlerts(options?: { force?: boolean }): Promise<Alert[]> {
  const now = Date.now();
  if (!options?.force && cache && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }
  if (inflight) return inflight;

  inflight = alertsApi
    .getPriority(PRIORITY_ALERTS_LIMIT)
    .then((data) => {
      cache = { data, at: Date.now() };
      notify(data);
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getCachedPriorityAlerts(): Alert[] | null {
  if (!cache) return null;
  if (Date.now() - cache.at >= CACHE_TTL_MS) return null;
  return cache.data;
}

export function setCachedPriorityAlerts(data: Alert[]) {
  cache = { data, at: Date.now() };
  notify(data);
}

export function subscribePriorityAlerts(listener: (alerts: Alert[]) => void): () => void {
  listeners.add(listener);
  const cached = getCachedPriorityAlerts();
  if (cached) listener(cached);
  return () => {
    listeners.delete(listener);
  };
}
