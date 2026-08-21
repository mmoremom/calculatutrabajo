import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "P751sSNrYBmxrIhFlATWnGnM_oYmxly5CtHe_fAupfw",
  },
  metadataBase: new URL("https://calculatutrabajo.vercel.app"),
  title: "Calculadora de Finiquito y Sueldo Neto 2026 | España",
  description: "Calcula tu sueldo neto y finiquito en España con estimaciones claras de IRPF y cotizaciones.",
  keywords: [
    "calculadora de finiquito",
    "calculadora sueldo neto",
    "finiquito 2026",
    "nómina España",
    "IRPF",
    "salario neto",
    "liquidación laboral"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
