import type { SalaryInput } from "./types";

export function validateSalaryInput(input: SalaryInput): { isValid: boolean; error?: string } {
  if (!Number.isFinite(input.brutoAnual) || input.brutoAnual <= 0) {
    return { isValid: false, error: "El salario bruto anual debe ser mayor que cero." };
  }

  if (input.numeroPagas !== 12 && input.numeroPagas !== 14) {
    return { isValid: false, error: "El número de pagas debe ser 12 o 14." };
  }

  if (!input.comunidadAutonoma) {
    return { isValid: false, error: "Selecciona una comunidad autónoma." };
  }

  if (!input.situacionFamiliar) {
    return { isValid: false, error: "Selecciona una situación familiar." };
  }

  return { isValid: true };
}
