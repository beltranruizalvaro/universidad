
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Examen = {
  id: number | string;
  titulo: string;
  tipo: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  asignatura: string | null;
  descripcion: string | null;
};

const colores = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-orange-100 text-orange-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
];

function fechaLocal(fecha: Date) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
}

function diasRestantes(fecha: string) {
  const hoy = new Date();
  const fechaHoy = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );
  const diaExamen = new Date(`${fecha}T12:00:00`);
  diaExamen.setHours(0, 0, 0, 0);

  return Math.round(
    (diaExamen.getTime() - fechaHoy.getTime()) / 86400000
  );
}

function formatoFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Examenes() {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [titulo, setTitulo] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [fecha, setFecha] = useState(fechaLocal(new Date()));
  const [hora, setHora] = useState("");
  const [aula, setAula] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarExamenes = useCallback(async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("eventos")
      .select(
        "id,titulo,tipo,fecha,hora_inicio,hora_fin,asignatura,descripcion"
      )
      .eq("tipo", "Examen")
      .order("fecha", { ascending: true });

    if (error) {
      console.error("Error al cargar exámenes:", error);
      setMensaje(`No se pudieron cargar los exámenes: ${error.message}`);
      setCargando(false);
      return;
    }

    setExamenes((data ?? []) as Examen[]);
    setCargando(false);
  }, []);

  useEffect(() => {
    void cargarExamenes();
  }, [cargarExamenes]);

  async function anadirExamen(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!titulo.trim() || !fecha) {
      setMensaje("Introduce el nombre del examen y la fecha.");
      return;
    }

    const duplicado = examenes.some(
      (examen) =>
        examen.fecha === fecha &&
        examen.titulo.trim().toLowerCase() ===
          titulo.trim().toLowerCase() &&
        (examen.asignatura ?? "").trim().toLowerCase() ===
          asignatura.trim().toLowerCase() &&
        (examen.hora_inicio ?? "").slice(0, 5) === hora
    );

    if (duplicado) {
      setMensaje("Ese examen ya está registrado.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("eventos").insert({
      titulo: titulo.trim(),
      tipo: "Examen",
      fecha,
      hora_inicio: hora || null,
      hora_fin: null,
      asignatura: asignatura.trim() || null,
      descripcion: [
        aula.trim() ? `Aula: ${aula.trim()}` : "",
        descripcion.trim(),
      ]
        .filter(Boolean)
        .join("\n") || null,
    });

    if (error) {
      console.error("Error al añadir examen:", error);
      setMensaje(`No se pudo añadir: ${error.message}`);
      setGuardando(false);
      return;
    }

    setTitulo("");
    setAsignatura("");
    setFecha(fechaLocal(new Date()));
    setHora("");
    setAula("");
    setDescripcion("");

    await cargarExamenes();
    setMensaje("Examen añadido al calendario y a la lista.");
    setGuardando(false);
  }

  async function eliminarExamen(examen: Examen) {
    const confirmar = window.confirm(
      `¿Quieres eliminar "${examen.titulo}" del calendario y de la lista de exámenes?`
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", examen.id);

    if (error) {
      console.error("Error al eliminar examen:", error);
      setMensaje(`No se pudo eliminar: ${error.message}`);
      return;
    }

    await cargarExamenes();
    setMensaje("Examen eliminado del calendario y de la lista.");
  }

  const proximos = examenes.filter((e) => diasRestantes(e.fecha) >= 0);
  const siguiente = proximos[0];

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-gray-500">UC3M · ADE</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Exámenes
          </h1>
          <p className="mt-2 text-gray-500">
            Todos los exámenes registrados en tu calendario académico.
          </p>
        </header>

        {mensaje && (
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            {mensaje}
          </div>
        )}

        {siguiente && (
          <section className="mb-8 rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold tracking-wider text-gray-300">
              PRÓXIMO EXAMEN
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{siguiente.titulo}</h2>
                {siguiente.asignatura && (
                  <p className="mt-1 text-gray-300">
                    {siguiente.asignatura}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-300">
                  {formatoFecha(siguiente.fecha)}
                  {siguiente.hora_inicio
                    ? ` · ${siguiente.hora_inicio.slice(0, 5)}`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {diasRestantes(siguiente.fecha)}
                </p>
                <p className="text-sm text-gray-300">días restantes</p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {proximos.length > 0 ? "Próximos exámenes" : "Lista de exámenes"}
          </h2>

          {cargando ? (
            <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
              Cargando exámenes...
            </div>
          ) : examenes.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">
                Todavía no hay exámenes registrados
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Añade uno con el formulario de abajo y aparecerá también en
                el calendario.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {examenes.map((examen, indice) => {
                const dias = diasRestantes(examen.fecha);
                const aula = examen.descripcion
                  ?.split("\n")
                  .find((linea) => linea.startsWith("Aula:"));

                return (
                  <article
                    key={examen.id}
                    className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${
                            colores[indice % colores.length]
                          }`}
                        >
                          📝
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {examen.titulo}
                          </h3>
                          {examen.asignatura && (
                            <p className="mt-1 text-sm text-gray-500">
                              {examen.asignatura}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-gray-500">
                            {formatoFecha(examen.fecha)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void eliminarExamen(examen)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm">
                      <p className="text-gray-500">
                        {examen.hora_inicio
                          ? `🕐 ${examen.hora_inicio.slice(0, 5)}`
                          : "Hora sin especificar"}
                        {aula ? ` · 📍 ${aula.replace("Aula: ", "")}` : ""}
                      </p>
                      <p className="font-medium text-gray-700">
                        {dias < 0
                          ? "Fecha pasada"
                          : dias === 0
                            ? "Es hoy"
                            : `Faltan ${dias} días`}
                      </p>
                    </div>

                    {examen.descripcion &&
                      examen.descripcion
                        .split("\n")
                        .filter((linea) => !linea.startsWith("Aula:"))
                        .join("\n")
                        .trim() && (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">
                          {examen.descripcion
                            .split("\n")
                            .filter((linea) => !linea.startsWith("Aula:"))
                            .join("\n")
                            .trim()}
                        </p>
                      )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            + Añadir examen
          </h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Se guardará en Supabase y aparecerá también en el calendario.
          </p>

          <form onSubmit={anadirExamen} className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Nombre del examen *
              </span>
              <input
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Primer parcial"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Asignatura
              </span>
              <input
                value={asignatura}
                onChange={(e) => setAsignatura(e.target.value)}
                placeholder="Ej. Matemáticas Empresariales"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Fecha *
              </span>
              <input
                required
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Hora
              </span>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Aula
              </span>
              <input
                value={aula}
                onChange={(e) => setAula(e.target.value)}
                placeholder="Ej. 5.1.A.03"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Notas
              </span>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles adicionales"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "+ Añadir examen"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
