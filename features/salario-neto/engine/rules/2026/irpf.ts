import type { TaxRule } from "../../../types";

export interface IrpfRuleSet {
  year: 2026;
  status: "provisional";
  algorithmStatus: "PDF AEAT 2026 no verificado completamente";
  notes: string[];
  provisionalRule: TaxRule;
}

export const irpfRuleSet: IrpfRuleSet = {
  year: 2026,
  status: "provisional",
  algorithmStatus: "PDF AEAT 2026 no verificado completamente",
  notes: [
    "El algoritmo oficial del IRPF 2026 no ha sido verificado completamente.",
    "Se deja la lógica provisional y fuera de validación hasta confirmar la documentación AEAT.",
  ],
  provisionalRule: {
    ruleId: "irpf-2026-provisional",
    year: 2026,
    description: "IRPF 2026 provisional: pendiente de verificación completa del algoritmo AEAT.",
    source: "Agencia Tributaria",
    sourceUrl: "https://sede.agenciatributaria.gob.es/Sede/Retenciones.shtml",
    status: "provisional",
    notes: "Sin verificación completa del PDF AEAT 2026, la regla queda provisional.",
  },
};
