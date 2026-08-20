import { useState } from 'react';
import type { RefObject } from 'react';

const MINIMO_PERSONAL = 5550;

const IRPF_BRACKETS = [
  { limit: 12450, rate: 0.19 },
  { limit: 20200, rate: 0.24 },
  { limit: 35200, rate: 0.30 },
  { limit: 60000, rate: 0.37 },
  { limit: 300000, rate: 0.45 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.47 },
];

type IrpfCalculatorProps = {
  resultsRef: RefObject<HTMLDivElement | null>;
};

type IrpfResult = {
  cuotaTributariaFinal: number;
  retencionesAdelantadas: number;
  resultadoDeclaracion: number;
  tipoEfectivoReal: number;
};

function calcularCuotaEscala(base: number): number {
  let previousLimit = 0;
  let cuotaTotal = 0;

  for (const bracket of IRPF_BRACKETS) {
    const amountInBracket = Math.min(base, bracket.limit) - previousLimit;
    if (amountInBracket <= 0) {
      break;
    }

    cuotaTotal += amountInBracket * bracket.rate;
    previousLimit = bracket.limit;
  }

  return cuotaTotal;
}

function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export default function IrpfCalculator({ resultsRef }: IrpfCalculatorProps) {
  const [rentaAnual, setRentaAnual] = useState(36000);
  const [retencionAplicada, setRetencionAplicada] = useState(15);
  const [situacionFamiliar, setSituacionFamiliar] = useState('Soltero/a');
  const [result, setResult] = useState<IrpfResult | null>(null);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cuotaBase = calcularCuotaEscala(rentaAnual);
    const cuotaMinimo = calcularCuotaEscala(MINIMO_PERSONAL);
    const cuotaTributariaFinal = Math.max(0, cuotaBase - cuotaMinimo);
    const retencionesAdelantadas = rentaAnual * retencionAplicada / 100;
    const resultadoDeclaracion = cuotaTributariaFinal - retencionesAdelantadas;
    const tipoEfectivoReal = rentaAnual > 0 ? cuotaTributariaFinal / rentaAnual * 100 : 0;

    setResult({ cuotaTributariaFinal, retencionesAdelantadas, resultadoDeclaracion, tipoEfectivoReal });
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const hasValidIncome = rentaAnual > 0;

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calculadora de IRPF</h2>
            <p className="text-sm text-slate-500">Tramos estatales y autonómicos de referencia 2026</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Fiscal</span>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label htmlFor="irpf-renta-anual" className="mb-2 block text-sm font-semibold text-slate-700">Renta bruta imponible anual (€)</label>
            <input
              id="irpf-renta-anual"
              type="number"
              min="0"
              step="any"
              value={rentaAnual}
              onChange={(event) => setRentaAnual(Number(event.target.value))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="irpf-retencion" className="mb-2 block text-sm font-semibold text-slate-700">Retención aplicada en nómina o facturas (%)</label>
            <input
              id="irpf-retencion"
              type="number"
              min="0"
              max="100"
              step="any"
              value={retencionAplicada}
              onChange={(event) => setRetencionAplicada(Number(event.target.value))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="irpf-situacion-familiar" className="mb-2 block text-sm font-semibold text-slate-700">Situación familiar</label>
            <select
              id="irpf-situacion-familiar"
              value={situacionFamiliar}
              onChange={(event) => setSituacionFamiliar(event.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>Soltero/a</option>
              <option>Casado/a con cónyuge a cargo</option>
              <option>Monoparental</option>
              <option>Casado/a sin cónyuge a cargo</option>
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-500">Mínimo personal aplicado: {formatEuros(MINIMO_PERSONAL)}. La situación familiar queda registrada como contexto orientativo.</p>
          </div>
          <button type="submit" disabled={!hasValidIncome} className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">Calcular estimación</button>
        </form>
      </div>

      <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Resultado estimado</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">IRPF</span>
        </div>
        {result ? (
          <div className="mt-6 space-y-5">
            <div className={`rounded-2xl border p-4 ${result.resultadoDeclaracion < 0 ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-orange-400/30 bg-orange-400/10'}`}>
              <div className="text-sm text-slate-300">{result.resultadoDeclaracion < 0 ? 'A devolver por la Agencia Tributaria' : result.resultadoDeclaracion > 0 ? 'A pagar en la declaración de la renta' : 'Resultado estimado equilibrado'}</div>
              <div className={`mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl ${result.resultadoDeclaracion < 0 ? 'text-emerald-300' : 'text-orange-300'}`}>
                {result.resultadoDeclaracion < 0 ? '+' : ''}{formatEuros(Math.abs(result.resultadoDeclaracion))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-sm text-slate-300">Tipo efectivo real</div>
                <div className="mt-2 text-xl font-bold">{formatPercent(result.tipoEfectivoReal)}</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-sm text-slate-300">Retenciones adelantadas</div>
                <div className="mt-2 text-xl font-bold">{formatEuros(result.retencionesAdelantadas)}</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="text-sm text-slate-300">Cuota tributaria final estimada</div>
              <div className="mt-2 text-2xl font-black">{formatEuros(result.cuotaTributariaFinal)}</div>
            </div>
            <p className="text-xs leading-5 text-slate-400">Cálculo orientativo para {situacionFamiliar}. La liquidación definitiva depende de deducciones, comunidad autónoma y datos fiscales completos.</p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">Completa los datos para estimar tu cuota y la diferencia frente a las retenciones.</div>
        )}
      </aside>
    </section>
  );
}
