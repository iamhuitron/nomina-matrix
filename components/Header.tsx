import React from "react";
import { ShieldCheck, Cpu, Scale, FileSpreadsheet } from "lucide-react";
import { Periodicity } from "../lib/types/payroll";

interface HeaderProps {
  periodicity: Periodicity;
  setPeriodicity: (p: Periodicity) => void;
  onOpenBatch: () => void;
  onOpenPaystub: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  periodicity,
  setPeriodicity,
  onOpenBatch,
  onOpenPaystub,
}) => {
  return (
    <header className="border-b border-white/10 bg-[#080c14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Differentiator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-mono font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20">
              NM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-base font-bold text-white tracking-tight">
                  NOMINA<span className="text-emerald-400">_MATRIX</span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Normatividad 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Motor de Ingeniería Inversa (Net-to-Gross), Costo Social e IMSS 5 Ramos
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <Scale size={13} className="text-cyan-400" />
            LISR Art. 96 + Subsidio
          </span>
          <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <ShieldCheck size={13} className="text-emerald-400" />
            LSS Reforma RCV 2026
          </span>
          <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <Cpu size={13} className="text-amber-400" />
            Vacaciones Dignas
          </span>
        </div>

        {/* Controls & Modals Trigger */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Periodicity Selector */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-white/10 font-mono text-xs">
            {(["mensual", "quincenal", "semanal"] as Periodicity[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodicity(p)}
                className={`px-3 py-1 rounded-md capitalize transition ${
                  periodicity === p
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={onOpenBatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-white/10 transition"
          >
            <FileSpreadsheet size={14} className="text-cyan-400" />
            <span>Plantilla PyME</span>
          </button>

          <button
            onClick={onOpenPaystub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30 transition"
          >
            <span>Recibo CFDI</span>
          </button>
        </div>

      </div>
    </header>
  );
};
