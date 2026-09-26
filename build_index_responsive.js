const fs = require('fs');
let s = '';
function add(x) { s += x; }

add(`<!DOCTYPE html>
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
    /* Responsive Stepper Scroll */
    .stepper-scroll-container {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .stepper-scroll-container::-webkit-scrollbar {
      display: none;
    }
  </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 antialiased">

  <!-- Header / Navigation Bar -->
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

  <!-- Main Container -->
  <main class="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

    <!-- Card Wrapper -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Stepper Header -->
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

        <!-- Progress Bar -->
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4 sm:mb-5">
          <div id="step-progress-bar" class="bg-blue-500 h-full transition-all duration-300" style="width: 0%;"></div>
        </div>

        <!-- Stepper Navigation Items (Responsive Scroll) -->
        <div class="stepper-scroll-container">
          <div class="flex sm:grid sm:grid-cols-7 gap-2 sm:gap-2 min-w-max sm:min-w-0 pb-1">
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="1">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-blue-600 text-white ring-4 ring-blue-100 shadow">1</div>
              <span class="step-label text-[11px] sm:text-xs font-semibold text-blue-400 mt-1 whitespace-nowrap">1. Identificación</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="2">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">2</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">2. Familiares</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="3">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">3</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">3. Referencias</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="4">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">4</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">4. Socioeconómico</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="5">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">5</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">5. Salud</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="6">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">6</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">6. Académico</span>
            </button>
            <button type="button" class="step-nav-btn flex flex-col items-center text-center group px-2 sm:px-0" data-step="7">
              <div class="step-circle w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-800 text-slate-400">7</div>
              <span class="step-label text-[11px] sm:text-xs font-medium text-slate-400 mt-1 whitespace-nowrap">7. Historia Vital</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form id="cumulativeRecordForm" class="p-4 sm:p-6">
`);