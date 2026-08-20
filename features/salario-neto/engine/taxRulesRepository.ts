import type { CalculationStatus, TaxRule } from "../types";

export type RuleYear = 2026;

export class TaxRulesRepository {
  static getYearRules(year: RuleYear): TaxRule[] {
    if (year !== 2026) {
      return [];
    }

    return [
      {
        ruleId: "ss-2026-base-maxima-mensual",
        year: 2026,
        description: "Base máxima mensual de cotización del Régimen General para 2026.",
        source: "Seguridad Social",
        sourceUrl:
          "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4327/4328",
        status: "validated",
        notes: "Valor oficial confirmado por la Seguridad Social para 2026.",
      },
      {
        ruleId: "ss-2026-contingencias-comunes-trabajador",
        year: 2026,
        description: "Contingencias comunes trabajador en el Régimen General para 2026.",
        source: "Seguridad Social",
        sourceUrl:
          "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
        status: "validated",
        notes: "4,70 % confirmado para el trabajador.",
      },
      {
        ruleId: "ss-2026-desempleo-indefinido-trabajador",
        year: 2026,
        description: "Desempleo para trabajador con contrato indefinido en el Régimen General para 2026.",
        source: "Seguridad Social",
        sourceUrl:
          "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
        status: "validated",
        notes: "1,55 % confirmado para contrato indefinido.",
      },
      {
        ruleId: "ss-2026-formacion-profesional-trabajador",
        year: 2026,
        description: "Formación Profesional trabajador en el Régimen General para 2026.",
        source: "Seguridad Social",
        sourceUrl:
          "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
        status: "validated",
        notes: "0,10 % confirmado para el trabajador.",
      },
      {
        ruleId: "ss-2026-mei-trabajador",
        year: 2026,
        description: "MEI trabajador en el Régimen General para 2026.",
        source: "Seguridad Social",
        sourceUrl:
          "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
        status: "validated",
        notes: "0,15 % confirmado para el trabajador.",
      },
      {
        ruleId: "irpf-2026-provisional",
        year: 2026,
        description: "IRPF 2026 pendiente de verificación completa del algoritmo AEAT.",
        source: "Agencia Tributaria",
        sourceUrl: "https://sede.agenciatributaria.gob.es/Sede/Retenciones.shtml",
        status: "provisional",
        notes: "PDF AEAT 2026 no verificado completamente; la implementación del IRPF queda provisional.",
      },
    ];
  }

  static getRuleById(year: RuleYear, ruleId: string): TaxRule | undefined {
    return this.getYearRules(year).find((rule) => rule.ruleId === ruleId);
  }
}

export const taxRulesRepository = TaxRulesRepository;

export function getRuleStatus(): CalculationStatus[] {
  return ["demo", "provisional", "validated"];
}
