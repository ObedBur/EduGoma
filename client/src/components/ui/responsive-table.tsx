"use client";

/**
 * EduGoma — ResponsiveTable
 *
 * Sur desktop (md+) : affiche un vrai tableau HTML scrollable.
 * Sur mobile (<md) : affiche chaque ligne comme une carte empilée.
 *
 * Usage :
 * ```tsx
 * import { ResponsiveTable } from "@/components/ui/responsive-table";
 *
 * <ResponsiveTable
 *   columns={[
 *     { key: "name", header: "École & ID", mobileLabel: "École" },
 *     { key: "status", header: "Statut", hideOnMobile: true },
 *   ]}
 *   rows={schools}
 *   renderCell={(row, colKey) => <span>{row[colKey]}</span>}
 *   renderMobileCard={(row) => <p>{row.name}</p>}
 *   onRowClick={(row) => setSelected(row.id)}
 *   keyExtractor={(row) => row.id}
 * />
 * ```
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface ResponsiveColumn<T> {
  key: keyof T | string;
  header: string;
  /** Si true, la colonne n'apparaît que sur desktop */
  hideOnMobile?: boolean;
  /** Alignement de la cellule */
  align?: "left" | "center" | "right";
  /** Largeur minimale CSS (ex: "120px") */
  minWidth?: string;
}

interface ResponsiveTableProps<T> {
  columns: ResponsiveColumn<T>[];
  rows: T[];
  /** Rendu d'une cellule pour le tableau desktop */
  renderCell: (row: T, colKey: string) => React.ReactNode;
  /** Rendu de la carte mobile complète (optionnel — sinon auto-généré) */
  renderMobileCard?: (row: T) => React.ReactNode;
  /** Rendu du sous-titre/description sur la carte mobile */
  renderMobileSubtitle?: (row: T) => React.ReactNode;
  /** Extrait la clé unique de la ligne */
  keyExtractor: (row: T) => string;
  /** Callback au clic sur une ligne / carte */
  onRowClick?: (row: T) => void;
  /** Nœud à afficher quand rows est vide */
  emptyState?: React.ReactNode;
  /** Classes CSS supplémentaires pour le wrapper */
  className?: string;
}

export function ResponsiveTable<T>({
  columns,
  rows,
  renderCell,
  renderMobileCard,
  renderMobileSubtitle,
  keyExtractor,
  onRowClick,
  emptyState,
  className,
}: ResponsiveTableProps<T>) {
  return (
    <div className={cn("w-full", className)}>

      {/* ── DESKTOP TABLE (md+) ─────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth: "640px" }}>
          <thead>
            <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-2.5 border-b border-[#edf1f4]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  {emptyState ?? (
                    <p className="text-[11px] text-[#8a97a4]">Aucun résultat</p>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className={cn(
                    "border-t border-[#edf1f4] align-middle transition-colors",
                    onRowClick && "cursor-pointer hover:bg-[#fbfdff]",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        "px-4 py-3",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {renderCell(row, String(col.key))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (<md) ──────────────────────────────── */}
      <div className="block md:hidden space-y-2">
        {rows.length === 0 ? (
          <div className="py-12 text-center">
            {emptyState ?? (
              <p className="text-[12px] text-[#8a97a4]">Aucun résultat</p>
            )}
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={keyExtractor(row)}
              className={cn(
                "rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm",
                onRowClick && "cursor-pointer active:bg-[#f5f8fb]",
              )}
              onClick={() => onRowClick?.(row)}
            >
              {renderMobileCard ? (
                renderMobileCard(row)
              ) : (
                <MobileCardDefault
                  row={row}
                  columns={columns}
                  renderCell={renderCell}
                  renderMobileSubtitle={renderMobileSubtitle}
                  hasAction={!!onRowClick}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Rendu par défaut de la carte mobile ────────────────────────────────────
function MobileCardDefault<T>({
  row,
  columns,
  renderCell,
  renderMobileSubtitle,
  hasAction,
}: {
  row: T;
  columns: ResponsiveColumn<T>[];
  renderCell: (row: T, colKey: string) => React.ReactNode;
  renderMobileSubtitle?: (row: T) => React.ReactNode;
  hasAction: boolean;
}) {
  // La première colonne devient le titre, les suivantes vont en grille
  const [titleCol, ...restCols] = columns;
  const visibleRest = restCols.filter((c) => !c.hideOnMobile);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        {/* Titre de la carte = première colonne */}
        <div className="text-[12px] font-bold text-[#142c42] truncate">
          {renderCell(row, String(titleCol.key))}
        </div>
        {/* Sous-titre optionnel */}
        {renderMobileSubtitle && (
          <div className="mt-0.5 text-[10px] text-[#687585]">
            {renderMobileSubtitle(row)}
          </div>
        )}
        {/* Grille des colonnes secondaires */}
        {visibleRest.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {visibleRest.map((col) => (
              <div key={String(col.key)} className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#9aa5b1] mb-1">
                  {col.header}
                </p>
                <div className="text-[11px] text-[#33485d]">
                  {renderCell(row, String(col.key))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {hasAction && (
        <ChevronRight size={16} className="text-[#c5cdd7] shrink-0 mt-0.5" />
      )}
    </div>
  );
}
