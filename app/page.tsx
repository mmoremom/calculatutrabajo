'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateNetSalary } from '../features/salario-neto/calculator';
import ParoCalculator from '../features/salario-neto/components/ParoCalculator';
import type { TaxInputs, TaxResult } from '../features/salario-neto/types';
import DynamicCalculatorGuide from '../components/DynamicCalculatorGuide';
import LegalFramework from '../components/LegalFramework';
import IrpfCalculator from '../components/IrpfCalculator';
import FreelanceInvoiceCalculator from '../components/FreelanceInvoiceCalculator';
import IvaCalculator from '../components/IvaCalculator';
import MortgageCalculator from '../components/MortgageCalculator';

type TabKey = 'neto' | 'finiquito';
type CalculationMode = 'gross_to_net' | 'net_to_gross';
type FamilySituation = 'single' | 'married' | 'single_parent';
type SpouseSituation = 'not_applicable' | 'income_over_1500' | 'dependent';
type FiniquitoReason = 'voluntary' | 'procedente' | 'improcedente' | 'temporal';
type HubCategory = 'salarios' | 'impuestos' | 'finanzas';
type HubTool =
  | 'salary_net'
  | 'salary_reverse'
  | 'finiquito'
  | 'hourly_salary'
  | 'salary_raise'
  | 'unemployment'
  | 'irpf'
  | 'iva'
  | 'autonomous_tax'
  | 'mortgage'
  | 'personal_loan'
  | 'compound_interest'
  | 'inflation';

type HubToolDefinition = {
  key: HubTool;
  label: string;
  description: string;
  badge: string;
  fields: Array<{ key: string; label: string; placeholder: string; suffix?: string }>;
};

type FiniquitoFormState = {
  startDate: string;
  endDate: string;
  baseSalary: string;
  extraProrrateo: string;
  vacationDays: string;
  reason: FiniquitoReason;
};

type FiniquitoResult = {
  startDate: string;
  endDate: string;
  yearsWorked: number;
  dailySalary: number;
  vacationPending: number;
  extraPay: number;
  indemnizacion: number;
  total: number;
};

const HUB_TOOLS: Record<HubCategory, HubToolDefinition[]> = {
  salarios: [
    { key: 'salary_net', label: 'Calculadora de Sueldo Neto', description: 'Nómina, IRPF y cotizaciones', badge: 'Más usada', fields: [] },
    { key: 'salary_reverse', label: 'Sueldo Bruto ↔ Neto', description: 'Calculadora reversa', badge: 'Conversión', fields: [] },
    { key: 'hourly_salary', label: 'Salario por Hora', description: 'Bruto y neto según jornada', badge: 'Jornada', fields: [{ key: 'annualSalary', label: 'Salario anual', placeholder: '36000', suffix: '€' }, { key: 'weeklyHours', label: 'Horas semanales', placeholder: '40', suffix: 'h' }, { key: 'weeks', label: 'Semanas trabajadas', placeholder: '46', suffix: 'sem.' }] },
    { key: 'salary_raise', label: 'Subida Salarial', description: 'Aumento e impacto anual', badge: 'Comparativa', fields: [{ key: 'currentSalary', label: 'Salario actual', placeholder: '30000', suffix: '€' }, { key: 'raisePercent', label: 'Porcentaje de aumento', placeholder: '5', suffix: '%' }] },
    { key: 'finiquito', label: 'Finiquito e Indemnización', description: 'Liquidación por salida', badge: 'Legal', fields: [] },
    { key: 'unemployment', label: 'Prestación por Paro', description: 'Estimación orientativa SEPE', badge: 'SEPE', fields: [{ key: 'contributionBase', label: 'Base reguladora mensual', placeholder: '1800', suffix: '€' }, { key: 'monthsUnemployed', label: 'Meses de prestación', placeholder: '12', suffix: 'meses' }, { key: 'children', label: 'Personas a cargo', placeholder: '0' }] },
  ],
  impuestos: [
    { key: 'irpf', label: 'Calculadora de IRPF', description: 'Retenciones y tramos', badge: 'Fiscal', fields: [{ key: 'taxableIncome', label: 'Renta anual imponible', placeholder: '36000', suffix: '€' }, { key: 'withholding', label: 'Retención aplicada', placeholder: '15', suffix: '%' }] },
    { key: 'iva', label: 'Calculadora de IVA', description: 'Con IVA y sin IVA', badge: '21% · 10% · 4%', fields: [{ key: 'basePrice', label: 'Precio base o final', placeholder: '1000', suffix: '€' }, { key: 'ivaRate', label: 'Tipo de IVA', placeholder: '21', suffix: '%' }] },
    { key: 'autonomous_tax', label: 'Retenciones para Autónomos', description: 'Profesionales y facturas', badge: 'Autónomos', fields: [{ key: 'invoiceAmount', label: 'Importe de la factura', placeholder: '1500', suffix: '€' }, { key: 'professionalWithholding', label: 'Retención profesional', placeholder: '15', suffix: '%' }, { key: 'invoiceIva', label: 'IVA aplicado', placeholder: '21', suffix: '%' }] },
  ],
  finanzas: [
    { key: 'mortgage', label: 'Calculadora de Hipoteca', description: 'Cuota, intereses y coste total', badge: 'Vivienda', fields: [{ key: 'loanAmount', label: 'Capital solicitado', placeholder: '180000', suffix: '€' }, { key: 'interestRate', label: 'Tipo de interés anual', placeholder: '3.2', suffix: '%' }, { key: 'loanYears', label: 'Plazo', placeholder: '25', suffix: 'años' }] },
    { key: 'personal_loan', label: 'Préstamo Personal', description: 'Cuota mensual estimada', badge: 'Financiación', fields: [{ key: 'loanAmount', label: 'Importe del préstamo', placeholder: '12000', suffix: '€' }, { key: 'interestRate', label: 'Interés anual', placeholder: '7', suffix: '%' }, { key: 'loanYears', label: 'Plazo', placeholder: '5', suffix: 'años' }] },
    { key: 'compound_interest', label: 'Interés Compuesto', description: 'Rendimiento de inversión', badge: 'Inversión', fields: [{ key: 'initialInvestment', label: 'Inversión inicial', placeholder: '5000', suffix: '€' }, { key: 'annualReturn', label: 'Rentabilidad anual', placeholder: '6', suffix: '%' }, { key: 'investmentYears', label: 'Años invertidos', placeholder: '10', suffix: 'años' }] },
    { key: 'inflation', label: 'Impacto de la Inflación', description: 'Poder adquisitivo del ahorro', badge: 'Ahorro', fields: [{ key: 'savings', label: 'Ahorro actual', placeholder: '10000', suffix: '€' }, { key: 'inflationRate', label: 'Inflación anual', placeholder: '2.5', suffix: '%' }, { key: 'inflationYears', label: 'Horizonte temporal', placeholder: '10', suffix: 'años' }] },
  ],
};

