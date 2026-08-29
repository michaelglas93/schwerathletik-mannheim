import type { ResultsTable as ResultsTableData } from "@/lib/types";

/**
 * Wettkampfergebnisse. Am Desktop eine gewöhnliche Tabelle; unterhalb von 768px klappt
 * jede Zeile zu einer Karte auf, weil sechs Spalten auf einem Telefon nicht lesbar sind.
 * Die ARIA-Rollen sind gesetzt, weil `display: block` sonst die Tabellensemantik entfernt.
 */
export function ResultsTable({ headers, rows }: ResultsTableData) {
  if (!rows.length) return null;

  return (
    <div className="not-prose my-9 overflow-x-auto">
      <table role="table" className="results w-full border-collapse text-sm">
        <thead role="rowgroup" className="hidden md:table-header-group">
          <tr role="row">
            {headers.map((h, i) => (
              <th
                key={h + i}
                role="columnheader"
                scope="col"
                className={`border-b border-line-strong py-3 pr-4 font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, r) => (
            <tr
              key={r}
              role="row"
              className="block border-b border-line py-4 md:table-row md:py-0"
            >
              {row.map((cell, c) => (
                <td
                  key={c}
                  role="cell"
                  data-label={headers[c] ?? ""}
                  className={
                    c === 0
                      ? "block font-display text-base font-semibold uppercase tracking-wide text-bone md:table-cell md:border-b md:border-line md:py-3.5 md:pr-4 md:text-sm md:normal-case md:tracking-normal"
                      : "flex items-baseline justify-between gap-4 py-1 text-[0.9375rem] text-muted before:font-display before:text-[0.6875rem] before:uppercase before:tracking-[0.12em] before:text-faint before:content-[attr(data-label)] md:table-cell md:border-b md:border-line md:py-3.5 md:pr-4 md:text-right md:tabular-nums md:text-bone md:before:content-none"
                  }
                >
                  <span className={c === 0 ? "" : "font-medium text-bone md:font-normal"}>
                    {cell || "—"}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
