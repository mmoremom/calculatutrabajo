import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {<meta name="google-site-verification" content="P751sSNrYBmxrIhFlATWnGhM_oYmxly5CtHe_fAupfw" />
  metadataBase: new URL("https://calculatutrabajo.com"),
  title: "Calculadora de Finiquito y Sueldo Neto 2026 | España",
  description: "Calcula tu sueldo neto y finiquito en España con estimaciones claras de IRPF, cotizaciones y liquidación laboral. Herramienta útil y rápida para nóminas y finiquitos.",
  keywords: [
    "calculadora de finiquito",
    "calculadora sueldo neto",
    "finiquito 2026",
    "nómina España",
    "IRPF",
    "salario neto",
    "liquidación laboral",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Calculadora de Finiquito y Sueldo Neto 2026 | España",
    description: "Simula tu nómina, retenciones y finiquito en España con una herramienta rápida, clara y orientada a la decisión financiera.",
    type: "website",
    url: "https://calculatutrabajo.com",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Finiquito y Sueldo Neto 2026 | España",
    description: "Calcula tu sueldo neto y finiquito en España con estimaciones rápidas de nómina y liquidación laboral.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