const CATEGORY_SEO_CONTENT: Record<HubCategory, { title: string; paragraphs: string[]; faqs: Array<{ question: string; answer: string }> }> = {
  salarios: {
    title: '¿Cómo calcular nóminas, finiquitos e indemnizaciones en España?',
    paragraphs: [
      'Para calcular una nómina hay que partir del salario bruto y descontar las cotizaciones a la Seguridad Social y la retención de IRPF. El resultado es el salario neto que llega a la cuenta, y puede variar según las pagas, la comunidad autónoma, la situación familiar y el número de hijos. Nuestra calculadora ofrece una estimación orientativa para comparar escenarios antes de revisar una nómina real.',
      'En un finiquito se liquidan las cantidades pendientes al terminar la relación laboral: días trabajados, vacaciones no disfrutadas y pagas extraordinarias devengadas. La indemnización es un concepto distinto y depende de la causa de extinción. En términos generales, un despido procedente puede aplicar 20 días por año trabajado, mientras que el improcedente puede alcanzar 33 días por año, con los límites legales correspondientes.',
      'La prestación por desempleo del SEPE se calcula con la base reguladora y la duración reconocida. Durante los primeros meses suele aplicarse el 70% de la base reguladora y posteriormente el 60%, siempre sujeto a topes y circunstancias familiares. Estas cifras son informativas y conviene contrastarlas con la resolución oficial o con un profesional.',
    ],
    faqs: [
      { question: '¿Puedo firmar el finiquito como “No conforme”?', answer: 'Sí. Si detectas cantidades incorrectas o no estás de acuerdo con la liquidación, puedes firmar indicando “No conforme” y conservar una copia para revisar tus derechos dentro de los plazos aplicables.' },
      { question: '¿Qué plazo existe para cobrar la liquidación?', answer: 'La liquidación debe abonarse al finalizar la relación laboral. El plazo para reclamar cantidades puede depender del concepto y de la situación, por lo que conviene actuar pronto y guardar nóminas, contrato y finiquito.' },
      { question: '¿Cuál es la diferencia entre salario neto y bruto?', answer: 'El bruto es la retribución antes de descuentos. El neto es la cantidad que recibes después de aplicar cotizaciones y retenciones fiscales.' },
    ],
  },
  impuestos: {
    title: 'Guía de Impuestos en España: IRPF, IVA y Retenciones',
    paragraphs: [
      'El IRPF es progresivo: la base liquidable se reparte en tramos y cada tramo tiene un tipo marginal. Para 2026, la retención final no debe confundirse con un único porcentaje aplicado a toda la renta, porque intervienen mínimos personales y familiares, deducciones y la situación del contribuyente. La calculadora permite hacer simulaciones iniciales de retenciones y comparar el efecto de distintos ingresos.',
      'El IVA general es del 21%, aunque existen tipos reducidos del 10% y superreducidos del 4% para bienes y servicios concretos. Para pasar de un precio sin IVA a uno final se multiplica la base por uno más el tipo; para extraer la base desde un precio final se divide entre uno más el tipo. La aplicación correcta depende de la naturaleza de la operación y de la normativa vigente.',
      'Los autónomos y profesionales suelen reflejar una retención de IRPF en sus facturas cuando el servicio está sujeto a ella. Esa retención funciona como pago a cuenta y no sustituye la declaración fiscal. También es importante separar la base imponible, el IVA repercutido y la retención para conocer el importe real a cobrar.',
    ],
    faqs: [
      { question: '¿Cómo puedo deducir el IVA?', answer: 'Un autónomo puede deducir el IVA soportado cuando el gasto está relacionado con la actividad, está correctamente documentado y cumple los requisitos fiscales. La factura completa y su registro son esenciales.' },
      { question: '¿Cómo funcionan los tramos impositivos por base imponible?', answer: 'Cada tramo se aplica únicamente a la parte de la base que cae dentro de sus límites. Por eso una subida de ingresos no hace que toda la renta tribute automáticamente al tipo más alto.' },
      { question: '¿Qué retención debe aparecer en una factura profesional?', answer: 'Depende del tipo de actividad, del momento de inicio y de la situación fiscal del profesional. La retención habitual puede ser del 15% y existen supuestos específicos, por lo que debe verificarse el caso concreto.' },
    ],
  },
  finanzas: {
    title: 'Calculadoras Financieras: Hipotecas, Préstamos e Interés Compuesto',
    paragraphs: [
      'La cuota de una hipoteca o préstamo se calcula mediante un sistema de amortización que separa cada pago entre intereses y devolución de capital. Al principio suele pesar más la parte de intereses; conforme se amortiza deuda, aumenta la proporción destinada a reducir el principal. El plazo, el capital y el tipo de interés determinan el coste total.',
      'El TIN expresa el tipo nominal del préstamo, mientras que la TAE incorpora gastos, comisiones y la periodicidad de los pagos para facilitar la comparación entre ofertas. Una hipoteca a tipo fijo mantiene la cuota estable; una variable puede cambiar con el índice de referencia y ofrece más incertidumbre. La oferta real siempre debe revisarse con sus condiciones completas.',
      'El interés compuesto reinvierte los rendimientos y hace que el capital crezca sobre el capital inicial más los intereses acumulados. En sentido contrario, la inflación reduce el poder adquisitivo del ahorro: una misma cantidad comprará menos en el futuro si los precios suben. Comparar ambos efectos ayuda a planificar objetivos a largo plazo.',
    ],
    faqs: [
      { question: '¿Qué diferencia hay entre un tipo fijo y uno variable?', answer: 'El tipo fijo mantiene una cuota más previsible durante el periodo acordado. El variable puede subir o bajar según el índice de referencia y las revisiones previstas en el contrato.' },
      { question: '¿Qué capacidad de endeudamiento se recomienda?', answer: 'Como orientación prudente, las cuotas de deuda no deberían comprometer una parte excesiva de los ingresos netos mensuales. Hay que considerar estabilidad laboral, ahorro, gastos familiares y posibles subidas de tipos.' },
      { question: '¿Cómo actúa el interés compuesto a largo plazo?', answer: 'Los rendimientos se suman al capital y también generan nuevos rendimientos. Cuanto más tiempo se mantiene la inversión y se reinvierte, mayor puede ser el efecto acumulativo, aunque nunca está garantizado.' },
    ],
  },
};

type FaqItem = { question: string; answer: string };
type FaqGroup = { title: string; questions: FaqItem[] };

