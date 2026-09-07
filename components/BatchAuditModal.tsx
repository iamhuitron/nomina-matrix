import React, { useState } from "react";
import { X, Users, Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { BatchEmployeeRow, BatchSummary } from "../lib/types/payroll";
import { computeBatchPayroll, SAMPLE_COMPANY_PAYROLL } from "../lib/engine/payroll-orchestrator";
import { exportPayrollWorkbook } from "../lib/export/excel-exporter";

interface BatchAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchAuditModal: React.FC<BatchAuditModalProps> = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState<BatchEmployeeRow[]>(SAMPLE_COMPANY_PAYROLL);

  if (!isOpen) return null;

  const summary: BatchSummary = computeBatchPayroll(employees);

  const handleExportExcel = () => {
    exportPayrollWorkbook(summary.results[0], summary);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Auditoría Masiva de Plantilla PyME (Batch Engine)</h2>
              <p className="text-[11px] text-slate-400">Simulación consolidada de 10 colaboradores con distintos puestos y clases de riesgo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global KPIs Bar */}
        <div className="p-5 bg-slate-950/40 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase">Masa Salarial Bruta</span>
            <p className="text-lg font-bold text-white">${summary.totalGrossPayroll.toLocaleString("es-MX")}</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase">Neto Total Pagado</span>
            <p className="text-lg font-bold text-emerald-300">${summary.totalNetPaid.toLocaleString("es-MX")}</p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase">Total Retención ISR SAT</span>
            <p className="text-lg font-bold text-amber-400">${summary.totalISRRetained.toLocaleString("es-MX")}</p>
          </div>
          <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30 space-y-0.5">
            <span className="text-[10px] text-cyan-300 uppercase font-bold">Costo Social Empresa</span>
            <p className="text-lg font-black text-cyan-300">${summary.totalEmployerCost.toLocaleString("es-MX")}</p>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase sticky top-0 bg-slate-900">
                <th className="py-2.5 px-3">Colaborador / Puesto</th>
                <th className="py-2.5 px-3 text-right">Sueldo Bruto</th>
                <th className="py-2.5 px-3 text-right">Ret. ISR</th>
                <th className="py-2.5 px-3 text-right">IMSS Obrero</th>
                <th className="py-2.5 px-3 text-right">Sueldo Neto</th>
                <th className="py-2.5 px-3 text-right">Costo Total Empresa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {summary.results.map((res, i) => (
                <tr key={i} className="hover:bg-white/5 transition">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white">{res.config.name}</div>
                    <div className="text-[10px] text-slate-400">{res.config.position} ({res.config.seniorityYears} {res.config.seniorityYears === 1 ? "año" : "años"})</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">${res.grossSalary.toLocaleString("es-MX")}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400">-${res.isr.retainedTax.toLocaleString("es-MX")}</td>
                  <td className="py-2.5 px-3 text-right text-red-400">-${res.imss.totalEmployee.toLocaleString("es-MX")}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-300">${res.netSalary.toLocaleString("es-MX")}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-300">${res.employerCost.totalCost.toLocaleString("es-MX")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-slate-950/80">
          <span className="text-[11px] text-slate-400">
            {summary.totalEmployees} colaboradores calculados con precisión de centavos bajo tarifas 2026
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              <FileSpreadsheet size={15} />
              <span>Descargar Cédula en Excel (.xlsx)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
