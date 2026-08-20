export type CalculatorFaq = {
  question: string;
  answer: string;
};

export type CalculatorSeoContent = {
  badge: string;
  title: string;
  mainText: string[];
  bulletPoints: string[];
  faqs: CalculatorFaq[];
};

const sharedDisclaimer = 'Las cifras son orientativas y deben contrastarse con la nómina, resolución administrativa, contrato o condiciones concretas del caso.';

export const CALCULATOR_SEO_CONTENT: Record<string, CalculatorSeoContent> = {
  salary_net: {
    badge: 'GUÍA DE SUELDO NETO',
    title: 'Cómo calcular el sueldo neto en España',
    mainText: [
      'El sueldo neto es la cantidad que llega a tu cuenta después de descontar del salario bruto las cotizaciones a la Seguridad Social y la retención de IRPF. Para estimarlo hay que considerar el salario anual, el número de pagas, la comunidad autónoma y la situación familiar.',
      'La retención de IRPF funciona como un pago a cuenta del impuesto y puede cambiar durante el año si varían tus ingresos, tu contrato o tus circunstancias personales. No es lo mismo el tipo marginal que el porcentaje efectivo aplicado al conjunto de la renta.',
      'La base de cotización incluye los conceptos salariales que correspondan según la normativa laboral. Pluses, bonus, retribución en especie y pagas extraordinarias pueden modificar tanto la cotización como la retención reflejada en la nómina.',
      sharedDisclaimer,
    ],
    bulletPoints: ['Parte del bruto anual y divide correctamente entre 12 o 14 pagas.', 'Revisa la retención de IRPF comunicada mediante el modelo 145.', 'Distingue cotizaciones sociales, IRPF y otros descuentos de nómina.', 'Compara el resultado con tu nómina real antes de tomar decisiones.'],
    faqs: [
      { question: '¿Qué diferencia hay entre sueldo bruto y sueldo neto?', answer: 'El bruto es la retribución antes de descuentos. El neto es lo que recibes después de aplicar cotizaciones a la Seguridad Social, IRPF y otros conceptos que procedan.' },
      { question: '¿Por qué cambia mi sueldo neto de un mes a otro?', answer: 'Puede cambiar por regularizaciones de IRPF, pagas extra, bonus, horas extraordinarias, bajas, cambios de jornada o variaciones en la base de cotización.' },
      { question: '¿Cobrar en 12 o 14 pagas cambia el salario anual?', answer: 'No necesariamente. Si el bruto anual es el mismo, cambia la distribución de los cobros: con 12 pagas las extras suelen estar prorrateadas y con 14 se abonan por separado.' },
      { question: '¿La calculadora ofrece el importe exacto de mi nómina?', answer: 'Ofrece una estimación. El importe exacto depende del contrato, convenio, conceptos salariales, datos fiscales y regularizaciones aplicadas por la empresa.' },
    ],
  },
  salary_reverse: {
    badge: 'GUÍA DE BRUTO A NETO',
    title: 'Qué salario bruto necesitas para cobrar un neto concreto',
    mainText: [
      'La conversión de neto a bruto parte de la cantidad mensual que quieres recibir y estima el salario anual necesario para alcanzarla. El cálculo debe tener en cuenta si cobras en 12 o 14 pagas, porque la cuota mensual cambia aunque el bruto anual pueda ser idéntico.',
      'La retención de IRPF no es una tarifa plana: depende de la renta anual, los mínimos personales y familiares, la comunidad autónoma y la información fiscal comunicada a la empresa. Por eso dos personas con el mismo bruto pueden obtener netos distintos.',
      'También se descuentan las cotizaciones sociales, calculadas sobre la base correspondiente y sujetas a límites y reglas del régimen aplicable. Una oferta salarial debe compararse por bruto anual, estructura de pagas y beneficios, no solo por el neto de un mes.',
      sharedDisclaimer,
    ],
    bulletPoints: ['Define el neto mensual objetivo y el número de pagas.', 'Incluye situación familiar y comunidad autónoma en la estimación.', 'Compara el bruto anual total, no solo la nómina mensual.', 'Revisa bonus, variable y beneficios en especie por separado.'],
    faqs: [
      { question: '¿Cómo calculo el bruto necesario para un neto mensual?', answer: 'La calculadora prueba distintos salarios brutos y aplica una estimación de cotizaciones e IRPF hasta aproximarse al neto objetivo indicado.' },
      { question: '¿Puedo cobrar menos neto al subir el salario bruto?', answer: 'Una retención marginal mayor puede reducir el incremento mensual, pero en condiciones normales una subida del bruto aumenta el neto total recibido.' },
      { question: '¿Influyen las pagas extra en el bruto necesario?', answer: 'Influyen en la distribución mensual y en la percepción de liquidez. El bruto anual pactado sigue siendo la referencia principal para comparar ofertas.' },
      { question: '¿Qué datos personales modifican el resultado?', answer: 'La situación familiar, hijos, discapacidad, movilidad geográfica y comunidad autónoma pueden afectar a la retención de IRPF.' },
    ],
  },
  finiquito: {
    badge: 'GUÍA DE FINIQUITO Y DESPIDO',
    title: 'Cómo calcular el finiquito y la indemnización',
    mainText: [
      'El finiquito liquida las cantidades pendientes al terminar la relación laboral: salario de los días trabajados, vacaciones no disfrutadas, pagas extraordinarias devengadas y otros conceptos salariales. La indemnización por despido es una partida distinta y depende de la causa de extinción.',
      'Para valorar la liquidación se utiliza el salario diario y el tiempo trabajado, junto con las reglas del contrato, el convenio colectivo y el Estatuto de los Trabajadores. En un despido objetivo procedente la referencia general es de 20 días por año; el improcedente puede alcanzar 33 días por año con límites legales.',
      'Las vacaciones pendientes y las pagas extra deben calcularse según lo devengado hasta la fecha de baja. Su tratamiento fiscal y de cotización puede ser distinto del de una indemnización que cumpla los requisitos de exención.',
      sharedDisclaimer,
    ],
    bulletPoints: ['Separa finiquito, indemnización y salarios pendientes.', 'Comprueba días trabajados, vacaciones y pagas extraordinarias.', 'Revisa la causa del despido y el convenio aplicable.', 'Puedes firmar “No conforme” si necesitas revisar la liquidación.'],
    faqs: [
      { question: '¿Puedo firmar el finiquito como “No conforme”?', answer: 'Sí. Esa mención deja constancia de que no aceptas el cálculo como definitivo. Conserva una copia y solicita asesoramiento si detectas discrepancias.' },
      { question: '¿Qué incluye normalmente un finiquito?', answer: 'Suele incluir salario pendiente, vacaciones no disfrutadas, parte proporcional de pagas extra y otros conceptos devengados hasta la fecha de finalización.' },
      { question: '¿Cuál es la diferencia entre finiquito e indemnización?', answer: 'El finiquito liquida cantidades ya generadas por el trabajo. La indemnización compensa determinadas extinciones del contrato y depende de su causa y de la normativa aplicable.' },
      { question: '¿Cuándo prescribe la reclamación de cantidades?', answer: 'La reclamación de cantidades salariales suele estar sujeta a un plazo de un año, mientras que las acciones relacionadas con el despido tienen plazos más breves. Conviene actuar cuanto antes.' },
    ],
  },
  unemployment: {
    badge: 'GUÍA DE PARO Y SEPE',
    title: 'Cómo calcular la prestación por desempleo',
    mainText: [
      'La prestación contributiva por desempleo se calcula a partir de la base reguladora, normalmente obtenida con las bases de cotización por desempleo de los últimos 180 días trabajados. La duración depende del periodo cotizado dentro de los seis años anteriores.',
      'Con carácter general, se aplica el 70% de la base reguladora durante los primeros 180 días y el 60% desde el día 181. El resultado está limitado por topes mínimos y máximos vinculados al IPREM y por la existencia de responsabilidades familiares.',
      'Tener hijos o personas a cargo puede cambiar los límites aplicables y la cuantía mínima reconocida. Además, la prestación está sujeta a la cotización correspondiente y a las retenciones que procedan, por lo que el importe ingresado puede no coincidir con el cálculo bruto.',
      sharedDisclaimer,
    ],
    bulletPoints: ['Usa la base reguladora, no el último sueldo neto.', 'La duración depende de los días cotizados.', 'El 70% inicial pasa normalmente al 60% desde el día 181.', 'IPREM, topes y responsabilidades familiares condicionan la cuantía.'],
    faqs: [
      { question: '¿Cuánto es el mínimo que se cobra de paro?', answer: 'El mínimo depende del IPREM vigente y de si existen hijos o responsabilidades familiares. El SEPE aplica los topes y requisitos correspondientes al año de reconocimiento.' },
      { question: '¿Cómo afecta tener hijos a cargo?', answer: 'Las responsabilidades familiares pueden elevar el límite máximo y modificar el mínimo de la prestación, siempre que se acrediten ante el SEPE.' },
      { question: '¿Cuántos días debo tener cotizados para cobrar el paro?', answer: 'Como regla general, se necesitan 360 días cotizados por desempleo en los seis años anteriores, además de cumplir los demás requisitos de acceso.' },
      { question: '¿Cuánto tiempo tengo para solicitar la prestación?', answer: 'Con carácter general, la solicitud debe presentarse en los 15 días hábiles siguientes al último día trabajado o al final de las vacaciones pagadas y no disfrutadas.' },
    ],
  },
  irpf: {
    badge: 'GUÍA DE IRPF Y RETENCIONES',
    title: 'Cómo funcionan los tramos del IRPF',
    mainText: ['El IRPF es un impuesto progresivo: cada tipo se aplica únicamente a la parte de la base liquidable que cae dentro de un tramo. El tipo marginal no representa el porcentaje que se paga sobre toda la renta.', 'La retención de la nómina es un pago a cuenta y se calcula con ingresos previstos, mínimos personales y familiares, situación familiar y otros datos fiscales. La declaración de la renta regulariza la diferencia entre retenciones y cuota final.', 'Cambios de salario, contrato, hijos o circunstancias personales pueden provocar una regularización durante el año. Por eso la retención de una nómina no debe confundirse con el impuesto definitivo.', sharedDisclaimer],
    bulletPoints: ['Cada tramo se aplica solo a la parte correspondiente.', 'Retención e impuesto final son conceptos distintos.', 'El modelo 145 comunica datos familiares a la empresa.', 'Las regularizaciones pueden cambiar el porcentaje mensual.'],
    faqs: [
      { question: '¿Cómo funcionan los tramos de IRPF?', answer: 'La renta se divide por tramos y cada parte tributa con el tipo que corresponde a su límite. No se aplica el tipo más alto a toda la renta.' },
      { question: '¿Por qué cambia mi retención de IRPF?', answer: 'Puede cambiar por variaciones salariales, duración del contrato, pagas extra, situación familiar o regularizaciones de la previsión anual.' },
      { question: '¿La retención es lo mismo que el impuesto final?', answer: 'No. Es un anticipo. La declaración anual calcula la cuota definitiva y determina si procede pagar o devolver.' },
      { question: '¿Qué datos debo comunicar a mi empresa?', answer: 'Los datos personales y familiares que correspondan mediante el modelo 145, además de comunicar cualquier cambio relevante.' },
    ],
  },
  iva: {
    badge: 'GUÍA DE IVA',
    title: 'Cómo calcular el IVA de un precio',
    mainText: ['El IVA se calcula aplicando el tipo previsto para cada bien o servicio sobre la base imponible. En España existen un tipo general y tipos reducido y superreducido para operaciones concretas.', 'Para añadir IVA a un precio sin impuesto se multiplica la base por 1 más el tipo expresado en decimal. Para extraer la base desde un precio final se divide entre ese mismo factor.', 'En actividades profesionales hay que separar base imponible, IVA repercutido y retención de IRPF. La deducción del IVA soportado exige relación con la actividad, factura válida y registro correcto.', sharedDisclaimer],
    bulletPoints: ['Distingue precio base, IVA y precio final.', 'El tipo aplicable depende de la operación.', 'La retención de IRPF no reduce la base del IVA.', 'Conserva facturas y registros para deducir IVA soportado.'],
    faqs: [
      { question: '¿Cómo paso un precio sin IVA a precio final?', answer: 'Multiplica la base imponible por 1 más el tipo de IVA en decimal. Con un 21%, por ejemplo, el factor es 1,21.' },
      { question: '¿Cómo calculo la base de un precio con IVA?', answer: 'Divide el precio final entre 1 más el tipo aplicado. Así obtienes la base imponible y la diferencia es el IVA.' },
      { question: '¿Cuándo se aplica el 21%, 10% o 4%?', answer: 'El 21% es general; los tipos del 10% y 4% se aplican solo a bienes y servicios definidos por la normativa.' },
      { question: '¿Puedo deducir todo el IVA soportado?', answer: 'Solo el que cumpla los requisitos fiscales, esté relacionado con la actividad y quede respaldado por una factura válida y registrada.' },
    ],
  },
  autonomous_tax: {
    badge: 'GUÍA DE AUTÓNOMOS',
    title: 'Cómo calcular retenciones en una factura profesional',
    mainText: ['Una factura profesional puede incluir una retención de IRPF cuando la normativa obliga al pagador a ingresar ese importe a Hacienda por cuenta del autónomo. La retención es un pago a cuenta, no un impuesto adicional.', 'El importe líquido se obtiene sumando el IVA a la base imponible y restando la retención de IRPF. La base del IVA se calcula sobre el servicio antes de aplicar la retención.', 'El porcentaje depende de la actividad, del inicio de la actividad y de circunstancias específicas. El profesional debe declarar sus ingresos y podrá descontar las retenciones soportadas en su declaración.', sharedDisclaimer],
    bulletPoints: ['La retención habitual puede ser del 15% en muchos casos.', 'El IVA se suma y la retención se resta al líquido.', 'La retención no sustituye las obligaciones fiscales.', 'Revisa el tipo aplicable a tu actividad concreta.'],
    faqs: [
      { question: '¿Qué retención debe aparecer en una factura profesional?', answer: 'Depende de la actividad y de la situación fiscal. El 15% es habitual, pero existen tipos reducidos y excepciones.' },
      { question: '¿La retención de IRPF es un impuesto adicional?', answer: 'No. Es un pago a cuenta que el cliente ingresa en Hacienda en nombre del profesional y que se descuenta del importe líquido.' },
      { question: '¿Cómo se calcula una factura con IVA y retención?', answer: 'Suma el IVA a la base imponible y resta la retención de IRPF aplicada sobre esa base.' },
      { question: '¿Qué ocurre si mi cliente no aplica la retención?', answer: 'La obligación depende del tipo de servicio y del cliente. Debes revisar el supuesto fiscal y conservar la documentación de la operación.' },
    ],
  },
  mortgage: {
    badge: 'GUÍA DE HIPOTECAS',
    title: 'Cómo calcular la cuota de una hipoteca',
    mainText: ['La cuota hipotecaria depende del capital solicitado, el tipo de interés y el plazo. Cada pago combina intereses y amortización de capital; al principio suele pesar más la parte de intereses.', 'El TIN expresa el interés nominal, mientras que la TAE ayuda a comparar el coste efectivo al incorporar gastos y comisiones. Una hipoteca fija ofrece una cuota más estable y una variable puede cambiar en las revisiones.', 'Además de la cuota, conviene valorar entrada, impuestos, seguros, comisiones y capacidad de endeudamiento. El coste total aumenta normalmente cuanto mayor es el plazo, aunque la cuota mensual sea más baja.', sharedDisclaimer],
    bulletPoints: ['Capital, plazo y tipo determinan la cuota.', 'Compara TAE y coste total, no solo TIN.', 'El tipo variable puede cambiar la cuota futura.', 'Deja margen para ahorro y gastos imprevistos.'],
    faqs: [
      { question: '¿Cómo se calcula la cuota hipotecaria?', answer: 'Se aplica el sistema de amortización a capital, tipo de interés y número de cuotas. Cada mensualidad combina devolución de capital e intereses.' },
      { question: '¿Qué diferencia hay entre tipo fijo y variable?', answer: 'El fijo mantiene una cuota más previsible. El variable se revisa según el índice y las condiciones contratadas.' },
      { question: '¿Cuál es la diferencia entre TIN y TAE?', answer: 'El TIN es el interés nominal. La TAE incorpora gastos, comisiones y periodicidad para comparar mejor ofertas.' },
      { question: '¿Qué porcentaje de ingresos dedicar a la hipoteca?', answer: 'Como orientación prudente, la deuda mensual debe dejar margen suficiente para gastos, ahorro y posibles variaciones de ingresos o tipos.' },
    ],
  },
  personal_loan: {
    badge: 'GUÍA DE PRÉSTAMOS',
    title: 'Cómo calcular la cuota de un préstamo personal',
    mainText: ['La cuota de un préstamo personal se calcula con el capital, el tipo de interés, el plazo y la frecuencia de pago. Cada mensualidad devuelve una parte del principal y otra corresponde a intereses.', 'Alargar el plazo reduce la cuota, pero suele aumentar los intereses totales. Para comparar ofertas hay que revisar TAE, comisiones, seguros vinculados y el importe total adeudado.', 'Una amortización anticipada puede reducir plazo o cuota según el contrato. La elección depende de si priorizas pagar menos intereses o liberar capacidad mensual.', sharedDisclaimer],
    bulletPoints: ['La TAE facilita la comparación entre ofertas.', 'Más plazo suele significar más intereses totales.', 'Amortizar puede reducir cuota o duración.', 'Incluye comisiones y seguros en el coste real.'],
    faqs: [
      { question: '¿Cómo se calcula la cuota de un préstamo?', answer: 'Depende del capital, tipo, plazo y periodicidad. La cuota combina amortización del principal e intereses.' },
      { question: '¿Es mejor reducir plazo o cuota al amortizar?', answer: 'Reducir plazo suele ahorrar más intereses; reducir cuota mejora la liquidez mensual. Depende de tus objetivos.' },
      { question: '¿Qué coste debo comparar?', answer: 'Compara la TAE y el importe total adeudado, incluidos intereses, comisiones y seguros obligatorios.' },
      { question: '¿El tipo nominal es el coste final?', answer: 'No necesariamente. La TAE incorpora otros costes y es una referencia más útil para comparar préstamos.' },
    ],
  },
  compound_interest: {
    badge: 'GUÍA DE INTERÉS COMPUESTO',
    title: 'Cómo funciona el interés compuesto',
    mainText: ['El interés compuesto reinvierte los rendimientos y hace que el siguiente periodo se calcule sobre el capital inicial más los intereses acumulados. El tiempo convierte pequeñas diferencias de rentabilidad en resultados relevantes.', 'El resultado depende de la aportación inicial, aportaciones periódicas, rentabilidad estimada y frecuencia de capitalización. Las comisiones e impuestos reducen la rentabilidad efectiva.', 'Una proyección matemática no garantiza resultados: las inversiones tienen riesgo y la rentabilidad puede ser negativa. Conviene analizar distintos escenarios y no usar una única tasa como predicción.', sharedDisclaimer],
    bulletPoints: ['El tiempo y la reinversión potencian el crecimiento.', 'Aportaciones periódicas cambian la proyección.', 'Costes e impuestos reducen el resultado neto.', 'La estimación no garantiza rentabilidad futura.'],
    faqs: [
      { question: '¿Cómo funciona el interés compuesto?', answer: 'Los rendimientos se suman al capital y también generan rendimientos en los periodos siguientes.' },
      { question: '¿Qué factores influyen más?', answer: 'Capital inicial, aportaciones, rentabilidad, frecuencia de capitalización y tiempo invertido.' },
      { question: '¿Está garantizado el resultado?', answer: 'No. Es una proyección basada en una tasa supuesta y no elimina el riesgo de pérdida.' },
      { question: '¿Las comisiones afectan al cálculo?', answer: 'Sí. Reducen la rentabilidad efectiva y pueden tener un impacto importante cuando se acumulan durante muchos años.' },
    ],
  },
  inflation: {
    badge: 'GUÍA DE INFLACIÓN Y AHORRO',
    title: 'Cómo afecta la inflación a tus ahorros',
    mainText: ['La inflación mide el aumento general de los precios y reduce el poder adquisitivo del dinero. Una cantidad nominal constante puede comprar menos bienes y servicios con el paso del tiempo.', 'Para estimar el valor real de un ahorro futuro se descuenta la inflación acumulada. La comparación con una rentabilidad de ahorro o inversión debe hacerse después de costes e impuestos.', 'Planificar con escenarios de inflación ayuda a fijar objetivos realistas. Ninguna proyección sustituye la revisión periódica de ingresos, gastos y capacidad de ahorro.', sharedDisclaimer],
    bulletPoints: ['La inflación reduce el poder adquisitivo.', 'El efecto se acumula año a año.', 'Compara rentabilidad neta e inflación.', 'Revisa objetivos y aportaciones periódicamente.'],
    faqs: [
      { question: '¿Cómo afecta la inflación a mis ahorros?', answer: 'Reduce su poder adquisitivo: la misma cantidad puede comprar menos bienes y servicios en el futuro.' },
      { question: '¿Cómo calculo el valor real de un ahorro?', answer: 'Se descuenta el efecto acumulado de la inflación dividiendo el valor nominal entre 1 más la inflación elevada al número de años.' },
      { question: '¿Puede el interés compuesto compensar la inflación?', answer: 'Puede ayudar si la rentabilidad neta supera la inflación, pero existen costes, impuestos y riesgo de inversión.' },
      { question: '¿La inflación es igual todos los años?', answer: 'No. Es una tasa variable que depende de la evolución de los precios y de la economía, por lo que las simulaciones son escenarios.' },
    ],
  },
};

export const DEFAULT_CALCULATOR_SEO_CONTENT = CALCULATOR_SEO_CONTENT.salary_net;
