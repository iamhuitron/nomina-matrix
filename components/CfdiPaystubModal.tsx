import React from "react";
import { X, Printer, Download, FileSpreadsheet, ShieldCheck, QrCode } from "lucide-react";
import { PayrollCalculationResult } from "../lib/types/payroll";
import { exportPayrollWorkbook } from "../lib/export/excel-exporter";

interface CfdiPaystubModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollCalculationResult;
}

export const CfdiPaystubModal: React.FC<CfdiPaystubModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  if (!isOpen) return null;

  const { grossSalary, netSalary, isr, imss, sbc, config } = payroll;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportPayrollWorkbook(payroll);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Modal Toolbar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-2 font-bold text-xs">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>CFDI NÓMINA 1.2 · PREVISUALIZADOR TIMBRABLE SAT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
            >
              <FileSpreadsheet size={13} />
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-medium transition"
            >
              <Printer size={13} />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Paystub Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white">
          
          {/* Company & Voucher Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-950 uppercase">
                SERVICIOS TECNOLÓGICOS Y DIGITALES S.A. DE C.V.
              </h1>
              <p className="text-[11px] text-slate-600">RFC: STD200101XYZ · Régimen General de Ley Personas Morales (601)</p>
              <p className="text-[10px] text-slate-500">Lugar de Expedición: 54700 Cuautitlán Izcalli, Estado de México</p>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-bold text-[11px]">
                RECIBO DE NÓMINA ORDINARIA
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Folio Fiscal: 9F8E7D6C-5B4A-3C2D-1E0F-9A8B7C6D5E4F</p>
              <p className="text-[10px] text-slate-500">Fecha de Emisión: 2026-03-15T12:00:00</p>
            </div>
          </div>

          {/* Employee Fiscal Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[10px]">
            <div>
              <span className="text-slate-500 block">Colaborador:</span>
              <strong className="text-slate-900">{config.name || "Ian Miguel Delgado Huitron"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">RFC / CURP:</span>
              <strong className="text-slate-900">DEHI010608ABC</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Puesto / Depto:</span>
              <strong className="text-slate-900">{config.position}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Periodicidad:</span>
              <strong className="text-slate-900 uppercase">{config.periodicity}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Salario Diario:</span>
              <strong className="text-slate-900">${sbc.dailySalary.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">SBC Integrado:</span>
              <strong className="text-emerald-700">${sbc.sbcDaily.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Antigüedad:</span>
              <strong className="text-slate-900">{config.seniorityYears} {config.seniorityYears === 1 ? "año" : "años"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Régimen SAT:</span>
              <strong className="text-slate-900">605 Sueldos y Salarios</strong>
            </div>
          </div>

          {/* Perceptions and Deductions Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PERCEPCIONES */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between text-[11px]">
                <span>PERCEPCIONES (SAT Cat. c_TipoPercepcion)</span>
                <span>IMPORTE</span>
              </div>
              <div className="p-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-500">001</span> Sueldos, Salarios y Jornales
                  </div>
                  <strong className="text-slate-900">${grossSalary.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>
              <div className="bg-emerald-50 px-3 py-2 border-t border-slate-200 flex justify-between text-emerald-900 font-bold text-xs">
                <span>TOTAL PERCEPCIONES:</span>
                <span>${grossSalary.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* DEDUCCIONES */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between text-[11px]">
                <span>DEDUCCIONES (SAT Cat. c_TipoDeduccion)</span>
                <span>IMPORTE</span>
              </div>
              <div className="p-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-500">001</span> Seguridad Social (IMSS Obrero)
                  </div>
                  <strong className="text-red-700">-${imss.totalEmployee.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-500">002</span> ISR Retenido (Art. 96 LISR)
                  </div>
                  <strong className="text-red-700">-${isr.retainedTax.toFixed(2)}</strong>
                </div>
                {isr.employmentSubsidy > 0 && (
                  <div className="flex justify-between text-emerald-700 text-[10px]">
                    <div>
                      <span className="text-slate-400">002</span> Subsidio Causado Acreditado
                    </div>
                    <span>-${isr.employmentSubsidy.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="bg-red-50 px-3 py-2 border-t border-slate-200 flex justify-between text-red-900 font-bold text-xs">
                <span>TOTAL DEDUCCIONES:</span>
                <span>-${(isr.retainedTax + imss.totalEmployee).toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Net Total Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] uppercase block">Neto Efectivo Recibido:</span>
              <span className="text-[10px] text-emerald-400">Certificado bajo las tarifas y subsidios vigentes del SAT 2026</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                ${netSalary.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
              </span>
            </div>
          </div>

          {/* Sello Digital Fake / Legal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
            <div>
              <p>Cadena Original del Complemento de Certificación Digital del SAT:</p>
              <p className="truncate max-w-md">||1.1|9F8E7D6C-5B4A-3C2D-1E0F-9A8B7C6D5E4F|2026-03-15T12:00:00|SAT970701NN3|jK3...||</p>
            </div>
            <div className="text-right font-bold text-slate-600">
              NOMINA-MATRIX ENGINE 2026
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
