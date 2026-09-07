export type Periodicity = "mensual" | "quincenal" | "semanal";

export type CalculationMode = "gross_to_net" | "net_to_gross";

export type RiskClass = "I" | "II" | "III" | "IV" | "V";

export type GeographicZone = "general" | "frontera_norte";

export interface EmployeeConfig {
  name: string;
  position: string;
  salary: number; // Sueldo base según el modo seleccionado
  periodicity: Periodicity;
  seniorityYears: number;
  vacationDays: number;
  vacationBonusRate: number; // Por defecto 0.25 (25%)
  christmasBonusDays: number; // Por defecto 15 días
  riskClass: RiskClass;
  zone: GeographicZone;
  stateTaxRate: number; // ISN (Impuesto sobre nómina estatal, ej. 0.03 = 3%)
}

export interface SbcBreakdown {
  dailySalary: number;
  integrationFactor: number;
  sbcDaily: number;
  sbcMonthly: number;
  isCapped: boolean;
  dailyCap: number; // 25 UMAs
}

export interface ISRBreakdown {
  taxableIncome: number;
  lowerLimit: number;
  excess: number;
  marginalRate: number;
  marginalTax: number;
  fixedFee: number;
  grossTax: number;
  employmentSubsidy: number;
  retainedTax: number;
  effectiveRate: number; // En porcentaje (0 - 100)
}

export interface IMSSBranchDetail {
  code: string;
  branchName: string;
  employerRate: number;
  employerAmount: number;
  employeeRate: number;
  employeeAmount: number;
  calculationBase: string;
}

export interface IMSSBreakdown {
  branches: IMSSBranchDetail[];
  totalEmployer: number;
  totalEmployee: number;
  rcvEmployer: number;
  rcvEmployee: number;
}

export interface EmployerCostBreakdown {
  grossSalary: number;
  imssEmployer: number;
  infonavitEmployer: number;
  stateTaxAmount: number; // ISN
  totalCost: number;
  socialCostMultiplier: number; // totalCost / netSalary
  overheadPercentage: number; // ((totalCost - grossSalary) / grossSalary) * 100
}

export interface NetToGrossTelemetry {
  iterations: number;
  elapsedMicroseconds: number;
  targetNet: number;
  calculatedNet: number;
  deltaError: number;
  converged: boolean;
}

export interface PayrollCalculationResult {
  config: EmployeeConfig;
  grossSalary: number;
  netSalary: number;
  sbc: SbcBreakdown;
  isr: ISRBreakdown;
  imss: IMSSBreakdown;
  employerCost: EmployerCostBreakdown;
  telemetry?: NetToGrossTelemetry;
}

export type TerminationType = "renuncia" | "despido_injustificado";

export interface TerminationInput {
  dailySalary: number;
  sbcDaily: number;
  seniorityYears: number;
  seniorityMonths: number;
  seniorityDays: number;
  type: TerminationType;
  christmasBonusDays: number;
  vacationDays: number;
  vacationBonusRate: number;
  daysWorkedInCurrentYear: number;
}

export interface TerminationResult {
  type: TerminationType;
  seniorityYearsExact: number;
  // Finiquito proporcional ordinario
  proportionalChristmasBonus: number;
  proportionalVacation: number;
  proportionalVacationBonus: number;
  ordinaryFiniquitoGross: number;
  // Indemnizaciones LFT (en caso de despido)
  constitutionalIndemnity: number; // 90 días Art. 48 LFT
  twentyDaysPerYear: number; // 20 días por año Art. 50 LFT
  seniorityBonus: number; // 12 días por año topado a 2 SMG Art. 162 LFT
  severanceGross: number;
  // Consolidado e impuestos
  totalGross: number;
  exemptAmount: number; // 90 UMAs por año Art. 93 Frac. XIII LISR
  taxableAmount: number;
  retainedTaxISR: number;
  totalNetToPay: number;
  legalArticlesCited: string[];
}

export interface BatchEmployeeRow {
  id: string;
  name: string;
  position: string;
  grossSalary: number;
  seniorityYears: number;
  riskClass: RiskClass;
}

export interface BatchSummary {
  totalEmployees: number;
  totalGrossPayroll: number;
  totalNetPaid: number;
  totalISRRetained: number;
  totalIMSSEmployee: number;
  totalIMSSEmployer: number;
  totalInfonavit: number;
  totalStateTax: number;
  totalEmployerCost: number;
  averageEffectiveTaxRate: number;
  results: PayrollCalculationResult[];
}
