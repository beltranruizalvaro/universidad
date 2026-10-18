
"use client";

import { useState } from "react";

const asignaturas = [
  {
    nombre: "Introducción al Derecho Civil Patrimonial",
    codigo: "13150",
    creditos: 6,
    icono: "⚖️",
    color: "bg-blue-100",
    examenFinal: 60,
    evaluacionContinua: 40,
    evaluacion: [
      "Evaluación continua: 40 %",
      "Examen final: 60 %",
    ],
    temas: [
      "Derecho patrimonial y orden público económico",
      "Persona física y persona jurídica",
      "Contratos y obligaciones",
      "Responsabilidad civil",
      "Modalidades contractuales",
      "Propiedad, derechos reales, garantías y Registro",
      "Régimen económico matrimonial",
      "Sucesiones y empresa familiar",
    ],
    fechas: [
      "28 oct. 2026: cuestionario de los temas 1–8 (1 punto)",
      "9 dic. 2026: caso práctico de repaso (2 puntos)",
      "12 ene. 2027, 09:00–12:00: examen final",
    ],
  },
  {
    nombre: "Principios de Economía",
    codigo: "",
    creditos: 6,
    icono: "📈",
    color: "bg-green-100",
    examenFinal: 60,
    evaluacionContinua: 40,
    evaluacion: [
      "Evaluación continua: 40 %",
      "Examen final: 60 %",
      "La evaluación continua se reparte entre pruebas presenciales (60 % de la continua) y pruebas online (40 % de la continua).",
      "Se requiere al menos un 3/10 en el examen final para aprobar en la convocatoria ordinaria.",
    ],
    temas: [
      "Microeconomía",
      "Macroeconomía",
    ],
    fechas: [
      "28–31 oct. 2026: evaluación online",
      "18 nov. 2026: prueba presencial en clase",
      "7–12 dic. 2026: evaluación online",
      "11 ene. 2027, 09:00–12:00: examen final",
    ],
  },
  {
    nombre: "Matemáticas para la Economía I",
    codigo: "",
    creditos: 6,
    icono: "📐",
    color: "bg-purple-100",
    examenFinal: 60,
    evaluacionContinua: 40,
    evaluacion: [
      "Primer parcial: 20 %",
      "Segundo parcial: 20 %",
      "Examen final: 60 %",
    ],
    temas: [
      "Consulta el programa y los materiales oficiales de la asignatura.",
    ],
    fechas: [
      "15 oct. 2026: primer parcial",
      "Segundo parcial: fecha pendiente de confirmar",
      "22 dic. 2026, 09:00–12:00: examen final",
    ],
    enlaces: [
      {
        texto: "Web oficial de Matemáticas I",
        url: "https://economia.uc3m.es/docencia/MatematicasI/",
      },
      {
        texto: "Cronograma",
        url: "https://economia.uc3m.es/docencia/Mates-1-Eco/cronograma.html",
      },
      {
        texto: "Ejercicios",
        url: "https://economia.uc3m.es/docencia/Mates-1-Eco/ejercicios.html",
      },
      {
        texto: "Exámenes anteriores",
        url: "https://economia.uc3m.es/docencia/Mates-1-Eco/examenes.html",
      },
    ],
  },
  {
    nombre: "Fundamentos de Administración de Empresas",
    codigo: "13153",
    creditos: 6,
    icono: "🏢",
    color: "bg-orange-100",
    examenFinal: 50,
    evaluacionContinua: 50,
    evaluacion: [
      "Primer examen parcial: 20 %",
      "Segundo examen parcial: 20 %",
      "Prácticas: 10 %",
      "Examen final: 50 %",
    ],
    temas: [
      "Entorno empresarial y responsabilidad social",
      "Estrategia empresarial",
      "Finanzas",
      "Recursos humanos y organización",
      "Producción",
      "Marketing",
    ],
    fechas: [
      "22 oct. 2026: mini-test de 30 minutos (10 % según la información facilitada)",
      "19 nov. 2026: presentaciones",
      "3 dic. 2026: presentaciones",
      "5 dic. 2026: segundo test indicado; fecha y día pendientes de confirmar",
      "10 dic. 2026: presentaciones",
      "18 dic. 2026, 09:00–12:00: examen final",
    ],
  },
  {
    nombre: "Estrategias de Expresión",
    codigo: "19790",
    creditos: 3,
    icono: "✍️",
    color: "bg-pink-100",
    examenFinal: 0,
    evaluacionContinua: 100,
    evaluacion: [
      "Evaluación continua: 100 %",
      "Examen final: 0 %",
    ],
    temas: [
      "Inventio: elección y desarrollo del tema",
      "Dispositio: estructura y organización",
      "Memoria: preparación del discurso",
      "Elocutio: registro, lenguaje inclusivo y comunicación digital",
      "Actio: exposición oral y comunicación académica",
      "Presentaciones, debates, informes y textos académicos",
    ],
    fechas: [
      "Horario semanal: miércoles, 14:30–16:00",
      "Aula: 10.0.27",
      "Actividades y entregas: pendientes de confirmar",
    ],
  },
  {
    nombre: "Competencias Digitales para el Uso de la Información",
    codigo: "19408",
    creditos: 3,
    icono: "💻",
    color: "bg-cyan-100",
    examenFinal: 0,
    evaluacionContinua: 100,
    evaluacion: [
      "Evaluación continua: 100 %",
      "Examen final: 0 %",
    ],
    temas: [
      "Fuentes de información y desinformación",
      "Búsqueda y recuperación de información",
      "Uso ético de la información y prevención del plagio",
      "Creación y gestión de referencias bibliográficas",
      "Herramientas de análisis de originalidad",
      "Inteligencia artificial generativa: aplicaciones y fundamentos",
      "Privacidad, consentimiento, autoría y regulación de la IA",
    ],
    fechas: [
      "Horario semanal: jueves, 14:30–16:00",
      "Aula: 10.4.1",
      "Actividades y entregas: pendientes de confirmar",
    ],
  },
];

