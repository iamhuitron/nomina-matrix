import React from "react";
import { CheckCircle2, TrendingUp, Zap, HelpCircle } from "lucide-react";
import { PayrollCalculationResult, CalculationMode } from "../lib/types/payroll";

interface NetSummaryCardProps {
  payroll: PayrollCalculationResult;
  mode: CalculationMode;
}

export const NetSummaryCard: React.FC<NetSummaryCardProps> = ({ payroll, mode }) => {
  const { grossSalary, netSalary, isr, imss, sbc, telemetry } = payroll;

  const totalDeductions = isr.retainedTax + imss.totalEmployee;
  const netPercentage = grossSalary > 0 ? (netSalary / grossSalary) * 100 : 0;
  const isrPercentage = grossSalary > 0 ? (isr.retainedTax / grossSalary) * 100 : 0;
  const imssPercentage = grossSalary > 0 ? (imss.totalEmployee / grossSalary) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-[#0b101c] to-slate-950 rounded-2xl p-6 border border-white/15 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Telemetry banner if in Net-to-Gross mode */}
      {mode === "net_to_gross" && telemetry && (
        <div className="mb-5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-emerald-400 animate-pulse" />
            <span className="font-semibold">Búsqueda Binaria Concluida:</span>
            <span>
              Convergencia exacta a centavos en <strong className="text-white">{telemetry.iterations} pasos</strong> ({telemetry.elapsedMicroseconds} µs)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400/80">
            <span>Delta: ${Math.abs(telemetry.deltaError).toFixed(4)} MXN</span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-white font-bold">100% Cuadrado</span>
          </div>
        </div>
      )}

      {/* Main Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sueldo Bruto */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
          <p className="text-[11px] font-mono uppercase text-slate-400">Sueldo Bruto Contractual</p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            ${grossSalary.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">
            SBC Diario: <strong className="text-cyan-400 font-mono">${sbc.sbcDaily.toFixed(2)}</strong> {sbc.isCapped ? "(Topado a 25 UMA)" : `(Factor ${sbc.integrationFactor})`}
          </p>
        </div>

        {/* Retención ISR */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono uppercase text-slate-400">Retención ISR (Art. 96)</p>
            <span className="text-[10px] font-mono text-amber-400">Tasa: {isr.marginalRate}%</span>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-tight">
            -${isr.retainedTax.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">
            Tasa efectiva neta: <strong className="text-white font-mono">{isr.effectiveRate}%</strong>
            {isr.employmentSubsidy > 0 && <span className="text-emerald-400 ml-1">(Subsidio acreditado)</span>}
          </p>
        </div>

        {/* Retención IMSS Obrero */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
          <p className="text-[11px] font-mono uppercase text-slate-400">IMSS Cuota Trabajador</p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-red-400 tracking-tight">
            -${imss.totalEmployee.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">
            Descuento de seguridad social de ley ({imssPercentage.toFixed(1)}% del bruto)
          </p>
        </div>

        {/* Sueldo Neto Libre */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-4 rounded-xl border border-emerald-500/40 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono uppercase text-emerald-300 font-bold">Sueldo Neto Libre</p>
            <CheckCircle2 size={15} className="text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-300 tracking-tight">
            ${netSalary.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-emerald-300/80 font-mono">
            Efectivo en cuenta bancaria ({netPercentage.toFixed(1)}% del bruto)
          </p>
        </div>

      </div>

      {/* Visual Composition Progress Bar */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Distribución del Sueldo Bruto</span>
          <span className="text-slate-300">
            Deducciones: ${(isr.retainedTax + imss.totalEmployee).toFixed(2)} ({((isrPercentage + imssPercentage)).toFixed(1)}%)
          </span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-white/10">
          <div
            style={{ width: `${netPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500"
            title={`Neto: ${netPercentage.toFixed(1)}%`}
          ></div>
          <div
            style={{ width: `${isrPercentage}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`ISR: ${isrPercentage.toFixed(1)}%`}
          ></div>
          <div
            style={{ width: `${imssPercentage}%` }}
            className="h-full bg-red-500 rounded-r-full transition-all duration-500"
            title={`IMSS: ${imssPercentage.toFixed(1)}%`}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Neto Libre ({netPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>ISR ({isrPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span>IMSS ({imssPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
