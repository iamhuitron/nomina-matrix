import React from "react";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import { CalculationMode } from "../lib/types/payroll";

interface ModeToggleProps {
  mode: CalculationMode;
  setMode: (m: CalculationMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="bg-slate-900/80 p-1.5 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-1.5 font-mono text-xs">
      <button
        onClick={() => setMode("gross_to_net")}
        className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
          mode === "gross_to_net"
            ? "bg-slate-800 text-white font-semibold shadow-md border border-white/15"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span>Bruto ➔ Neto</span>
        <span className="text-[10px] text-slate-400 hidden md:inline">(Deducciones de Ley)</span>
      </button>

      <button
        onClick={() => setMode("net_to_gross")}
        className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
          mode === "net_to_gross"
            ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 font-bold shadow-md border border-emerald-500/40"
            : "text-slate-400 hover:text-emerald-400"
        }`}
      >
        <Sparkles size={14} className="text-emerald-400 animate-pulse" />
        <span>Neto ➔ Bruto (Ingeniería Inversa)</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Algoritmo Binario
        </span>
      </button>
    </div>
  );
};