const SALARY_FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Sobre nómina y sueldo neto',
    questions: [
      { question: '¿Qué diferencia hay entre salario bruto y salario neto?', answer: 'El salario bruto es la retribución pactada antes de aplicar descuentos. El salario neto es la cantidad que finalmente recibes después de restar la cotización a la Seguridad Social y la retención de IRPF.' },
      { question: '¿Qué retención de IRPF me corresponde según mi sueldo en España?', answer: 'Depende de tus ingresos anuales, comunidad autónoma, situación familiar, hijos y otros datos del modelo 145. El porcentaje es una retención a cuenta y la cifra definitiva se regulariza en la declaración de la renta.' },
      { question: '¿Es mejor cobrar en 12 o en 14 pagas? ¿Afecta al total bruto anual?', answer: 'No tiene por qué cambiar el bruto anual pactado: cambia la distribución del cobro. Con 12 pagas las extras se prorratean y con 14 se reciben dos pagos adicionales, normalmente en verano y Navidad.' },
      { question: '¿Por qué varía mi sueldo neto de un mes a otro?', answer: 'Puede variar por regularizaciones de IRPF, horas extra, bonus, bajas, cambios de jornada, pagas extraordinarias, dietas o ajustes en las bases de cotización.' },
      { question: '¿Qué son los devengos no salariales y cómo cotizan?', answer: 'Son percepciones que compensan gastos o situaciones concretas, como dietas, suplidos o indemnizaciones. Su tratamiento fiscal y de cotización depende del concepto y de los límites legales aplicables.' },
    ],
  },
  {
    title: 'Sobre finiquito e indemnización por despido',
    questions: [
      { question: '¿Puedo firmar el finiquito como "No conforme"? ¿Qué consecuencias tiene?', answer: 'Sí. Indicar "No conforme" deja constancia de que no aceptas el cálculo como definitivo y permite revisar cantidades pendientes. Conserva una copia y busca asesoramiento si existen discrepancias.' },
      { question: '¿Cuál es el plazo legal que tiene la empresa para pagar el finiquito?', answer: 'El finiquito debe ponerse a disposición al finalizar la relación laboral. Si no se abona o contiene errores, el plazo para reclamar cantidades salariales suele ser de un año, aunque conviene actuar cuanto antes.' },
      { question: '¿Cómo se calculan los días de vacaciones no disfrutados en la liquidación?', answer: 'Se calcula el salario diario y se multiplica por los días de vacaciones devengados y pendientes. El convenio colectivo y la retribución habitual pueden influir en la base utilizada.' },
      { question: '¿Cuál es la indemnización por despido procedente frente a improcedente?', answer: 'Como referencia general, el despido objetivo procedente puede generar 20 días por año trabajado, mientras que el despido improcedente puede generar 33 días por año, con topes y reglas específicas.' },
      { question: '¿El finiquito y la indemnización cotizan o pagan IRPF?', answer: 'Los conceptos del finiquito, como salario, vacaciones y pagas extra, suelen tributar y cotizar según su naturaleza. La indemnización puede quedar exenta hasta los límites legales si cumple los requisitos, pero debe revisarse cada caso.' },
    ],
  },
  {
    title: 'Sobre prestación por desempleo (paro)',
    questions: [
      { question: '¿Cuántos días debo tener cotizados para tener derecho a cobrar el paro?', answer: 'Como regla general, se necesitan al menos 360 días cotizados por desempleo dentro de los seis años anteriores, además de cumplir el resto de requisitos del SEPE.' },
      { question: '¿Cuánto cobro de paro en los primeros 6 meses y cuánto a partir del 7º mes?', answer: 'La prestación contributiva suele calcularse aplicando el 70% de la base reguladora durante los primeros 180 días y el 60% desde el día 181, con límites mínimos y máximos.' },
      { question: '¿Cómo influyen los hijos a cargo en el tope máximo y mínimo del paro?', answer: 'Las responsabilidades familiares pueden elevar el límite máximo y modificar el mínimo aplicable. El SEPE determina los topes según el IPREM y la situación familiar acreditada.' },
      { question: '¿Cuánto tiempo tengo para solicitar la prestación tras ser despedido?', answer: 'La solicitud debe presentarse, con carácter general, dentro de los 15 días hábiles siguientes al último día trabajado o al fin del periodo de vacaciones pagadas y no disfrutadas.' },
    ],
  },
  {
    title: 'Sobre subidas salariales y salario por hora',
    questions: [
      { question: '¿Cómo calcular cuánto pedir de sueldo bruto si quiero cobrar una cifra neta concreta?', answer: 'Introduce el neto mensual objetivo en la calculadora inversa y selecciona pagas, comunidad autónoma y situación familiar. El resultado estima el bruto anual necesario mediante una aproximación de IRPF y cotizaciones.' },
      { question: '¿Cómo afecta una subida salarial al tramo de IRPF? ¿Puedo cobrar menos neto al subir el bruto?', answer: 'Una subida puede aumentar la retención marginal, pero solo la parte que entra en el tramo superior. En condiciones normales, cobrar más bruto no reduce el neto total, aunque la diferencia mensual pueda parecer menor.' },
      { question: '¿Cómo se calcula el precio de la hora ordinaria frente a la hora extraordinaria?', answer: 'La hora ordinaria suele obtenerse dividiendo la retribución anual entre las horas anuales de trabajo del convenio. La hora extraordinaria debe respetar los límites legales y puede pagarse con un valor superior o compensarse con descanso.' },
    ],
  },
];

const TOOL_FAQ_CONTENT: Record<HubTool, FaqGroup> = {
  salary_net: { title: 'Preguntas sobre nómina y sueldo neto', questions: SALARY_FAQ_GROUPS[0].questions.slice(0, 4) },
  salary_reverse: { title: 'Preguntas sobre negociación salarial', questions: SALARY_FAQ_GROUPS[3].questions },
  salary_raise: { title: 'Preguntas sobre negociación salarial', questions: SALARY_FAQ_GROUPS[3].questions },
  hourly_salary: { title: 'Preguntas sobre salario por hora', questions: SALARY_FAQ_GROUPS[3].questions },
  finiquito: { title: 'Preguntas sobre finiquito y despido', questions: SALARY_FAQ_GROUPS[1].questions.slice(0, 4) },
  unemployment: { title: 'Preguntas sobre prestación por desempleo', questions: SALARY_FAQ_GROUPS[2].questions },
  irpf: { title: 'Preguntas sobre IRPF', questions: [
    { question: '¿Cómo funcionan los tramos de IRPF según la base imponible?', answer: 'Cada tipo se aplica únicamente a la parte de la base que cae dentro de su tramo. La retención final también considera mínimos personales, familiares y otros datos fiscales.' },
    { question: '¿Qué retención de IRPF me corresponde según mi sueldo?', answer: 'Depende de los ingresos anuales, situación familiar, comunidad autónoma y datos comunicados a la empresa. La cifra de la nómina es un pago a cuenta.' },
    { question: '¿Puede cambiar mi retención de IRPF durante el año?', answer: 'Sí. Puede regularizarse por cambios de salario, contrato, jornada, situación familiar o previsión de ingresos.' },
  ] },
  iva: { title: 'Preguntas sobre IVA', questions: [
    { question: '¿Cómo puedo deducir el IVA soportado?', answer: 'Debe estar vinculado a la actividad, documentado con una factura válida y registrado correctamente, además de cumplir los requisitos fiscales.' },
    { question: '¿Cuándo se aplica el IVA general del 21%, el reducido del 10% o el superreducido del 4%?', answer: 'El 21% es el tipo general. El 10% y el 4% se reservan para bienes y servicios concretos previstos por la normativa.' },
    { question: '¿Cómo paso un precio con IVA a precio sin IVA?', answer: 'Divide el precio final entre 1 más el tipo de IVA expresado en decimal. Para añadirlo a una base, multiplica por 1 más ese tipo.' },
  ] },
  autonomous_tax: { title: 'Preguntas sobre retenciones profesionales', questions: [
    { question: '¿Qué retención debe aparecer en una factura profesional?', answer: 'La retención depende de la actividad y de la situación fiscal. El 15% es habitual, aunque existen tipos reducidos y excepciones que deben verificarse.' },
    { question: '¿La retención de IRPF es un impuesto adicional?', answer: 'No. Es un pago a cuenta que el cliente ingresa en Hacienda en nombre del profesional y que se descuenta del importe a cobrar.' },
    { question: '¿Cómo se calcula el total de una factura con IVA y retención?', answer: 'Se suma el IVA a la base imponible y se resta la retención de IRPF. El resultado es el importe líquido de la factura.' },
  ] },
  mortgage: { title: 'Preguntas sobre hipotecas', questions: [
    { question: '¿Qué diferencia hay entre una hipoteca a tipo fijo y variable?', answer: 'El tipo fijo mantiene una cuota más previsible. El variable puede cambiar en las revisiones según el índice de referencia y las condiciones contratadas.' },
    { question: '¿Qué porcentaje de ingresos debería dedicar a la cuota hipotecaria?', answer: 'Como orientación prudente, la cuota total de deuda debería mantenerse en una parte razonable de los ingresos netos y dejar margen para ahorro, gastos y posibles subidas de tipos.' },
    { question: '¿Cuál es la diferencia entre TIN y TAE en una hipoteca?', answer: 'El TIN refleja el interés nominal. La TAE incorpora gastos, comisiones y periodicidad para comparar mejor el coste de distintas ofertas.' },
  ] },
  personal_loan: { title: 'Preguntas sobre préstamos personales', questions: [
    { question: '¿Cómo se calcula la cuota de un préstamo personal?', answer: 'La cuota depende del capital, el tipo de interés, el plazo y la frecuencia de pago. Cada mensualidad combina devolución de capital e intereses.' },
    { question: '¿Es mejor reducir plazo o cuota al amortizar un préstamo?', answer: 'Reducir plazo suele disminuir los intereses totales; reducir cuota mejora la liquidez mensual. La mejor opción depende de tus objetivos y capacidad de ahorro.' },
    { question: '¿Qué coste total debo comparar al pedir un préstamo?', answer: 'Compara la TAE y el importe total adeudado, incluyendo intereses, comisiones, seguros obligatorios y otros gastos asociados.' },
  ] },
  compound_interest: { title: 'Preguntas sobre interés compuesto', questions: [
    { question: '¿Cómo funciona el interés compuesto?', answer: 'Los rendimientos se suman al capital y generan nuevos rendimientos en los siguientes periodos. El tiempo y la reinversión son sus principales motores.' },
    { question: '¿Qué influye más en el resultado de una inversión a largo plazo?', answer: 'La aportación inicial, las aportaciones periódicas, la rentabilidad, la frecuencia de capitalización y el tiempo invertido.' },
    { question: '¿Está garantizado el rendimiento calculado?', answer: 'No. Es una proyección matemática basada en una tasa supuesta y no garantiza la rentabilidad ni elimina el riesgo de pérdida.' },
  ] },
  inflation: { title: 'Preguntas sobre inflación y ahorro', questions: [
    { question: '¿Cómo afecta la inflación al valor de mis ahorros?', answer: 'Reduce su poder adquisitivo: con el tiempo, la misma cantidad de dinero puede comprar menos bienes y servicios.' },
    { question: '¿Cómo se calcula el valor real de un ahorro futuro?', answer: 'Se descuenta el efecto acumulado de la inflación dividiendo el ahorro nominal entre 1 más la inflación anual elevada al número de años.' },
    { question: '¿Puede el interés compuesto compensar la inflación?', answer: 'Puede ayudar si la rentabilidad neta supera la inflación, pero hay que considerar impuestos, costes y el riesgo de la inversión.' },
  ] },
};

