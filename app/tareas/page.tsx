
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Estado = "Pendiente" | "En progreso" | "Completada";

type Tarea = {
  id: number;
  titulo: string;
  asignatura: string | null;
  descripcion: string | null;
  fecha_entrega: string | null;
  estado: Estado;
};

const estados: Estado[] = ["Pendiente", "En progreso", "Completada"];

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState("Todas");
  const [titulo, setTitulo] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarTareas = useCallback(async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("tareas")
      .select("id, titulo, asignatura, descripcion, fecha_entrega, estado")
      .order("id", { ascending: false });

    if (error) {
      setMensaje(`No se pudieron cargar las tareas: ${error.message}`);
    } else {
      setTareas((data ?? []) as Tarea[]);
      setMensaje("");
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    void cargarTareas();
  }, [cargarTareas]);

  async function anadirTarea(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!titulo.trim()) {
      setMensaje("Escribe el título de la tarea.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("tareas").insert({
      titulo: titulo.trim(),
      asignatura: asignatura.trim() || null,
      descripcion: descripcion.trim() || null,
      fecha_entrega: fecha || null,
      estado: "Pendiente",
    });

    if (error) {
      setMensaje(`No se pudo guardar la tarea: ${error.message}`);
      setGuardando(false);
      return;
    }

    setTitulo("");
    setAsignatura("");
    setDescripcion("");
    setFecha("");
    setMostrarFormulario(false);
    await cargarTareas();
    setGuardando(false);
  }

  async function cambiarEstado(id: number, estado: Estado) {
    setMensaje("");

    const { error } = await supabase
      .from("tareas")
      .update({ estado })
      .eq("id", id);

    if (error) {
      setMensaje(`No se pudo cambiar el estado: ${error.message}`);
      return;
    }

    await cargarTareas();
  }

  async function eliminarTarea(id: number) {
    if (!window.confirm("¿Quieres eliminar esta tarea para todos?")) return;

    setMensaje("");

    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(`No se pudo eliminar la tarea: ${error.message}`);
      return;
    }

    await cargarTareas();
  }

  const tareasFiltradas = tareas.filter(
    (tarea) => filtro === "Todas" || tarea.estado === filtro
  );

  const pendientes = tareas.filter((t) => t.estado === "Pendiente").length;
  const enProgreso = tareas.filter((t) => t.estado === "En progreso").length;
  const completadas = tareas.filter((t) => t.estado === "Completada").length;

  const tarjeta: React.CSSProperties = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  };

  const boton: React.CSSProperties = {
    border: "none",
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const campo: React.CSSProperties = {
    width: "100%",
    padding: 11,
    border: "1px solid #d1d5db",
    borderRadius: 9,
    marginTop: 6,
    boxSizing: "border-box",
    background: "white",
    color: "#111827",
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 28, color: "#111827" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <p style={{ color: "#64748b", margin: "0 0 6px" }}>UC3M · ADE</p>
          <h1 style={{ fontSize: 32, margin: 0 }}>Mis tareas</h1>
          <p style={{ color: "#64748b", marginBottom: 0 }}>
            Organiza y comparte el trabajo con tus compañeros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setMensaje("");
          }}
          style={{ ...boton, background: "#172554", color: "white" }}
        >
          {mostrarFormulario ? "Cancelar" : "+ Nueva tarea"}
        </button>
      </div>

      {mensaje && (
        <div role="alert" style={{ background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", borderRadius: 10, padding: 14, marginBottom: 18, overflowWrap: "anywhere" }}>
          {mensaje}
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={anadirTarea} style={{ ...tarjeta, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Añadir tarea</h2>

          <label>
            Título *
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Entregar trabajo de Economía"
              style={campo}
            />
          </label>

          <label style={{ display: "block", marginTop: 14 }}>
            Asignatura
            <input
              value={asignatura}
              onChange={(e) => setAsignatura(e.target.value)}
              placeholder="Nombre de la asignatura"
              style={campo}
            />
          </label>

          <label style={{ display: "block", marginTop: 14 }}>
            Fecha de entrega
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={campo}
            />
          </label>

          <label style={{ display: "block", marginTop: 14 }}>
            Descripción
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles de la tarea (opcional)"
              rows={3}
              style={campo}
            />
          </label>

          <button
            type="submit"
            disabled={guardando}
            style={{ ...boton, background: "#172554", color: "white", marginTop: 18, opacity: guardando ? 0.6 : 1 }}
          >
            {guardando ? "Guardando..." : "Guardar tarea"}
          </button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={tarjeta}>
          <p style={{ color: "#64748b", margin: 0 }}>Total de tareas</p>
          <p style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 0" }}>{tareas.length}</p>
        </div>
        <div style={tarjeta}>
          <p style={{ color: "#64748b", margin: 0 }}>Pendientes</p>
          <p style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 0" }}>{pendientes}</p>
        </div>
        <div style={tarjeta}>
          <p style={{ color: "#64748b", margin: 0 }}>En progreso</p>
          <p style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 0" }}>{enProgreso}</p>
        </div>
        <div style={tarjeta}>
          <p style={{ color: "#64748b", margin: 0 }}>Completadas</p>
          <p style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 0" }}>{completadas}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {["Todas", ...estados].map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => setFiltro(opcion)}
            style={{
              ...boton,
              background: filtro === opcion ? "#172554" : "white",
              color: filtro === opcion ? "white" : "#374151",
              border: filtro === opcion ? "1px solid #172554" : "1px solid #e5e7eb",
            }}
          >
            {opcion}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ color: "#64748b" }}>Cargando tareas...</p>
      ) : tareasFiltradas.length === 0 ? (
        <div style={{ ...tarjeta, textAlign: "center", padding: 36 }}>
          <h3>No hay tareas que mostrar</h3>
          <p style={{ color: "#64748b" }}>
            Añade una tarea o selecciona otro filtro.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {tareasFiltradas.map((tarea) => (
            <article key={tarea.id} style={tarjeta}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 240px" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>{tarea.titulo}</h3>
                  {tarea.asignatura && (
                    <p style={{ margin: "4px 0", color: "#475569" }}>{tarea.asignatura}</p>
                  )}
                  {tarea.fecha_entrega && (
                    <p style={{ margin: "4px 0", color: "#475569" }}>
                      Fecha de entrega: {new Date(`${tarea.fecha_entrega}T12:00:00`).toLocaleDateString("es-ES")}
                    </p>
                  )}
                  {tarea.descripcion && (
                    <p style={{ margin: "10px 0 0", color: "#64748b", whiteSpace: "pre-wrap" }}>{tarea.descripcion}</p>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
                  <label style={{ fontSize: 13, color: "#64748b" }}>
                    Estado
                    <select
                      value={estados.includes(tarea.estado) ? tarea.estado : "Pendiente"}
                      onChange={(e) => cambiarEstado(tarea.id, e.target.value as Estado)}
                      style={campo}
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => eliminarTarea(tarea.id)}
                    style={{ ...boton, background: "#fff1f2", color: "#be123c" }}
                  >
                    Eliminar tarea
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
