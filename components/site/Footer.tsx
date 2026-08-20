export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">CalculaTuTrabajo</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Herramientas financieras sencillas para comprender mejor tus números.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Empresa</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#sobre-nosotros" className="hover:text-slate-900">Sobre nosotros</a></li>
            <li><a href="#contacto" className="hover:text-slate-900">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#aviso-legal" className="hover:text-slate-900">Aviso legal</a></li>
            <li><a href="#privacidad" className="hover:text-slate-900">Privacidad</a></li>
            <li><a href="#cookies" className="hover:text-slate-900">Cookies</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#empleados" className="hover:text-slate-900">Empleados</a></li>
            <li><a href="#autonomos" className="hover:text-slate-900">Autónomos</a></li>
            <li><a href="#finanzas" className="hover:text-slate-900">Finanzas</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>© 2026 CalculaTuTrabajo</p>
          <p>Hecho para ayudarte a entender mejor tus finanzas.</p>
        </div>
      </div>
    </footer>
  );
}
