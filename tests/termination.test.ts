import { describe, it, expect } from "vitest";
import { calculateTermination } from "../lib/engine/termination";

describe("Simulador de Finiquito y Liquidación LFT", () => {
  it("calcula renuncia voluntaria sin indemnización constitucional", () => {
    const res = calculateTermination({
      dailySalary: 500,
      sbcDaily: 524.66,
      seniorityYears: 2,
      seniorityMonths: 3,
      seniorityDays: 10,
      type: "renuncia",
      christmasBonusDays: 15,
      vacationDays: 14,
      vacationBonusRate: 0.25,
      daysWorkedInCurrentYear: 180,
    });

    expect(res.constitutionalIndemnity).toBe(0);
    expect(res.twentyDaysPerYear).toBe(0);
    expect(res.ordinaryFiniquitoGross).toBeGreaterThan(0);
    expect(res.totalNetToPay).toBeGreaterThan(0);
  });

  it("calcula despido injustificado con 90 días constitucionales y 20 días por año", () => {
    const res = calculateTermination({
      dailySalary: 600,
      sbcDaily: 630,
      seniorityYears: 3,
      seniorityMonths: 0,
      seniorityDays: 0,
      type: "despido_injustificado",
      christmasBonusDays: 15,
      vacationDays: 16,
      vacationBonusRate: 0.25,
      daysWorkedInCurrentYear: 120,
    });

    // 90 días * 630 = $56,700
    expect(res.constitutionalIndemnity).toBe(56700);
    // 20 días * 3 años * 630 = $37,800
    expect(res.twentyDaysPerYear).toBe(37800);
    // Prima de antigüedad: 12 días * 3 años * min(600, 2*278.80=557.60) = 36 * 557.60 = $20,073.60
    expect(res.seniorityBonus).toBeCloseTo(20073.6, 0);
    // Exención de 90 UMAs por año laborado (3 años * 90 * 113.14 = $30,547.80)
    expect(res.exemptAmount).toBeGreaterThan(30000);
    expect(res.legalArticlesCited.length).toBeGreaterThanOrEqual(4);
  });
});
