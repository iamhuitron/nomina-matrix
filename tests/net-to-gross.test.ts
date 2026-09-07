import { describe, it, expect } from "vitest";
import { solveNetToGross } from "../lib/engine/net-to-gross";
import { computePayroll } from "../lib/engine/payroll-orchestrator";

describe("Algoritmo Inverso Net-to-Gross (Búsqueda Binaria)", () => {
  it("resuelve sueldo bruto con precisión de centavos para sueldo neto de $15,000", () => {
    const targetNet = 15000;
    const solved = solveNetToGross({ targetNetSalary: targetNet });

    expect(solved.telemetry.converged).toBe(true);
    expect(solved.telemetry.iterations).toBeLessThan(30);

    // Verificamos con el motor directo que el sueldo bruto resultante da exactamente el neto
    const verify = computePayroll({
      name: "Test",
      position: "Dev",
      salary: solved.estimatedGrossSalary,
      periodicity: "mensual",
      seniorityYears: 1,
      vacationDays: 12,
      vacationBonusRate: 0.25,
      christmasBonusDays: 15,
      riskClass: "I",
      zone: "general",
      stateTaxRate: 0.03,
    });

    expect(verify.netSalary).toBeCloseTo(targetNet, 1);
  });

  it("resuelve sueldo bruto para sueldo neto ejecutivo de $45,000 en menos de 25 iteraciones", () => {
    const targetNet = 45000;
    const solved = solveNetToGross({ targetNetSalary: targetNet, seniorityYears: 2 });

    expect(solved.telemetry.converged).toBe(true);
    expect(solved.telemetry.iterations).toBeLessThan(30);

    const verify = computePayroll({
      name: "Exec",
      position: "Lead",
      salary: solved.estimatedGrossSalary,
      periodicity: "mensual",
      seniorityYears: 2,
      vacationDays: 14,
      vacationBonusRate: 0.25,
      christmasBonusDays: 15,
      riskClass: "I",
      zone: "general",
      stateTaxRate: 0.03,
    });

    expect(verify.netSalary).toBeCloseTo(targetNet, 1);
  });
});
