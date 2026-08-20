import test from "node:test";
import assert from "node:assert/strict";

import { calculateSocialSecurityContribution, getSocialSecurityRuleSet } from "../engine/socialSecurityCalculator";

test("devuelve la regla verificada de Seguridad Social para 2026", () => {
  const rules = getSocialSecurityRuleSet(2026);

  assert.equal(rules.year, 2026);
  assert.equal(rules.baseMaximaMensual, 5101.2);
  assert.equal(rules.contingenciasComunesTrabajador, 0.047);
  assert.equal(rules.desempleoTrabajadorIndefinido, 0.0155);
  assert.equal(rules.formacionProfesionalTrabajador, 0.001);
  assert.equal(rules.meiTrabajador, 0.0015);
});

test("calcula la cuota del trabajador sin superar el máximo de cotización", () => {
  const result = calculateSocialSecurityContribution({
    year: 2026,
    grossAnnualSalary: 36000,
    payrollFrequency: 14,
    contractType: "indefinido",
    employmentRegime: "regimen-general",
    workSchedule: "completa",
    residenceType: "residente",
  });

  assert.equal(result.year, 2026);
  assert.equal(result.status, "validated");
  assert.ok(result.workerContribution > 0);
  assert.ok(result.baseContribution <= 5101.2);
  assert.equal(result.workerContribution, Number((result.baseContribution * 0.063 * 12).toFixed(2)));
});

test("aplica el tope máximo cuando el salario supera la base máxima", () => {
  const result = calculateSocialSecurityContribution({
    year: 2026,
    grossAnnualSalary: 200000,
    payrollFrequency: 14,
    contractType: "indefinido",
    employmentRegime: "regimen-general",
    workSchedule: "completa",
    residenceType: "residente",
  });

  assert.equal(result.year, 2026);
  assert.equal(result.status, "validated");
  assert.equal(result.baseContribution, 5101.2);
  assert.equal(result.workerContribution, Number((5101.2 * 0.063 * 12).toFixed(2)));
  assert.ok(result.workerContribution > 0);
});


test("no divide la base de cotización entre 14 cuando hay pagas extra", () => {
  const result = calculateSocialSecurityContribution({
    year: 2026,
    grossAnnualSalary: 36000,
    payrollFrequency: 14,
    contractType: "indefinido",
    employmentRegime: "regimen-general",
    workSchedule: "completa",
    residenceType: "residente",
  });

  assert.equal(result.baseContribution, 3000);
});
