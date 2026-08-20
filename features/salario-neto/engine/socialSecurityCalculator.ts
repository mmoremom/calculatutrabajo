import { getSocialSecurityRuleSet as getSocialSecurityRuleSetFromRules } from "./rules/2026/socialSecurity";
import type {
  CalculationStatus,
  SalaryNetInput,
  SocialSecurityContributionResult,
} from "../types";

export function getSocialSecurityRuleSet(year: number) {
  return getSocialSecurityRuleSetFromRules(year);
}

export function calculateSocialSecurityContribution(input: SalaryNetInput): SocialSecurityContributionResult {
  const rules = getSocialSecurityRuleSet(input.year);

  const salarioAnual = Number(input.grossAnnualSalary ?? 0);
  // La cotización mensual prorratea la remuneración anual en 12 meses.
  // Las pagas extraordinarias no convierten la base mensual en anual / 14.
  const baseMensual = salarioAnual / 12;
  const baseAplicable = Math.min(baseMensual, rules.baseMaximaMensual);

  const contingencias = baseAplicable * rules.contingenciasComunesTrabajador;
  const mei = baseAplicable * rules.meiTrabajador;
  const formacion = baseAplicable * rules.formacionProfesionalTrabajador;
  const desempleo = baseAplicable * rules.desempleoTrabajadorIndefinido;

  const contributionMensual = contingencias + mei + formacion + desempleo;
  const contributionAnual = contributionMensual * 12;

  return {
    year: input.year,
    status: "validated",
    baseContribution: Number(baseAplicable.toFixed(2)),
    workerContribution: Number(contributionAnual.toFixed(2)),
    breakdown: [
      {
        id: "ss-contingencias-comunes",
        label: "Contingencias comunes",
        amount: Number((contingencias * 12).toFixed(2)),
        percentage: rules.contingenciasComunesTrabajador,
        ruleId: rules.contingenciasComunesTrabajadorRule.ruleId,
        year: input.year,
        source: rules.contingenciasComunesTrabajadorRule.source,
        sourceUrl: rules.contingenciasComunesTrabajadorRule.sourceUrl,
        status: rules.contingenciasComunesTrabajadorRule.status,
      },
      {
        id: "ss-mei",
        label: "MEI",
        amount: Number((mei * 12).toFixed(2)),
        percentage: rules.meiTrabajador,
        ruleId: rules.meiTrabajadorRule.ruleId,
        year: input.year,
        source: rules.meiTrabajadorRule.source,
        sourceUrl: rules.meiTrabajadorRule.sourceUrl,
        status: rules.meiTrabajadorRule.status,
      },
      {
        id: "ss-formacion-profesional",
        label: "Formación profesional",
        amount: Number((formacion * 12).toFixed(2)),
        percentage: rules.formacionProfesionalTrabajador,
        ruleId: rules.formacionProfesionalTrabajadorRule.ruleId,
        year: input.year,
        source: rules.formacionProfesionalTrabajadorRule.source,
        sourceUrl: rules.formacionProfesionalTrabajadorRule.sourceUrl,
        status: rules.formacionProfesionalTrabajadorRule.status,
      },
      {
        id: "ss-desempleo-indefinido",
        label: "Desempleo (indefinido)",
        amount: Number((desempleo * 12).toFixed(2)),
        percentage: rules.desempleoTrabajadorIndefinido,
        ruleId: rules.desempleoTrabajadorIndefinidoRule.ruleId,
        year: input.year,
        source: rules.desempleoTrabajadorIndefinidoRule.source,
        sourceUrl: rules.desempleoTrabajadorIndefinidoRule.sourceUrl,
        status: rules.desempleoTrabajadorIndefinidoRule.status,
      },
    ],
  };
}

export type SocialSecurityContributionInput = SalaryNetInput;
export type SocialSecurityContributionStatus = CalculationStatus;

export function calculateSocialSecurityContributionByPeriod(
  input: SocialSecurityContributionInput,
): SocialSecurityContributionResult {
  return calculateSocialSecurityContribution(input);
}
