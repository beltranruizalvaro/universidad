
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Evento = {
  id: number | string;
  titulo: string;
  tipo: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  asignatura: string | null;
  descripcion: string | null;
};

const tipos = [
  "Examen",
  "Evaluación",
  "Presentación",
  "Actividad",
  "Festivo",
  "Aviso",
  "Clase",
  "Entrega",
  "Recordatorio",
];

const colores: Record<string, string> = {
  Examen: "bg-red-100 text-red-800 border-red-200",
  Evaluación: "bg-orange-100 text-orange-800 border-orange-200",
  Presentación: "bg-purple-100 text-purple-800 border-purple-200",
  Actividad: "bg-green-100 text-green-800 border-green-200",
  Festivo: "bg-pink-100 text-pink-800 border-pink-200",
  Aviso: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Clase: "bg-blue-100 text-blue-800 border-blue-200",
  Entrega: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Recordatorio: "bg-gray-100 text-gray-800 border-gray-200",
};

function fechaLocal(fecha: Date) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
}

function claveEvento(e: Evento) {
  return [
    e.fecha,
    e.titulo.trim().toLowerCase(),
    e.tipo,
    e.hora_inicio ?? "",
    e.hora_fin ?? "",
    (e.asignatura ?? "").trim().toLowerCase(),
  ].join("|");
}

