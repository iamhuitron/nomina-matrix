import { describe, it, expect } from "vitest";
import { calculateSbc } from "../lib/engine/sbc";
import { UMA_2026, SALARIO_MINIMO_2026, MAX_SBC_UMAS } from "../lib/engine/constants";

describe("SBC & Factor de Integración", () => {
  it("calcula factor de integración de ley para año 1 con Vacaciones Dignas (12 días)", () => {
    // Factor = (365 + 15 + (12 * 0.25)) / 365 = (365 + 15 + 3) / 365 = 383 / 365 = 1.049315
    const sbc = calculateSbc({
      grossMonthlySalary: 30400, // $1,000 diarios
      seniorityYears: 1,
    });

    expect(sbc.dailySalary).toBe(1000);
    expect(sbc.integrationFactor).toBeCloseTo(1.049315, 5);
    expect(sbc.sbcDaily).toBeCloseTo(1049.32, 1);
    expect(sbc.isCapped).toBe(false);
  });

  it("aplica el tope legal de 25 UMAs a salarios ejecutivos altos", () => {
    const dailyCap = MAX_SBC_UMAS * UMA_2026.DAILY; // 25 * 113.14 = 2828.50
    const sbc = calculateSbc({
      grossMonthlySalary: 150000, // $4,934 diarios, excede por mucho las 25 UMAs
      seniorityYears: 3,
    });

    expect(sbc.isCapped).toBe(true);
    expect(sbc.sbcDaily).toBe(Math.round(dailyCap * 100) / 100);
  });

  it("garantiza que el SBC no sea inferior al Salario Mínimo General", () => {
    const sbc = calculateSbc({
      grossMonthlySalary: 3000, // Muy por debajo del salario mínimo
      seniorityYears: 1,
    });

    expect(sbc.sbcDaily).toBeGreaterThanOrEqual(SALARIO_MINIMO_2026.GENERAL);
  });
});
