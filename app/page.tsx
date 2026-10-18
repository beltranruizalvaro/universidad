
const accesos = [
  {
    nombre: "Calendario",
    descripcion: "Clases, exámenes, entregas y eventos.",
    icono: "📅",
    href: "/calendario",
    boton: "Ver calendario",
    color: "bg-blue-50",
  },
  {
    nombre: "Horario",
    descripcion: "Consulta y organiza tu horario semanal.",
    icono: "🗓️",
    href: "/horario",
    boton: "Ver horario",
    color: "bg-purple-50",
  },
  {
    nombre: "Tareas",
    descripcion: "Organiza trabajos, prácticas y entregas.",
    icono: "✅",
    href: "/tareas",
    boton: "Ver tareas",
    color: "bg-green-50",
  },
  {
    nombre: "Exámenes",
    descripcion: "Consulta las fechas de tus próximos exámenes.",
    icono: "📝",
    href: "/examenes",
    boton: "Ver exámenes",
    color: "bg-orange-50",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabecera */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                UC3M · ADE
              </h1>
            </div>

            <p className="mt-2 text-gray-500">
              Tu espacio académico para organizar la universidad.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://aulaglobal.uc3m.es/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Aula Global de la Universidad Carlos III de Madrid"
              title="Abrir Aula Global"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-sm font-extrabold tracking-tight text-white">
                UC3M
              </span>
              <span className="text-left">
                <span className="block font-semibold text-gray-900">
                  Universidad Carlos III
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Abrir Aula Global ↗
                </span>
              </span>
            </a>

            <div className="hidden rounded-2xl bg-white px-5 py-4 shadow-sm sm:block">
              <p className="text-sm text-gray-500">Curso académico</p>
              <p className="mt-1 font-bold text-gray-900">2026 / 27</p>
            </div>
          </div>
        </header>

        {/* Introducción */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Tu panel de control
          </h2>
          <p className="mt-1 text-gray-500">
            Accede rápidamente a tus herramientas de organización.
          </p>
        </section>

        {/* Accesos principales */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {accesos.map((acceso) => (
            <article
              key={acceso.nombre}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${acceso.color}`}
              >
                {acceso.icono}
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {acceso.nombre}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {acceso.descripcion}
              </p>

              <a
                href={acceso.href}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                {acceso.boton} →
              </a>
            </article>
          ))}
        </section>

        {/* Acceso a Aula Global */}
        <section className="mt-8 overflow-hidden rounded-2xl bg-blue-950 p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                Tu universidad
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Aula Global UC3M
              </h2>
              <p className="mt-2 leading-6 text-blue-100">
                Accede al campus virtual para consultar tus asignaturas,
                materiales, avisos y actividades.
              </p>
            </div>

            <a
              href="https://aulaglobal.uc3m.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-950 transition hover:bg-blue-50"
            >
              Entrar en Aula Global ↗
            </a>
          </div>
        </section>

        <footer className="mt-10 pb-4 text-center text-sm text-gray-400">
          Organizador universitario · ADE · Curso 2026 / 27
        </footer>
      </div>
    </main>
  );
}
