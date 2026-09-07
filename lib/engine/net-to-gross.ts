import { NetToGrossTelemetry, Periodicity, RiskClass } from "../types/payroll";
import { calculateISR } from "./isr";
import { calculateSbc } from "./sbc";
import { calculateIMSS } from "./imss";

export interface NetToGrossParams {
  targetNetSalary: number;
  periodicity?: Periodicity;
  seniorityYears?: number;
  christmasBonusDays?: number;
  vacationDaysCustom?: number;
  vacationBonusRate?: number;
  riskClass?: RiskClass;
  tolerance?: number;
  maxIterations?: number;
}

export interface NetToGrossResult {
  estimatedGrossSalary: number;
  telemetry: NetToGrossTelemetry;
}

export function solveNetToGross(params: NetToGrossParams): NetToGrossResult {
  const {
    targetNetSalary,
    periodicity = "mensual",
    seniorityYears = 1,
    christmasBonusDays = 15,
    vacationDaysCustom,
    vacationBonusRate = 0.25,
    riskClass = "I",
    tolerance = 0.005, // Menor a un centavo de precisión
    maxIterations = 50,
  } = params;

  if (targetNetSalary <= 0) {
    return {
      estimatedGrossSalary: 0,
      telemetry: {
        iterations: 0,
        elapsedMicroseconds: 0,
        targetNet: 0,
        calculatedNet: 0,
        deltaError: 0,
        converged: true,
      },
    };
  }

  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  // Función interna que evalúa el Sueldo Neto resultante de un Sueldo Bruto dado
  function evaluateGross(candidateGross: number): {
    net: number;
    isr: number;
    imss: number;
  } {
    // Normalizar a mensual si es necesario para el cálculo de SBC
    let monthlyGross = candidateGross;
    if (periodicity === "quincenal") monthlyGross = candidateGross * 2;
    if (periodicity === "semanal") monthlyGross = (candidateGross * 52) / 12;

    const sbc = calculateSbc({
      grossMonthlySalary: monthlyGross,
      seniorityYears,
      christmasBonusDays,
      vacationDaysCustom,
      vacationBonusRate,
    });

    const isr = calculateISR(candidateGross, periodicity);
    const imss = calculateIMSS({
      sbcDaily: sbc.sbcDaily,
      riskClass,
      periodicity,
    });

    const net = candidateGross - isr.retainedTax - imss.totalEmployee;
    return { net, isr: isr.retainedTax, imss: imss.totalEmployee };
  }

  // Intervalo de búsqueda para el algoritmo de bisección
  let low = targetNetSalary;
  let high = targetNetSalary * 2.8 + 1000; // Cota superior holgada para absorber hasta 35% ISR + IMSS
  let mid = (low + high) / 2;
  let iterations = 0;
  let currentNet = 0;

  while (iterations < maxIterations) {
    iterations++;
    mid = (low + high) / 2;
    const res = evaluateGross(mid);
    currentNet = res.net;
    const error = currentNet - targetNetSalary;

    if (Math.abs(error) <= tolerance) {
      break;
    }

    if (currentNet < targetNetSalary) {
      // Necesitamos más sueldo bruto
      low = mid;
    } else {
      // Nos pasamos, reducir cota superior
      high = mid;
    }
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const elapsedMicroseconds = Math.round((endTime - startTime) * 1000);

  return {
    estimatedGrossSalary: Math.round(mid * 100) / 100,
    telemetry: {
      iterations,
      elapsedMicroseconds,
      targetNet: targetNetSalary,
      calculatedNet: Math.round(currentNet * 100) / 100,
      deltaError: Math.round((currentNet - targetNetSalary) * 1000) / 1000,
      converged: Math.abs(currentNet - targetNetSalary) <= 0.05,
    },
  };
}
