# ⚡ NOMINA-MATRIX

[![CI](https://github.com/iamhuitron/nomina-matrix/actions/workflows/ci.yml/badge.svg)](https://github.com/iamhuitron/nomina-matrix/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-6e9f18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

> **High-performance Mexican Payroll Reverse-Engineering (Net-to-Gross) Engine, Social Security Matrix (IMSS 5 Branches 2026), and Labor Termination Simulator (LFT / SAT Art. 93).** 100% Client-side in-memory computation with sub-cent precision.

Created by **[Ian Miguel Delgado Huitron](https://portfolio-pink-five-jaih91sunw.vercel.app/)** (@iamhuitron)  
*UNAM Informatics undergraduate (FES Cuautitlán) & Fiscal Accounting Specialist.*

---

## 📌 Problem & Strategic Value

In Mexico, calculating corporate payroll is notoriously complex due to non-linear, multi-tiered fiscal regulations:
1. **The Net-to-Gross Challenge:** When a candidate asks for *$35,000 MXN net ("libres")*, solving the required gross salary involves inverting piecewise convex progressive income tax curves (ISR Art. 96) alongside variable social security contributions (IMSS).
2. **The 2026 Social Security Reform:** Employer contributions for Retirement, Severance, and Old Age (*Cesantía y Vejez*) follow an escalating multi-tier progressive rate scheduled through 2030, increasing the employer's real cost significantly.
3. **Hidden Employer Burden:** Many SMEs fail because they overlook the true social cost: for every $100 net paid to an employee, the company often spends between $145 and $175 when factoring in IMSS, 5% Infonavit, and 3% local payroll taxes (ISN).
4. **Labor Liabilities (LFT):** Calculating terminations (*Finiquito vs. Liquidación por Despido Injustificado*) requires applying constitutional 3-month indemnities, 20 days per year of service, seniority premiums capped at 2 minimum wages, and tax exemptions under Article 93 of the LISR (90 UMAs per year).

**NOMINA-MATRIX** solves these challenges in a single, high-precision, client-side web application and TypeScript engine.

---

## 🚀 Key Features

* ⚡ **Algorithmic Net-to-Gross Solver:** High-precision Binary Search algorithm that converges to the exact gross salary down to $\pm \$0.005$ MXN in $< 25$ iterations ($< 0.5$ ms).
* 🏛️ **IMSS 2026 5-Branch Matrix:** Granular breakdown of both Employee (*Deducciones Obreras*) and Employer (*Cargas Patronales*) contributions:
  - Enfermedades y Maternidad (Fixed 20.40% UMA + Surplus $>3$ UMAs).
  - Invalidez y Vida (1.75% / 0.625%).
  - Guarderías y Prestaciones Sociales (1.00%).
  - Riesgo de Trabajo (Configurable Classes I to V).
  - Retiro, Cesantía y Vejez (RCV) with the official progressive employer tier.
* ⚖️ **LFT Termination & Severance Engine:** Simulates voluntary resignation (*Finiquito*) and unjust dismissal (*Liquidación Constitucional Art. 48/50 LFT*), applying statutory 90-UMA-per-year income tax exemptions (Art. 93 Frac. XIII LISR).
* 👥 **Batch Team Payroll Auditor:** Audit a 10-employee SME company roster with a single click, producing company-wide payroll mass, consolidated SAT tax withholdings, and bimonthly Infonavit obligations.
* 📑 **CFDI Nómina 1.2 Digital Paystub & Multi-Tab Excel Export:** Previews a standardized paystub with official SAT catalog perception and deduction codes, and exports a comprehensive multi-sheet `.xlsx` workbook via SheetJS.

---

## 🏗️ Mathematical Formulations

### 1. Salario Base de Cotización (SBC) & Integration Factor
$$\text{Factor de Integración} = \frac{365 + \text{Días Aguinaldo} + (\text{Días Vacaciones Dignas} \times \text{Prima Vacacional})}{365}$$
$$\text{SBC Diario} = \min\left( \max(\text{Salario Diario} \times \text{Factor}, \text{SMG}), 25 \times \text{UMA} \right)$$

### 2. Net-to-Gross Binary Search Convergence
$$\text{TargetNet} = \text{Gross} - \text{ISR}(\text{Gross}) - \text{IMSS\_Employee}(\text{SBC}(\text{Gross}))$$
Since $f(\text{Gross}) = \text{Net}(\text{Gross})$ is strictly monotonically increasing, we solve for $\text{Gross}^*$ via bisection over $[\text{Net}, 2.8 \times \text{Net}]$:
$$|\text{CalculatedNet} - \text{TargetNet}| < \$0.005 \text{ MXN}$$

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, Static Export)
* **Frontend:** React 19, Tailwind CSS 4, Lucide React
* **Math & Engine:** Pure TypeScript with zero runtime overhead
* **Spreadsheet Engine:** SheetJS (xlsx)
* **Testing Suite:** Vitest (100% automated coverage for tax, IMSS, and binary search convergence)

---

## 🧪 Automated Testing

Run the test suite:
```bash
npm test
```

All 5 test suites (SBC, ISR Art. 96, IMSS 2026, Net-to-Gross Binary Search, and LFT Termination) execute in milliseconds:
```text
 ✓ tests/sbc.test.ts (3 tests)
 ✓ tests/isr.test.ts (3 tests)
 ✓ tests/imss.test.ts (2 tests)
 ✓ tests/net-to-gross.test.ts (2 tests)
 ✓ tests/termination.test.ts (2 tests)

 Test Files  5 passed (5)
      Tests  12 passed (12)
```

---

## 🚀 Quick Start

1. Clone repository:
   ```bash
   git clone https://github.com/iamhuitron/nomina-matrix.git
   cd nomina-matrix
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License. Created by [Ian Miguel Delgado Huitron](https://github.com/iamhuitron).
