export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Contacto</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Contacto</h1>
        <p className="mt-6 text-sm leading-7 text-slate-600">
          Si necesitas más información, asesoramiento o quieres colaborar con nuestra web, puedes contactar con nosotros a través del correo electrónico.
        </p>
        <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Email</p>
          <p className="mt-2">contacto@calculatutrabajo.es</p>
        </div>
      </div>
    </main>
  );
}
