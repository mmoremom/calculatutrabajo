import type { TaxRule } from "../../../types";

export interface SocialSecurityRuleSet {
  year: 2026;
  baseMaximaMensual: number;
  contingenciasComunesTrabajador: number;
  meiTrabajador: number;
  formacionProfesionalTrabajador: number;
  desempleoTrabajadorIndefinido: number;
  contingenciasComunesTrabajadorRule: TaxRule;
  meiTrabajadorRule: TaxRule;
  formacionProfesionalTrabajadorRule: TaxRule;
  desempleoTrabajadorIndefinidoRule: TaxRule;
}

export function getSocialSecurityRuleSet(year: number): SocialSecurityRuleSet {
  if (year !== 2026) {
    throw new Error("Solo está implementado el año 2026 para la Seguridad Social.");
  }

  const contingenciasComunesTrabajadorRule: TaxRule = {
    ruleId: "ss-2026-contingencias-comunes-trabajador",
    year: 2026,
    description: "Contingencias comunes trabajador del Régimen General 2026.",
    source: "Seguridad Social",
    sourceUrl:
      "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
    status: "validated",
    notes: "Valor oficial verificado para 2026.",
  };

  const meiTrabajadorRule: TaxRule = {
    ruleId: "ss-2026-mei-trabajador",
    year: 2026,
    description: "MEI trabajador del Régimen General 2026.",
    source: "Seguridad Social",
    sourceUrl:
      "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
    status: "validated",
    notes: "Valor oficial verificado para 2026.",
  };

  const formacionProfesionalTrabajadorRule: TaxRule = {
    ruleId: "ss-2026-formacion-profesional-trabajador",
    year: 2026,
    description: "Formación Profesional trabajador del Régimen General 2026.",
    source: "Seguridad Social",
    sourceUrl:
      "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
    status: "validated",
    notes: "Valor oficial verificado para 2026.",
  };

  const desempleoTrabajadorIndefinidoRule: TaxRule = {
    ruleId: "ss-2026-desempleo-indefinido-trabajador",
    year: 2026,
    description: "Desempleo para contrato indefinido trabajador del Régimen General 2026.",
    source: "Seguridad Social",
    sourceUrl:
      "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/9932/4315/4316",
    status: "validated",
    notes: "Valor oficial verificado para 2026.",
  };

  return {
    year: 2026,
    baseMaximaMensual: 5101.2,
    contingenciasComunesTrabajador: 0.047,
    meiTrabajador: 0.0015,
    formacionProfesionalTrabajador: 0.001,
    desempleoTrabajadorIndefinido: 0.0155,
    contingenciasComunesTrabajadorRule,
    meiTrabajadorRule,
    formacionProfesionalTrabajadorRule,
    desempleoTrabajadorIndefinidoRule,
  };
}
