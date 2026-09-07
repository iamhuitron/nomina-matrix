import { ISRBreakdown, Periodicity } from "../types/payroll";
import { ISR_TABLE_MONTHLY, SUBSIDIO_EMPLEO_2026 } from "./constants";

export function calculateISR(
  taxableIncome: number,
  periodicity: Periodicity = "mensual"
): ISRBreakdown {
  if (taxableIncome <= 0) {
    return {
      taxableIncome: 0,
      lowerLimit: 0,
      excess: 0,
      marginalRate: 0,
      marginalTax: 0,
      fixedFee: 0,
      grossTax: 0,
      employmentSubsidy: 0,
      retainedTax: 0,
      effectiveRate: 0,
    };
  }

  // Normalización mensual para aplicación estricta de la tabla del Art. 96 LISR
  let monthlyFactor = 1;
  if (periodicity === "quincenal") monthlyFactor = 2;
  if (periodicity === "semanal") monthlyFactor = 52 / 12;

  const monthlyIncome = taxableIncome * monthlyFactor;

  // Ubicar tramo en la tabla del Art. 96 LISR
  const bracket =
    ISR_TABLE_MONTHLY.find(
      (b) => monthlyIncome >= b.lowerLimit && monthlyIncome <= b.upperLimit
    ) || ISR_TABLE_MONTHLY[ISR_TABLE_MONTHLY.length - 1];

  const excess = monthlyIncome - bracket.lowerLimit;
  const marginalTaxMonthly = excess * bracket.rate;
  const grossTaxMonthly = marginalTaxMonthly + bracket.fixedFee;

  // Subsidio para el empleo 2026
  let subsidyMonthly = 0;
  if (monthlyIncome <= SUBSIDIO_EMPLEO_2026.SALARY_LIMIT) {
    subsidyMonthly = SUBSIDIO_EMPLEO_2026.MONTHLY_AMOUNT;
  }

  // Retención mensual efectiva (no negativa según reforma oficial)
  const retainedTaxMonthly = Math.max(0, grossTaxMonthly - subsidyMonthly);

  // Escalar de vuelta a la periodicidad solicitada
  const finalGrossTax = grossTaxMonthly / monthlyFactor;
  const finalSubsidy = subsidyMonthly / monthlyFactor;
  const finalRetainedTax = retainedTaxMonthly / monthlyFactor;
  const effectiveRate = taxableIncome > 0 ? (finalRetainedTax / taxableIncome) * 100 : 0;

  return {
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    lowerLimit: Math.round((bracket.lowerLimit / monthlyFactor) * 100) / 100,
    excess: Math.round((excess / monthlyFactor) * 100) / 100,
    marginalRate: Math.round(bracket.rate * 10000) / 100, // En porcentaje (ej. 17.92%)
    marginalTax: Math.round((marginalTaxMonthly / monthlyFactor) * 100) / 100,
    fixedFee: Math.round((bracket.fixedFee / monthlyFactor) * 100) / 100,
    grossTax: Math.round(finalGrossTax * 100) / 100,
    employmentSubsidy: Math.round(finalSubsidy * 100) / 100,
    retainedTax: Math.round(finalRetainedTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}
