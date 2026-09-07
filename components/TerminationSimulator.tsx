import React, { useState } from "react";
import { Scale, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { TerminationType, TerminationResult } from "../lib/types/payroll";
import { calculateTermination } from "../lib/engine/termination";

interface TerminationSimulatorProps {
  grossMonthlySalary: number;
  sbcDaily: number;
}

export const TerminationSimulator: React.FC<TerminationSimulatorProps> = ({
  grossMonthlySalary,
  sbcDaily,
}) => {
  const [type, setType] = useState<TerminationType>("despido_injustificado");
  const [seniorityYears, setSeniorityYears] = useState(3);
  const [seniorityMonths, setSeniorityMonths] = useState(6);
  const [daysWorkedInCurrentYear, setDaysWorkedInCurrentYear] = useState(180);

  const dailySalary = grossMonthlySalary / 30.4;

  const result: TerminationResult = calculateTermination({
    dailySalary,
    sbcDaily,
    seniorityYears,
    seniorityMonths,
    seniorityDays: 0,
    type,
    christmasBonusDays: 15,
    vacationDays: 16,
    vacationBonusRate: 0.25,
    daysWorkedInCurrentYear,
  });

  return (
    <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold text-white">
              Simulador de Finiquito y Liquidación Legal (LFT / SAT)
            </h2>
            <p className="text-xs text-slate-400">
              Cálculo de indemnizaciones constitucionales, prima de antigüedad y exenciones de 90 UMAs/año
            </p>
          </div>
        </div>

        {/* Termination Type Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10 font-mono text-xs self-start sm:self-auto">
          <button
            onClick={() => setType("despido_injustificado")}
            className={`px-3 py-1.5 rounded-lg transition font-semibold ${
              type === "despido_injustificado"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Despido Injustificado (Art. 48/50)
          </button>
          <button
            onClick={() => setType("renuncia")}
            className={`px-3 py-1.5 rounded-lg transition font-semibold ${
              type === "renuncia"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Renuncia Voluntaria (Finiquito)
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1.5">
          <label className="text-slate-400">Años de Antigüedad:</label>
          <input
            type="number"
            min="0"
            max="40"
            value={seniorityYears}
            onChange={(e) => setSeniorityYears(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white font-bold"
          />
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1.5">
          <label className="text-slate-400">Meses Adicionales:</label>
          <input
            type="number"
            min="0"
            max="11"
            value={seniorityMonths}
            onChange={(e) => setSeniorityMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white font-bold"
          />
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1.5">
          <label className="text-slate-400">Días Laborados en Año Actual:</label>
          <input
            type="number"
            min="1"
            max="365"
            value={daysWorkedInCurrentYear}
            onChange={(e) => setDaysWorkedInCurrentYear(Math.max(1, Math.min(365, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white font-bold"
          />
        </div>
      </div>

      {/* Hero Result Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase">Monto Bruto Total</span>
          <p className="text-2xl font-bold text-white">${result.totalGross.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-slate-400">Finiquito (${result.ordinaryFiniquitoGross.toFixed(2)}) + Indemnizaciones (${result.severanceGross.toFixed(2)})</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 uppercase">Retención Estimada ISR</span>
            <span className="text-[10px] text-emerald-400">Exento: ${result.exemptAmount.toFixed(2)}</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">-${result.retainedTaxISR.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-slate-400">Art. 93 Frac. XIII (90 UMAs por año exentas)</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 rounded-xl border border-amber-500/40 space-y-1">
          <span className="text-[11px] text-amber-300 uppercase font-bold">Total Neto a Liquidar</span>
          <p className="text-2xl font-black text-amber-300">${result.totalNetToPay.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-amber-200/80">Cheque final / Depósito al colaborador</p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] text-slate-400 uppercase">
              <th className="py-2.5 px-3">Concepto Laboral</th>
              <th className="py-2.5 px-3">Fundamento Legal</th>
              <th className="py-2.5 px-3 text-right">Importe Bruto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            <tr>
              <td className="py-2.5 px-3 font-medium text-white">Aguinaldo Proporcional ({daysWorkedInCurrentYear} días)</td>
              <td className="py-2.5 px-3 text-[11px] text-slate-400">Art. 87 LFT</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-200">${result.proportionalChristmasBonus.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-white">Vacaciones Proporcionales Devengadas</td>
              <td className="py-2.5 px-3 text-[11px] text-slate-400">Art. 76 LFT (Vacaciones Dignas)</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-200">${result.proportionalVacation.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-medium text-white">Prima Vacacional (25%)</td>
              <td className="py-2.5 px-3 text-[11px] text-slate-400">Art. 80 LFT</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-200">${result.proportionalVacationBonus.toFixed(2)}</td>
            </tr>

            {type === "despido_injustificado" && (
              <>
                <tr className="bg-amber-500/5">
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Indemnización Constitucional (3 Meses / 90 Días SBC)</td>
                  <td className="py-2.5 px-3 text-[11px] text-amber-400/80">Art. 48 LFT & Art. 123 Const.</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">${result.constitutionalIndemnity.toFixed(2)}</td>
                </tr>
                <tr className="bg-amber-500/5">
                  <td className="py-2.5 px-3 font-semibold text-amber-200">20 Días de Salario Integrado por Año Laborado</td>
                  <td className="py-2.5 px-3 text-[11px] text-amber-400/80">Art. 50 Frac. II LFT</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">${result.twentyDaysPerYear.toFixed(2)}</td>
                </tr>
                <tr className="bg-amber-500/5">
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Prima de Antigüedad (12 Días por Año, Topada a 2 SMG)</td>
                  <td className="py-2.5 px-3 text-[11px] text-amber-400/80">Art. 162 & 486 LFT</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">${result.seniorityBonus.toFixed(2)}</td>
                </tr>
              </>
            )}

            {type === "renuncia" && result.seniorityBonus > 0 && (
              <tr>
                <td className="py-2.5 px-3 font-semibold text-cyan-200">Prima de Antigüedad (&gt;= 15 Años Cumplidos)</td>
                <td className="py-2.5 px-3 text-[11px] text-cyan-400">Art. 162 Frac. III LFT</td>
                <td className="py-2.5 px-3 text-right font-bold text-cyan-300">${result.seniorityBonus.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cited Laws */}
      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
        <span className="text-slate-300 font-bold block mb-1">Fundamentos Jurídicos Aplicados:</span>
        {result.legalArticlesCited.map((cite, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>{cite}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
