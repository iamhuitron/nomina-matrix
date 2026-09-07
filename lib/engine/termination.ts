import { TerminationInput, TerminationResult } from "../types/payroll";
import {
  SALARIO_MINIMO_2026,
  UMA_2026,
  DAYS_PER_YEAR,
  getVacationDays,
} from "./constants";
import { calculateISR } from "./isr";

export function calculateTermination(input: TerminationInput): TerminationResult {
  const {
    dailySalary,
    sbcDaily,
    seniorityYears,
    seniorityMonths,
    seniorityDays,
    type,
    christmasBonusDays = 15,
    vacationBonusRate = 0.25,
    daysWorkedInCurrentYear = 180,
  } = input;

  // Antigüedad total exacta en años decimales
  const totalSeniorityYears =
    seniorityYears + seniorityMonths / 12 + seniorityDays / DAYS_PER_YEAR;
  
  // Para exenciones del SAT, fracciones mayores a 6 meses cuentan como año completo
  const yearsForExemption =
    seniorityMonths >= 6 ? Math.ceil(totalSeniorityYears) : Math.max(1, Math.floor(totalSeniorityYears));

  const vacationDaysLaw = getVacationDays(Math.max(1, seniorityYears));

  // --- 1. FINIQUITO ORDINARIO (Partes Proporcionales) ---
  // Aguinaldo proporcional al año en curso
  const proportionalChristmasBonus =
    (daysWorkedInCurrentYear / DAYS_PER_YEAR) * christmasBonusDays * dailySalary;

  // Vacaciones proporcionales al año en curso
  const proportionalVacation =
    (daysWorkedInCurrentYear / DAYS_PER_YEAR) * vacationDaysLaw * dailySalary;

  // Prima vacacional
  const proportionalVacationBonus = proportionalVacation * vacationBonusRate;

  const ordinaryFiniquitoGross =
    proportionalChristmasBonus + proportionalVacation + proportionalVacationBonus;

  // --- 2. INDEMNIZACIONES POR DESPIDO INJUSTIFICADO (LFT) ---
  let constitutionalIndemnity = 0;
  let twentyDaysPerYear = 0;
  let seniorityBonus = 0;
  const legalArticlesCited: string[] = [];

  // Tope de Salario para Prima de Antigüedad (Art. 486 LFT: Doble del Salario Mínimo)
  const doubleSmg = SALARIO_MINIMO_2026.GENERAL * 2;
  const baseSalaryForSeniorityBonus = Math.min(dailySalary, doubleSmg);

  // Prima de Antigüedad (12 días por cada año laborado - Art. 162 LFT)
  const shouldPaySeniorityBonus =
    type === "despido_injustificado" || totalSeniorityYears >= 15;

  if (shouldPaySeniorityBonus) {
    seniorityBonus = totalSeniorityYears * 12 * baseSalaryForSeniorityBonus;
    legalArticlesCited.push("Art. 162 LFT (Prima de Antigüedad - 12 días por año topado a 2 SMG)");
  }

  if (type === "despido_injustificado") {
    // 3 meses constitucionales (90 días con SBC)
    constitutionalIndemnity = 90 * sbcDaily;
    // 20 días por año de servicio (Art. 50 LFT)
    twentyDaysPerYear = 20 * totalSeniorityYears * sbcDaily;

    legalArticlesCited.push("Art. 48 LFT (Indemnización Constitucional de 90 días)");
    legalArticlesCited.push("Art. 50 LFT (20 días de salario por año laborado)");
  }

  const severanceGross =
    constitutionalIndemnity + twentyDaysPerYear + seniorityBonus;

  const totalGross = ordinaryFiniquitoGross + severanceGross;

  // --- 3. EXENCIONES FISCALES E ISR (Art. 93 LISR) ---
  // Exención de Aguinaldo: Hasta 30 UMAs (Art. 93 Frac. XIV LISR)
  const maxAguinaldoExempt = 30 * UMA_2026.DAILY;
  const exemptAguinaldo = Math.min(proportionalChristmasBonus, maxAguinaldoExempt);

  // Exención de Prima Vacacional: Hasta 15 UMAs (Art. 93 Frac. XIV LISR)
  const maxPrimaVacExempt = 15 * UMA_2026.DAILY;
  const exemptPrimaVac = Math.min(proportionalVacationBonus, maxPrimaVacExempt);

  // Exención de Indemnizaciones y Prima de Antigüedad: 90 UMAs por cada año laborado (Art. 93 Frac. XIII LISR)
  const maxSeveranceExempt = yearsForExemption * 90 * UMA_2026.DAILY;
  const exemptSeverance = Math.min(severanceGross, maxSeveranceExempt);

  const totalExempt = exemptAguinaldo + exemptPrimaVac + exemptSeverance;
  const taxableAmount = Math.max(0, totalGross - totalExempt);

  // Estimación de retención de ISR sobre el remanente gravable
  const isrCalculation = calculateISR(taxableAmount, "mensual");
  const retainedTaxISR = isrCalculation.retainedTax;

  const totalNetToPay = Math.max(0, totalGross - retainedTaxISR);

  legalArticlesCited.push("Art. 76 y 80 LFT (Vacaciones Dignas y Prima Vacacional)");
  legalArticlesCited.push("Art. 87 LFT (Aguinaldo Legal Proporcional)");
  legalArticlesCited.push("Art. 93 Frac. XIII y XIV LISR (Exenciones de 90 UMAs por año y prestaciones)");

  return {
    type,
    seniorityYearsExact: Math.round(totalSeniorityYears * 100) / 100,
    proportionalChristmasBonus: Math.round(proportionalChristmasBonus * 100) / 100,
    proportionalVacation: Math.round(proportionalVacation * 100) / 100,
    proportionalVacationBonus: Math.round(proportionalVacationBonus * 100) / 100,
    ordinaryFiniquitoGross: Math.round(ordinaryFiniquitoGross * 100) / 100,
    constitutionalIndemnity: Math.round(constitutionalIndemnity * 100) / 100,
    twentyDaysPerYear: Math.round(twentyDaysPerYear * 100) / 100,
    seniorityBonus: Math.round(seniorityBonus * 100) / 100,
    severanceGross: Math.round(severanceGross * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
    exemptAmount: Math.round(totalExempt * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    retainedTaxISR: Math.round(retainedTaxISR * 100) / 100,
    totalNetToPay: Math.round(totalNetToPay * 100) / 100,
    legalArticlesCited,
  };
}
