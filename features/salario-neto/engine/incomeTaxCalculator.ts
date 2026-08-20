import type { CalculationStatus, SalaryNetInput, TaxRule } from "../types";

export interface IncomeTaxCalculationResult {
  year: number;
  status: CalculationStatus;
  retentionPercentage: number | null;
  grossAnnualSalary: number;
  taxableBase: number | null;
  withholding: number | null;
  ruleTrace: TaxRule[];
  notes: string[];
}

export function calculateIncomeTax(input: SalaryNetInput): IncomeTaxCalculationResult {
  return {
    year: input.year,
    status: "provisional",
    retentionPercentage: null,
    grossAnnualSalary: input.grossAnnualSalary,
    taxableBase: null,
    withholding: null,
    ruleTrace: [
      {
        ruleId: "irpf-2026-provisional",
        year: 2026,
        description: "IRPF 2026 pendiente de verificación completa del algoritmo AEAT.",
        source: "Agencia Tributaria",
        sourceUrl: "https://sede.agenciatributaria.gob.es/Sede/Retenciones.shtml",
        status: "provisional",
        notes: "PDF AEAT 2026 no verificado completamente; la lógica del IRPF queda provisional.",
      },
    ],
    notes: [
      "PDF AEAT 2026 no verificado completamente.",
      "No se implementa el algoritmo definitivo de IRPF sin verificar la documentación oficial.",
      "El cálculo de IRPF queda marcado como provisional.",
    ],
  };
}