export default function Asignaturas() {
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-gray-500">
          UC3M · ADE · Curso 2026/2027
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Mis asignaturas
        </h1>

        <p className="mt-2 text-gray-600">
          Consulta tus materias, evaluación, temario y fechas importantes.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Asignaturas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {asignaturas.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Créditos totales</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {asignaturas.reduce((total, a) => total + a.creditos, 0)}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
          <p className="text-sm text-gray-500">Cuatrimestre</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            Primero
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {asignaturas.map((asignatura) => {
          const estaAbierta = abierta === asignatura.nombre;

          return (
            <article
              key={asignatura.nombre}
              className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${asignatura.color} text-2xl`}
                >
                  {asignatura.icono}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {asignatura.nombre}
                  </h2>

                  {asignatura.codigo && (
                    <p className="mt-1 text-sm text-gray-500">
                      Código UC3M: {asignatura.codigo}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-gray-600">
                    🎓 {asignatura.creditos} ECTS
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Evaluación continua</span>
                  <span className="font-semibold text-gray-900">
                    {asignatura.evaluacionContinua} %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${asignatura.evaluacionContinua}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Continua: {asignatura.evaluacionContinua} %</span>
                  <span>Final: {asignatura.examenFinal} %</span>
                </div>
              </div>

              {estaAbierta && (
                <div className="mt-6 space-y-6 border-t border-gray-200 pt-5">
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">
                      Sistema de evaluación
                    </h3>
                    <ul className="space-y-2">
                      {asignatura.evaluacion.map((item) => (
                        <li
                          key={item}
                          className="text-sm leading-6 text-gray-600"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">
                      Temario
                    </h3>
                    <ul className="space-y-2">
                      {asignatura.temas.map((tema) => (
                        <li
                          key={tema}
                          className="text-sm leading-6 text-gray-600"
                        >
                          • {tema}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">
                      Fechas importantes
                    </h3>
                    <ul className="space-y-2">
                      {asignatura.fechas.map((fecha) => (
                        <li
                          key={fecha}
                          className="text-sm leading-6 text-gray-600"
                        >
                          📅 {fecha}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {"enlaces" in asignatura && asignatura.enlaces && (
                    <div>
                      <h3 className="mb-3 font-semibold text-gray-900">
                        Materiales oficiales
                      </h3>
                      <div className="flex flex-col gap-2">
                        {asignatura.enlaces.map((enlace) => (
                          <a
                            key={enlace.url}
                            href={enlace.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
                          >
                            {enlace.texto} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setAbierta(estaAbierta ? null : asignatura.nombre)
                }
                className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                {estaAbierta ? "Ocultar información ↑" : "Ver asignatura ↓"}
              </button>
            </article>
          );
        })}
      </section>

      <p className="mt-8 text-sm leading-6 text-gray-500">
        Algunas fechas y actividades todavía están pendientes de confirmar.
        Cuando tengamos la información oficial completa, podremos actualizarla.
      </p>
    </main>
  );
}