const NAV_ITEMS = ['Inicio', 'Herramientas', 'Legislación', 'Contacto'];

type HubIconName = 'briefcase' | 'receipt' | 'chart' | 'calculator' | 'clock' | 'trend' | 'file' | 'shield' | 'percent' | 'wallet' | 'home' | 'loan' | 'coins' | 'inflation';

function HubIcon({ name, className = 'h-5 w-5' }: { name: HubIconName; className?: string }) {
  const paths: Record<HubIconName, string> = {
    briefcase: 'M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 4h10m-11 0a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Z',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h3',
    chart: 'M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-8',
    calculator: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8',
    clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    trend: 'M4 17 10 11l4 4 6-8m0 0v5m0-5h-5',
    file: 'M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 0v5h4M8 13h8m-8 4h6',
    shield: 'm12 3 8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z',
    percent: 'M19 5 5 19M7 7h.01M17 17h.01',
    wallet: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 2h16m-5 4h3',
    home: 'm3 11 9-8 9 8m-2 0v9H5v-9m4 9v-5h6v5',
    loan: 'M4 7h16v12H4zM8 7V5h8v2m-8 5h8',
    coins: 'M12 6c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3Zm-7 3v5c0 1.7 3 3 7 3s7-1.3 7-3V9m-14 5v5c0 1.7 3 3 7 3s7-1.3 7-3v-5',
    inflation: 'M5 19 19 5m-9 0H5v5m9 9h5v-5',
  };

  return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24"><path d={paths[name]} /></svg>;
}

function getToolIcon(tool: HubTool): HubIconName {
  const icons: Record<HubTool, HubIconName> = {
    salary_net: 'calculator', salary_reverse: 'trend', hourly_salary: 'clock', salary_raise: 'trend', finiquito: 'file', unemployment: 'shield',
    irpf: 'percent', iva: 'receipt', autonomous_tax: 'wallet', mortgage: 'home', personal_loan: 'loan', compound_interest: 'coins', inflation: 'inflation',
  };
  return icons[tool];
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatSpanishDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseSpanishDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day) ? date : null;
}

