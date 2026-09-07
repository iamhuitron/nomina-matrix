import React from "react";
import { DollarSign } from "lucide-react";
import { CalculationMode, Periodicity } from "../lib/types/payroll";

interface SalaryControlProps {
  salary: number;
  setSalary: (val: number) => void;
  mode: CalculationMode;
  periodicity: Periodicity;
}

export const SalaryControl: React.FC<SalaryControlProps> = ({
  salary,
  setSalary,
  mode,
  periodicity,
}) => {
  // Preset buttons depending on periodicity
  const presetsMonthly = [12000, 20000, 30000, 45000, 65000, 90000];
  const presetsQuincenal = [6000, 10000, 15000, 22500, 32500, 45000];
  const presetsSemanal = [2800, 4500, 7000, 10500, 15000, 21000];

  let presets = presetsMonthly;
  if (periodicity === "quincenal") presets = presetsQuincenal;
  if (periodicity === "semanal") presets = presetsSemanal;

  const maxSlider = periodicity === "mensual" ? 150000 : periodicity === "quincenal" ? 75000 : 35000;

  return (
    <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {mode === "gross_to_net" ? "Sueldo Bruto Ofertado" : "Sueldo Neto Libre en Banco"}
          </label>
          <p className="text-[11px] text-slate-400">
            {mode === "gross_to_net"
              ? "Base contractual antes de retenciones de ISR y cuotas de seguridad social"
              : "Importe exacto que el colaborador pide recibir libre en su cuenta bancaria"}
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 self-start sm:self-auto">
          {periodicity.toUpperCase()} MXN
        </span>
      </div>

      {/* Big Number Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-mono font-bold text-2xl">
          $
        </div>
        <input
          type="number"
          value={salary || ""}
          onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
          className="w-full pl-10 pr-4 py-3.5 bg-slate-950/80 border border-white/15 rounded-xl font-mono text-3xl font-bold text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
          placeholder="0.00"
          step="500"
        />
      </div>

      {/* Slider */}
      <div className="pt-2">
        <input
          type="range"
          min="5000"
          max={maxSlider}
          step="500"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>$5,000</span>
          <span>${(maxSlider / 2).toLocaleString()}</span>
          <span>${maxSlider.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 pt-1">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => setSalary(p)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
              salary === p
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                : "bg-slate-800/60 text-slate-400 border-white/5 hover:text-white hover:border-white/20"
            }`}
          >
            ${p.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
};
