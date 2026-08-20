import { calculateIncomeTax } from "./incomeTaxCalculator";
import { calculateSocialSecurityContribution } from "./socialSecurityCalculator";
import type {
  SalaryNetBreakdownItem,
  SalaryNetInput,
  SalaryNetResult,
  TaxRule,
} from "../types";

export function calculateNetSalary(input: SalaryNetInput): SalaryNetResult {
  const socialSecurity = calculateSocialSecurityContribution(input);
  const incomeTax = calculateIncomeTax(input);

  const grossAnnualSalary = Number(input.grossAnnualSalary ?? 0);
  const grossMonthlySalary = grossAnnualSalary / (input.payrollFrequency === 14 ? 14 : 12);
  const grossPerPay = grossAnnualSalary / input.payrollFrequency;

  const totalDeductions = socialSecurity.workerContribution + (incomeTax.withholding ?? 0);
  const netAnnualSalary = grossAnnualSalary - totalDeductions;
  const netMonthlySalary = netAnnualSalary / (input.payrollFrequency === 14 ? 14 : 12);
  const netPerPay = netAnnualSalary / input.payrollFrequency;

  return {
    year: input.year,
    status: incomeTax.status === "provisional" ? "provisional" : socialSecurity.status,
    grossAnnualSalary,
    grossMonthlySalary,
    grossPerPay,
    socialSecurityBase: socialSecurity.baseContribution,
    socialSecurityContribution: socialSecurity.workerContribution,
    irpfWithholding: incomeTax.withholding ?? 0,
    retentionPercentage: incomeTax.retentionPercentage ?? 0,
    totalDeductions,
    netAnnualSalary,
    netMonthlySalary,
    netPerPay,
    breakdown: [
      ...socialSecurity.breakdown,
      {
        id: "irpf",
        label: "IRPF",
        amount: incomeTax.withholding ?? 0,
        percentage: incomeTax.retentionPercentage ?? 0,
        ruleId: "irpf-2026-provisional",
        year: input.year,
        source: "Agencia Tributaria",
        sourceUrl: "https://sede.agenciatributaria.gob.es/Sede/Retenciones.shtml",
        status: incomeTax.status,
      },
    ],
    ruleTrace: [
      ...socialSecurity.breakdown.map((item: SalaryNetBreakdownItem) => ({
        ruleId: item.ruleId ?? "",
        year: item.year,
        description: item.label,
        source: item.source ?? "",
        sourceUrl: item.sourceUrl ?? "",
        status: item.status,
      })),
      ...incomeTax.ruleTrace.map((rule: TaxRule) => ({
        ruleId: rule.ruleId,
        year: rule.year,
        description: rule.description,
        source: rule.source,
        sourceUrl: rule.sourceUrl,
        status: rule.status,
      })),
    ],
  };
}
