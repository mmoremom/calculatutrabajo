export const SS_WORKER_RATE = 0.064; // Cotización del trabajador (Contingencias comunes, desempleo, MEI, etc.)
export const GENERAL_DEDUCTIBLE_EXPENSES = 2000;
export const IRPF_COMBINED_SCALE_FACTOR = 0.9465;

// Escala general combinada estatal + autonómica estándar.
export const IRPF_BRACKETS_COMBINED = [
  { limit: 12450, rate: 0.19 },
  { limit: 20200, rate: 0.24 },
  { limit: 35200, rate: 0.30 },
  { limit: 60000, rate: 0.37 },
  { limit: 300000, rate: 0.45 },
  { limit: Infinity, rate: 0.49 },
];

// Mínimo personal y familiar básico
export const PERSONAL_MINIMUM_BASE = 5550;