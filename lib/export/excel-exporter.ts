import * as XLSX from "xlsx";
import {
  PayrollCalculationResult,
  TerminationResult,
  BatchSummary,
} from "../types/payroll";

export function exportPayrollWorkbook(
  payroll: PayrollCalculationResult,
  batch?: BatchSummary,
  termination?: TerminationResult
) {
  const wb = XLSX.utils.book_new();

  // HOJA 1: RESUMEN SALARIAL Y DEDUCCIONES
  const salaryData = [
    ["NOMINA-MATRIX: DICTAMEN SALARIAL MEXICANO 2026", ""],
    ["Colaborador:", payroll.config.name || "Colaborador"],
    ["Puesto:", payroll.config.position || "General"],
    ["Periodicidad:", payroll.config.periodicity.toUpperCase()],
    ["Antigüedad (Años):", payroll.config.seniorityYears],
    ["", ""],
    ["PERCEPCIONES", "IMPORTE (MXN)"],
    ["Sueldo Bruto:", payroll.grossSalary],
    ["SBC Diario Integrado:", payroll.sbc.sbcDaily],
    ["SBC Mensual:", payroll.sbc.sbcMonthly],
    ["", ""],
    ["DEDUCCIONES OBRERAS", "IMPORTE (MXN)"],
    ["ISR Retenido (Art. 96 LISR):", payroll.isr.retainedTax],
    ["Subsidio al Empleo Acreditado:", payroll.isr.employmentSubsidy],
    ["Cuota IMSS Obrero Total:", payroll.imss.totalEmployee],
    ["", ""],
    ["NETO A PAGAR EN BANCO:", payroll.netSalary],
    ["Tasa Efectiva de Impuesto:", `${payroll.isr.effectiveRate}%`],
  ];
  const wsSalary = XLSX.utils.aoa_to_sheet(salaryData);
  XLSX.utils.book_append_sheet(wb, wsSalary, "Resumen Salarial");

  // HOJA 2: DESGLOSE IMSS Y CARGAS PATRONALES
  const imssRows = [
    ["RAMO DE SEGURIDAD SOCIAL", "TASA PATRÓN (%)", "PATRÓN (MXN)", "TASA OBRERO (%)", "OBRERO (MXN)"],
    ...payroll.imss.branches.map((b) => [
      b.branchName,
      `${b.employerRate}%`,
      b.employerAmount,
      `${b.employeeRate}%`,
      b.employeeAmount,
    ]),
    ["TOTALES IMSS", "", payroll.imss.totalEmployer, "", payroll.imss.totalEmployee],
    ["", "", "", "", ""],
    ["OTRAS CARGAS PATRONALES", "TASA (%)", "IMPORTE (MXN)", "", ""],
    ["Aportación Infonavit (Vivienda):", "5.0%", payroll.employerCost.infonavitEmployer, "", ""],
    ["Impuesto Sobre Nómina Estatal (ISN):", `${payroll.config.stateTaxRate * 100}%`, payroll.employerCost.stateTaxAmount, "", ""],
    ["", "", "", "", ""],
    ["COSTO TOTAL EMPRESA:", "", payroll.employerCost.totalCost, "", ""],
    ["Multiplicador de Costo Social:", "", `${payroll.employerCost.socialCostMultiplier}x neto`, "", ""],
  ];
  const wsImss = XLSX.utils.aoa_to_sheet(imssRows);
  XLSX.utils.book_append_sheet(wb, wsImss, "Cargas Patronales");

  // HOJA 3: PLANTILLA BATCH (SI EXISTE)
  if (batch) {
    const batchRows = [
      ["ID", "NOMBRE", "PUESTO", "SUELDO BRUTO", "ISR RETENIDO", "IMSS OBRERO", "SUELDO NETO", "COSTO TOTAL EMPRESA"],
      ...batch.results.map((r) => [
        r.config.name,
        r.config.position,
        r.config.salary,
        r.grossSalary,
        r.isr.retainedTax,
        r.imss.totalEmployee,
        r.netSalary,
        r.employerCost.totalCost,
      ]),
      ["TOTALES EMPRESA", "", "", batch.totalGrossPayroll, batch.totalISRRetained, batch.totalIMSSEmployee, batch.totalNetPaid, batch.totalEmployerCost],
    ];
    const wsBatch = XLSX.utils.aoa_to_sheet(batchRows);
    XLSX.utils.book_append_sheet(wb, wsBatch, "Plantilla Masiva");
  }

  // HOJA 4: FINIQUITO / LIQUIDACIÓN (SI EXISTE)
  if (termination) {
    const termRows = [
      ["SIMULADOR DE FINIQUITO Y LIQUIDACIÓN LEGAL (LFT / SAT)", ""],
      ["Tipo de Baja:", termination.type === "despido_injustificado" ? "Despido Injustificado" : "Renuncia Voluntaria"],
      ["Antigüedad Exacta (Años):", termination.seniorityYearsExact],
      ["", ""],
      ["CONCEPTO", "IMPORTE (MXN)"],
      ["Aguinaldo Proporcional:", termination.proportionalChristmasBonus],
      ["Vacaciones Proporcionales:", termination.proportionalVacation],
      ["Prima Vacacional (25%+):", termination.proportionalVacationBonus],
      ["Total Finiquito Ordinario:", termination.ordinaryFiniquitoGross],
      ["", ""],
      ["Indemnización Constitucional (90 días):", termination.constitutionalIndemnity],
      ["20 Días por Año de Servicio:", termination.twentyDaysPerYear],
      ["Prima de Antigüedad (Art. 162 LFT):", termination.seniorityBonus],
      ["Total Indemnizaciones LFT:", termination.severanceGross],
      ["", ""],
      ["TOTAL BRUTO FINIQUITO/LIQUIDACIÓN:", termination.totalGross],
      ["Monto Exento de ISR (90 UMAs/Año):", termination.exemptAmount],
      ["Monto Gravado para ISR:", termination.taxableAmount],
      ["Retención Estimada de ISR:", termination.retainedTaxISR],
      ["NETO TOTAL A LIQUIDAR:", termination.totalNetToPay],
    ];
    const wsTerm = XLSX.utils.aoa_to_sheet(termRows);
    XLSX.utils.book_append_sheet(wb, wsTerm, "Finiquito y Liquidación");
  }

  XLSX.writeFile(wb, `Nomina_Matrix_Reporte_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
