import { IMSSBreakdown, IMSSBranchDetail, RiskClass, Periodicity } from "../types/payroll";
import {
  UMA_2026,
  DAYS_PER_MONTH,
  RIESGO_TRABAJO_RATES,
  getPatronalCesantiaVejezRate2026,
} from "./constants";

export interface IMSSParams {
  sbcDaily: number;
  riskClass?: RiskClass;
  periodicity?: Periodicity;
}

export function calculateIMSS(params: IMSSParams): IMSSBreakdown {
  const { sbcDaily, riskClass = "I", periodicity = "mensual" } = params;

  let periodDays = DAYS_PER_MONTH;
  if (periodicity === "quincenal") periodDays = 15;
  if (periodicity === "semanal") periodDays = 7;

  const sbcPeriod = sbcDaily * periodDays;
  const umaPeriod = UMA_2026.DAILY * periodDays;
  const threeUmasDaily = UMA_2026.DAILY * 3;

  const branches: IMSSBranchDetail[] = [];

  // 1. Enfermedades y Maternidad - Cuota Fija (Art. 106 Frac. I LSS)
  // Patrón paga 20.40% de 1 UMA. Obrero 0%
  const cuotaFijaPatron = umaPeriod * 0.204;
  branches.push({
    code: "EYM_FIJA",
    branchName: "Enfermedades y Maternidad (Cuota Fija)",
    employerRate: 20.4,
    employerAmount: Math.round(cuotaFijaPatron * 100) / 100,
    employeeRate: 0,
    employeeAmount: 0,
    calculationBase: "1 UMA por días del periodo",
  });

  // 2. Enfermedades y Maternidad - Excedente de 3 UMAs (Art. 106 Frac. II LSS)
  // Aplica únicamente sobre la diferencia si SBC > 3 UMAs
  let excedentePatron = 0;
  let excedenteObrero = 0;
  if (sbcDaily > threeUmasDaily) {
    const baseExcedente = (sbcDaily - threeUmasDaily) * periodDays;
    excedentePatron = baseExcedente * 0.011; // 1.10%
    excedenteObrero = baseExcedente * 0.004; // 0.40%
  }
  branches.push({
    code: "EYM_EXCEDENTE",
    branchName: "Enfermedades y Maternidad (Excedente 3 UMA)",
    employerRate: 1.1,
    employerAmount: Math.round(excedentePatron * 100) / 100,
    employeeRate: 0.4,
    employeeAmount: Math.round(excedenteObrero * 100) / 100,
    calculationBase: sbcDaily > threeUmasDaily ? "SBC - 3 UMAs" : "No aplica (SBC <= 3 UMA)",
  });

  // 3. Enfermedades y Maternidad - Prestaciones en Dinero (Art. 107 LSS)
  // Patrón: 0.70%, Obrero: 0.25% sobre SBC
  const dineroPatron = sbcPeriod * 0.007;
  const dineroObrero = sbcPeriod * 0.0025;
  branches.push({
    code: "EYM_DINERO",
    branchName: "Enfermedades y Maternidad (Prestaciones en Dinero)",
    employerRate: 0.7,
    employerAmount: Math.round(dineroPatron * 100) / 100,
    employeeRate: 0.25,
    employeeAmount: Math.round(dineroObrero * 100) / 100,
    calculationBase: "SBC Integrado",
  });

  // 4. Enfermedades y Maternidad - Gastos Médicos Pensionados (Art. 25 LSS)
  // Patrón: 1.05%, Obrero: 0.375% sobre SBC
  const gmpPatron = sbcPeriod * 0.0105;
  const gmpObrero = sbcPeriod * 0.00375;
  branches.push({
    code: "EYM_PENSIONADOS",
    branchName: "Gastos Médicos para Pensionados (GMP)",
    employerRate: 1.05,
    employerAmount: Math.round(gmpPatron * 100) / 100,
    employeeRate: 0.375,
    employeeAmount: Math.round(gmpObrero * 100) / 100,
    calculationBase: "SBC Integrado",
  });

  // 5. Invalidez y Vida (Art. 147 LSS)
  // Patrón: 1.75%, Obrero: 0.625% sobre SBC
  const iyvPatron = sbcPeriod * 0.0175;
  const iyvObrero = sbcPeriod * 0.00625;
  branches.push({
    code: "IYV",
    branchName: "Invalidez y Vida",
    employerRate: 1.75,
    employerAmount: Math.round(iyvPatron * 100) / 100,
    employeeRate: 0.625,
    employeeAmount: Math.round(iyvObrero * 100) / 100,
    calculationBase: "SBC Integrado",
  });

  // 6. Guarderías y Prestaciones Sociales (Art. 211 LSS)
  // Patrón: 1.00%, Obrero: 0%
  const guarderiasPatron = sbcPeriod * 0.01;
  branches.push({
    code: "GUARDERIAS",
    branchName: "Guarderías y Prestaciones Sociales",
    employerRate: 1.0,
    employerAmount: Math.round(guarderiasPatron * 100) / 100,
    employeeRate: 0,
    employeeAmount: 0,
    calculationBase: "SBC Integrado",
  });

  // 7. Riesgo de Trabajo (Art. 71/73 LSS)
  const rtRate = RIESGO_TRABAJO_RATES[riskClass];
  const rtPatron = sbcPeriod * rtRate;
  branches.push({
    code: "RIESGO_TRABAJO",
    branchName: `Riesgo de Trabajo (Clase ${riskClass})`,
    employerRate: Math.round(rtRate * 100000) / 1000,
    employerAmount: Math.round(rtPatron * 100) / 100,
    employeeRate: 0,
    employeeAmount: 0,
    calculationBase: "SBC Integrado",
  });

  // 8. RCV: Retiro (SAR 2%) (Art. 168 Frac. I LSS)
  const retiroPatron = sbcPeriod * 0.02;
  branches.push({
    code: "RETIRO_SAR",
    branchName: "Seguro de Retiro (SAR)",
    employerRate: 2.0,
    employerAmount: Math.round(retiroPatron * 100) / 100,
    employeeRate: 0,
    employeeAmount: 0,
    calculationBase: "SBC Integrado",
  });

  // 9. RCV: Cesantía en Edad Avanzada y Vejez (Reforma Progresiva 2026)
  const cvPatronRate = getPatronalCesantiaVejezRate2026(sbcDaily);
  const cvPatron = sbcPeriod * cvPatronRate;
  const cvObrero = sbcPeriod * 0.01125; // 1.125% fijo obrero
  branches.push({
    code: "CESANTIA_VEJEZ",
    branchName: "Cesantía y Vejez (Reforma Progresiva 2026)",
    employerRate: Math.round(cvPatronRate * 10000) / 100,
    employerAmount: Math.round(cvPatron * 100) / 100,
    employeeRate: 1.125,
    employeeAmount: Math.round(cvObrero * 100) / 100,
    calculationBase: "SBC Integrado según tramo UMA",
  });

  const totalEmployer = branches.reduce((acc, b) => acc + b.employerAmount, 0);
  const totalEmployee = branches.reduce((acc, b) => acc + b.employeeAmount, 0);

  const rcvEmployer = Math.round((retiroPatron + cvPatron) * 100) / 100;
  const rcvEmployee = Math.round(cvObrero * 100) / 100;

  return {
    branches,
    totalEmployer: Math.round(totalEmployer * 100) / 100,
    totalEmployee: Math.round(totalEmployee * 100) / 100,
    rcvEmployer,
    rcvEmployee,
  };
}
