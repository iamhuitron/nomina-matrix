import React from "react";
import { Calculator, Building2, Scale } from "lucide-react";

export type ActiveTab = "payroll" | "employer_cost" | "termination";

interface TabNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: "payroll" as ActiveTab,
      label: "Calculadora Salarial & Net-to-Gross",
      icon: <Calculator size={15} />,
      badge: "Búsqueda Binaria",
    },
    {
      id: "employer_cost" as ActiveTab,
      label: "Costo Social & 5 Ramos IMSS",
      icon: <Building2 size={15} />,
      badge: "Reforma RCV 2026",
    },
    {
      id: "termination" as ActiveTab,
      label: "Finiquito y Liquidación Legal",
      icon: <Scale size={15} />,
      badge: "LFT Art. 48/50",
    },
  ];

  return (
    <div className="flex border-b border-white/10 gap-2 overflow-x-auto font-mono text-xs">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
            activeTab === t.id
              ? "border-emerald-400 text-white font-bold bg-white/5"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <span className={activeTab === t.id ? "text-emerald-400" : "text-slate-400"}>
            {t.icon}
          </span>
          <span>{t.label}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10 hidden sm:inline">
            {t.badge}
          </span>
        </button>
      ))}
    </div>
  );
};
