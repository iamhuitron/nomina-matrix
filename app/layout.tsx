import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomina-Matrix | Motor de Nómina e Ingeniería Inversa Net-to-Gross 2026",
  description:
    "Suite de nómina mexicana 2026, cálculo de Neto a Bruto con búsqueda binaria, cuotas obrero-patronales IMSS 5 ramos, costo social para PyMEs y simulador de finiquitos y liquidaciones LFT.",
  authors: [{ name: "Ian Miguel Delgado Huitron (@iamhuitron)" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#070a12] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
