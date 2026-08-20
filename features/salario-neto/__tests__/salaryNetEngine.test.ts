import test from "node:test";
import assert from "node:assert/strict";

import { calculateNetSalary } from "../engine/salaryNetEngine";

test("calcula el neto anual y por periodo con Seguridad Social confirmada e IRPF provisional", () => {
  const result = calculateNetSalary({
    year: 2026,
    grossAnnualSalary: 36000,
    payrollFrequency: 14,
    contractType: "indefinido",
    employmentRegime: "regimen-general",
    workSchedule: "completa",
    residenceType: "residente",
  });

  assert.equal(result.year, 2026);
  assert.equal(result.status, "provisional");
  assert.ok(result.grossAnnualSalary > 0);
  assert.ok(result.socialSecurityContribution > 0);
  assert.ok(result.netAnnualSalary > 0);
  assert.ok(Array.isArray(result.breakdown));
  assert.ok(Array.isArray(result.ruleTrace));
});

test("mantiene la trazabilidad y el estado provisional del IRPF", () => {
  const result = calculateNetSalary({
    year: 2026,
    grossAnnualSalary: 50000,
    payrollFrequency: 12,
    contractType: "indefinido",
    employmentRegime: "regimen-general",
    workSchedule: "completa",
    residenceType: "residente",
  });

  const irpfRule = result.ruleTrace.find((rule) => rule.ruleId === "irpf-2026-provisional");

  assert.ok(irpfRule);
  assert.equal(irpfRule?.status, "provisional");
  assert.equal(result.status, "provisional");
});
