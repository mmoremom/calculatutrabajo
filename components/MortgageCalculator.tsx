import { useState } from 'react';
import type { RefObject } from 'react';

type MortgageCalculatorProps = {
  resultsRef: RefObject<HTMLDivElement | null>;
};

type MortgageResult = {
  cuotaMensual: number;
  totalPagado: number;
  totalIntereses: number;
};

const TERM_PRESETS = [15, 20, 25, 30];

function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateMortgage(capital: number, interesAnual: number, plazoAnos: number): MortgageResult {
  const meses = plazoAnos * 12;
  const interesMensual = interesAnual / 100 / 12;
  const factor = Math.pow(1 + interesMensual, meses);
  const cuotaMensual = interesMensual === 0
    ? capital / meses
    : capital * (interesMensual * factor) / (factor - 1);
  const totalPagado = cuotaMensual * meses;
  const totalIntereses = totalPagado - capital;

  return { cuotaMensual, totalPagado, totalIntereses };
}

export default function MortgageCalculator({ resultsRef }: MortgageCalculatorProps) {
  const [capital, setCapital] = useState(180000);
  const [interesAnual, setInteresAnual] = useState(3.2);
  const [plazoAnos, setPlazoAnos] = useState(25);
  const [result, setResult] = useState< MortgageResult | null>(null);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const calculated = calculateMortgage(capital, interesAnual, plazoAnos);
    setResult(calculated);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calculadora de Hipoteca</h2>
            <p className="text-sm text-slate-500">Cuota, intereses y coste total con amortización francesa</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Vivienda</span>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label htmlFor="mortgage-capital" className="mb-2 block text-sm font-semibold text-slate-700">Capital solicitado (€)</label>
            <input id="mortgage-capital" type="number" min="0" step="any" value={capital} onChange={(event) => setCapital(Number(event.target.value))} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div>
            <label htmlFor="mortgage-interest" className="mb-2 block text-sm font-semibold text-slate-700">Interés anual (%)</label>
            <input id="mortgage-interest" type="number" min="0" step="any" value={interesAnual} onChange={(event) => setInteresAnual(Number(event.target.value))} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Plazo de la hipoteca</span>
            <div className="grid grid-cols-4 gap-2">
              {TERM_PRESETS.map((term) => (
                <button key={term} type="button" onClick={() => setPlazoAnos(term)} className={`min-h-[44px] rounded-lg px-2 py-2 text-sm transition ${plazoAnos === term ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}>{term} años</button>
              ))}
            </div>
            <label htmlFor="mortgage-term" className="sr-only">Plazo personalizado en años</label>
            <input id="mortgage-term" type="number" min="1" step="1" value={plazoAnos} onChange={(event) => setPlazoAnos(Number(event.target.value))} className="mt-2 min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>

          <button type="submit" className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">Calcular estimación</button>
        </form>
      </div>

      <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Resultado estimado</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">HIPOTECA</span>
        </div>
        {result ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4">
              <div className="text-sm text-slate-300">Cuota Mensual</div>
              <div className="mt-2 break-words text-3xl font-black tracking-tight text-blue-200 sm:text-4xl">{formatEuros(result.cuotaMensual)} /mes</div>
            </div>
            <div className="space-y-3 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><span className="text-sm text-slate-200">Capital prestado</span><span className="font-bold text-white">{formatEuros(capital)}</span></div>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><span className="text-sm text-slate-200">Total intereses a pagar</span><span className="font-bold text-orange-300">{formatEuros(result.totalIntereses)}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-sm text-slate-200">Coste total del préstamo</span><span className="font-bold text-white">{formatEuros(result.totalPagado)}</span></div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">Completa los datos para calcular la cuota mensual y el coste total de tu hipoteca.</div>
        )}
      </aside>
    </section>
  );
}
