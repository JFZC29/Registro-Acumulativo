# Generator for responsive index.html and admin.html
import os

def save_file(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Saved:", path)

html_parts = []
def h(chunk): html_parts.append(chunk)h("""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Registro Acumulativo General - DECE (2026 - 2027)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/pdf-format.css">
  <style>
    .stepper-scroll { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
    .stepper-scroll::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 antialiased">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2.5 sm:space-x-3">
        <img src="/assets/logo.svg" alt="DECE Logo" class="w-8 h-8 sm:w-10 sm:h-10">
        <div>
          <h1 class="text-xs sm:text-base font-bold text-slate-900 leading-tight">DEPARTAMENTO DE CONSEJERÍA ESTUDIANTIL</h1>
          <p class="text-[10px] sm:text-xs text-slate-500 font-medium">Registro Acumulativo General · 2026 - 2027</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <a href="/admin.html" class="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition">
          🛡️ <span class="hidden sm:inline ml-1">Panel</span> Admin
        </a>
      </div>
    </div>
  </header>
  <main class="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-900 text-white p-3.5 sm:p-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-1">Formulario Oficial en Línea</span>
            <h2 class="text-base sm:text-xl font-bold">Ficha de Registro Acumulativo</h2>
          </div>
          <div class="text-right hidden sm:block">
            <span class="text-xs text-slate-400">Guarda automáticamente tu progreso</span>
          </div>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4 sm:mb-5">
          <div id="step-progress-bar" class="bg-blue-500 h-full transition-all duration-300" style="width: 0%;"></div>
        </div>
        <div class="stepper-scroll">
          <div class="flex sm:grid sm:grid-cols-7 gap-2 min-w-max sm:min-w-0 pb-1">
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="1">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-blue-600 text-white ring-4 ring-blue-100 shadow">1</div>
              <span class="step-label text-[11px] sm:text-xs font-semibold text-blue-400 mt-1 whitespace-nowrap">1. Identificación</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="2">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">2</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">2. Familiares</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="3">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">3</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">3. Referencias</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="4">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">4</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">4. Socioeconómico</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="5">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">5</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">5. Salud</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="6">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">6</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">6. Académico</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center px-2 sm:px-0" data-step="7">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">7</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">7. Historia Vital</span>
            </button>
          </div>
        </div>
      </div>
      <form id="cumulativeRecordForm" class="p-4 sm:p-6">
""")h("""
        <!-- STEP 1: DATOS DE IDENTIFICACIÓN -->
        <div id="step-1" class="form-section-step space-y-4 sm:space-y-6">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center text-xs font-bold">1</span>
              DATOS DE IDENTIFICACIÓN / INFORMACIÓN
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Información básica del estudiante y croquis de ubicación del domicilio.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-slate-700 mb-1">ESTUDIANTE (Apellidos y Nombres) <span class="text-red-500">*</span></label>
              <input type="text" id="est_nombre" required class="form-input-clean text-sm" placeholder="Ej. PÉREZ MOREIRA JUAN ANDRÉS">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">NACIONALIDAD</label>
              <input type="text" id="est_nacionalidad" class="form-input-clean text-sm" value="Ecuatoriana" placeholder="Ej. Ecuatoriana">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">N° IDENTIFICACIÓN (Cédula) <span class="text-red-500">*</span></label>
              <input type="text" id="est_identificacion" required class="form-input-clean text-sm font-mono" placeholder="Ej. 1723456789">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">FECHA DE NACIMIENTO</label>
              <input type="date" id="est_fecha_nacimiento" class="form-input-clean text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">EDAD</label>
              <input type="number" id="est_edad" class="form-input-clean text-sm" placeholder="Calculado auto">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">CURSO / PARALELO</label>
              <input type="text" id="est_curso" class="form-input-clean text-sm" placeholder="Ej. 10mo EGB 'A'">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">GRUPO ÉTNICO</label>
              <input type="text" id="est_grupo_etnico" class="form-input-clean text-sm" placeholder="Ej. Mestizo, Afroecuatoriano">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">TELÉFONO CONVENCIONAL</label>
              <input type="tel" id="est_telefono" class="form-input-clean text-sm" placeholder="Ej. 022345678">
            </div>
          </div>

          <!-- Domicilio y Croquis -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">DOMICILIO (Dirección exacta y referencia)</label>
                <textarea id="est_domicilio" rows="3" class="form-input-clean text-sm" placeholder="Ej. Calle Los Álamos N45-12 y Av. Amazonas..."></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">CELULAR DE CONTACTO</label>
                <input type="tel" id="est_celular" class="form-input-clean text-sm font-mono" placeholder="Ej. 0991234567">
              </div>
            </div>

            <!-- Interactive Croquis Canvas -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-slate-700">CROQUIS UBICACIÓN DE LA CASA</label>
                <div class="text-[11px] text-slate-500">Dibuja o sube imagen</div>
              </div>
              
              <!-- Toolbar -->
              <div class="flex flex-wrap items-center gap-1 mb-2 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                <button type="button" class="croquis-tool-btn px-2 py-1 rounded bg-blue-600 text-white font-medium" data-tool="pen">✏️ Lápiz</button>
                <button type="button" class="croquis-tool-btn px-2 py-1 rounded text-slate-700 hover:bg-slate-100 font-medium" data-tool="line">📏 Línea</button>
                <button type="button" class="croquis-tool-btn px-2 py-1 rounded text-slate-700 hover:bg-slate-100 font-medium" data-tool="rect">⬜ Cuadra</button>
                <button type="button" class="croquis-tool-btn px-2 py-1 rounded text-slate-700 hover:bg-slate-100 font-medium" data-tool="text">🔤 Texto</button>
                <button type="button" class="croquis-tool-btn px-2 py-1 rounded text-slate-700 hover:bg-slate-100 font-medium" data-tool="eraser">🧹 Borrador</button>
                <button type="button" id="btn-undo-croquis" class="px-2 py-1 rounded text-slate-700 hover:bg-slate-100">↩️ Deshacer</button>
                <button type="button" id="btn-clear-croquis" class="px-2 py-1 rounded text-red-600 hover:bg-red-50">🗑️ Limpiar</button>
              </div>

              <!-- Canvas Board -->
              <div class="canvas-container overflow-hidden rounded border border-slate-300">
                <canvas id="croquisCanvas" width="460" height="200" class="w-full h-auto bg-white block"></canvas>
              </div>

              <!-- Upload File Option -->
              <div class="mt-2 flex items-center justify-between text-xs">
                <label class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                  📁 Cargar imagen / captura de mapa
                  <input type="file" id="croquis-file-input" accept="image/*" class="hidden">
                </label>
              </div>
            </div>
          </div>

          <!-- Step 1 Footer -->
          <div class="flex justify-end pt-3 sm:pt-4 border-t border-slate-100">
            <button type="button" class="btn-next-step w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
              Siguiente: Datos Familiares ➔
            </button>
          </div>
        </div>

        <!-- STEP 2: DATOS FAMILIARES -->
        <div id="step-2" class="form-section-step space-y-4 sm:space-y-6 hidden">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center text-xs font-bold">2</span>
              DATOS FAMILIARES
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Madre, Padre y Representante Legal / Cuidador / Tutor.</p>
          </div>

          <!-- Madre -->
          <div class="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-2">👩 DATOS DE LA MADRE</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div class="sm:col-span-2">
                <label class="block font-semibold text-slate-600 mb-1">Nombre de la madre</label>
                <input type="text" id="madre_nombre" class="form-input-clean" placeholder="Nombres y Apellidos">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Edad</label>
                <input type="number" id="madre_edad" class="form-input-clean" placeholder="Edad">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Estado civil</label>
                <select id="madre_estado_civil" class="form-input-clean">
                  <option value="">Seleccione...</option>
                  <option value="Soltera">Soltera</option>
                  <option value="Casada">Casada</option>
                  <option value="Unión Libre">Unión Libre</option>
                  <option value="Divorciada">Divorciada</option>
                  <option value="Viuda">Viuda</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div><label class="block font-semibold text-slate-600 mb-1">Instrucción</label><input type="text" id="madre_instruccion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Profesión / Ocupación</label><input type="text" id="madre_profesion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Lugar de trabajo</label><input type="text" id="madre_lugar_trabajo" class="form-input-clean"></div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Teléfonos de contacto</label>
              <input type="text" id="madre_telefonos" class="form-input-clean text-xs font-mono" placeholder="Ej. 0991234567 / 022345678">
            </div>
          </div>

          <!-- Padre -->
          <div class="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-2">👨 DATOS DEL PADRE</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div class="sm:col-span-2">
                <label class="block font-semibold text-slate-600 mb-1">Nombre del padre</label>
                <input type="text" id="padre_nombre" class="form-input-clean" placeholder="Nombres y Apellidos">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Edad</label>
                <input type="number" id="padre_edad" class="form-input-clean" placeholder="Edad">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Estado civil</label>
                <select id="padre_estado_civil" class="form-input-clean">
                  <option value="">Seleccione...</option>
                  <option value="Soltero">Soltero</option>
                  <option value="Casado">Casado</option>
                  <option value="Unión Libre">Unión Libre</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Viudo">Viudo</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div><label class="block font-semibold text-slate-600 mb-1">Instrucción</label><input type="text" id="padre_instruccion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Profesión / Ocupación</label><input type="text" id="padre_profesion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Lugar de trabajo</label><input type="text" id="padre_lugar_trabajo" class="form-input-clean"></div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Teléfonos de contacto</label>
              <input type="text" id="padre_telefonos" class="form-input-clean text-xs font-mono" placeholder="Ej. 0987654321">
            </div>
          </div>

          <!-- Representante Legal -->
          <div class="bg-blue-50/60 p-3.5 sm:p-4 rounded-xl border border-blue-200 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-2">🤝 REPRESENTANTE LEGAL</h4>
              <div class="flex items-center gap-1.5 text-xs">
                <span class="text-slate-500 font-medium">Copiar:</span>
                <button type="button" id="btn-copy-madre" class="px-2 py-0.5 bg-white border border-blue-300 rounded text-blue-700 hover:bg-blue-50 font-medium">👩 Madre</button>
                <button type="button" id="btn-copy-padre" class="px-2 py-0.5 bg-white border border-blue-300 rounded text-blue-700 hover:bg-blue-50 font-medium">👨 Padre</button>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div class="sm:col-span-2">
                <label class="block font-semibold text-slate-600 mb-1">Nombre del Representante</label>
                <input type="text" id="rep_nombre" class="form-input-clean" placeholder="Nombres y Apellidos">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Edad</label>
                <input type="number" id="rep_edad" class="form-input-clean" placeholder="Edad">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Estado civil</label>
                <select id="rep_estado_civil" class="form-input-clean">
                  <option value="">Seleccione...</option>
                  <option value="Soltero/a">Soltero/a</option>
                  <option value="Casado/a">Casado/a</option>
                  <option value="Unión Libre">Unión Libre</option>
                  <option value="Divorciado/a">Divorciado/a</option>
                  <option value="Viudo/a">Viudo/a</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div><label class="block font-semibold text-slate-600 mb-1">Instrucción</label><input type="text" id="rep_instruccion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Profesión / Ocupación</label><input type="text" id="rep_profesion" class="form-input-clean"></div>
              <div><label class="block font-semibold text-slate-600 mb-1">Lugar de trabajo</label><input type="text" id="rep_lugar_trabajo" class="form-input-clean"></div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Teléfonos de contacto</label>
              <input type="text" id="rep_telefonos" class="form-input-clean text-xs font-mono">
            </div>
          </div>

          <!-- Step 2 Footer -->
          <div class="flex justify-between pt-3 sm:pt-4 border-t border-slate-100 gap-2">
            <button type="button" class="btn-prev-step px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-xs sm:text-sm hover:bg-slate-200">➔ Anterior</button>
            <button type="button" class="btn-next-step px-5 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-700">Siguiente: Referencias ➔</button>
          </div>
        </div>
""")