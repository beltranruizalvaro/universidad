const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];

const horas = [
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
];

const clases = [
  {
    dia: "LUNES",
    inicio: "16:15",
    fin: "18:00",
    nombre: "Gen.-Int. Dcho. Civil Patrimonial",
    tipo: "MAGISTRAL",
    grupo: "grp. 66",
    aula: "10.2.5",
    color: "bg-blue-200",
  },
  {
    dia: "LUNES",
    inicio: "18:00",
    fin: "19:45",
    nombre: "Mag.-Principios de Economía",
    tipo: "MAGISTRAL",
    grupo: "grp. 63",
    aula: "10.2.5",
    color: "bg-orange-200",
  },
  {
    dia: "LUNES",
    inicio: "19:45",
    fin: "21:30",
    nombre: "Matemáticas Economía I",
    tipo: "MAGISTRAL",
    grupo: "grp. 78",
    aula: "10.1.5",
    color: "bg-green-200",
  },

  {
    dia: "MIÉRCOLES",
    inicio: "14:30",
    fin: "16:00",
    nombre: "Estrategias de Expresión",
    tipo: "TEORÍA",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.0.27",
    color: "bg-green-100",
  },
  {
    dia: "MIÉRCOLES",
    inicio: "16:15",
    fin: "18:00",
    nombre: "Fund. Admon. Empresas",
    tipo: "MAGISTRAL",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.2.9",
    color: "bg-green-100",
  },
  {
    dia: "MIÉRCOLES",
    inicio: "18:00",
    fin: "19:45",
    nombre: "Principios de Economía",
    tipo: "PRÁCTICAS",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.0.27",
    color: "bg-green-100",
  },
  {
    dia: "MIÉRCOLES",
    inicio: "19:45",
    fin: "21:30",
    nombre: "Gen.-Int.Dcho. Civil Patrimonial",
    tipo: "PRÁCTICAS",
    grupo: "grp. 66",
    aula: "4.1.05",
    color: "bg-blue-200",
  },

  {
    dia: "JUEVES",
    inicio: "14:30",
    fin: "16:00",
    nombre: "Competencias digitales uso informac.",
    tipo: "TEORÍA",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.4.1",
    color: "bg-green-100",
  },
  {
    dia: "JUEVES",
    inicio: "16:15",
    fin: "18:00",
    nombre: "Matemáticas Economía I",
    tipo: "PRÁCTICAS",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.4.1",
    color: "bg-green-100",
  },
  {
    dia: "JUEVES",
    inicio: "18:00",
    fin: "19:45",
    nombre: "Fund. Admon. Empresas",
    tipo: "PRÁCTICAS",
    grupo: "grp.78 1º, Cuatr.1",
    aula: "10.2.9",
    color: "bg-green-100",
  },
];

function convertirMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function filaInicio(hora: string) {
  const inicio = convertirMinutos("14:00");
  const actual = convertirMinutos(hora);

  return (actual - inicio) / 15 + 1;
}

function numeroFilas(inicio: string, fin: string) {
  return (
    (convertirMinutos(fin) - convertirMinutos(inicio)) / 15
  );
}

export default function Horario() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">

      {/* CABECERA */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500">
          UC3M
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Horario · ADE
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Curso 2026/2027 · 1er cuatrimestre
        </p>
      </div>

      {/* HORARIO */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 bg-white shadow-sm">
        <div className="min-w-[1200px]">

          {/* CABECERA DE DÍAS */}
          <div
            className="grid border-b border-gray-400"
            style={{
              gridTemplateColumns: "90px repeat(5, 1fr)",
            }}
          >
            <div className="bg-gray-100" />

            {dias.map((dia) => (
              <div
                key={dia}
                className="border-l border-gray-400 bg-violet-100 py-3 text-center text-xs font-bold text-gray-900"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* CUERPO */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "90px repeat(5, 1fr)",
            }}
          >

            {/* HORAS */}
            <div className="relative">
              {horas.slice(0, -1).map((hora, index) => (
                <div
                  key={hora}
                  className="flex items-start justify-center border-b border-gray-400 bg-gray-50 text-[11px] font-semibold text-gray-800"
                  style={{
                    height: "28px",
                  }}
                >
                  <span className="mt-1">{hora}</span>
                </div>
              ))}
            </div>

            {/* COLUMNAS DE DÍAS */}
            {dias.map((dia) => (
              <div
                key={dia}
                className="relative border-l border-gray-400"
              >

                {/* CUADRÍCULA DE 15 MINUTOS */}
                {horas.slice(0, -1).map((hora) => (
                  <div
                    key={hora}
                    className="border-b border-gray-300"
                    style={{
                      height: "28px",
                    }}
                  />
                ))}

                {/* CLASES */}
                {clases
                  .filter((clase) => clase.dia === dia)
                  .map((clase) => {
                    const fila = filaInicio(clase.inicio);
                    const filas = numeroFilas(
                      clase.inicio,
                      clase.fin
                    );

                    return (
                      <div
                        key={`${clase.dia}-${clase.inicio}-${clase.nombre}`}
                        className={`absolute left-0 right-0 overflow-hidden border border-gray-500 ${clase.color} p-2`}
                        style={{
                          top: `${(fila - 1) * 28}px`,
                          height: `${filas * 28}px`,
                        }}
                      >
                        <p className="text-[9px] font-bold text-blue-900">
                          {clase.tipo}
                        </p>

                        <p className="mt-1 text-[13px] font-bold leading-tight text-gray-900">
                          {clase.nombre}
                        </p>

                        <p className="mt-1 text-[10px] leading-tight text-gray-700">
                          {clase.grupo}
                        </p>

                        <p className="mt-2 text-[9px] font-semibold text-blue-800">
                          Aula {clase.aula}
                        </p>

                        <p className="text-[9px] text-gray-600">
                          {clase.inicio} - {clase.fin}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="mt-5 flex flex-wrap gap-3">

        <div className="rounded-lg bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
          🔵 Derecho Civil
        </div>

        <div className="rounded-lg bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
          🟠 Economía
        </div>

        <div className="rounded-lg bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
          🟢 Matemáticas
        </div>

        <div className="rounded-lg bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
          🟢 Administración / Competencias
        </div>

      </div>
    </main>
  );
}