import { useState } from 'react';
import type { RefObject } from 'react';

type FreelanceInvoiceCalculatorProps = {
  resultsRef: RefObject<HTMLDivElement | null>;
};

type InvoiceResult = {
  cuotaIva: number;
  cuotaIrpf: number;
  totalFactura: number;
  ingresoNetoReal: number;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function FreelanceInvoiceCalculator({ resultsRef }: FreelanceInvoiceCalculatorProps) {
  const [baseImponible, setBaseImponible] = useState(1500);
  const [retencionPct, setRetencionPct] = useState(15);
  const [ivaPct, setIvaPct] = useState(21);
  const [result, setResult] = useState<InvoiceResult | null>(null);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cuotaIva = baseImponible * (ivaPct / 100);
    const cuotaIrpf = baseImponible * (retencionPct / 100);
    const totalFactura = baseImponible + cuotaIva - cuotaIrpf;
    const ingresoNetoReal = baseImponible;

    setResult({ cuotaIva, cuotaIrpf, totalFactura, ingresoNetoReal });
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Retenciones para Autónomos</h2>
            <p className="text-sm text-slate-500">Calcula el líquido de tu factura profesional</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Autónomos</span>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label htmlFor="freelance-base" className="mb-2 block text-sm font-semibold text-slate-700">Base imponible (€)</label>
            <input
              id="freelance-base"
              type="number"
              min="0"
              step="any"
              value={baseImponible}
              onChange={(event) => setBaseImponible(Number(event.target.value))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Retención de IRPF (%)</span>
            <div className="mb-2 flex items-center gap-2">
              {[{ value: 7, label: '7% (Nuevo)' }, { value: 15, label: '15% (General)' }].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRetencionPct(option.value)}
                  className={`min-h-[42px] flex-1 rounded-lg px-3 py-2 text-sm transition ${retencionPct === option.value ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <label htmlFor="freelance-retencion" className="sr-only">Porcentaje de retención IRPF personalizado</label>
              <input
                id="freelance-retencion"
                type="number"
                min="0"
                max="100"
                step="any"
                value={retencionPct}
                onChange={(event) => setRetencionPct(Number(event.target.value))}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 pr-9 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-500">%</span>
            </div>
          </div>

          <div>
            <label htmlFor="freelance-iva" className="mb-2 block text-sm font-semibold text-slate-700">Tipo de IVA</label>
            <select
              id="freelance-iva"
              value={ivaPct}
              onChange={(event) => setIvaPct(Number(event.target.value))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value={21}>21% General</option>
              <option value={10}>10% Reducido</option>
              <option value={0}>0% Exento</option>
            </select>
          </div>

          <button type="submit" className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">Calcular estimación</button>
        </form>
      </div>

      <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Resultado estimado</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">FACTURA</span>
        </div>
        {result ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4">
              <div className="text-sm text-slate-300">Total a Cobrar al Cliente</div>
              <div className="mt-2 break-words text-3xl font-black tracking-tight text-blue-200 sm:text-4xl">{formatEuros(result.totalFactura)}</div>
            </div>
            <div className="space-y-3 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div><div className="text-sm text-slate-200">Base Imponible</div><div className="text-xs text-slate-400">Importe bruto del servicio</div></div>
                <span className="font-bold text-white">{formatEuros(result.ingresoNetoReal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div><div className="text-sm text-slate-200">IVA a repercutir (+)</div><div className="text-xs text-slate-400">A ingresar en Modelo 303</div></div>
                <span className="font-bold text-emerald-300">+{formatEuros(result.cuotaIva)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div><div className="text-sm text-slate-200">Retención IRPF (-)</div><div className="text-xs text-slate-400">Adelanto prestado en Modelo 111 por el cliente</div></div>
                <span className="font-bold text-orange-300">-{formatEuros(result.cuotaIrpf)}</span>
              </div>
            </div>
            <p className="text-xs leading-5 text-slate-400">El ingreso neto real del servicio antes del IRPF final es {formatEuros(result.ingresoNetoReal)}. El IVA repercutido y la retención son obligaciones fiscales diferenciadas.</p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">Completa la base y los tipos fiscales para ver el total de tu factura.</div>
        )}
      </aside>
    </section>
  );
}
