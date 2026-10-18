 import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "UC3M · ADE",
  description: "Organizador académico para estudiantes de ADE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">

        <div className="min-h-screen">

          {/* Barra lateral */}
          <aside className="fixed left-0 top-0 z-10 hidden h-screen w-64 border-r border-gray-200 bg-white md:block">

            <div className="p-6">

              {/* Logo */}
              <div className="mb-10">
                <h1 className="text-xl font-bold">
                  🎓 UC3M · ADE
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Curso 2026/27
                </p>
              </div>


              {/* Navegación */}
              <nav className="space-y-2">

                <Link
                  href="/"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  🏠 Inicio
                </Link>

                <Link
                  href="/calendario"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  📅 Calendario
                </Link>

                <Link
                  href="/horario"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  🕐 Horario
                </Link>

                <Link
                  href="/asignaturas"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  📚 Asignaturas
                </Link>

                <Link
                  href="/examenes"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  📝 Exámenes
                </Link>

                <Link
                  href="/tareas"
                  className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  ✅ Tareas
                </Link>

              </nav>

            </div>


            {/* Parte inferior */}
            <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-6">

              <p className="text-xs text-gray-400">
                UC3M · ADE
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Organizador académico
              </p>

            </div>

          </aside>


          {/* Contenido */}
          <div className="md:ml-64">
            {children}
          </div>

        </div>

      </body>
    </html>
  );
}