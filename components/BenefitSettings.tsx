import React, { useState } from "react";
import { Sliders, ChevronDown, ChevronUp, ShieldAlert, Award } from "lucide-react";
import { EmployeeConfig, RiskClass } from "../lib/types/payroll";
import { getVacationDays, RIESGO_TRABAJO_RATES } from "../lib/engine/constants";

interface BenefitSettingsProps {
  config: EmployeeConfig;
  updateConfig: (patch: Partial<EmployeeConfig>) => void;
}

export const BenefitSettings: React.FC<BenefitSettingsProps> = ({
  config,
  updateConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const calculatedVacationDays = getVacationDays(config.seniorityYears);

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-2.5">
          <Sliders size={16} className="text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-white">
            Parámetros Laborales y Prestaciones (SBC / IMSS)
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {config.seniorityYears} {config.seniorityYears === 1 ? "año" : "años"} · {calculatedVacationDays} días vac. · Riesgo Clase {config.riskClass}
          </span>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          
          {/* Antigüedad */}
          <div className="space-y-1.5">
            <label className="text-slate-400 flex items-center justify-between">
              <span>Antigüedad (Años):</span>
              <span className="text-emerald-400 font-bold">{config.seniorityYears}</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={config.seniorityYears}
              onChange={(e) =>
                updateConfig({
                  seniorityYears: Number(e.target.value),
                  vacationDays: getVacationDays(Number(e.target.value)),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
            />
            <p className="text-[10px] text-slate-400">
              Vacaciones Dignas: <span className="text-white font-bold">{calculatedVacationDays} días</span>
            </p>
          </div>

          {/* Días de Aguinaldo */}
          <div className="space-y-1.5">
            <label className="text-slate-400">Días de Aguinaldo (mín. 15):</label>
            <input
              type="number"
              min="15"
              max="60"
              value={config.christmasBonusDays}
              onChange={(e) =>
                updateConfig({ christmasBonusDays: Math.max(15, Number(e.target.value)) })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
            />
          </div>

          {/* Prima Vacacional */}
          <div className="space-y-1.5">
            <label className="text-slate-400">Prima Vacacional (% mín. 25%):</label>
            <input
              type="number"
              min="25"
              max="100"
              step="5"
              value={config.vacationBonusRate * 100}
              onChange={(e) =>
                updateConfig({ vacationBonusRate: Number(e.target.value) / 100 })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
            />
          </div>

          {/* Clase de Riesgo de Trabajo */}
          <div className="space-y-1.5">
            <label className="text-slate-400 flex items-center justify-between">
              <span>Clase de Riesgo (IMSS):</span>
              <span className="text-cyan-400">
                {(RIESGO_TRABAJO_RATES[config.riskClass] * 100).toFixed(3)}%
              </span>
            </label>
            <select
              value={config.riskClass}
              onChange={(e) =>
                updateConfig({ riskClass: e.target.value as RiskClass })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
            >
              <option value="I">Clase I (0.543% - Oficinas, Software, Comercio)</option>
              <option value="II">Clase II (1.130% - Manufactura ligera)</option>
              <option value="III">Clase III (2.598% - Talleres, Transporte menor)</option>
              <option value="IV">Clase IV (4.653% - Construcción, Operación pesada)</option>
              <option value="V">Clase V (7.588% - Alta siniestralidad, Minería)</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
};
