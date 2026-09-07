import { describe, it, expect } from "vitest";
import { calculateISR } from "../lib/engine/isr";

describe("Cálculo de ISR Art. 96 LISR", () => {
  it("aplica subsidio para el empleo en salarios bajos", () => {
    const isr = calculateISR(8500, "mensual");
    expect(isr.employmentSubsidy).toBeGreaterThan(0);
    expect(isr.retainedTax).toBeLessThan(isr.grossTax);
  });

  it("calcula retención exacta en rango medio ($25,000 mensuales)", () => {
    const isr = calculateISR(25000, "mensual");
    // $25,000 cae en tramo 6 (15,487.72 a 31,236.49), cuota fija: 1640.18, tasa: 21.36%
    // Excedente = 25000 - 15487.72 = 9512.28
    // Impuesto marginal = 9512.28 * 0.2136 = 2031.82
    // ISR bruto = 1640.18 + 2031.82 = 3672.00
    expect(isr.retainedTax).toBeCloseTo(3672.0, 0);
    expect(isr.marginalRate).toBe(21.36);
    expect(isr.effectiveRate).toBeGreaterThan(10);
    expect(isr.effectiveRate).toBeLessThan(20);
  });

  it("escala proporcionalmente en pagos quincenales", () => {
    const isrMensual = calculateISR(30000, "mensual");
    const isrQuincenal = calculateISR(15000, "quincenal");

    // La retención quincenal debe ser exactamente la mitad de la retención mensual equivalente
    expect(isrQuincenal.retainedTax * 2).toBeCloseTo(isrMensual.retainedTax, 0);
  });
});
