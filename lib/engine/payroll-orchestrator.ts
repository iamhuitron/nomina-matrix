import {
  EmployeeConfig,
  EmployerCostBreakdown,
  PayrollCalculationResult,
  BatchEmployeeRow,
  BatchSummary,
} from "../types/payroll";
import { calculateSbc } from "./sbc";
import { calculateISR } from "./isr";
import { calculateIMSS } from "./imss";
import { solveNetToGross } from "./net-to-gross";
import { DAYS_PER_MONTH } from "./constants";

export function computePayroll(
  config: EmployeeConfig,
  mode: "gross_to_net" | "net_to_gross" = "gross_to_net"
): PayrollCalculationResult {
  let grossSalary = config.salary;
  let telemetry = undefined;

  if (mode === "net_to_gross") {
    const solved = solveNetToGross({
      targetNetSalary: config.salary,
      periodicity: config.periodicity,
      seniorityYears: config.seniorityYears,
      christmasBonusDays: config.christmasBonusDays,
      vacationBonusRate: config.vacationBonusRate,
      riskClass: config.riskClass,
    });
    grossSalary = solved.estimatedGrossSalary;
    telemetry = solved.telemetry;
  }

  // Normalizar a mensual para el cálculo de SBC y cuotas patronales
  let monthlyGross = grossSalary;
  if (config.periodicity === "quincenal") monthlyGross = grossSalary * 2;
  if (config.periodicity === "semanal") monthlyGross = (grossSalary * 52) / 12;

  // 1. Salario Base de Cotización (SBC)
  const sbc = calculateSbc({
    grossMonthlySalary: monthlyGross,
    seniorityYears: config.seniorityYears,
    christmasBonusDays: config.christmasBonusDays,
    vacationBonusRate: config.vacationBonusRate,
  });

  // 2. Retención de ISR
  const isr = calculateISR(grossSalary, config.periodicity);

  // 3. Cuotas IMSS
  const imss = calculateIMSS({
    sbcDaily: sbc.sbcDaily,
    riskClass: config.riskClass,
    periodicity: config.periodicity,
  });

  // 4. Sueldo Neto resultante
  const netSalary = Math.max(
    0,
    grossSalary - isr.retainedTax - imss.totalEmployee
  );

  // 5. Cargas Patronales Adicionales
  // Infonavit: 5% sobre SBC del periodo
  let periodDays = DAYS_PER_MONTH;
  if (config.periodicity === "quincenal") periodDays = 15;
  if (config.periodicity === "semanal") periodDays = 7;

  const infonavitEmployer = Math.round(sbc.sbcDaily * periodDays * 0.05 * 100) / 100;
  // ISN (Impuesto sobre nóminas local, ej. 3% sobre sueldo bruto)
  const stateTaxAmount = Math.round(grossSalary * config.stateTaxRate * 100) / 100;

  // 6. Costo Total para la Empresa
  const totalCost =
    grossSalary + imss.totalEmployer + infonavitEmployer + stateTaxAmount;
  
  const socialCostMultiplier =
    netSalary > 0 ? Math.round((totalCost / netSalary) * 100) / 100 : 1;
  const overheadPercentage =
    grossSalary > 0
      ? Math.round(((totalCost - grossSalary) / grossSalary) * 10000) / 100
      : 0;

  const employerCost: EmployerCostBreakdown = {
    grossSalary: Math.round(grossSalary * 100) / 100,
    imssEmployer: imss.totalEmployer,
    infonavitEmployer,
    stateTaxAmount,
    totalCost: Math.round(totalCost * 100) / 100,
    socialCostMultiplier,
    overheadPercentage,
  };

  return {
    config,
    grossSalary: Math.round(grossSalary * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    sbc,
    isr,
    imss,
    employerCost,
    telemetry,
  };
}

export function computeBatchPayroll(employees: BatchEmployeeRow[]): BatchSummary {
  const results = employees.map((emp) =>
    computePayroll(
      {
        name: emp.name,
        position: emp.position,
        salary: emp.grossSalary,
        periodicity: "mensual",
        seniorityYears: emp.seniorityYears,
        vacationDays: 12,
        vacationBonusRate: 0.25,
        christmasBonusDays: 15,
        riskClass: emp.riskClass,
        zone: "general",
        stateTaxRate: 0.03,
      },
      "gross_to_net"
    )
  );

  const totalGrossPayroll = results.reduce((acc, r) => acc + r.grossSalary, 0);
  const totalNetPaid = results.reduce((acc, r) => acc + r.netSalary, 0);
  const totalISRRetained = results.reduce((acc, r) => acc + r.isr.retainedTax, 0);
  const totalIMSSEmployee = results.reduce((acc, r) => acc + r.imss.totalEmployee, 0);
  const totalIMSSEmployer = results.reduce((acc, r) => acc + r.imss.totalEmployer, 0);
  const totalInfonavit = results.reduce((acc, r) => acc + r.employerCost.infonavitEmployer, 0);
  const totalStateTax = results.reduce((acc, r) => acc + r.employerCost.stateTaxAmount, 0);
  const totalEmployerCost = results.reduce((acc, r) => acc + r.employerCost.totalCost, 0);

  const averageEffectiveTaxRate =
    totalGrossPayroll > 0
      ? Math.round((totalISRRetained / totalGrossPayroll) * 10000) / 100
      : 0;

  return {
    totalEmployees: employees.length,
    totalGrossPayroll: Math.round(totalGrossPayroll * 100) / 100,
    totalNetPaid: Math.round(totalNetPaid * 100) / 100,
    totalISRRetained: Math.round(totalISRRetained * 100) / 100,
    totalIMSSEmployee: Math.round(totalIMSSEmployee * 100) / 100,
    totalIMSSEmployer: Math.round(totalIMSSEmployer * 100) / 100,
    totalInfonavit: Math.round(totalInfonavit * 100) / 100,
    totalStateTax: Math.round(totalStateTax * 100) / 100,
    totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
    averageEffectiveTaxRate,
    results,
  };
}

// Plantilla sintética de 10 puestos de una PyME mexicana típica para la demo
export const SAMPLE_COMPANY_PAYROLL: BatchEmployeeRow[] = [
  { id: "EMP-01", name: "Carlos Mendoza", position: "Director General", grossSalary: 65000, seniorityYears: 5, riskClass: "I" },
  { id: "EMP-02", name: "Sofía Arteaga", position: "Lead Software Engineer", grossSalary: 52000, seniorityYears: 3, riskClass: "I" },
  { id: "EMP-03", name: "Alejandro Ruiz", position: "Contador Senior", grossSalary: 38000, seniorityYears: 4, riskClass: "I" },
  { id: "EMP-04", name: "Mariana Treviño", position: "Frontend Developer", grossSalary: 32000, seniorityYears: 2, riskClass: "I" },
  { id: "EMP-05", name: "Jorge Morales", position: "Ejecutivo de Ventas B2B", grossSalary: 24000, seniorityYears: 2, riskClass: "I" },
  { id: "EMP-06", name: "Valeria Gómez", position: "Diseñadora UI/UX", grossSalary: 22000, seniorityYears: 1, riskClass: "I" },
  { id: "EMP-07", name: "Héctor Silva", position: "Soporte Técnico / TI", grossSalary: 18000, seniorityYears: 2, riskClass: "II" },
  { id: "EMP-08", name: "Patricia Vega", position: "Analista de Operaciones", grossSalary: 16000, seniorityYears: 1, riskClass: "I" },
  { id: "EMP-09", name: "Raúl Hernández", position: "Auxiliar Contable", grossSalary: 12500, seniorityYears: 1, riskClass: "I" },
  { id: "EMP-10", name: "Daniela Cruz", position: "Recepcionista / Admin", grossSalary: 9500, seniorityYears: 1, riskClass: "I" },
];
