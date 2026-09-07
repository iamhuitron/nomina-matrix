"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { ModeToggle } from "../components/ModeToggle";
import { SalaryControl } from "../components/SalaryControl";
import { BenefitSettings } from "../components/BenefitSettings";
import { NetSummaryCard } from "../components/NetSummaryCard";
import { EmployerCostMatrix } from "../components/EmployerCostMatrix";
import { TerminationSimulator } from "../components/TerminationSimulator";
import { TabNavigation, ActiveTab } from "../components/TabNavigation";
import { BatchAuditModal } from "../components/BatchAuditModal";
import { CfdiPaystubModal } from "../components/CfdiPaystubModal";
import { EmployeeConfig, CalculationMode, Periodicity } from "../lib/types/payroll";
import { computePayroll } from "../lib/engine/payroll-orchestrator";
import { Sparkles, ExternalLink, HelpCircle } from "lucide-react";

export default function HomePage() {
  const [mode, setMode] = useState<CalculationMode>("gross_to_net");
  const [activeTab, setActiveTab] = useState<ActiveTab>("payroll");
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isPaystubOpen, setIsPaystubOpen] = useState(false);

  const [config, setConfig] = useState<EmployeeConfig>({
    name: "Ian Miguel Delgado Huitron",
    position: "Software Engineer",
    salary: 35000,
    periodicity: "mensual",
    seniorityYears: 2,
    vacationDays: 14,
    vacationBonusRate: 0.25,
    christmasBonusDays: 15,
    riskClass: "I",
    zone: "general",
    stateTaxRate: 0.03,
  });

  const updateConfig = (patch: Partial<EmployeeConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSetPeriodicity = (periodicity: Periodicity) => {
    updateConfig({ periodicity });
  };

  const payrollResult = computePayroll(config, mode);

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        periodicity={config.periodicity}
        setPeriodicity={handleSetPeriodicity}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenPaystub={() => setIsPaystubOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Hero Tagline & Interactive Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
              <span>Simulador Salarial y Auditoría Laboral 2026</span>
              <Sparkles size={18} className="text-emerald-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Resuelve instantáneamente el salario bruto a partir del neto mediante búsqueda binaria de alta precisión. Desglosa los 5 ramos de seguridad social (IMSS LSS 2026), retenciones de ISR y pasivos contingentes de finiquito/liquidación.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <ModeToggle mode={mode} setMode={setMode} />
          </div>
        </div>

        {/* Primary Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SalaryControl
              salary={config.salary}
              setSalary={(val) => updateConfig({ salary: val })}
              mode={mode}
              periodicity={config.periodicity}
            />
          </div>
          <div className="space-y-4">
            <BenefitSettings config={config} updateConfig={updateConfig} />
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content Panels */}
        {activeTab === "payroll" && (
          <div className="space-y-6">
            <NetSummaryCard payroll={payrollResult} mode={mode} />
          </div>
        )}

        {activeTab === "employer_cost" && (
          <div className="space-y-6">
            <EmployerCostMatrix payroll={payrollResult} />
          </div>
        )}

        {activeTab === "termination" && (
          <div className="space-y-6">
            <TerminationSimulator
              grossMonthlySalary={payrollResult.grossSalary}
              sbcDaily={payrollResult.sbc.sbcDaily}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <BatchAuditModal isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />
      <CfdiPaystubModal
        isOpen={isPaystubOpen}
        onClose={() => setIsPaystubOpen(false)}
        payroll={payrollResult}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Nomina-Matrix Engine · Desarrollado por <strong>Ian Miguel Delgado Huitron</strong> (@iamhuitron)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>UNAM FES Cuautitlán · Informática</span>
            <a
              href="https://github.com/iamhuitron/nomina-matrix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>Ver en GitHub</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
