export type CalculationStatus = 'demo' | 'provisional' | 'validated';

export interface TaxRule {
  ruleId: string;
  year: number;
  description: string;
  source: string;
  sourceUrl: string;
  status: CalculationStatus;
  notes?: string;
}

export interface TaxInputs {
  grossSalary: number;
  pays: 12 | 14;
  region: string;
  familySituation: 'single' | 'married' | 'single_parent';
  childrenCount: number;
  disabilityDegree: number; // Porcentaje de discapacidad
  spouseSituation: 'not_applicable' | 'income_over_1500' | 'dependent';
  geographicMobility: boolean;
}

export interface TaxResult {
  annualNet: number;
  monthlyNet: number;
  annualIRPF: number;
  irpfPercentage: number;
  annualSocialSecurity: number;
  socialSecurityPercentage: number;
  taxRegimeNote?: string;
}

export interface SalaryCalculationResult {
  netoMensual: number;
  netoAnual: number;
  brutoAnual: number;
  isProvisional: boolean;
  deducciones: Array<{ label: string; value: number; note?: string }>;
  summary: string;
}

export interface SalaryInput {
  brutoAnual: number;
  numeroPagas: 12 | 14;
  comunidadAutonoma: string;
  situacionFamiliar: string;
  numeroHijos?: number;
  discapacidad?: number;
}

export interface SalaryNetBreakdownItem {
  id: string;
  label: string;
  amount: number;
  percentage: number;
  ruleId: string;
  year: number;
  source: string;
  sourceUrl: string;
  status: CalculationStatus;
}

export interface SalaryNetInput {
  year: number;
  grossAnnualSalary: number;
  payrollFrequency: 12 | 14;
}

export interface SalaryNetResult {
  year: number;
  status: CalculationStatus;
  grossAnnualSalary: number;
  grossMonthlySalary: number;
  grossPerPay: number;
  socialSecurityBase: number;
  socialSecurityContribution: number;
  irpfWithholding: number;
  retentionPercentage: number;
  totalDeductions: number;
  netAnnualSalary: number;
  netMonthlySalary: number;
  netPerPay: number;
  breakdown: SalaryNetBreakdownItem[];
  ruleTrace: Array<{
    ruleId: string;
    year: number;
    description: string;
    source: string;
    sourceUrl: string;
    status: CalculationStatus;
  }>;
}

export interface SocialSecurityContributionResult {
  year: number;
  status: CalculationStatus;
  baseContribution: number;
  workerContribution: number;
  breakdown: SalaryNetBreakdownItem[];
}