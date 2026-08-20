import { TaxInputs, TaxResult } from './types';
import { GENERAL_DEDUCTIBLE_EXPENSES, IRPF_BRACKETS_COMBINED, IRPF_COMBINED_SCALE_FACTOR, PERSONAL_MINIMUM_BASE, SS_WORKER_RATE } from './constants';

function calculateAeatQuota(base: number): number {
  let tax = 0;
  let remainingBase = Math.max(base, 0);
  let previousLimit = 0;

  for (const bracket of IRPF_BRACKETS_COMBINED) {
    if (remainingBase <= 0) break;

    const taxableChunk = Math.min(remainingBase, bracket.limit - previousLimit);
    tax += taxableChunk * bracket.rate * IRPF_COMBINED_SCALE_FACTOR;
    remainingBase -= taxableChunk;
    previousLimit = bracket.limit;
  }

  return tax;
}

export function calculateNetSalary(inputs: TaxInputs): TaxResult {
  const { grossSalary, pays, region, familySituation, childrenCount, disabilityDegree, spouseSituation, geographicMobility } = inputs;

  // 1. Cálculo de Seguridad Social
  const annualSS = grossSalary * SS_WORKER_RATE;

  // 2. Base Liquidable para IRPF
  const deductibleExpenses = GENERAL_DEDUCTIBLE_EXPENSES + (geographicMobility ? GENERAL_DEDUCTIBLE_EXPENSES : 0);
  const taxBase = Math.max(0, grossSalary - annualSS - deductibleExpenses);

  // 3. Mínimo Personal y Familiar ampliado por hijos
  let personalMin = PERSONAL_MINIMUM_BASE;
  if (childrenCount === 1) personalMin += 2400;
  if (childrenCount === 2) personalMin += 2700;
  if (childrenCount >= 3) personalMin += 4000;
  if (disabilityDegree >= 65) personalMin += 9000;
  else if (disabilityDegree >= 33) personalMin += 3000;
  if (familySituation === 'married' && spouseSituation === 'dependent') personalMin += 3400;

  // 4. Cuota progresiva y crédito fiscal del mínimo personal/familiar
  const quotaA = calculateAeatQuota(taxBase);
  const quotaB = calculateAeatQuota(personalMin);
  const finalAnnualIRPF = Math.max(0, quotaA - quotaB);

  // 5. Resultados finales
  const annualNet = grossSalary - annualSS - finalAnnualIRPF;
  const monthlyNet = annualNet / pays;
  const isForalRegion = region.includes('Navarra') || region.includes('País Vasco');

  return {
    annualNet: Number(annualNet.toFixed(2)),
    monthlyNet: Number(monthlyNet.toFixed(2)),
    annualIRPF: Number(finalAnnualIRPF.toFixed(2)),
    irpfPercentage: Number(((finalAnnualIRPF / grossSalary) * 100).toFixed(2)),
    annualSocialSecurity: Number(annualSS.toFixed(2)),
    socialSecurityPercentage: 6.4,
    taxRegimeNote: isForalRegion ? 'Navarra y País Vasco aplican la normativa foral correspondiente. Esta estimación usa la escala común y debe contrastarse con la hacienda foral.' : undefined,
  };
}