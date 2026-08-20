'use client';

import { useMemo, useState } from 'react';

type ParoResult = {
  firstSixMonths: { gross: number; socialSecurity: number; irpf: number; net: number };
  remainingMonths: { gross: number; socialSecurity: number; irpf: number; net: number } | null;
  total: number;
};

const MINIMUMS = { noChildren: 560, withChildren: 749 };
const MAXIMUMS = { noChildren: 1225, oneChild: 1400, twoOrMoreChildren: 1575 };

function formatCurrency(value: number): string {
  return `${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function clampBenefit(amount: number, children: number): number {
  const minimum = children === 0 ? MINIMUMS.noChildren : MINIMUMS.withChildren;
  const maximum = children === 0 ? MAXIMUMS.noChildren : children === 1 ? MAXIMUMS.oneChild : MAXIMUMS.twoOrMoreChildren;
  return Math.min(Math.max(amount, minimum), maximum);
}

function calculatePeriod(base: number, rate: number, children: number, irpfRate: number) {
  const gross = clampBenefit(base * rate, children);
  const socialSecurity = base * 0.047;
  const irpf = gross * (irpfRate / 100);
  return { gross, socialSecurity, irpf, net: gross - socialSecurity - irpf };
}

export default function ParoCalculator() {
  const [baseReguladora, setBaseReguladora] = useState('1800');
  const [mesesPrestacion, setMesesPrestacion] = useState('12');
  const [hijosACargo, setHijosACargo] = useState('0');
  const [irpfRate, setIrpfRate] = useState('2');
  const [result, setResult] = useState<ParoResult | null>(null);

  const children = Math.max(Number(hijosACargo) || 0, 0);
  const months = Math.min(Math.max(Number(mesesPrestacion) || 4, 4), 24);
  const base = Math.max(Number(baseReguladora) || 0, 0);

  const validationMessage = useMemo(() => {
    if (!base) return 'Introduce una base reguladora mensual válida.';
    if (Number(mesesPrestacion) < 4 || Number(mesesPrestacion) > 24) return 'La duración debe estar entre 4 y 24 meses.';
    return '';
  }, [base, mesesPrestacion]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validationMessage) {
      setResult(null);
      return;
    }

    const firstSixMonths = calculatePeriod(base, 0.7, children, Number(irpfRate));
    const remainingMonths = months > 6 ? calculatePeriod(base, 0.6, children, Number(irpfRate)) : null;
    const firstPeriodMonths = Math.min(months, 6);
    const total = firstSixMonths.net * firstPeriodMonths + (remainingMonths ? remainingMonths.net * (months - 6) : 0);
    setResult({ firstSixMonths, remainingMonths, total });
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-200/70">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">SEPE · 2026</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Prestación por paro</h2>
            <p className="mt-2 text-sm text-slate-600">Estimación orientativa por tramos y responsabilidades familiares.</p>
          </div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">SEPE</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="paro-base" className="mb-2 block text-sm font-semibold text-slate-700">Base reguladora mensual (€)</label>
            <input id="paro-base" type="number" min="0" step="any" value={baseReguladora} onChange={(event) => setBaseReguladora(event.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="1800" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="paro-months" className="mb-2 block text-sm font-semibold text-slate-700">Meses concedidos</label>
              <input id="paro-months" type="number" min="4" max="24" step="1" value={mesesPrestacion} onChange={(event) => setMesesPrestacion(event.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="12" />
            </div>
            <div>
              <label htmlFor="paro-children" className="mb-2 block text-sm font-semibold text-slate-700">Personas a cargo</label>
              <select id="paro-children" value={hijosACargo} onChange={(event) => setHijosACargo(event.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="0">0 personas</option>
                <option value="1">1 persona</option>
                <option value="2">2 o más personas</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="paro-irpf" className="mb-2 block text-sm font-semibold text-slate-700">Retención IRPF estimada</label>
            <select id="paro-irpf" value={irpfRate} onChange={(event) => setIrpfRate(event.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option value="2">Mínimo 2%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
            </select>
          </div>

          {validationMessage ? <p className="text-sm text-amber-700">{validationMessage}</p> : null}
          <button type="submit" className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">Calcular prestación</button>
        </form>
      </div>

      <aside className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/30">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Resultado estimado</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-300">{months} meses</span>
        </div>
        {result ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-100">Total acumulado estimado</p>
              <p className="mt-2 text-3xl font-black">{formatCurrency(result.total)}</p>
            </div>
            <div className="space-y-4 rounded-2xl bg-white/5 p-4">
              <PeriodResult title="Primeros 6 meses" period={result.firstSixMonths} />
              {result.remainingMonths ? <PeriodResult title="Desde el mes 7" period={result.remainingMonths} /> : <p className="text-sm text-slate-300">La prestación finaliza antes del séptimo mes.</p>}
            </div>
            <p className="text-xs leading-5 text-slate-400">Estimación informativa. Los topes, retenciones y cotizaciones definitivos dependen de la resolución del SEPE y de tu situación fiscal.</p>
          </div>
        ) : <p className="mt-6 rounded-2xl bg-white/5 p-5 text-sm leading-6 text-slate-300">Completa los datos y calcula para ver el bruto, la cotización SS, el IRPF y el neto de cada tramo.</p>}
      </aside>
    </section>
  );
}

function PeriodResult({ title, period }: { title: string; period: { gross: number; socialSecurity: number; irpf: number; net: number } }) {
  return (
    <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-bold text-white">{title}</h4>
        <span className="text-lg font-black text-blue-200">{formatCurrency(period.net)} / mes</span>
      </div>
      <dl className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
        <div><dt>Bruto</dt><dd className="font-bold text-white">{formatCurrency(period.gross)}</dd></div>
        <div><dt>SS (4,7%)</dt><dd className="font-bold text-white">-{formatCurrency(period.socialSecurity)}</dd></div>
        <div><dt>IRPF</dt><dd className="font-bold text-white">-{formatCurrency(period.irpf)}</dd></div>
      </dl>
    </div>
  );
}
