export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Aviso legal</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Aviso Legal</h1>
        <p className="mt-6 text-sm leading-7 text-slate-600">
          El presente sitio web tiene finalidad informativa y de apoyo para cálculos orientativos en materia laboral y fiscal en España.
          Los resultados obtenidos son estimaciones prácticas y no sustituyen el asesoramiento profesional específico de un abogado,
          asesor fiscal o gestor laboral.
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          CalculaTuTrabajo no garantiza la exactitud absoluta de los datos en cada caso concreto ni se responsabiliza por decisiones
          tomadas sobre la base de los cálculos sin revisión profesional. Se recomienda contrastar toda información relevante con fuentes
          oficiales y profesionales autorizados.
        </p>
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          <p>Propiedad del sitio: CalculaTuTrabajo.</p>
          <p className="mt-2">Contacto: contacto@calculatutrabajo.es</p>
        </div>
      </div>
    </main>
  );
}
