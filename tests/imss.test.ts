import { describe, it, expect } from "vitest";
import { calculateIMSS } from "../lib/engine/imss";
import { UMA_2026 } from "../lib/engine/constants";

describe("Cuotas Obrero-Patronales IMSS 2026", () => {
  it("calcula los 5 ramos de seguridad social correctamente", () => {
    const imss = calculateIMSS({
      sbcDaily: 600, // $600 diarios
      riskClass: "I",
      periodicity: "mensual",
    });

    expect(imss.branches.length).toBe(9); // 9 conceptos agrupados en los 5 ramos
    expect(imss.totalEmployer).toBeGreaterThan(imss.totalEmployee);
    expect(imss.totalEmployee).toBeGreaterThan(0);
  });

  it("cobra excedente de 3 UMAs cuando SBC diario supera $339.42", () => {
    const threeUmas = UMA_2026.DAILY * 3;
    const imssAlto = calculateIMSS({ sbcDaily: threeUmas + 200 });
    const imssBajo = calculateIMSS({ sbcDaily: threeUmas - 50 });

    const excedenteAlto = imssAlto.branches.find((b) => b.code === "EYM_EXCEDENTE");
    const excedenteBajo = imssBajo.branches.find((b) => b.code === "EYM_EXCEDENTE");

    expect(excedenteAlto?.employerAmount).toBeGreaterThan(0);
    expect(excedenteBajo?.employerAmount).toBe(0);
  });
});
