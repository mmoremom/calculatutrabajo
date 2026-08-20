export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Privacidad</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Política de Privacidad</h1>
        <p className="mt-6 text-sm leading-7 text-slate-600">
          Este sitio puede recopilar información de navegación y datos de uso para mejorar la experiencia del usuario y analizar el tráfico.
          Los datos se tratan con fines estadísticos y de servicio, y no se venden a terceros para usos comerciales.
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          En caso de contactar con nosotros a través de formularios o correo electrónico, solo utilizaremos la información para responder a la consulta,
          gestionar solicitudes o prestar servicios asociados a la herramienta.
        </p>
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          <p>Responsable del tratamiento: CalculaTuTrabajo.</p>
          <p className="mt-2">Se pueden ejercer derechos de acceso, rectificación y oposición en contacto@calculatutrabajo.es</p>
        </div>
      </div>
    </main>
  );
}
