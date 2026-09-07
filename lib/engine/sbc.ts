import { SbcBreakdown } from "../types/payroll";
import {
  DAYS_PER_YEAR,
  DAYS_PER_MONTH,
  MAX_SBC_UMAS,
  UMA_2026,
  SALARIO_MINIMO_2026,
  getVacationDays,
} from "./constants";

export interface SbcParams {
  grossMonthlySalary: number;
  seniorityYears: number;
  christmasBonusDays?: number; // Mínimo 15 días
  vacationDaysCustom?: number; // Si no se especifica, usa Vacaciones Dignas
  vacationBonusRate?: number; // Mínimo 0.25 (25%)
}

export function calculateSbc(params: SbcParams): SbcBreakdown {
  const {
    grossMonthlySalary,
    seniorityYears,
    christmasBonusDays = 15,
    vacationDaysCustom,
    vacationBonusRate = 0.25,
  } = params;

  const dailySalary = grossMonthlySalary / DAYS_PER_MONTH;
  const vacationDays = vacationDaysCustom ?? getVacationDays(seniorityYears);

  // Factor de Integración = (365 + Aguinaldo + (Vacaciones * Prima)) / 365
  const integrationNumerator =
    DAYS_PER_YEAR + christmasBonusDays + vacationDays * vacationBonusRate;
  const integrationFactor = integrationNumerator / DAYS_PER_YEAR;

  let calculatedSbcDaily = dailySalary * integrationFactor;

  // Límite Inferior: Salario Mínimo General
  if (calculatedSbcDaily < SALARIO_MINIMO_2026.GENERAL) {
    calculatedSbcDaily = SALARIO_MINIMO_2026.GENERAL;
  }

  // Límite Superior: 25 UMAs (Art. 28 LSS)
  const dailyCap = MAX_SBC_UMAS * UMA_2026.DAILY;
  const isCapped = calculatedSbcDaily > dailyCap;
  const finalSbcDaily = isCapped ? dailyCap : calculatedSbcDaily;

  return {
    dailySalary: Math.round(dailySalary * 100) / 100,
    integrationFactor: Math.round(integrationFactor * 1000000) / 1000000,
    sbcDaily: Math.round(finalSbcDaily * 100) / 100,
    sbcMonthly: Math.round(finalSbcDaily * DAYS_PER_MONTH * 100) / 100,
    isCapped,
    dailyCap: Math.round(dailyCap * 100) / 100,
  };
}