export default function Calendario() {
  const hoy = new Date();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mes, setMes] = useState(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  );
  const [seleccionada, setSeleccionada] = useState(fechaLocal(hoy));
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<number | string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("Examen");
  const [fecha, setFecha] = useState(fechaLocal(hoy));
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarEventos = useCallback(async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("eventos")
      .select(
        "id,titulo,tipo,fecha,hora_inicio,hora_fin,asignatura,descripcion"
      )
      .order("fecha", { ascending: true });

    if (error) {
      console.error(error);
      setMensaje(`Error al cargar eventos: ${error.message}`);
      setCargando(false);
      return;
    }

    // Oculta copias idénticas sin borrar nada de la base de datos.
    const unicos = new Map<string, Evento>();

    for (const evento of (data ?? []) as Evento[]) {
      const clave = claveEvento(evento);
      if (!unicos.has(clave)) unicos.set(clave, evento);
    }

    setEventos(Array.from(unicos.values()));
    setCargando(false);
  }, []);

  useEffect(() => {
    void cargarEventos();
  }, [cargarEventos]);

  function limpiarFormulario() {
    setEditando(null);
    setTitulo("");
    setTipo("Examen");
    setFecha(seleccionada);
    setHoraInicio("");
    setHoraFin("");
    setAsignatura("");
    setDescripcion("");
  }

  function prepararEdicion(e: Evento) {
    setEditando(e.id);
    setTitulo(e.titulo);
    setTipo(e.tipo);
    setFecha(e.fecha);
    setHoraInicio(e.hora_inicio ?? "");
    setHoraFin(e.hora_fin ?? "");
    setAsignatura(e.asignatura ?? "");
    setDescripcion(e.descripcion ?? "");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function guardarEvento(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!titulo.trim() || !fecha) {
      setMensaje("Introduce un título y una fecha.");
      return;
    }

    const nuevo = {
      titulo: titulo.trim(),
      tipo,
      fecha,
      hora_inicio: horaInicio || null,
      hora_fin: horaFin || null,
      asignatura: asignatura.trim() || null,
      descripcion: descripcion.trim() || null,
    };

    const candidato: Evento = { ...nuevo, id: editando ?? "nuevo" };

    const repetido = eventos.some(
      (e) =>
        String(e.id) !== String(editando ?? "") &&
        claveEvento(e) === claveEvento(candidato)
    );

    if (repetido) {
      setMensaje("Ya existe un evento con esos mismos datos.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const resultado =
      editando !== null
        ? await supabase.from("eventos").update(nuevo).eq("id", editando)
        : await supabase.from("eventos").insert(nuevo);

    if (resultado.error) {
      console.error(resultado.error);
      setMensaje(`No se pudo guardar: ${resultado.error.message}`);
      setGuardando(false);
      return;
    }

    const eraEdicion = editando !== null;
    await cargarEventos();
    limpiarFormulario();
    setSeleccionada(fecha);
    setMensaje(eraEdicion ? "Evento actualizado." : "Evento añadido.");
    setGuardando(false);
  }

  async function borrarEvento(e: Evento) {
    if (!window.confirm(`¿Quieres borrar "${e.titulo}"?`)) return;

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", e.id);

    if (error) {
      setMensaje(`No se pudo borrar: ${error.message}`);
      return;
    }

    await cargarEventos();
    setMensaje("Evento eliminado.");
  }

  const diasMes = new Date(
    mes.getFullYear(),
    mes.getMonth() + 1,
    0
  ).getDate();

  const huecos = (new Date(
    mes.getFullYear(),
    mes.getMonth(),
    1
  ).getDay() + 6) % 7;

  const celdas: (number | null)[] = [
    ...Array(huecos).fill(null),
    ...Array.from({ length: diasMes }, (_, i) => i + 1),
  ];

  while (celdas.length % 7 !== 0) celdas.push(null);

  const eventosDia = eventos.filter((e) => e.fecha === seleccionada);

  const nombreMes = mes.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  function irMes(cambio: number) {
    setMes(new Date(mes.getFullYear(), mes.getMonth() + cambio, 1));
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Universidad · ADE
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Calendario académico
          </h1>
          <p className="mt-2 text-gray-500">
            Exámenes, entregas, presentaciones y fechas importantes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarEventos()}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-50"
        >
          ↻ Actualizar
        </button>
      </header>

      {mensaje && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          {mensaje}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 md:p-6">
          <div>
            <h2 className="text-2xl font-bold capitalize text-gray-900">
              {nombreMes}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {eventos.length} eventos registrados
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMes(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
                setSeleccionada(fechaLocal(hoy));
                setFecha(fechaLocal(hoy));
              }}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => irMes(-1)}
              aria-label="Mes anterior"
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => irMes(1)}
              aria-label="Mes siguiente"
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b bg-gray-50 text-center text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className="py-3">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {celdas.map((dia, i) => {
            if (dia === null) {
              return (
                <div
                  key={`hueco-${i}`}
                  className="min-h-20 border-b border-r border-gray-100 bg-gray-50/50 sm:min-h-28 md:min-h-32"
                />
              );
            }

            const fechaDia = fechaLocal(
              new Date(mes.getFullYear(), mes.getMonth(), dia)
            );
            const delDia = eventos.filter((e) => e.fecha === fechaDia);
            const activo = seleccionada === fechaDia;
            const esHoy = fechaDia === fechaLocal(hoy);

            return (
              <button
                type="button"
                key={fechaDia}
                onClick={() => {
                  setSeleccionada(fechaDia);
                  setFecha(fechaDia);
                }}
                className={`min-w-0 border-b border-r border-gray-100 p-1.5 text-left transition sm:p-2 ${
                  activo ? "bg-blue-50 ring-2 ring-inset ring-blue-500" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    esHoy
                      ? "bg-blue-600 font-bold text-white"
                      : "font-semibold text-gray-700"
                  }`}
                >
                  {dia}
                </span>

                <div className="mt-1 space-y-1">
                  {delDia.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      title={e.titulo}
                      className={`truncate rounded-md border px-1 py-1 text-[10px] font-medium sm:text-xs ${
                        colores[e.tipo] ?? colores.Recordatorio
                      }`}
                    >
                      {e.hora_inicio ? `${e.hora_inicio.slice(0, 5)} ` : ""}
                      {e.titulo}
                    </div>
                  ))}
                  {delDia.length > 3 && (
                    <p className="px-1 text-[10px] font-semibold text-gray-500 sm:text-xs">
                      +{delDia.length - 3} más
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Eventos del día
          </h2>
          <p className="mb-5 mt-1 text-sm capitalize text-gray-500">
            {new Date(`${seleccionada}T12:00:00`).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {cargando ? (
            <p className="text-sm text-gray-500">Cargando eventos...</p>
          ) : eventosDia.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="font-medium text-gray-700">Día libre</p>
              <p className="mt-1 text-sm text-gray-500">
                No hay eventos registrados para esta fecha.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventosDia.map((e) => (
                <article
                  key={e.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          colores[e.tipo] ?? colores.Recordatorio
                        }`}
                      >
                        {e.tipo}
                      </span>
                      <h3 className="mt-2 font-bold text-gray-900">
                        {e.titulo}
                      </h3>
                      {e.asignatura && (
                        <p className="mt-1 text-sm text-gray-600">
                          {e.asignatura}
                        </p>
                      )}
                      {(e.hora_inicio || e.hora_fin) && (
                        <p className="mt-2 text-sm text-gray-500">
                          ◷ {e.hora_inicio?.slice(0, 5) || "Sin hora"}
                          {e.hora_fin ? ` – ${e.hora_fin.slice(0, 5)}` : ""}
                        </p>
                      )}
                      {e.descripcion && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                          {e.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => prepararEdicion(e)}
                        className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void borrarEvento(e)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editando !== null ? "Editar evento" : "Nuevo evento"}
          </h2>
          <p className="mb-5 mt-1 text-sm text-gray-500">
            Los cambios se guardarán en el calendario compartido.
          </p>

          <form onSubmit={guardarEvento} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                Título *
              </span>
              <input
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Examen de Matemáticas"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                Tipo de evento
              </span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              >
                {tipos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                Fecha *
              </span>
              <input
                required
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Hora inicio
                </span>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Hora fin
                </span>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                Asignatura
              </span>
              <input
                value={asignatura}
                onChange={(e) => setAsignatura(e.target.value)}
                placeholder="Ej. Matemáticas"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                Descripción
              </span>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles adicionales..."
                className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5"
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {guardando
                  ? "Guardando..."
                  : editando !== null
                    ? "Guardar cambios"
                    : "Añadir evento"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-xl border px-4 py-3 font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-bold text-gray-900">Leyenda</h2>
        <div className="flex flex-wrap gap-2">
          {tipos.map((t) => (
            <span
              key={t}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                colores[t] ?? colores.Recordatorio
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-gray-500">
        Calendario compartido mediante Supabase. Los eventos se cargan al
        entrar y al pulsar «Actualizar». No se crean eventos iniciales
        automáticamente, para evitar inserciones duplicadas.
      </p>
    </main>
  );
}
