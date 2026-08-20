import { formatCurrency } from "@/lib/formatters";
import type { SalaryCalculationResult } from "../types";

interface SalaryResultsProps {
  result: SalaryCalculationResult;
}

export function SalaryResults({ result }: SalaryResultsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Resultado estimado</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{formatCurrency(result.netoMensual)}</h3>
        </div>
        {result.isProvisional ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            Provisional
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Neto anual</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(result.netoAnual)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Bruto anual</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(result.brutoAnual)}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Desglose de deducciones</p>
        <div className="mt-4 space-y-3">
          {result.deducciones.length > 0 ? (
            result.deducciones.map((item: { label: string; value: number; note?: string }) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div>
                  <p className="font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.note}</p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No hay deducciones para mostrar.</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {result.summary}
      </div>
    </div>
  );
}
