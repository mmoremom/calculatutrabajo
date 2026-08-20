import { useState } from 'react';
import type { RefObject } from 'react';

type CalculationMode = 'add' | 'extract';

type IvaCalculatorProps = {
  resultsRef: RefObject<HTMLDivElement | null>;
};

type IvaResult = {
  baseImponible: number;
  cuotaIva: number;
  precioTotal: number;
};

const IVA_PRESETS = [
  { value: 21, label: '21% General' },
  { value: 10, label: '10% Reducido' },
  { value: 4, label: '4% Superreducido' },
];

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

export default function IvaCalculator({ resultsRef }: IvaCalculatorProps) {
  const [modoCalculo, setModoCalculo] = useState<CalculationMode>('add');
  const [monto, setMonto] = useState(1000);
  const [tipoIvaPct, setTipoIvaPct] = useState(21);
  const [customIva, setCustomIva] = useState(false);
  const [result, setResult] = useState<IvaResult | null>(null);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ivaRate = tipoIvaPct / 100;
    const baseImponible = modoCalculo === 'add' ? monto : monto / (1 + ivaRate);
    const precioTotal = modoCalculo === 'add' ? monto + monto * ivaRate : monto;
    const cuotaIva = precioTotal - baseImponible;

    setResult({ baseImponible, cuotaIva, precioTotal });
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const selectPreset = (value: number) => {
    setTipoIvaPct(value);
    setCustomIva(false);
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calculadora de IVA</h2>
            <p className="text-sm text-slate-500">Añade o desglosa el IVA de cualquier importe</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Fiscal</span>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Modo de cálculo</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setModoCalculo('add')} className={`min-h-[48px] rounded-xl px-3 py-2 text-sm transition ${modoCalculo === 'add' ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}>Añadir IVA</button>
              <button type="button" onClick={() => setModoCalculo('extract')} className={`min-h-[48px] rounded-xl px-3 py-2 text-sm transition ${modoCalculo === 'extract' ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}>Desglosar / Quitar IVA</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{modoCalculo === 'add' ? 'El importe introducido es la base imponible.' : 'El importe introducido es el precio final con IVA.'}</p>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Tipo de IVA</span>
            <div className="flex flex-wrap gap-2">
              {IVA_PRESETS.map((preset) => (
                <button key={preset.value} type="button" onClick={() => selectPreset(preset.value)} className={`min-h-[42px] rounded-lg px-3 py-2 text-sm transition ${!customIva && tipoIvaPct === preset.value ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}>{preset.label}</button>
              ))}
              <button type="button" onClick={() => setCustomIva(true)} className={`min-h-[42px] rounded-lg px-3 py-2 text-sm transition ${customIva ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm' : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'}`}>Personalizado</button>
            </div>
            <div className="relative mt-2">
              <label htmlFor="iva-tipo-personalizado" className="sr-only">Porcentaje de IVA personalizado</label>
              <input id="iva-tipo-personalizado" type="number" min="0" max="100" step="any" value={tipoIvaPct} onChange={(event) => { setTipoIvaPct(Number(event.target.value)); setCustomIva(true); }} className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 pr-9 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-500">%</span>
            </div>
          </div>

          <div>
            <label htmlFor="iva-monto" className="mb-2 block text-sm font-semibold text-slate-700">{modoCalculo === 'add' ? 'Base imponible (€)' : 'Precio final con IVA (€)'}</label>
            <input id="iva-monto" type="number" min="0" step="any" value={monto} onChange={(event) => setMonto(Number(event.target.value))} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>

          <button type="submit" className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">Calcular estimación</button>
        </form>
      </div>

      <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Resultado estimado</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">IVA</span>
        </div>
        {result ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4">
              <div className="text-sm text-slate-300">{modoCalculo === 'add' ? 'Precio Total con IVA' : 'Base Imponible sin IVA'}</div>
              <div className="mt-2 break-words text-3xl font-black tracking-tight text-blue-200 sm:text-4xl">{formatEuros(modoCalculo === 'add' ? result.precioTotal : result.baseImponible)}</div>
            </div>
            <div className="space-y-3 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><span className="text-sm text-slate-200">Base Imponible</span><span className="font-bold text-white">{formatEuros(result.baseImponible)}</span></div>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"><span className="text-sm text-slate-200">Cuota de IVA ({formatPercent(tipoIvaPct)})</span><span className="font-bold text-emerald-300">{formatEuros(result.cuotaIva)}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-sm text-slate-200">Importe Total</span><span className="font-bold text-white">{formatEuros(result.precioTotal)}</span></div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">Completa los datos para calcular el importe con o sin IVA.</div>
        )}
      </aside>
    </section>
  );
}
