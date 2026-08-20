import type { LucideIcon } from 'lucide-react';
import { ExternalLink, FileText, Scale, ShieldCheck } from 'lucide-react';

type LegalReference = {
  icon: LucideIcon;
  title: string;
  description: string;
  officialLink: string;
  linkText: string;
};

const LEGAL_REFERENCES: Record<string, LegalReference[]> = {
  salary_net: [
    { icon: Scale, title: 'Ley del IRPF - Ley 35/2006', description: 'Regula la tributación de los rendimientos del trabajo y los mínimos personales que influyen en la retención estimada.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', linkText: 'Ver la Ley en el BOE' },
    { icon: ShieldCheck, title: 'Ley General de la Seguridad Social - Real Decreto Legislativo 8/2015', description: 'Establece la obligación de cotizar y las bases que se aplican para estimar los descuentos de Seguridad Social.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724', linkText: 'Consultar en el BOE' },
    { icon: FileText, title: 'Reglamento del IRPF - Real Decreto 439/2007', description: 'Desarrolla el procedimiento para calcular las retenciones que aparecen en la nómina.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820', linkText: 'Ver el Reglamento en el BOE' },
  ],
  salary_reverse: [
    { icon: Scale, title: 'Ley 35/2006 del IRPF', description: 'Define los tramos, mínimos y circunstancias personales que determinan la relación entre salario bruto y neto.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', linkText: 'Ver la Ley en el BOE' },
    { icon: FileText, title: 'Reglamento del IRPF - Real Decreto 439/2007', description: 'Fija las reglas de cálculo de las retenciones utilizadas para aproximar el bruto necesario.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820', linkText: 'Consultar en el BOE' },
    { icon: ShieldCheck, title: 'Cotización al Régimen General', description: 'La normativa de Seguridad Social determina los descuentos que deben tenerse en cuenta al convertir neto en bruto.', officialLink: 'https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores', linkText: 'Consultar en la Seguridad Social' },
  ],
  finiquito: [
    { icon: Scale, title: 'Estatuto de los Trabajadores - Real Decreto Legislativo 2/2015', description: 'Regula la extinción del contrato, el finiquito y las indemnizaciones por despido.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430', linkText: 'Ver el Estatuto en el BOE' },
    { icon: FileText, title: 'Vacaciones y pagas extraordinarias - Art. 31 y 38', description: 'Sus reglas permiten identificar las cantidades devengadas y pendientes en la liquidación final.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a31', linkText: 'Consultar los artículos en el BOE' },
    { icon: ShieldCheck, title: 'Servicio Público de Empleo Estatal', description: 'Ofrece información oficial sobre la documentación y los trámites vinculados a la finalización de la relación laboral.', officialLink: 'https://www.sepe.es/HomeSepe/es/Personas/distributiva-prestaciones.html', linkText: 'Consultar la web del SEPE' },
  ],
  unemployment: [
    { icon: Scale, title: 'Ley General de la Seguridad Social - Art. 268', description: 'Establece la cuantía de la prestación contributiva, su base reguladora y los porcentajes aplicables por periodos.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724#a268', linkText: 'Ver el artículo 268 en el BOE' },
    { icon: ShieldCheck, title: 'SEPE - Prestación contributiva', description: 'Explica requisitos, duración, topes vinculados al IPREM y responsabilidades familiares para solicitar el paro.', officialLink: 'https://www.sepe.es/HomeSepe/es/Personas/distributiva-prestaciones/proteccion-desempleo/prestacion-contributiva.html', linkText: 'Consultar en la web del SEPE' },
    { icon: FileText, title: 'IPREM oficial', description: 'El IPREM sirve como referencia para calcular los límites mínimos y máximos de la prestación por desempleo.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2004-20908', linkText: 'Ver la norma en el BOE' },
  ],
  hourly_salary: [
    { icon: Scale, title: 'Estatuto de los Trabajadores - Art. 34', description: 'Define la jornada y el tiempo de trabajo que sirven de referencia para obtener el valor de la hora.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a34', linkText: 'Ver el artículo 34 en el BOE' },
    { icon: FileText, title: 'Estatuto de los Trabajadores - Art. 35', description: 'Regula las horas extraordinarias y sus límites cuando se compara la hora ordinaria con la extraordinaria.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a35', linkText: 'Consultar el artículo 35' },
  ],
  salary_raise: [
    { icon: FileText, title: 'Estatuto de los Trabajadores - Art. 26', description: 'Distingue salario, complementos y percepciones que deben considerarse al valorar una subida salarial.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430#a26', linkText: 'Ver el artículo 26 en el BOE' },
    { icon: Scale, title: 'Ley del IRPF - Ley 35/2006', description: 'Permite entender cómo una subida puede modificar la retención sin aplicar el tipo marginal a toda la renta.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', linkText: 'Consultar la Ley en el BOE' },
  ],
  irpf: [
    { icon: Scale, title: 'Ley 35/2006 del IRPF', description: 'Define la base liquidable, los tramos y los mínimos que intervienen en el impuesto.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', linkText: 'Ver la Ley en el BOE' },
    { icon: FileText, title: 'Reglamento del IRPF - Real Decreto 439/2007', description: 'Regula las retenciones y pagos a cuenta que se practican durante el ejercicio.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820', linkText: 'Ver el Reglamento en el BOE' },
  ],
  iva: [
    { icon: Scale, title: 'Ley del IVA - Ley 37/1992', description: 'Determina los tipos de IVA y las operaciones sujetas al impuesto para calcular el precio final.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740', linkText: 'Ver la Ley del IVA en el BOE' },
    { icon: FileText, title: 'Agencia Tributaria - IVA', description: 'Recoge información práctica sobre tipos, facturación y deducción del IVA soportado.', officialLink: 'https://sede.agenciatributaria.gob.es/Sede/iva.html', linkText: 'Consultar en la Agencia Tributaria' },
  ],
  autonomous_tax: [
    { icon: Scale, title: 'Ley 35/2006 del IRPF - Art. 101', description: 'Establece las retenciones que pueden aplicarse a los rendimientos de actividades profesionales.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a101', linkText: 'Ver el artículo 101 en el BOE' },
    { icon: FileText, title: 'Agencia Tributaria - Retenciones', description: 'Ofrece criterios oficiales para cumplimentar facturas y declarar las retenciones profesionales.', officialLink: 'https://sede.agenciatributaria.gob.es/Sede/retenciones-pagos-cuenta.html', linkText: 'Consultar en la Agencia Tributaria' },
  ],
  mortgage: [
    { icon: Scale, title: 'Ley 5/2019 de contratos de crédito inmobiliario', description: 'Protege al prestatario y regula la información que debe recibir antes de contratar una hipoteca.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2019-3814', linkText: 'Ver la Ley en el BOE' },
    { icon: FileText, title: 'Banco de España - Hipotecas', description: 'Explica TIN, TAE, cuota, amortización y riesgos de los tipos variables para interpretar el resultado.', officialLink: 'https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/hipotecas/', linkText: 'Consultar al Banco de España' },
  ],
  personal_loan: [
    { icon: Scale, title: 'Ley 16/2011 de contratos de crédito al consumo', description: 'Regula la información precontractual, el coste y los derechos del consumidor ante un préstamo personal.', officialLink: 'https://www.boe.es/buscar/act.php?id=BOE-A-2011-10970', linkText: 'Ver la Ley en el BOE' },
    { icon: FileText, title: 'Banco de España - Préstamos', description: 'Ayuda a interpretar cuota, TAE, comisiones y amortización anticipada del préstamo calculado.', officialLink: 'https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/prestamos-personales/', linkText: 'Consultar al Banco de España' },
  ],
  compound_interest: [
    { icon: FileText, title: 'CNMV - Finanzas para todos', description: 'Proporciona criterios oficiales para entender rentabilidad, riesgo y proyecciones de inversión.', officialLink: 'https://www.finanzasparatodos.es/', linkText: 'Consultar Finanzas para Todos' },
    { icon: ShieldCheck, title: 'CNMV - Información al inversor', description: 'Recuerda que una proyección matemática no garantiza rentabilidad y que toda inversión implica riesgos.', officialLink: 'https://www.cnmv.es/portal/inversor/DecisionesInversion.aspx', linkText: 'Consultar en la CNMV' },
  ],
  inflation: [
    { icon: FileText, title: 'Instituto Nacional de Estadística - IPC', description: 'El IPC oficial mide la evolución de los precios y sirve para contextualizar la pérdida de poder adquisitivo.', officialLink: 'https://www.ine.es/consul/serie.do?d=true&s=IPC251856', linkText: 'Consultar el IPC oficial' },
    { icon: Scale, title: 'Banco de España - Inflación', description: 'Explica cómo la inflación afecta al ahorro, al consumo y a la planificación financiera.', officialLink: 'https://www.bde.es/wbe/es/areas-actuacion/politica-monetaria/', linkText: 'Consultar al Banco de España' },
  ],
};

const DEFAULT_REFERENCES = LEGAL_REFERENCES.salary_net;

type LegalFrameworkProps = {
  activeCalculator: string;
};

export default function LegalFramework({ activeCalculator }: LegalFrameworkProps) {
  const references = LEGAL_REFERENCES[activeCalculator] ?? DEFAULT_REFERENCES;

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8" aria-live="polite">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Marco legal y normativa oficial</span>
          <span className="text-sm text-slate-500">Referencias aplicables a la calculadora activa</span>
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Normativa oficial de {activeCalculator === 'unemployment' ? 'la prestación por paro' : 'este cálculo'}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {references.map((reference) => {
            const Icon = reference.icon;
            return (
              <article key={reference.title} className="border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{reference.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{reference.description}</p>
                    <a className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline" href={reference.officialLink} target="_blank" rel="noopener noreferrer">
                      {reference.linkText} <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
