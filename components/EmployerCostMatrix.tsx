import React, { useState } from "react";
import { Building2, ChevronDown, ChevronUp, Layers, HelpCircle } from "lucide-react";
import { PayrollCalculationResult } from "../lib/types/payroll";

interface EmployerCostMatrixProps {
  payroll: PayrollCalculationResult;
}

export const EmployerCostMatrix: React.FC<EmployerCostMatrixProps> = ({ payroll }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { grossSalary, netSalary, employerCost, imss, sbc, config } = payroll;

  return (
    <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/10 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold text-white">
              Costo Social Total para la Empresa (Carga Patronal)
            </h2>
            <p className="text-xs text-slate-400">
              Desglose real de lo que desembolsa el negocio más allá del sueldo bruto
            </p>
          </div>
        </div>

        {/* Social Cost Multiplier Badge */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl self-start sm:self-auto font-mono text-xs">
          <span className="text-slate-400">Multiplicador de Costo: </span>
          <strong className="text-cyan-300 text-sm">{employerCost.socialCostMultiplier}x neto</strong>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[11px] uppercase text-slate-400">Sueldo Bruto Nomina</span>
          <p className="text-xl font-bold text-white">
            ${grossSalary.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">Base pactada en contrato</p>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[11px] uppercase text-slate-400">IMSS Patronal Total</span>
          <p className="text-xl font-bold text-cyan-400">
            +${imss.totalEmployer.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">
            5 ramos de seguridad social ({((imss.totalEmployer / grossSalary) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-[11px] uppercase text-slate-400">Infonavit + ISN Estatal</span>
          <p className="text-xl font-bold text-teal-400">
            +${(employerCost.infonavitEmployer + employerCost.stateTaxAmount).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400">
            Infonavit 5% (${employerCost.infonavitEmployer.toFixed(2)}) + ISN 3% (${employerCost.stateTaxAmount.toFixed(2)})
          </p>
        </div>

        <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-500/30 space-y-1">
          <span className="text-[11px] uppercase text-cyan-300 font-bold">Costo Real Empresa</span>
          <p className="text-xl sm:text-2xl font-black text-cyan-300">
            ${employerCost.totalCost.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-cyan-200/80 font-mono">
            Sobreprecio del +{employerCost.overheadPercentage.toFixed(1)}% sobre el bruto
          </p>
        </div>

      </div>

      {/* Insight Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-cyan-400" />
          <span>
            💡 <strong>Regla del Costo Real:</strong> Por cada <strong>$100.00 pesos netos</strong> que el trabajador recibe en su cuenta, tu empresa debe desembolsar <strong>${(employerCost.socialCostMultiplier * 100).toFixed(2)} pesos</strong>.
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
        >
          <span>{showDetails ? "Ocultar Desglose de 5 Ramos" : "Ver Desglose de 5 Ramos IMSS"}</span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Detailed Table of 5 Branches */}
      {showDetails && (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/15 text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">Ramo de Seguridad Social</th>
                <th className="py-2.5 px-3 text-right">Tasa Patrón</th>
                <th className="py-2.5 px-3 text-right">Aportación Patrón</th>
                <th className="py-2.5 px-3 text-right">Tasa Obrero</th>
                <th className="py-2.5 px-3 text-right">Descuento Obrero</th>
                <th className="py-2.5 px-3 text-right">Base de Cálculo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {imss.branches.map((b) => (
                <tr key={b.code} className="hover:bg-white/5 transition">
                  <td className="py-2.5 px-3 font-semibold text-white">{b.branchName}</td>
                  <td className="py-2.5 px-3 text-right text-cyan-400">{b.employerRate}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-300">${b.employerAmount.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-red-400">{b.employeeRate > 0 ? `${b.employeeRate}%` : "—"}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-red-300">{b.employeeAmount > 0 ? `$${b.employeeAmount.toFixed(2)}` : "—"}</td>
                  <td className="py-2.5 px-3 text-right text-[10px] text-slate-400">{b.calculationBase}</td>
                </tr>
              ))}
              <tr className="border-t border-white/20 font-bold bg-white/5 text-white">
                <td className="py-3 px-3">TOTALES CONSOLIDADOS IMSS</td>
                <td className="py-3 px-3 text-right"></td>
                <td className="py-3 px-3 text-right text-cyan-300 text-sm">${imss.totalEmployer.toFixed(2)}</td>
                <td className="py-3 px-3 text-right"></td>
                <td className="py-3 px-3 text-right text-red-300 text-sm">${imss.totalEmployee.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-[10px] text-emerald-400">SBC: ${sbc.sbcDaily.toFixed(2)}/día</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
