import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface AssetTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function AssetTable<T>({ data, columns, keyExtractor, onRowClick, emptyMessage = "No results found" }: AssetTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full p-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-4 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr 
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`bg-white hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-6 py-4 whitespace-nowrap text-slate-700 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
