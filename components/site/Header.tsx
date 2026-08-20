export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="text-xl font-bold tracking-tight text-slate-900">
          CalculaTuTrabajo
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          <a href="#empleados" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Empleados
          </a>
          <a href="#autonomos" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Autónomos
          </a>
          <a href="#finanzas" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Finanzas
          </a>
        </nav>

        <a
          href="#calculadora"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Calcular
        </a>
      </div>
    </header>
  );
}
