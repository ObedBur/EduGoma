"use client";

/**
 * EduGoma — ListTable
 *
 * Composant réutilisable : recherche, filtres, tri, pagination.
 * À brancher sur une API paginée (items + meta).
 *
 * Usage :
 * ```tsx
 * const { query, setQuery } = useListQuery();
 * const data = await api.getList(toListParams(query));
 *
 * <ListTable
 *   query={query}
 *   onQueryChange={setQuery}
 *   total={data.meta.total}
 *   columns={[
 *     { key: "name", header: "Nom", sortable: true },
 *     { key: "status", header: "Statut" },
 *   ]}
 *   rows={data.items}
 *   renderCell={(row, key) => …}
 *   keyExtractor={(row) => row.id}
 *   filters={[{ key: "status", label: "Statut", options: [...] }]}
 * />
 * ```
 */

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOrder = "asc" | "desc";

export interface ListQuery {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
  search: string;
  filters: Record<string, string>;
}

export interface ListQueryPatch extends Partial<Omit<ListQuery, "filters">> {
  filters?: Record<string, string>;
}

export const DEFAULT_LIST_QUERY: ListQuery = {
  page: 1,
  limit: 30,
  sort: "createdAt",
  order: "desc",
  search: "",
  filters: {},
};

export function useListQuery(initial?: Partial<ListQuery>) {
  const [query, setQuery] = React.useState<ListQuery>({
    ...DEFAULT_LIST_QUERY,
    ...initial,
    filters: { ...DEFAULT_LIST_QUERY.filters, ...initial?.filters },
  });

  const patch = React.useCallback((p: ListQueryPatch) => {
    setQuery((prev) => ({
      ...prev,
      ...p,
      filters: p.filters ? { ...prev.filters, ...p.filters } : prev.filters,
      page: p.page !== undefined ? p.page : p.search !== undefined || p.filters !== undefined || p.sort !== undefined || p.order !== undefined || p.limit !== undefined ? 1 : prev.page,
    }));
  }, []);

  const setSearch = React.useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setFilter = React.useCallback((key: string, value: string) => {
    setQuery((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }));
  }, []);

  const setPage = React.useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page: Math.max(1, page) }));
  }, []);

  const setSort = React.useCallback((sort: string) => {
    setQuery((prev) => {
      if (prev.sort === sort) {
        return {
          ...prev,
          order: prev.order === "asc" ? "desc" : "asc",
          page: 1,
        };
      }
      return { ...prev, sort, order: "asc", page: 1 };
    });
  }, []);

  const setLimit = React.useCallback((limit: number) => {
    setQuery((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  return { query, setQuery, patch, setSearch, setFilter, setPage, setSort, setLimit };
}

/** Construit une query string pour une API paginée standardisée. */
export function toListParams(query: ListQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);
  params.set("order", query.order);
  if (query.search.trim()) params.set("search", query.search.trim());
  for (const [key, value] of Object.entries(query.filters)) {
    if (value && value !== "all" && value !== "") params.set(key, value);
  }
  return params.toString();
}

export interface ListColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  /** Champ API pour le tri si différent de `key` (ex: key="city", sortKey="commune") */
  sortKey?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface ListFilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface ListTableProps<T> {
  title?: string;
  subtitle?: string;
  query: ListQuery;
  onQueryChange: (q: ListQuery) => void;
  columns: ListColumn<T>[];
  rows: T[];
  total: number;
  loading?: boolean;
  searchPlaceholder?: string;
  filters?: ListFilterDef[];
  renderCell: (row: T, key: string) => React.ReactNode;
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  actions?: React.ReactNode;
  footerExtra?: React.ReactNode;
  className?: string;
}

export function ListTable<T>({
  title,
  subtitle,
  query,
  onQueryChange,
  columns,
  rows,
  total,
  loading,
  searchPlaceholder = "Rechercher…",
  filters = [],
  renderCell,
  keyExtractor,
  onRowClick,
  emptyState,
  actions,
  footerExtra,
  className,
}: ListTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / query.limit));
  const from = total === 0 ? 0 : (query.page - 1) * query.limit + 1;
  const to = Math.min(total, query.page * query.limit);

  const update = (patch: ListQueryPatch) => onQueryChange({ ...query, ...patch, filters: patch.filters ? { ...query.filters, ...patch.filters } : query.filters });

  const handleSearch = (value: string) => onQueryChange({ ...query, search: value, page: 1 });
  const handleFilter = (key: string, value: string) =>
    onQueryChange({ ...query, filters: { ...query.filters, [key]: value }, page: 1 });
  const handleSort = (col: ListColumn<T>) => {
    const key = col.sortKey ?? col.key;
    if (query.sort === key) {
      onQueryChange({ ...query, order: query.order === "asc" ? "desc" : "asc", page: 1 });
    } else {
      onQueryChange({ ...query, sort: key, order: "asc", page: 1 });
    }
  };
  const handlePage = (page: number) =>
    onQueryChange({ ...query, page: Math.min(Math.max(1, page), totalPages) });

  return (
    <section
      className={cn(
        "rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-[#edf1f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {title && (
            <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]">
              {title}
              <span className="rounded-full bg-[#eef3f7] px-2 py-0.5 text-[9px] font-bold text-[#698092]">
                {total} résultat{total > 1 ? "s" : ""}
              </span>
            </h2>
          )}
          {subtitle && <p className="mt-1 text-[9px] text-[#8a97a4]">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          <div className="relative w-full lg:w-[260px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" />
            <input
              value={query.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>
        </div>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#edf1f4] px-4 py-2.5">
          {filters.map((filter) => (
            <label key={filter.key} className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#9aa5af]">
                {filter.label}
              </span>
              <select
                value={query.filters[filter.key] || "all"}
                onChange={(e) => handleFilter(filter.key, e.target.value)}
                className="h-7 max-w-[160px] rounded-md border border-[#e0e7ee] bg-white px-2 text-[9px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"
                aria-label={`Filtrer par ${filter.label}`}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <div className="overflow-x-auto overscroll-x-contain scrollbar-thin">
        <p className="block md:hidden border-b border-[#edf1f4] py-1.5 text-center text-[9px] text-[#9aa5b1]">
          ← Défilez pour voir tout →
        </p>
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead>
            <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
              {columns.map((col) => {
                const sortKey = col.sortKey ?? col.key;
                const active = query.sort === sortKey;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-3 py-2.5 first:pl-4",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className={cn(
                          "inline-flex items-center gap-1 uppercase tracking-[0.06em] hover:text-[#4f7c9a]",
                          active && "text-[#102d48]",
                        )}
                        aria-label={`Trier par ${col.header}`}
                      >
                        {col.header}
                        <ChevronDown
                          size={11}
                          className={cn(
                            "transition-transform",
                            active && query.order === "asc" && "rotate-180",
                            !active && "opacity-35",
                          )}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[11px] text-[#8a97a4]">
                  Chargement…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  {emptyState ?? (
                    <p className="text-[11px] font-semibold text-[#5e7485]">Aucun résultat</p>
                  )}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-t border-[#edf1f4] align-middle",
                    onRowClick && "cursor-pointer hover:bg-[#fbfdff]",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 py-3 first:pl-4",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.className,
                      )}
                    >
                      {renderCell(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f4] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-3 text-[9px] text-[#8d99a4]">
          <span>
            {from}–{to} sur {total}
          </span>
          <label className="flex items-center gap-1">
            <span>Par page</span>
            <select
              value={query.limit}
              onChange={(e) => update({ limit: Number(e.target.value), page: 1 })}
              className="h-7 rounded border border-[#e0e7ee] bg-white px-1.5 text-[9px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"
              aria-label="Éléments par page"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {footerExtra}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePage(query.page - 1)}
            disabled={query.page <= 1 || loading}
            className="flex h-7 items-center gap-1 rounded border border-[#e0e7ee] px-2 text-[9px] font-bold text-[#536b7d] hover:bg-[#f3f6f8] disabled:opacity-40"
            aria-label="Page précédente"
          >
            <ChevronLeft size={12} /> Préc.
          </button>
          <span className="px-2 text-[9px] font-semibold text-[#536b7d]">
            {query.page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePage(query.page + 1)}
            disabled={query.page >= totalPages || loading}
            className="flex h-7 items-center gap-1 rounded border border-[#e0e7ee] px-2 text-[9px] font-bold text-[#536b7d] hover:bg-[#f3f6f8] disabled:opacity-40"
            aria-label="Page suivante"
          >
            Suiv. <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </section>
  );
}
