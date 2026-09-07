import { RiskClass } from "../types/payroll";

// Indicadores Económicos Oficiales 2026 (Proyección DOF / INEGI)
export const UMA_2026 = {
  DAILY: 113.14,
  MONTHLY: 3439.46, // 113.14 * 30.4
  ANNUAL: 41296.10, // 113.14 * 365
};

export const SALARIO_MINIMO_2026 = {
  GENERAL: 278.80,
  FRONTERA_NORTE: 374.89,
};

export const MAX_SBC_UMAS = 25; // Tope legal Art. 28 LSS (25 UMAs = $2,828.50 diarios)
export const DAYS_PER_MONTH = 30.4;
export const DAYS_PER_YEAR = 365;

// Tabla de Vacaciones Dignas (Reforma LFT Art. 76)
export function getVacationDays(seniorityYears: number): number {
  if (seniorityYears <= 0) return 12;
  if (seniorityYears === 1) return 12;
  if (seniorityYears === 2) return 14;
  if (seniorityYears === 3) return 16;
  if (seniorityYears === 4) return 18;
  if (seniorityYears === 5) return 20;
  if (seniorityYears <= 10) return 22;
  if (seniorityYears <= 15) return 24;
  if (seniorityYears <= 20) return 26;
  if (seniorityYears <= 25) return 28;
  if (seniorityYears <= 30) return 30;
  return 32;
}

// Tarifa Mensual del Art. 96 de la Ley del Impuesto Sobre la Renta (LISR 2026)
export interface ISRBracket {
  lowerLimit: number;
  upperLimit: number;
  fixedFee: number;
  rate: number;
}

export const ISR_TABLE_MONTHLY: ISRBracket[] = [
  { lowerLimit: 0.01, upperLimit: 746.04, fixedFee: 0.0, rate: 0.0192 },
  { lowerLimit: 746.05, upperLimit: 6332.05, fixedFee: 14.32, rate: 0.064 },
  { lowerLimit: 6332.06, upperLimit: 11128.01, fixedFee: 371.83, rate: 0.1088 },
  { lowerLimit: 11128.02, upperLimit: 12935.82, fixedFee: 893.63, rate: 0.16 },
  { lowerLimit: 12935.83, upperLimit: 15487.71, fixedFee: 1182.88, rate: 0.1792 },
  { lowerLimit: 15487.72, upperLimit: 31236.49, fixedFee: 1640.18, rate: 0.2136 },
  { lowerLimit: 31236.5, upperLimit: 49233.0, fixedFee: 5000.75, rate: 0.2352 },
  { lowerLimit: 49233.01, upperLimit: 93993.9, fixedFee: 9233.93, rate: 0.3 },
  { lowerLimit: 93993.91, upperLimit: 125325.2, fixedFee: 22662.2, rate: 0.32 },
  { lowerLimit: 125325.21, upperLimit: 375975.61, fixedFee: 32688.22, rate: 0.34 },
  { lowerLimit: 375975.62, upperLimit: Infinity, fixedFee: 117909.36, rate: 0.35 },
];

// Subsidio para el Empleo (Decreto Oficial Mayo 2024 / Ejercicio 2026)
// Cuota mensual del 11.82% de la UMA mensual para ingresos hasta $9,081.00
export const SUBSIDIO_EMPLEO_2026 = {
  SALARY_LIMIT: 9081.0,
  PERCENTAGE_OF_UMA: 0.1182,
  MONTHLY_AMOUNT: Math.round(UMA_2026.MONTHLY * 0.1182 * 100) / 100, // $406.54 aprox
};

// Tasas de Riesgo de Trabajo según Clase (Art. 73 LSS)
export const RIESGO_TRABAJO_RATES: Record<RiskClass, number> = {
  I: 0.0054355, // Oficinas, comercio, software
  II: 0.0113065, // Almacenes, manufactura ligera
  III: 0.025984, // Transporte menor, talleres
  IV: 0.0465325, // Construcción, química pesada
  V: 0.0758875, // Minería, fundición, alta siniestralidad
};

// Reforma de Pensiones (RCV): Cuota Patronal de Cesantía y Vejez 2026 (Art. 168 LSS)
// Escala progresiva conforme al incremento paulatino 2023-2030
export function getPatronalCesantiaVejezRate2026(sbcDaily: number): number {
  const uma = UMA_2026.DAILY;
  const smg = SALARIO_MINIMO_2026.GENERAL;

  if (sbcDaily <= smg * 1.05) return 0.03153; // 3.153%
  if (sbcDaily <= uma * 1.5) return 0.03513; // 3.513%
  if (sbcDaily <= uma * 2.0) return 0.04253; // 4.253%
  if (sbcDaily <= uma * 2.5) return 0.04993; // 4.993%
  if (sbcDaily <= uma * 3.0) return 0.05733; // 5.733%
  if (sbcDaily <= uma * 3.5) return 0.06473; // 6.473%
  if (sbcDaily <= uma * 4.0) return 0.07213; // 7.213%
  return 0.11875; // 11.875% (> 4.01 UMAs)
}