function estimateGrossSalaryFromNetMonthly(
  targetNetMonthly: number,
  inputs: Omit<TaxInputs, 'grossSalary'>,
): number {
  const safeTarget = Math.max(targetNetMonthly, 1);
  let low = 0;
  let high = Math.max(safeTarget * 12 * 8, 20000);

  for (let index = 0; index < 60; index += 1) {
    const mid = (low + high) / 2;
    const estimated = calculateNetSalary({ ...inputs, grossSalary: mid });

    if (estimated.monthlyNet >= safeTarget) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Number(((low + high) / 2).toFixed(2));
}

function calculateFiniquito(data: FiniquitoFormState): FiniquitoResult | null {
  const baseSalary = Number(data.baseSalary);
  const extraProrrateo = Number(data.extraProrrateo || 0);
  const vacationDays = Number(data.vacationDays || 0);

  if (!data.startDate || !data.endDate || Number.isNaN(baseSalary) || baseSalary <= 0) {
    return null;
  }

  const start = parseSpanishDate(data.startDate);
  const end = parseSpanishDate(data.endDate);

  if (!start || !end || end <= start) {
    return null;
  }

  const monthsWorked =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    (end.getDate() > start.getDate() ? 1 : 0);

  const yearsWorked = Math.max(monthsWorked / 12, 0);
  const dailySalary = (baseSalary + extraProrrateo) / 30;
  const vacationPending = dailySalary * vacationDays;

  let indemnizacion = 0;
  const daysPerYear =
    data.reason === 'procedente' ? 20 : data.reason === 'improcedente' ? 33 : 0;

  if (data.reason === 'procedente' || data.reason === 'improcedente') {
    indemnizacion = dailySalary * daysPerYear * Math.max(yearsWorked, 0);
  }

  const total = vacationPending + extraProrrateo + indemnizacion;

  return {
    startDate: formatSpanishDate(start),
    endDate: formatSpanishDate(end),
    yearsWorked,
    dailySalary,
    vacationPending,
    extraPay: extraProrrateo,
    indemnizacion,
    total,
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>('neto');
  const [hubCategory, setHubCategory] = useState<HubCategory>('salarios');
  const [selectedTool, setSelectedTool] = useState<HubTool>('salary_net');
  const [hubInputs, setHubInputs] = useState<Record<string, string>>({
    annualSalary: '36000',
    weeklyHours: '40',
    weeks: '46',
    currentSalary: '30000',
    raisePercent: '5',
    contributionBase: '1800',
    monthsUnemployed: '12',
    children: '0',
    taxableIncome: '36000',
    withholding: '15',
    basePrice: '1000',
    ivaRate: '21',
    invoiceAmount: '1500',
    professionalWithholding: '15',
    invoiceIva: '21',
    loanAmount: '180000',
    interestRate: '3.2',
    loanYears: '25',
    initialInvestment: '5000',
    annualReturn: '6',
    investmentYears: '10',
    savings: '10000',
    inflationRate: '2.5',
    inflationYears: '10',
  });
  const [hubResult, setHubResult] = useState<{ title: string; primary: string; rows: Array<[string, string]> } | null>(null);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('gross_to_net');
  const [grossSalary, setGrossSalary] = useState('36000');
  const [targetNetMonthly, setTargetNetMonthly] = useState('2000');
  const [pays, setPays] = useState<12 | 14>(14);
  const [region, setRegion] = useState('Madrid (Comunidad de)');
  const [familySituation, setFamilySituation] = useState<FamilySituation>('single');
  const [childrenCount, setChildrenCount] = useState(0);
  const [disabilityDegree, setDisabilityDegree] = useState(0);
  const [spouseSituation, setSpouseSituation] = useState<SpouseSituation>('not_applicable');
  const [geographicMobility, setGeographicMobility] = useState(false);
  const [salaryResult, setSalaryResult] = useState<TaxResult | null>(null);

  const [finiquitoForm, setFiniquitoForm] = useState<FiniquitoFormState>({
    startDate: '01/01/2023',
    endDate: '18/08/2026',
    baseSalary: '2600',
    extraProrrateo: '0',
    vacationDays: '10',
    reason: 'procedente',
  });
  const [finiquitoResult, setFiniquitoResult] = useState<FiniquitoResult | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [copiedState, setCopiedState] = useState({ neto: false, finiquito: false });
  const calculatorRef = useRef<HTMLDivElement>(null);
  const toolsListRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToElement = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const webApplicationSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'CalculaTuTrabajo',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      description:
        'Calculadora de sueldo neto, IRPF y finiquito para España con estimaciones rápidas y claras de nómina y liquidación laboral.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      provider: {
        '@type': 'Organization',
        name: 'CalculaTuTrabajo',
        url: 'https://calculatutrabajo.com',
      },
      featureList: [
        'Cálculo de sueldo neto en España',
        'Estimación de IRPF',
        'Cálculo de finiquito',
        'Liquidación laboral orientativa',
      ],
    }),
    [],
  );

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuándo se debe firmar un finiquito como “No Conforme”?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Si el trabajador considera que hay errores en el cálculo, faltan conceptos pendientes o se ha producido un despido con discrepancias legales, puede firmar el finiquito con la salvedad “No Conforme” para preservar sus derechos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué plazo tiene la empresa para pagar la liquidación?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La empresa suele tener un plazo legal para abonar las cantidades pendientes, y el tiempo exacto puede depender del tipo de contrato, la fecha de baja y la modalidad del despido.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo influye el número de pagas (12 vs 14) en la retención?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El número de pagas afecta a cómo se prorratea el salario anual. Con 14 pagas, las cuotas se distribuyen en más pagos y la base mensual puede verse modificada.',
          },
        },
      ],
    }),
    [],
  );

  useEffect(() => {
    document.title = 'Calculadora de Finiquito y Sueldo Neto 2026 | España';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      'Calcula tu sueldo neto y finiquito en España con estimaciones claras de IRPF, cotizaciones y liquidación laboral. Herramienta útil y rápida para nóminas y finiquitos.',
    );
  }, []);

  const selectedToolDefinition = HUB_TOOLS[hubCategory].find((tool) => tool.key === selectedTool) ?? HUB_TOOLS.salarios[0];
  const isLegacyTool = selectedTool === 'salary_net' || selectedTool === 'salary_reverse' || selectedTool === 'finiquito';

  const selectHubCategory = (category: HubCategory) => {
    const firstTool = HUB_TOOLS[category][0];
    setHubCategory(category);
    setSelectedTool(firstTool.key);
    setHubResult(null);
    if (firstTool.key === 'finiquito') {
      setActiveTab('finiquito');
    } else if (firstTool.key === 'salary_net' || firstTool.key === 'salary_reverse') {
      setActiveTab('neto');
      setCalculationMode(firstTool.key === 'salary_reverse' ? 'net_to_gross' : 'gross_to_net');
    }
    window.setTimeout(() => scrollToElement(toolsListRef), 0);
  };

  const selectHubTool = (tool: HubTool) => {
    setSelectedTool(tool);
    setHubResult(null);
    if (tool === 'finiquito') {
      setActiveTab('finiquito');
    } else if (tool === 'salary_net' || tool === 'salary_reverse') {
      setActiveTab('neto');
      setCalculationMode(tool === 'salary_reverse' ? 'net_to_gross' : 'gross_to_net');
    }
    window.setTimeout(() => scrollToElement(calculatorRef), 0);
  };

  const handleHubCalculate = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const value = (key: string) => Number(hubInputs[key] || 0);
    const money = (amount: number) => `${formatCurrency(Math.max(amount, 0))} €`;
    const percent = (amount: number) => `${amount.toFixed(2)}%`;
    const monthlyPayment = (principal: number, annualRate: number, years: number) => {
      const months = Math.max(years * 12, 1);
      const monthlyRate = annualRate / 100 / 12;
      return monthlyRate === 0 ? principal / months : principal * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    };

    let result: { title: string; primary: string; rows: Array<[string, string]> };
    switch (selectedTool) {
      case 'hourly_salary': {
        const hours = Math.max(value('weeklyHours') * value('weeks'), 1);
        const grossHourly = value('annualSalary') / hours;
        result = { title: 'Salario por hora', primary: money(grossHourly), rows: [['Bruto por hora', money(grossHourly)], ['Neto orientativo por hora', money(grossHourly * 0.82)], ['Horas anuales', `${hours.toFixed(0)} h`]] };
        break;
      }
      case 'salary_raise': {
        const increase = value('currentSalary') * value('raisePercent') / 100;
        result = { title: 'Impacto de la subida salarial', primary: money(value('currentSalary') + increase), rows: [['Aumento anual', money(increase)], ['Nuevo salario anual', money(value('currentSalary') + increase)], ['Aumento mensual', money(increase / 12)]] };
        break;
      }
      case 'unemployment': {
        const base = value('contributionBase');
        const monthly = base * 0.7;
        result = { title: 'Prestación estimada por desempleo', primary: money(monthly), rows: [['Primeros 180 días (70%)', money(monthly)], ['Desde el día 181 (60%)', money(base * 0.6)], ['Duración indicada', `${value('monthsUnemployed').toFixed(0)} meses`]] };
        break;
      }
      case 'irpf': {
        const retention = value('taxableIncome') * value('withholding') / 100;
        result = { title: 'Retención IRPF estimada', primary: money(retention), rows: [['Tipo aplicado', percent(value('withholding'))], ['Ingreso después de IRPF', money(value('taxableIncome') - retention)], ['Retención mensual media', money(retention / 12)]] };
        break;
      }
      case 'iva': {
        const rate = value('ivaRate');
        const tax = value('basePrice') * rate / 100;
        result = { title: 'Precio con IVA', primary: money(value('basePrice') + tax), rows: [['Base imponible', money(value('basePrice'))], ['IVA aplicado', `${money(tax)} (${percent(rate)})`], ['Precio sin IVA', money(value('basePrice'))]] };
        break;
      }
      case 'autonomous_tax': {
        const base = value('invoiceAmount');
        const withholding = base * value('professionalWithholding') / 100;
        const iva = base * value('invoiceIva') / 100;
        result = { title: 'Factura profesional estimada', primary: money(base + iva - withholding), rows: [['Base imponible', money(base)], ['IVA repercutido', money(iva)], ['Retención IRPF', money(withholding)]] };
        break;
      }
      case 'mortgage':
      case 'personal_loan': {
        const payment = monthlyPayment(value('loanAmount'), value('interestRate'), value('loanYears'));
        const total = payment * value('loanYears') * 12;
        result = { title: selectedTool === 'mortgage' ? 'Cuota hipotecaria estimada' : 'Cuota del préstamo estimada', primary: money(payment), rows: [['Capital financiado', money(value('loanAmount'))], ['Intereses totales', money(total - value('loanAmount'))], ['Coste total', money(total)]] };
        break;
      }
      case 'compound_interest': {
        const finalValue = value('initialInvestment') * (1 + value('annualReturn') / 100) ** value('investmentYears');
        result = { title: 'Rendimiento de la inversión', primary: money(finalValue), rows: [['Capital inicial', money(value('initialInvestment'))], ['Beneficio estimado', money(finalValue - value('initialInvestment'))], ['Rentabilidad anual', percent(value('annualReturn'))]] };
        break;
      }
      case 'inflation': {
        const futureValue = value('savings') / (1 + value('inflationRate') / 100) ** value('inflationYears');
        result = { title: 'Valor real del ahorro', primary: money(futureValue), rows: [['Ahorro actual', money(value('savings'))], ['Pérdida de poder adquisitivo', money(value('savings') - futureValue)], ['Inflación acumulada', percent(((value('savings') / futureValue) - 1) * 100)]] };
        break;
      }
      default:
        return;
    }
    setHubResult(result);
    scrollToElement(resultsRef);
  };

  const handleSalaryCalculate = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const baseInputs: Omit<TaxInputs, 'grossSalary'> = {
      pays,
      region,
      familySituation,
      childrenCount: Number(childrenCount) || 0,
      disabilityDegree,
      spouseSituation,
      geographicMobility,
    };

    if (calculationMode === 'net_to_gross') {
      const estimatedTarget = Number(targetNetMonthly);

      if (!targetNetMonthly || Number.isNaN(estimatedTarget) || estimatedTarget <= 0) {
        alert('Introduce un sueldo neto mensual válido.');
        return;
      }

      const estimatedGrossAnnual = estimateGrossSalaryFromNetMonthly(estimatedTarget, baseInputs);
      const inputs: TaxInputs = {
        grossSalary: estimatedGrossAnnual,
        ...baseInputs,
      };

      setGrossSalary(String(estimatedGrossAnnual));
      setSalaryResult(calculateNetSalary(inputs));
      scrollToElement(resultsRef);
      return;
    }

    const currentGross = Number(grossSalary);

    if (!grossSalary || Number.isNaN(currentGross) || currentGross <= 0) {
      alert('Por favor, introduce un salario bruto válido.');
      return;
    }

    const inputs: TaxInputs = {
      grossSalary: currentGross,
      ...baseInputs,
    };

    setSalaryResult(calculateNetSalary(inputs));
  scrollToElement(resultsRef);
  };

  const handleFiniquitoCalculate = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const calculated = calculateFiniquito(finiquitoForm);

    if (!calculated) {
      alert('Revisa las fechas y el salario base para calcular el finiquito.');
      return;
    }

    setFiniquitoResult(calculated);
  scrollToElement(resultsRef);
  };

  const handleCopySummary = async (type: 'neto' | 'finiquito') => {
    const summary =
      type === 'neto'
        ? salaryResult
          ? `Sueldo Neto Mensual: ${formatCurrency(salaryResult.monthlyNet)} € | Bruto: ${formatCurrency(Number(grossSalary))} € | Calculado en calculatutrabajo.vercel.app`
          : hubResult
            ? `${hubResult.title}: ${hubResult.primary} | ${hubResult.rows.map(([label, resultValue]) => `${label}: ${resultValue}`).join(' | ')}`
            : ''
        : finiquitoResult
          ? `Finiquito estimado: ${formatCurrency(finiquitoResult.total)} € | Vacaciones: ${formatCurrency(finiquitoResult.vacationPending)} € | Indemnización: ${formatCurrency(finiquitoResult.indemnizacion)} € | Calculado en calculatutrabajo.vercel.app`
          : '';

    if (!summary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedState((previous) => ({ ...previous, [type]: true }));
      window.setTimeout(() => {
        setCopiedState((previous) => ({ ...previous, [type]: false }));
      }, 1500);
    } catch {
      alert('No se pudo copiar el resumen. Inténtalo de nuevo.');
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md">
                C
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900">CalculaTuTrabajo</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">España 2026</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              {NAV_ITEMS.map((item) => (
                <a key={item} href="#" className="transition hover:text-blue-700">
                  {item}
                </a>
              ))}
            </nav>

            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
              Acceso rápido
            </button>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-200/60">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.8fr] md:px-10 md:py-12">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
                Portal de cálculo financiero y laboral 2026
              </span>
              <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight md:text-5xl">
                Calcula tu salario, impuestos y finanzas con precisión.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-blue-100 md:text-lg">
                Simulaciones profesionales e instantáneas para España: nóminas, finiquitos, IRPF, IVA, hipotecas y prestaciones por desempleo adaptadas a la normativa vigente.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { category: 'salarios' as HubCategory, label: '💼 Salarios y Paro' },
                  { category: 'impuestos' as HubCategory, label: '🧾 Impuestos e IRPF' },
                  { category: 'finanzas' as HubCategory, label: '📊 Hipotecas y Ahorro' },
                ].map((quickAccess) => (
                  <button
                    key={quickAccess.category}
                    type="button"
                    onClick={() => selectHubCategory(quickAccess.category)}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/20 hover:text-white"
                  >
                    {quickAccess.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-950/20 p-5 shadow-xl backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.25em] text-blue-100/80">Suite de cálculo</div>
                <div className="mt-5 text-3xl font-black">+12 Herramientas</div>
                <div className="mt-2 text-sm text-blue-100/90">Salarios • Impuestos • Finanzas</div>
                <div className="mt-6 rounded-xl bg-white/5 px-3 py-3 text-sm text-blue-50">
                  <span className="mr-2 text-emerald-300">●</span>
                  Actualizado a la normativa España 2026
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={toolsListRef} className="relative mb-12 mt-8 scroll-mt-6 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 pt-8 shadow-sm md:p-8 md:pt-10">
          <span className="absolute left-5 top-0 -translate-y-1/2 rounded-full border border-blue-100 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">
            Paso 1: selecciona la herramienta
          </span>
          <div className="grid gap-1 rounded-2xl border border-slate-200/80 bg-slate-100 p-2 md:grid-cols-3" role="tablist" aria-label="Categorías de herramientas">
            {[
              { key: 'salarios', label: 'Salarios y Empleo', badge: '6 herramientas', icon: 'briefcase' as HubIconName },
              { key: 'impuestos', label: 'Impuestos y Retenciones', badge: '3 herramientas', icon: 'receipt' as HubIconName },
              { key: 'finanzas', label: 'Finanzas Personales', badge: '4 herramientas', icon: 'chart' as HubIconName },
            ].map((category) => (
              <button
                key={category.key}
                type="button"
                role="tab"
                id={`tab-${category.key}`}
                aria-selected={hubCategory === category.key}
                aria-controls="hub-tools-panel"
                onClick={() => selectHubCategory(category.key as HubCategory)}
                className={`min-h-[58px] rounded-xl px-4 py-2.5 text-left transition-all duration-200 touch-manipulation ${
                  hubCategory === category.key ? 'bg-slate-900 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HubIcon name={category.icon} className={`h-5 w-5 shrink-0 ${hubCategory === category.key ? 'text-blue-300' : 'text-blue-600'}`} />
                  <span className="min-w-0 text-sm font-bold">{category.label}</span>
                </div>
                <div className={`mt-1 pl-8 text-[10px] font-semibold uppercase tracking-[0.12em] ${hubCategory === category.key ? 'text-slate-300' : 'text-slate-400'}`}>{category.badge}</div>
              </button>
            ))}
          </div>
          <div className="my-6 border-t border-slate-200/60" />
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Selecciona una calculadora de <span className="text-blue-700">{[
              { key: 'salarios', label: 'Salarios y Empleo' },
              { key: 'impuestos', label: 'Impuestos y Retenciones' },
              { key: 'finanzas', label: 'Finanzas Personales' },
            ].find((category) => category.key === hubCategory)?.label}:</span>
          </p>
          <div id="hub-tools-panel" role="tabpanel" aria-labelledby={`tab-${hubCategory}`} className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-inner shadow-slate-200/40 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUB_TOOLS[hubCategory].map((tool) => (
                <button
                  key={tool.key}
                  type="button"
                  aria-pressed={selectedTool === tool.key}
                  onClick={() => selectHubTool(tool.key)}
                  className={`min-h-[96px] rounded-2xl border px-4 py-3 text-left transition-all duration-200 touch-manipulation ${
                    selectedTool === tool.key ? 'scale-[1.02] rounded-2xl border-2 border-slate-900 bg-blue-50/60 text-blue-700 shadow-sm' : 'rounded-2xl border border-slate-200/80 bg-white text-slate-900 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selectedTool === tool.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <HubIcon name={getToolIcon(tool.key)} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-bold ${selectedTool === tool.key ? 'text-blue-600' : 'text-slate-900'}`}>{tool.label}</span>
                      <span className={`mt-2 block text-xs ${selectedTool === tool.key ? 'text-blue-700' : 'text-slate-500'}`}>{tool.description}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${selectedTool === tool.key ? 'bg-blue-100/80 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{tool.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section ref={calculatorRef} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700">
              Paso 2: introduce tus datos
            </span>
            <span className="hidden text-sm text-slate-500 sm:inline">Completa los campos de la herramienta seleccionada</span>
          </div>

        {selectedTool === 'unemployment' ? <ParoCalculator /> : selectedTool === 'irpf' ? <IrpfCalculator resultsRef={resultsRef} /> : selectedTool === 'autonomous_tax' ? <FreelanceInvoiceCalculator resultsRef={resultsRef} /> : selectedTool === 'iva' ? <IvaCalculator resultsRef={resultsRef} /> : selectedTool === 'mortgage' ? <MortgageCalculator resultsRef={resultsRef} /> : !isLegacyTool && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedToolDefinition.label}</h2>
                  <p className="text-sm text-slate-500">{selectedToolDefinition.description} · Estimación orientativa 2026</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">{selectedToolDefinition.badge}</span>
              </div>
              <form onSubmit={handleHubCalculate} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  {selectedToolDefinition.fields.map((field) => (
                    <div key={field.key}>
                      <label htmlFor={`hub-${field.key}`} className="mb-2 block text-sm font-semibold text-slate-700">{field.label}{field.suffix ? ` (${field.suffix})` : ''}</label>
                      <input
                        id={`hub-${field.key}`}
                        type="number"
                        min="0"
                        step="any"
                        value={hubInputs[field.key] ?? ''}
                        onChange={(event) => setHubInputs((previous) => ({ ...previous, [field.key]: event.target.value }))}
                        placeholder={field.placeholder}
                        className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">Calcular estimación</button>
              </form>
            </div>

            <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold">Resultado estimado</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">HUB</span>
              </div>
              {hubResult ? (
                <div className="mt-6 space-y-5">
                  <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                    <div className="text-sm text-slate-300">{hubResult.title}</div>
                    <div className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{hubResult.primary}</div>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
                    {hubResult.rows.map(([label, resultValue]) => (
                      <div key={label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <span>{label}</span><span className="break-words text-right font-bold text-white">{resultValue}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <button type="button" onClick={() => handleCopySummary('neto')} className="min-h-[48px] flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">{copiedState.neto ? 'Copiado ✓' : 'Copiar resultado'}</button>
                    <button type="button" onClick={handleDownloadPdf} className="min-h-[48px] flex-1 rounded-xl bg-slate-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-600">Descargar Informe PDF</button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">Completa los campos para ver el resultado de esta herramienta.</div>
              )}
            </aside>
          </section>
        )}

        {isLegacyTool && (activeTab === 'neto' ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Sueldo neto</h2>
                  <p className="text-sm text-slate-500">Estimación basada en el régimen general</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                  2026
                </span>
              </div>

              <form onSubmit={handleSalaryCalculate} className="space-y-5">
                <div>
                  <div className="mb-3 grid gap-2 sm:grid-cols-2">
                    {[
                      { key: 'gross_to_net', label: 'Bruto a Neto' },
                      { key: 'net_to_gross', label: 'Neto a Bruto' },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setCalculationMode(mode.key as CalculationMode)}
                        className={`min-h-[48px] rounded-xl border px-3 py-2 text-sm font-bold transition ${
                          calculationMode === mode.key
                            ? 'border-2 border-slate-900 bg-blue-50/60 text-blue-600 font-bold shadow-sm'
                            : 'border border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {calculationMode === 'gross_to_net' ? (
                    <>
                      <label htmlFor="grossSalary" className="mb-2 block text-sm font-semibold text-slate-700">
                        Salario bruto anual (€)
                      </label>
                      <input
                        id="grossSalary"
                        type="number"
                        value={grossSalary}
                        onChange={(event) => setGrossSalary(event.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        placeholder="Ej. 36000"
                      />
                    </>
                  ) : (
                    <>
                      <label htmlFor="targetNetMonthly" className="mb-2 block text-sm font-semibold text-slate-700">
                        Sueldo neto mensual deseado (€)
                      </label>
                      <input
                        id="targetNetMonthly"
                        type="number"
                        value={targetNetMonthly}
                        onChange={(event) => setTargetNetMonthly(event.target.value)}
                        className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        placeholder="Ej. 2000"
                      />
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        ¿Cómo se calcula? Estimamos el salario bruto anual necesario para alcanzar tu objetivo neto,
                        teniendo en cuenta las pagas, la comunidad autónoma y tu situación familiar.
                      </p>
                    </>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="pays" className="mb-2 block text-sm font-semibold text-slate-700">
                      Número de pagas
                    </label>
                    <select
                      id="pays"
                      value={pays}
                      onChange={(event) => setPays(Number(event.target.value) as 12 | 14)}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value={12}>12 pagas</option>
                      <option value={14}>14 pagas</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="region" className="mb-2 block text-sm font-semibold text-slate-700">
                      Comunidad autónoma
                    </label>
                    <select
                      id="region"
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="Andalucía">Andalucía</option>
                      <option value="Aragón">Aragón</option>
                      <option value="Asturias (Principado de)">Asturias (Principado de)</option>
                      <option value="Balears (Illes)">Balears (Illes)</option>
                      <option value="Canarias">Canarias</option>
                      <option value="Cantabria">Cantabria</option>
                      <option value="Castilla-La Mancha">Castilla-La Mancha</option>
                      <option value="Castilla y León">Castilla y León</option>
                      <option value="Cataluña">Cataluña</option>
                      <option value="Ceuta">Ceuta</option>
                      <option value="Comunitat Valenciana">Comunitat Valenciana</option>
                      <option value="Extremadura">Extremadura</option>
                      <option value="Galicia">Galicia</option>
                      <option value="Madrid (Comunidad de)">Madrid (Comunidad de)</option>
                      <option value="Melilla">Melilla</option>
                      <option value="Murcia (Región de)">Murcia (Región de)</option>
                      <option value="Navarra (Comunidad Foral de)">Navarra (Comunidad Foral de)</option>
                      <option value="País Vasco">País Vasco</option>
                      <option value="Rioja (La)">Rioja (La)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="familySituation" className="mb-2 block text-sm font-semibold text-slate-700">
                      Situación familiar
                    </label>
                    <select
                      id="familySituation"
                      value={familySituation}
                      onChange={(event) => {
                        const nextFamilySituation = event.target.value as FamilySituation;
                        setFamilySituation(nextFamilySituation);
                        setSpouseSituation(nextFamilySituation === 'married' ? 'income_over_1500' : 'not_applicable');
                      }}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="single">Soltero/a</option>
                      <option value="married">Casado/a</option>
                      <option value="single_parent">Monoparental</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="childrenCount" className="mb-2 block text-sm font-semibold text-slate-700">
                      Número de hijos
                    </label>
                    <input
                      id="childrenCount"
                      type="number"
                      min={0}
                      value={childrenCount}
                      onChange={(event) => setChildrenCount(Number(event.target.value))}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Variables fiscales adicionales</h3>
                    <p className="mt-1 text-xs text-slate-500">Ajustan la estimación orientativa de IRPF.</p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label htmlFor="disabilityDegree" className="mb-2 block text-sm font-semibold text-slate-700">
                        Grado de discapacidad
                      </label>
                      <select
                        id="disabilityDegree"
                        value={disabilityDegree}
                        onChange={(event) => setDisabilityDegree(Number(event.target.value))}
                        className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value={0}>Sin discapacidad</option>
                        <option value={33}>≥33%</option>
                        <option value={65}>≥65%</option>
                      </select>
                    </div>

                    {familySituation === 'married' ? (
                      <div>
                        <label htmlFor="spouseSituation" className="mb-2 block text-sm font-semibold text-slate-700">
                          Situación del cónyuge
                        </label>
                        <select
                          id="spouseSituation"
                          value={spouseSituation}
                          onChange={(event) => setSpouseSituation(event.target.value as SpouseSituation)}
                          className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="income_over_1500">Rentas &gt; 1.500 €</option>
                          <option value="dependent">Cónyuge a cargo</option>
                        </select>
                      </div>
                    ) : null}

                    <label htmlFor="geographicMobility" className="flex min-h-[48px] cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                      <input
                        id="geographicMobility"
                        type="checkbox"
                        checked={geographicMobility}
                        onChange={(event) => setGeographicMobility(event.target.checked)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      Movilidad geográfica
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  {calculationMode === 'gross_to_net' ? 'Calcular estimación' : 'Calcular bruto necesario'}
                </button>
              </form>
            </div>

            <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-300/60">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold">Resultado estimado</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                  {pays} pagas
                </span>
              </div>

              {salaryResult ? (
                <div className="mt-6 space-y-6">
                  <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                    <div className="text-sm text-slate-300">Neto mensual estimado</div>
                    <div className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">
                      {formatCurrency(salaryResult.monthlyNet)} €
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                      <div className="text-sm text-slate-300">Neto anual</div>
                      <div className="mt-2 break-words text-xl font-bold">{formatCurrency(salaryResult.annualNet)} €</div>
                    </div>
                    <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                      <div className="text-sm text-slate-300">Bruto anual</div>
                      <div className="mt-2 break-words text-xl font-bold">{formatCurrency(Number(grossSalary))} €</div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-white/5 p-4">
                    {calculationMode === 'net_to_gross' ? (
                      <>
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                          <span>Salario Bruto Anual necesario</span>
                          <span className="font-bold text-white">{formatCurrency(Number(grossSalary))} €</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                          <span>Bruto mensual</span>
                          <span>{formatCurrency(Number(grossSalary) / pays)} €</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                          <span>Retención IRPF estimada</span>
                          <span>{salaryResult.irpfPercentage}%</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                          <span>Retención IRPF</span>
                          <span>{salaryResult.irpfPercentage}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                          <span>Cotización SS</span>
                          <span>{salaryResult.socialSecurityPercentage}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm text-slate-200">
                          <span>Deducciones anuales</span>
                          <span className="break-words font-bold text-white">
                            {formatCurrency(salaryResult.annualIRPF + salaryResult.annualSocialSecurity)} €
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {salaryResult.taxRegimeNote ? (
                    <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-100">
                      {salaryResult.taxRegimeNote}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleCopySummary('neto')}
                      className="min-h-[48px] flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      {copiedState.neto ? 'Copiado ✓' : 'Copiar resultado'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="min-h-[48px] flex-1 rounded-xl bg-slate-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-600"
                    >
                      Descargar Informe PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">
                  Completa los datos para ver el resultado estimado de tu nómina.
                </div>
              )}
            </aside>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Finiquito</h2>
                  <p className="text-sm text-slate-500">Estimación para liquidación final</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                  Legal
                </span>
              </div>

              <form onSubmit={handleFiniquitoCalculate} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="mb-2 block text-sm font-semibold text-slate-700">
                      Fecha de inicio de contrato
                    </label>
                    <input
                      id="startDate"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={finiquitoForm.startDate}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, startDate: formatDateInput(event.target.value) }))}
                      placeholder="DD/MM/YYYY"
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="mb-2 block text-sm font-semibold text-slate-700">
                      Fecha de fin / despido
                    </label>
                    <input
                      id="endDate"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={finiquitoForm.endDate}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, endDate: formatDateInput(event.target.value) }))}
                      placeholder="DD/MM/YYYY"
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="baseSalary" className="mb-2 block text-sm font-semibold text-slate-700">
                      Salario base mensual (€)
                    </label>
                    <input
                      id="baseSalary"
                      type="number"
                      value={finiquitoForm.baseSalary}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, baseSalary: event.target.value }))}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej. 2600"
                    />
                  </div>

                  <div>
                    <label htmlFor="extraProrrateo" className="mb-2 block text-sm font-semibold text-slate-700">
                      Prorrateo de pagas extra (€)
                    </label>
                    <input
                      id="extraProrrateo"
                      type="number"
                      value={finiquitoForm.extraProrrateo}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, extraProrrateo: event.target.value }))}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej. 0"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="vacationDays" className="mb-2 block text-sm font-semibold text-slate-700">
                      Días de vacaciones pendientes
                    </label>
                    <input
                      id="vacationDays"
                      type="number"
                      min={0}
                      value={finiquitoForm.vacationDays}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, vacationDays: event.target.value }))}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej. 10"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="mb-2 block text-sm font-semibold text-slate-700">
                      Motivo de baja
                    </label>
                    <select
                      id="reason"
                      value={finiquitoForm.reason}
                      onChange={(event) => setFiniquitoForm((previous) => ({ ...previous, reason: event.target.value as FiniquitoReason }))}
                      className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="voluntary">Baja voluntaria</option>
                      <option value="procedente">Despido procedente (20 días/año)</option>
                      <option value="improcedente">Despido improcedente (33 días/año)</option>
                      <option value="temporal">Fin de contrato temporal</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="min-h-[48px] w-full rounded-xl bg-amber-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600 active:scale-[0.99]"
                >
                  Calcular finiquito
                </button>
              </form>
            </div>

            <aside ref={resultsRef} className="print-report scroll-mt-6 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-300/60">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold">Resumen del finiquito</h3>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                  Estimación
                </span>
              </div>

              {finiquitoResult ? (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl bg-white/5 p-4">
                    <div className="text-sm text-slate-300">Total estimado a recibir</div>
                    <div className="mt-2 break-words text-3xl font-black text-white">{formatCurrency(finiquitoResult.total)} €</div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
                    <div className="flex items-center justify-between gap-3">
                      <span>Periodo trabajado</span>
                      <span>{finiquitoResult.startDate} - {finiquitoResult.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Vacaciones pendientes</span>
                      <span>{formatCurrency(finiquitoResult.vacationPending)} €</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Pagas extra prorrateadas</span>
                      <span>{formatCurrency(finiquitoResult.extraPay)} €</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Indemnización por despido</span>
                      <span>{formatCurrency(finiquitoResult.indemnizacion)} €</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-white">
                      <span>Total</span>
                      <span className="break-words font-bold">{formatCurrency(finiquitoResult.total)} €</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                    <div>Tiempo trabajado</div>
                    <div className="mt-1 text-lg font-bold text-white">{finiquitoResult.yearsWorked.toFixed(1)} años</div>
                  </div>

                  <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-50">
                    <p className="font-semibold text-amber-100">¿No estás conforme con el cálculo de tu finiquito o te deben dinero? Consulta a un abogado especialista gratis.</p>
                    <button
                      type="button"
                      onClick={() => setIsLeadModalOpen(true)}
                      className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 font-bold text-slate-900 shadow-lg shadow-amber-900/20 transition hover:bg-amber-300"
                    >
                      Reclamar mi finiquito
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleCopySummary('finiquito')}
                      className="min-h-[48px] flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      {copiedState.finiquito ? 'Copiado ✓' : 'Copiar resultado'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="min-h-[48px] flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-900/20 transition hover:bg-amber-400"
                    >
                      Descargar Informe PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-600 bg-white/5 p-5 text-sm text-slate-300">
                  Introduce los datos del contrato para calcular tu liquidación final.
                </div>
              )}
            </aside>
          </section>
        ))}
        </section>

        <LegalFramework activeCalculator={selectedTool} />

        <DynamicCalculatorGuide activeCalculator={selectedTool} />

        <footer className="mt-12 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-black text-slate-900">CalculaTuTrabajo</div>
              <div className="text-sm text-slate-500">© {currentYear} Todos los derechos reservados.</div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <a href="/aviso-legal" className="transition hover:text-blue-700">Aviso Legal</a>
              <a href="/privacidad" className="transition hover:text-blue-700">Política de Privacidad</a>
              <a href="/contacto" className="transition hover:text-blue-700">Contacto</a>
            </div>
          </div>
        </footer>
      </div>

      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Consulta legal</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">Reclamar mi finiquito</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="min-h-[40px] min-w-[40px] rounded-full border border-slate-200 text-lg text-slate-600"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Déjanos tus datos y un abogado especialista revisará tu caso de finiquito sin coste inicial.
            </p>

            <form className="mt-5 space-y-4">
              <div>
                <label htmlFor="leadName" className="mb-2 block text-sm font-semibold text-slate-700">Nombre</label>
                <input
                  id="leadName"
                  type="text"
                  className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="leadEmail" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  id="leadEmail"
                  type="email"
                  className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="leadMessage" className="mb-2 block text-sm font-semibold text-slate-700">Mensaje</label>
                <textarea
                  id="leadMessage"
                  rows={4}
                  className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Cuéntanos qué te deben o en qué caso te gustaría revisión legal"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="min-h-[48px] w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Solicitar revisión
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}