// Public Application Logic for Cumulative Record Form (Apple Design)

let croquisEditor = null;
let currentStep = 1;
const totalSteps = 7;

const stepMetadata = {
  1: { title: "Paso 1: Datos de Identificación y Croquis", desc: "Complete los datos básicos del estudiante y dibuje el croquis domiciliario." },
  2: { title: "Paso 2: Datos Familiares", desc: "Información de los padres y representante legal del estudiante." },
  3: { title: "Paso 3: Composición Familiar", desc: "Otros familiares o personas que viven en el mismo hogar con el estudiante." },
  4: { title: "Paso 4: Referencias Socioeconómicas", desc: "Ingresos, egresos familiares, condiciones de vivienda y servicios." },
  5: { title: "Paso 5: Datos de Salud", desc: "Condiciones médicas, discapacidades, alergias y medicamentos." },
  6: { title: "Paso 6: Datos Académicos y Convivencia", desc: "Historial educativo, preferencias y rendimiento." },
  7: { title: "Paso 7: Entorno Familiar, Hábitos y Firma", desc: "Convivencia familiar, cédula para firma y finalización del registro." }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Croquis Canvas
  croquisEditor = new CroquisEditor('croquisCanvas');

  // 2. Croquis Tools setup
  setupCroquisControls();

  // 3. Calculation & Event listeners (Auto Age & Incomes/Expenses)
  setupAutoCalculations();

  // 4. Stepper navigation
  setupStepper();

  // 5. Dynamic "Otros Familiares" rows
  setupOtrosFamiliaresTable();

  // 6. Quick Copy buttons for Representante
  setupCopyButtons();

  // 7. Form submission
  setupFormSubmission();

  // 8. Draft autosave
  loadDraft();
  setupAutoSave();
});

// Stepper Navigation Logic
function setupStepper() {
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  document.querySelectorAll('.step-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      if (step < currentStep || validateCurrentStep(currentStep)) {
        goToStep(step);
      }
    });
  });
}

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;

  document.querySelectorAll('.form-step').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('active');
  });

  const target = document.getElementById(`form-step-${step}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  currentStep = step;
  updateStepperUI();
  window.scrollTo({ top: 90, behavior: 'smooth' });
}

function updateStepperUI() {
  const meta = stepMetadata[currentStep] || { title: `Paso ${currentStep} de 7`, desc: "" };
  const titleEl = document.getElementById('step-title-display');
  const descEl = document.getElementById('step-desc-display');
  const counterEl = document.getElementById('step-counter-display');
  const percentEl = document.getElementById('step-progress-percent');
  const barEl = document.getElementById('form-progress-bar');

  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;
  if (counterEl) counterEl.textContent = `Paso ${currentStep} de ${totalSteps}`;

  const pct = Math.round((currentStep / totalSteps) * 100);
  if (percentEl) percentEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;

  // Update pill buttons
  document.querySelectorAll('.step-nav-btn').forEach(btn => {
    const s = parseInt(btn.dataset.step, 10);
    btn.className = 'step-nav-btn stepper-pill flex flex-col items-center justify-center p-2 text-center transition cursor-pointer';

    if (s === currentStep) {
      btn.classList.add('active');
    } else if (s < currentStep) {
      btn.classList.add('completed');
    }
  });
}

// Age Calculation Helper function
function calculateExactAge(birthDateString) {
  if (!birthDateString) return '';
  const birthDate = new Date(birthDateString + 'T00:00:00');
  if (isNaN(birthDate.getTime())) return '';
  
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
  }

  if (years < 0 || years > 125) return '';
  return years === 1 ? '1 año' : `${years} años`;
}

// Automatic Calculations: Birthdate -> Age & Income / Expense Totals
function setupAutoCalculations() {
  // 1. Birthdate to Age (Listens to both 'input' and 'change')
  const birthInput = document.getElementById('est_fecha_nac') || document.getElementById('est_fecha_nacimiento');
  const ageInput = document.getElementById('est_edad');

  function updateAge() {
    if (birthInput && ageInput && birthInput.value) {
      const ageStr = calculateExactAge(birthInput.value);
      ageInput.value = ageStr;
    }
  }

  if (birthInput) {
    birthInput.addEventListener('change', updateAge);
    birthInput.addEventListener('input', updateAge);
    if (birthInput.value) updateAge();
  }

  // 2. Incomes live sum
  const incomeInputs = document.querySelectorAll('.calc-ing');
  const displayTotalIngresos = document.getElementById('display_total_ingresos');

  function calcIngresos() {
    let sum = 0;
    incomeInputs.forEach(i => { sum += parseFloat(i.value) || 0; });
    if (displayTotalIngresos) {
      displayTotalIngresos.textContent = `$${sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  incomeInputs.forEach(inp => {
    inp.addEventListener('input', calcIngresos);
    inp.addEventListener('change', calcIngresos);
  });
  calcIngresos();

  // 3. Expenses live sum
  const expenseInputs = document.querySelectorAll('.calc-egr');
  const displayTotalEgresos = document.getElementById('display_total_egresos');

  function calcEgresos() {
    let sum = 0;
    expenseInputs.forEach(i => { sum += parseFloat(i.value) || 0; });
    if (displayTotalEgresos) {
      displayTotalEgresos.textContent = `$${sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  expenseInputs.forEach(inp => {
    inp.addEventListener('input', calcEgresos);
    inp.addEventListener('change', calcEgresos);
  });
  calcEgresos();
}

// Croquis Toolbar setup
function setupCroquisControls() {
  const toolBtns = document.querySelectorAll('.croquis-tool-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => {
        b.classList.remove('apple-btn-primary');
        b.classList.add('apple-btn-secondary');
      });
      btn.classList.remove('apple-btn-secondary');
      btn.classList.add('apple-btn-primary');
      if (croquisEditor) croquisEditor.tool = btn.dataset.tool;
    });
  });

  const clearBtn = document.getElementById('btn-clear-croquis');
  if (clearBtn) clearBtn.addEventListener('click', () => { if (croquisEditor) croquisEditor.clear(); });

  const undoBtn = document.getElementById('btn-undo-croquis');
  if (undoBtn) undoBtn.addEventListener('click', () => { if (croquisEditor) croquisEditor.undo(); });

  const uploadInput = document.getElementById('croquis-file-input');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0] && croquisEditor) {
        croquisEditor.loadImage(e.target.files[0]);
      }
    });
  }
}

// Dynamic Otros Familiares table
function setupOtrosFamiliaresTable() {
  const addBtn = document.getElementById('btn-add-familiar-row') || document.getElementById('btn-add-familiar');
  const tableBody = document.getElementById('otros-familiares-tbody');
  if (!addBtn || !tableBody) return;

  addBtn.addEventListener('click', () => {
    const rowCount = tableBody.querySelectorAll('tr').length;
    if (rowCount >= 8) {
      window.showToast('Máximo 8 familiares en la tabla', 'warning');
      return;
    }
    const tr = document.createElement('tr');
    tr.className = 'familiar-row hover:bg-black/[0.02] border-b border-[var(--apple-border)]';
    tr.innerHTML = `
      <td class="p-2"><input type="text" class="form-table-input uppercase fam-nom" placeholder="Nombres"></td>
      <td class="p-2"><input type="text" class="form-table-input uppercase fam-par" placeholder="Hermano/a"></td>
      <td class="p-2"><input type="number" class="form-table-input fam-edad" placeholder="Edad"></td>
      <td class="p-2"><input type="text" class="form-table-input uppercase fam-ec" placeholder="Soltero"></td>
      <td class="p-2"><input type="text" class="form-table-input uppercase fam-inst" placeholder="Básica"></td>
      <td class="p-2"><input type="text" class="form-table-input uppercase fam-ocup" placeholder="Estudiante"></td>
      <td class="p-2 text-center">
        <button type="button" class="btn-remove-familiar text-[var(--apple-text-secondary)] hover:text-[var(--apple-red)] font-bold text-base">&times;</button>
      </td>
    `;
    tr.querySelector('.btn-remove-familiar').addEventListener('click', () => tr.remove());
    tableBody.appendChild(tr);
  });

  // Attach existing remove buttons
  tableBody.querySelectorAll('.btn-remove-familiar').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('tr').remove());
  });
}

// Quick Copy Madre / Padre to Representante
function setupCopyButtons() {
  const btnMadre = document.getElementById('btn-copy-madre');
  const btnPadre = document.getElementById('btn-copy-padre');

  if (btnMadre) {
    btnMadre.addEventListener('click', () => {
      document.getElementById('rep_nombre').value = document.getElementById('m_nombre')?.value || '';
      document.getElementById('rep_parentesco').value = 'MADRE';
      document.getElementById('rep_edad').value = document.getElementById('m_edad')?.value || '';
      document.getElementById('rep_ec').value = document.getElementById('m_ec')?.value || '';
      document.getElementById('rep_inst').value = document.getElementById('m_inst')?.value || '';
      document.getElementById('rep_prof').value = document.getElementById('m_prof')?.value || '';
      document.getElementById('rep_trab').value = document.getElementById('m_trab')?.value || '';
      document.getElementById('rep_tel').value = document.getElementById('m_tel')?.value || '';
      window.showToast('Datos de la Madre copiados a Representante', 'success');
    });
  }

  if (btnPadre) {
    btnPadre.addEventListener('click', () => {
      document.getElementById('rep_nombre').value = document.getElementById('p_nombre')?.value || '';
      document.getElementById('rep_parentesco').value = 'PADRE';
      document.getElementById('rep_edad').value = document.getElementById('p_edad')?.value || '';
      document.getElementById('rep_ec').value = document.getElementById('p_ec')?.value || '';
      document.getElementById('rep_inst').value = document.getElementById('p_inst')?.value || '';
      document.getElementById('rep_prof').value = document.getElementById('p_prof')?.value || '';
      document.getElementById('rep_trab').value = document.getElementById('p_trab')?.value || '';
      document.getElementById('rep_tel').value = document.getElementById('p_tel')?.value || '';
      window.showToast('Datos del Padre copiados a Representante', 'success');
    });
  }
}

// Step Validation
function validateCurrentStep(step) {
  if (step === 1) {
    const nom = document.getElementById('est_nombre')?.value.trim();
    const ci = document.getElementById('est_identificacion')?.value.trim();
    const curso = document.getElementById('est_curso')?.value.trim();
    const cel = document.getElementById('est_celular')?.value.trim();
    const dom = document.getElementById('est_domicilio')?.value.trim();

    if (!nom || !ci || !curso || !cel || !dom) {
      window.showToast('Complete los campos obligatorios del estudiante (*)', 'warning');
      return false;
    }
  } else if (step === 2) {
    const repNom = document.getElementById('rep_nombre')?.value.trim();
    const repPar = document.getElementById('rep_parentesco')?.value.trim();
    const repTel = document.getElementById('rep_tel')?.value.trim();

    if (!repNom || !repPar || !repTel) {
      window.showToast('Complete los datos obligatorios del Representante (*)', 'warning');
      return false;
    }
  } else if (step === 7) {
    const firma = document.getElementById('firma_ci')?.value.trim();
    if (!firma) {
      window.showToast('Ingrese el N° de Cédula del Representante para la firma (*)', 'warning');
      return false;
    }
  }
  return true;
}

// Extract full JSON payload from Form
function extractFormData() {
  const otrosFamiliares = [];
  document.querySelectorAll('#otros-familiares-tbody tr').forEach(row => {
    const nom = row.querySelector('.fam-nom')?.value.trim();
    if (nom) {
      otrosFamiliares.push({
        nombres: nom,
        parentesco: row.querySelector('.fam-par')?.value.trim() || '',
        edad: row.querySelector('.fam-edad')?.value.trim() || '',
        estado_civil: row.querySelector('.fam-ec')?.value.trim() || '',
        instruccion: row.querySelector('.fam-inst')?.value.trim() || '',
        profesion: row.querySelector('.fam-ocup')?.value.trim() || '',
        lugar_trabajo: ''
      });
    }
  });

  const ingPadre = parseFloat(document.getElementById('ing_padre')?.value) || 0;
  const ingMadre = parseFloat(document.getElementById('ing_madre')?.value) || 0;
  const ingHermanos = parseFloat(document.getElementById('ing_hermanos')?.value) || 0;
  const ingOtros = parseFloat(document.getElementById('ing_otros')?.value) || 0;
  const totalIngresos = (ingPadre + ingMadre + ingHermanos + ingOtros).toFixed(2);

  const egrAlim = parseFloat(document.getElementById('egr_alim')?.value) || 0;
  const egrSalud = parseFloat(document.getElementById('egr_salud')?.value) || 0;
  const egrViv = parseFloat(document.getElementById('egr_viv')?.value) || 0;
  const egrEduc = parseFloat(document.getElementById('egr_educ')?.value) || 0;
  const egrTrans = parseFloat(document.getElementById('egr_trans')?.value) || 0;
  const egrVest = parseFloat(document.getElementById('egr_vest')?.value) || 0;
  const egrServ = parseFloat(document.getElementById('egr_serv')?.value) || 0;
  const egrOtros = parseFloat(document.getElementById('egr_otros')?.value) || 0;
  const totalEgresos = (egrAlim + egrSalud + egrViv + egrEduc + egrTrans + egrVest + egrServ + egrOtros).toFixed(2);

  // Collect Housing Conditions
  const condVivienda = [];
  if (document.getElementById('cond_propia')?.checked) condVivienda.push('Propia');
  if (document.getElementById('cond_arrendada')?.checked) condVivienda.push('Arrendada');
  if (document.getElementById('cond_anticresis')?.checked) condVivienda.push('Anticresis');
  if (document.getElementById('cond_prestada')?.checked) condVivienda.push('Prestada');
  if (document.getElementById('cond_compartida')?.checked) condVivienda.push('Compartida');
  if (document.getElementById('cond_prestamo')?.checked) condVivienda.push('Con préstamo');

  // Collect Basic Services
  const servBasicos = [];
  if (document.getElementById('serv_luz')?.checked) servBasicos.push('Luz eléctrica');
  if (document.getElementById('serv_agua')?.checked) servBasicos.push('Agua potable');
  if (document.getElementById('serv_sshh')?.checked) servBasicos.push('SSHH');
  if (document.getElementById('serv_pozo')?.checked) servBasicos.push('Pozo séptico');
  if (document.getElementById('serv_telefono')?.checked) servBasicos.push('Teléfono');
  if (document.getElementById('serv_celular')?.checked) servBasicos.push('Celular');
  if (document.getElementById('serv_internet')?.checked) servBasicos.push('Internet');
  if (document.getElementById('serv_cable')?.checked) servBasicos.push('Cable');
  if (document.getElementById('serv_computador')?.checked) servBasicos.push('Computador');
  if (document.getElementById('serv_laptop')?.checked) servBasicos.push('Laptop');
  if (document.getElementById('serv_tablet')?.checked) servBasicos.push('Tablet');
  if (document.getElementById('serv_videojuegos')?.checked) servBasicos.push('Video juegos');

  // Collect Medical Attendance
  const medAtencion = [];
  if (document.getElementById('med_centro_salud')?.checked) medAtencion.push('Centro de salud');
  if (document.getElementById('med_subcentro')?.checked) medAtencion.push('Subcentro de salud');
  if (document.getElementById('med_hospital_pub')?.checked) medAtencion.push('Hospital público');
  if (document.getElementById('med_clinica_priv')?.checked) medAtencion.push('Clínica privada');

  // Collect Tipo de Parto
  const tipoParto = [];
  if (document.getElementById('parto_termino')?.checked) tipoParto.push('al término');
  if (document.getElementById('parto_prematuro')?.checked) tipoParto.push('Prematuro');
  if (document.getElementById('parto_cesarea')?.checked) tipoParto.push('Cesárea');
  if (document.getElementById('parto_normal')?.checked) tipoParto.push('Parto normal');

  const cursoVal = document.getElementById('est_curso')?.value || '';
  const paraleloVal = document.getElementById('est_paralelo')?.value || '';
  const fullCurso = cursoVal ? (paraleloVal ? `${cursoVal} "${paraleloVal}"` : cursoVal) : '';

  return {
    identificacion: {
      estudiante: document.getElementById('est_nombre')?.value.trim() || '',
      nacionalidad: document.getElementById('est_nacionalidad')?.value.trim() || 'ECUATORIANA',
      num_identificacion: document.getElementById('est_identificacion')?.value.trim() || '',
      fecha_nacimiento: document.getElementById('est_fecha_nac')?.value || '',
      edad: document.getElementById('est_edad')?.value || '',
      lugar_nacimiento: document.getElementById('est_lugar_nac')?.value.trim() || '',
      curso: fullCurso,
      grupo_etnico: document.getElementById('est_grupo_etnico')?.value.trim() || 'MESTIZO',
      telefono: document.getElementById('est_telefono')?.value.trim() || '',
      celular: document.getElementById('est_celular')?.value.trim() || '',
      domicilio: document.getElementById('est_domicilio')?.value.trim() || '',
      croquis_data: croquisEditor ? croquisEditor.getDataURL() : ''
    },
    datos_familiares: {
      madre: {
        nombre: document.getElementById('m_nombre')?.value.trim() || '',
        edad: document.getElementById('m_edad')?.value || '',
        estado_civil: document.getElementById('m_ec')?.value.trim() || '',
        instruccion: document.getElementById('m_inst')?.value.trim() || '',
        profesion: document.getElementById('m_prof')?.value.trim() || '',
        lugar_trabajo: document.getElementById('m_trab')?.value.trim() || '',
        telefonos: document.getElementById('m_tel')?.value.trim() || ''
      },
      padre: {
        nombre: document.getElementById('p_nombre')?.value.trim() || '',
        edad: document.getElementById('p_edad')?.value || '',
        estado_civil: document.getElementById('p_ec')?.value.trim() || '',
        instruccion: document.getElementById('p_inst')?.value.trim() || '',
        profesion: document.getElementById('p_prof')?.value.trim() || '',
        lugar_trabajo: document.getElementById('p_trab')?.value.trim() || '',
        telefonos: document.getElementById('p_tel')?.value.trim() || ''
      },
      representante: {
        nombre: document.getElementById('rep_nombre')?.value.trim() || '',
        parentesco: document.getElementById('rep_parentesco')?.value.trim() || '',
        edad: document.getElementById('rep_edad')?.value || '',
        estado_civil: document.getElementById('rep_ec')?.value.trim() || '',
        instruccion: document.getElementById('rep_inst')?.value.trim() || '',
        profesion: document.getElementById('rep_prof')?.value.trim() || '',
        lugar_trabajo: document.getElementById('rep_trab')?.value.trim() || '',
        telefonos: document.getElementById('rep_tel')?.value.trim() || ''
      },
      otros_familiares: otrosFamiliares
    },
    referencias_socioeconomicas: {
      ingresos: {
        padre: String(ingPadre),
        madre: String(ingMadre),
        hermanos: String(ingHermanos),
        otros: String(ingOtros),
        total: totalIngresos
      },
      egresos: {
        alimentacion: String(egrAlim),
        salud: String(egrSalud),
        vivienda: String(egrViv),
        educacion: String(egrEduc),
        transporte: String(egrTrans),
        vestimenta: String(egrVest),
        servicios: String(egrServ),
        otros: String(egrOtros),
        total: totalEgresos
      },
      condicion_vivienda: condVivienda,
      tipo_vivienda: document.getElementById('socio_tipo_viv')?.value || 'Casa',
      recibido_prestamos: document.getElementById('socio_prestamos')?.value.trim() || '',
      servicios_basicos: servBasicos
    },
    datos_salud: {
      discapacidad: document.getElementById('salud_disc')?.value || 'No',
      discapacidad_tipo: document.getElementById('salud_disc_tipo')?.value.trim() || '',
      condicion_medica: document.getElementById('salud_cond')?.value.trim() || '',
      alergias: document.getElementById('salud_alergias')?.value.trim() || '',
      medicamentos: document.getElementById('salud_meds')?.value.trim() || '',
      atencion_medica: medAtencion,
      atencion_medica_nota: document.getElementById('salud_med_nota')?.value.trim() || ''
    },
    datos_academicos: {
      fecha_ingreso: document.getElementById('acad_fecha_ingreso')?.value || '',
      institucion_procedencia: document.getElementById('acad_inst')?.value.trim() || '',
      ha_repetido_anios: document.getElementById('acad_rep')?.value || 'No',
      anios_repetidos: document.getElementById('acad_anios_rep')?.value.trim() || '',
      asignaturas_preferencia: document.getElementById('acad_pref')?.value.trim() || '',
      asignaturas_dificultad: document.getElementById('acad_dif')?.value.trim() || '',
      dignidades_alcanzadas: document.getElementById('acad_dignidades')?.value.trim() || '',
      logros_academicos: document.getElementById('acad_logros')?.value.trim() || '',
      participacion: document.getElementById('acad_participacion')?.value.trim() || '',
      clubes: document.getElementById('acad_clubes')?.value.trim() || '',
      extracurriculares: document.getElementById('acad_extracurriculares')?.value.trim() || ''
    },
    historia_vital: {
      edad_madre_al_nacer: document.getElementById('hist_edad_madre')?.value || '',
      accidentes_embarazo: document.getElementById('hist_acc_embarazo')?.value.trim() || '',
      medicamentos_embarazo: document.getElementById('hist_meds_embarazo')?.value.trim() || '',
      medicamentos_embarazo_cuales: document.getElementById('hist_meds_cuales')?.value.trim() || '',
      tipo_parto: tipoParto,
      dificultades_embarazo: document.getElementById('hist_dif_embarazo')?.value.trim() || '',
      peso_nacer: document.getElementById('hist_peso_nacer')?.value.trim() || '',
      talla_nacer: document.getElementById('hist_talla_nacer')?.value.trim() || '',
      edad_empezo_caminar: document.getElementById('hist_edad_caminar')?.value.trim() || '',
      edad_hablo_primera_vez: document.getElementById('hist_edad_hablo')?.value.trim() || '',
      periodo_lactancia: document.getElementById('hist_lactancia')?.value.trim() || '',
      edad_utilizo_biberon: document.getElementById('hist_edad_biberon')?.value.trim() || '',
      edad_control_esfinteres: document.getElementById('hist_edad_esfinteres')?.value.trim() || '',
      enfermedades_infancia: document.getElementById('hist_enf_desc')?.value.trim() || '',
      accidentes_infancia: document.getElementById('hist_acc_desc')?.value.trim() || '',
      alergias_infancia: document.getElementById('hist_alergias_desc')?.value.trim() || '',
      cirugias: document.getElementById('hist_cirugias_desc')?.value.trim() || '',
      perdidas_conocimiento: document.getElementById('hist_perdidas_desc')?.value.trim() || '',
      otros_salud_infancia: document.getElementById('hist_otros_salud_desc')?.value.trim() || ''
    },
    antecedentes_patologicos: {
      obesidad: document.getElementById('patol_obesidad')?.checked || false,
      enfermedades_cardiacas: document.getElementById('patol_cardiacas')?.checked || false,
      hipertension: document.getElementById('patol_hipertension')?.checked || false,
      diabetes: document.getElementById('patol_diabetes')?.checked || false,
      enfermedades_mentales: document.getElementById('patol_mentales')?.checked || false,
      otros: document.getElementById('patol_otros')?.value.trim() || ''
    },
    entorno_familiar_habitos: {
      relacion_padre: document.getElementById('entorno_rel_padre')?.value.trim() || '',
      relacion_madre: document.getElementById('entorno_rel_madre')?.value.trim() || '',
      relacion_hermanos: document.getElementById('entorno_rel_hermanos')?.value.trim() || '',
      relacion_otros: document.getElementById('entorno_rel_otros')?.value.trim() || '',
      costumbres_habitos: document.getElementById('habitos_desc')?.value.trim() || '',
      observaciones: document.getElementById('habitos_obs')?.value.trim() || '',
      firma_ci: document.getElementById('firma_ci')?.value.trim() || '',
      firma_representante: document.getElementById('firma_ci')?.value.trim() || ''
    }
  };
}

// Form Submission
function setupFormSubmission() {
  const form = document.getElementById('cumulativeRecordForm');
  const submitBtn = document.getElementById('btn-submit-form');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateCurrentStep(7)) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>&#8987;</span> Guardando...';

    try {
      const payload = extractFormData();
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el registro');

      // Clear draft on successful submission
      localStorage.removeItem('dece_record_draft');

      // Open Success Modal
      const modal = document.getElementById('successModal');
      const studentNameDisplay = document.getElementById('success-student-name');
      if (studentNameDisplay) studentNameDisplay.textContent = payload.identificacion.estudiante;

      document.getElementById('modal-btn-download').onclick = () => {
        PDFEngine.download(data.record || payload);
      };

      document.getElementById('modal-btn-preview').onclick = () => {
        PDFEngine.preview(data.record || payload);
      };

      document.getElementById('modal-btn-new').onclick = () => {
        modal.classList.add('hidden');
        form.reset();
        if (croquisEditor) croquisEditor.clear();
        goToStep(1);
      };

      modal.classList.remove('hidden');

    } catch (err) {
      window.showToast(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>&#128190;</span> Finalizar y Guardar Registro';
    }
  });
}

// Draft Autosave & Restore
function setupAutoSave() {
  const form = document.getElementById('cumulativeRecordForm');
  if (!form) return;

  let timer;
  form.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        const data = extractFormData();
        if (data.identificacion.estudiante || data.identificacion.num_identificacion) {
          localStorage.setItem('dece_record_draft', JSON.stringify(data));
        }
      } catch (e) {}
    }, 1500);
  });
}

async function loadDraft() {
  try {
    const raw = localStorage.getItem('dece_record_draft');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || !data.identificacion?.estudiante) return;

    const shouldRestore = await window.showAppConfirm({
      title: 'Restaurar Borrador Guardado',
      message: 'Se encontró un borrador en este dispositivo para <b>' + (data.identificacion.estudiante || 'el estudiante') + '</b>.<br><br>¿Desea restaurar los datos en el formulario?',
      confirmText: 'Sí, Restaurar Datos',
      cancelText: 'Descartar',
      iconHtml: '&#128196;'
    });

    if (shouldRestore) {
      fillFormValues(data);
      window.showToast('Borrador restaurado correctamente', 'success');
    } else {
      localStorage.removeItem('dece_record_draft');
    }
  } catch (e) {
    console.error('Error loading draft', e);
  }
}

function fillFormValues(data) {
  if (!data) return;
  const ident = data.identificacion || {};
  if (ident.estudiante) document.getElementById('est_nombre').value = ident.estudiante;
  if (ident.nacionalidad) document.getElementById('est_nacionalidad').value = ident.nacionalidad;
  if (ident.num_identificacion) document.getElementById('est_identificacion').value = ident.num_identificacion;
  if (ident.fecha_nacimiento) {
    document.getElementById('est_fecha_nac').value = ident.fecha_nacimiento;
    const ageStr = calculateExactAge(ident.fecha_nacimiento);
    if (ageStr) document.getElementById('est_edad').value = ageStr;
  }
  if (ident.lugar_nacimiento) document.getElementById('est_lugar_nac').value = ident.lugar_nacimiento;
  if (ident.curso) {
    const cursoEl = document.getElementById('est_curso');
    const parEl = document.getElementById('est_paralelo');
    if (cursoEl) {
      for (let opt of cursoEl.options) {
        if (ident.curso.toUpperCase().includes(opt.value.toUpperCase())) {
          cursoEl.value = opt.value;
          break;
        }
      }
    }
    if (parEl) {
      for (let opt of parEl.options) {
        if (ident.curso.toUpperCase().includes(`"${opt.value}"`) || ident.curso.toUpperCase().endsWith(` ${opt.value}`)) {
          parEl.value = opt.value;
          break;
        }
      }
    }
  }
  if (ident.grupo_etnico) document.getElementById('est_grupo_etnico').value = ident.grupo_etnico;
  if (ident.telefono) document.getElementById('est_telefono').value = ident.telefono;
  if (ident.celular) document.getElementById('est_celular').value = ident.celular;
  if (ident.domicilio) document.getElementById('est_domicilio').value = ident.domicilio;

  if (ident.croquis_data && croquisEditor) {
    croquisEditor.loadImage(ident.croquis_data);
  }

  const m = data.datos_familiares?.madre || {};
  if (m.nombre) document.getElementById('m_nombre').value = m.nombre;
  if (m.edad) document.getElementById('m_edad').value = m.edad;
  if (m.estado_civil) document.getElementById('m_ec').value = m.estado_civil;
  if (m.instruccion) document.getElementById('m_inst').value = m.instruccion;
  if (m.profesion) document.getElementById('m_prof').value = m.profesion;
  if (m.lugar_trabajo) document.getElementById('m_trab').value = m.lugar_trabajo;
  if (m.telefonos) document.getElementById('m_tel').value = m.telefonos;

  const p = data.datos_familiares?.padre || {};
  if (p.nombre) document.getElementById('p_nombre').value = p.nombre;
  if (p.edad) document.getElementById('p_edad').value = p.edad;
  if (p.estado_civil) document.getElementById('p_ec').value = p.estado_civil;
  if (p.instruccion) document.getElementById('p_inst').value = p.instruccion;
  if (p.profesion) document.getElementById('p_prof').value = p.profesion;
  if (p.lugar_trabajo) document.getElementById('p_trab').value = p.lugar_trabajo;
  if (p.telefonos) document.getElementById('p_tel').value = p.telefonos;

  const r = data.datos_familiares?.representante || {};
  if (r.nombre) document.getElementById('rep_nombre').value = r.nombre;
  if (r.parentesco) document.getElementById('rep_parentesco').value = r.parentesco;
  if (r.edad) document.getElementById('rep_edad').value = r.edad;
  if (r.estado_civil) document.getElementById('rep_ec').value = r.estado_civil;
  if (r.instruccion) document.getElementById('rep_inst').value = r.instruccion;
  if (r.profesion) document.getElementById('rep_prof').value = r.profesion;
  if (r.lugar_trabajo) document.getElementById('rep_trab').value = r.lugar_trabajo;
  if (r.telefonos) document.getElementById('rep_tel').value = r.telefonos;

  // Restore otros familiares table
  const otrosFam = data.datos_familiares?.otros_familiares || [];
  if (otrosFam.length > 0) {
    const tbody = document.getElementById('otros-familiares-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      otrosFam.forEach(f => {
        const tr = document.createElement('tr');
        tr.className = 'familiar-row hover:bg-[var(--apple-input-hover)]';
        tr.innerHTML = `
          <td class="p-2"><input type="text" class="form-table-input uppercase fam-nom" value="${f.nombres || ''}" placeholder="Nombres y Apellidos"></td>
          <td class="p-2">
            <select class="form-table-input uppercase fam-par bg-transparent">
              <option value="">Parentesco...</option>
              <option value="HERMANO/A" ${f.parentesco === 'HERMANO/A' ? 'selected' : ''}>Hermano/a</option>
              <option value="ABUELO/A" ${f.parentesco === 'ABUELO/A' ? 'selected' : ''}>Abuelo/a</option>
              <option value="TÍO/A" ${f.parentesco === 'TÍO/A' ? 'selected' : ''}>Tío/a</option>
              <option value="PRIMO/A" ${f.parentesco === 'PRIMO/A' ? 'selected' : ''}>Primo/a</option>
              <option value="SOBRINO/A" ${f.parentesco === 'SOBRINO/A' ? 'selected' : ''}>Sobrino/a</option>
              <option value="PADRASTRO" ${f.parentesco === 'PADRASTRO' ? 'selected' : ''}>Padrastro</option>
              <option value="MADRASTRA" ${f.parentesco === 'MADRASTRA' ? 'selected' : ''}>Madrastra</option>
              <option value="OTRO" ${f.parentesco === 'OTRO' ? 'selected' : ''}>Otro</option>
            </select>
          </td>
          <td class="p-2"><input type="number" class="form-table-input fam-edad" value="${f.edad || ''}" placeholder="Edad"></td>
          <td class="p-2">
            <select class="form-table-input uppercase fam-ec bg-transparent">
              <option value="">Estado Civil...</option>
              <option value="SOLTERO/A" ${f.estado_civil === 'SOLTERO/A' ? 'selected' : ''}>Soltero/a</option>
              <option value="CASADO/A" ${f.estado_civil === 'CASADO/A' ? 'selected' : ''}>Casado/a</option>
              <option value="DIVORCIADO/A" ${f.estado_civil === 'DIVORCIADO/A' ? 'selected' : ''}>Divorciado/a</option>
              <option value="VIUDO/A" ${f.estado_civil === 'VIUDO/A' ? 'selected' : ''}>Viudo/a</option>
              <option value="UNIÓN LIBRE" ${f.estado_civil === 'UNIÓN LIBRE' ? 'selected' : ''}>Unión Libre</option>
            </select>
          </td>
          <td class="p-2">
            <select class="form-table-input uppercase fam-inst bg-transparent">
              <option value="">Instrucción...</option>
              <option value="SIN INSTRUCCIÓN" ${f.instruccion === 'SIN INSTRUCCIÓN' ? 'selected' : ''}>Sin instrucción</option>
              <option value="PRIMARIA" ${f.instruccion === 'PRIMARIA' ? 'selected' : ''}>Primaria</option>
              <option value="BÁSICA" ${f.instruccion === 'BÁSICA' ? 'selected' : ''}>Básica</option>
              <option value="BACHILLERATO" ${f.instruccion === 'BACHILLERATO' ? 'selected' : ''}>Bachillerato</option>
              <option value="SUPERIOR" ${f.instruccion === 'SUPERIOR' ? 'selected' : ''}>Superior</option>
              <option value="POSGRADO" ${f.instruccion === 'POSGRADO' ? 'selected' : ''}>Posgrado</option>
            </select>
          </td>
          <td class="p-2"><input type="text" class="form-table-input uppercase fam-ocup" value="${f.profesion || ''}" placeholder="Ocupación / Escuela"></td>
          <td class="p-2 text-center"><button type="button" class="btn-remove-familiar text-[var(--apple-text-secondary)] hover:text-[var(--apple-red)] font-bold text-base">&times;</button></td>
        `;
        tr.querySelector('.btn-remove-familiar').addEventListener('click', () => tr.remove());
        tbody.appendChild(tr);
      });
    }
  }

  // Socioeconomics
  const socio = data.referencias_socioeconomicas || {};
  const condViv = Array.isArray(socio.condicion_vivienda) ? socio.condicion_vivienda : (socio.condicion_vivienda ? [socio.condicion_vivienda] : []);
  const hasCond = (val) => condViv.some(c => String(c).toLowerCase().includes(val.toLowerCase()));
  if (document.getElementById('cond_propia')) document.getElementById('cond_propia').checked = hasCond('propia');
  if (document.getElementById('cond_arrendada')) document.getElementById('cond_arrendada').checked = hasCond('arrendada');
  if (document.getElementById('cond_anticresis')) document.getElementById('cond_anticresis').checked = hasCond('anticresis');
  if (document.getElementById('cond_prestada')) document.getElementById('cond_prestada').checked = hasCond('prestada');
  if (document.getElementById('cond_compartida')) document.getElementById('cond_compartida').checked = hasCond('compartida');
  if (document.getElementById('cond_prestamo')) document.getElementById('cond_prestamo').checked = hasCond('préstamo') || hasCond('prestamo');

  const servs = Array.isArray(socio.servicios_basicos) ? socio.servicios_basicos : (socio.servicios_basicos ? [socio.servicios_basicos] : []);
  const hasServ = (val) => servs.some(s => String(s).toLowerCase().includes(val.toLowerCase()));
  if (document.getElementById('serv_luz')) document.getElementById('serv_luz').checked = hasServ('luz');
  if (document.getElementById('serv_agua')) document.getElementById('serv_agua').checked = hasServ('agua');
  if (document.getElementById('serv_sshh')) document.getElementById('serv_sshh').checked = hasServ('sshh');
  if (document.getElementById('serv_pozo')) document.getElementById('serv_pozo').checked = hasServ('pozo');
  if (document.getElementById('serv_telefono')) document.getElementById('serv_telefono').checked = hasServ('teléfono') || hasServ('telefono');
  if (document.getElementById('serv_celular')) document.getElementById('serv_celular').checked = hasServ('celular');
  if (document.getElementById('serv_internet')) document.getElementById('serv_internet').checked = hasServ('internet');
  if (document.getElementById('serv_cable')) document.getElementById('serv_cable').checked = hasServ('cable');
  if (document.getElementById('serv_computador')) document.getElementById('serv_computador').checked = hasServ('computador');
  if (document.getElementById('serv_laptop')) document.getElementById('serv_laptop').checked = hasServ('laptop');
  if (document.getElementById('serv_tablet')) document.getElementById('serv_tablet').checked = hasServ('tablet');
  if (document.getElementById('serv_videojuegos')) document.getElementById('serv_videojuegos').checked = hasServ('video') || hasServ('juegos');

  const s = data.datos_salud || {};
  if (s.discapacidad) document.getElementById('salud_disc').value = s.discapacidad;
  if (s.discapacidad_tipo) document.getElementById('salud_disc_tipo').value = s.discapacidad_tipo;
  if (s.condicion_medica) document.getElementById('salud_cond').value = s.condicion_medica;
  if (s.alergias) document.getElementById('salud_alergias').value = s.alergias;
  if (s.medicamentos) document.getElementById('salud_meds').value = s.medicamentos;

  const medAt = Array.isArray(s.atencion_medica) ? s.atencion_medica : (s.atencion_medica ? [s.atencion_medica] : []);
  const hasMed = (val) => medAt.some(m => String(m).toLowerCase().includes(val.toLowerCase()));
  if (document.getElementById('med_centro_salud')) document.getElementById('med_centro_salud').checked = hasMed('centro');
  if (document.getElementById('med_subcentro')) document.getElementById('med_subcentro').checked = hasMed('subcentro');
  if (document.getElementById('med_hospital_pub')) document.getElementById('med_hospital_pub').checked = hasMed('hospital');
  if (document.getElementById('med_clinica_priv')) document.getElementById('med_clinica_priv').checked = hasMed('clínica') || hasMed('clinica');
  if (document.getElementById('salud_med_nota') && s.atencion_medica_nota) document.getElementById('salud_med_nota').value = s.atencion_medica_nota;

  // Punto 6: Datos Académicos
  const ac = data.datos_academicos || {};
  if (ac.fecha_ingreso) document.getElementById('acad_fecha_ingreso').value = ac.fecha_ingreso;
  if (ac.institucion_procedencia) document.getElementById('acad_inst').value = ac.institucion_procedencia;
  if (ac.ha_repetido_anios) document.getElementById('acad_rep').value = ac.ha_repetido_anios;
  if (ac.anios_repetidos) document.getElementById('acad_anios_rep').value = ac.anios_repetidos;
  if (ac.asignaturas_preferencia) document.getElementById('acad_pref').value = ac.asignaturas_preferencia;
  if (ac.asignaturas_dificultad) document.getElementById('acad_dif').value = ac.asignaturas_dificultad;
  if (ac.dignidades_alcanzadas) document.getElementById('acad_dignidades').value = ac.dignidades_alcanzadas;
  if (ac.logros_academicos) document.getElementById('acad_logros').value = ac.logros_academicos;
  if (ac.participacion) document.getElementById('acad_participacion').value = ac.participacion;
  if (ac.clubes) document.getElementById('acad_clubes').value = ac.clubes;
  if (ac.extracurriculares) document.getElementById('acad_extracurriculares').value = ac.extracurriculares;

  // Punto 7: Historia Vital
  const hv = data.historia_vital || {};
  if (hv.edad_madre_al_nacer) document.getElementById('hist_edad_madre').value = hv.edad_madre_al_nacer;
  if (hv.accidentes_embarazo) document.getElementById('hist_acc_embarazo').value = hv.accidentes_embarazo;
  if (hv.medicamentos_embarazo) document.getElementById('hist_meds_embarazo').value = hv.medicamentos_embarazo;
  if (hv.medicamentos_embarazo_cuales) document.getElementById('hist_meds_cuales').value = hv.medicamentos_embarazo_cuales;

  const partos = Array.isArray(hv.tipo_parto) ? hv.tipo_parto : (hv.tipo_parto ? [hv.tipo_parto] : []);
  const hasParto = (val) => partos.some(p => String(p).toLowerCase().includes(val.toLowerCase()));
  if (document.getElementById('parto_termino')) document.getElementById('parto_termino').checked = hasParto('término') || hasParto('termino');
  if (document.getElementById('parto_prematuro')) document.getElementById('parto_prematuro').checked = hasParto('prematuro');
  if (document.getElementById('parto_cesarea')) document.getElementById('parto_cesarea').checked = hasParto('cesárea') || hasParto('cesarea');
  if (document.getElementById('parto_normal')) document.getElementById('parto_normal').checked = hasParto('normal');

  if (hv.dificultades_embarazo) document.getElementById('hist_dif_embarazo').value = hv.dificultades_embarazo;
  if (hv.peso_nacer) document.getElementById('hist_peso_nacer').value = hv.peso_nacer;
  if (hv.talla_nacer) document.getElementById('hist_talla_nacer').value = hv.talla_nacer;
  if (hv.edad_empezo_caminar) document.getElementById('hist_edad_caminar').value = hv.edad_empezo_caminar;
  if (hv.edad_hablo_primera_vez) document.getElementById('hist_edad_hablo').value = hv.edad_hablo_primera_vez;
  if (hv.periodo_lactancia) document.getElementById('hist_lactancia').value = hv.periodo_lactancia;
  if (hv.edad_utilizo_biberon) document.getElementById('hist_edad_biberon').value = hv.edad_utilizo_biberon;
  if (hv.edad_control_esfinteres) document.getElementById('hist_edad_esfinteres').value = hv.edad_control_esfinteres;

  if (hv.enfermedades_infancia) document.getElementById('hist_enf_desc').value = hv.enfermedades_infancia;
  if (hv.accidentes_infancia) document.getElementById('hist_acc_desc').value = hv.accidentes_infancia;
  if (hv.alergias_infancia) document.getElementById('hist_alergias_desc').value = hv.alergias_infancia;
  if (hv.cirugias) document.getElementById('hist_cirugias_desc').value = hv.cirugias;
  if (hv.perdidas_conocimiento) document.getElementById('hist_perdidas_desc').value = hv.perdidas_conocimiento;
  if (hv.otros_salud_infancia) document.getElementById('hist_otros_salud_desc').value = hv.otros_salud_infancia;

  // Antecedentes patológicos
  const patol = data.antecedentes_patologicos || {};
  if (document.getElementById('patol_obesidad')) document.getElementById('patol_obesidad').checked = !!patol.obesidad;
  if (document.getElementById('patol_cardiacas')) document.getElementById('patol_cardiacas').checked = !!patol.enfermedades_cardiacas;
  if (document.getElementById('patol_hipertension')) document.getElementById('patol_hipertension').checked = !!patol.hipertension;
  if (document.getElementById('patol_diabetes')) document.getElementById('patol_diabetes').checked = !!patol.diabetes;
  if (document.getElementById('patol_mentales')) document.getElementById('patol_mentales').checked = !!patol.enfermedades_mentales;
  if (patol.otros) document.getElementById('patol_otros').value = patol.otros;

  // Entorno y firma
  const ent = data.entorno_familiar_habitos || {};
  if (ent.relacion_padre) document.getElementById('entorno_rel_padre').value = ent.relacion_padre;
  if (ent.relacion_madre) document.getElementById('entorno_rel_madre').value = ent.relacion_madre;
  if (ent.relacion_hermanos) document.getElementById('entorno_rel_hermanos').value = ent.relacion_hermanos;
  if (ent.relacion_otros) document.getElementById('entorno_rel_otros').value = ent.relacion_otros;
  if (ent.costumbres_habitos) document.getElementById('habitos_desc').value = ent.costumbres_habitos;
  if (ent.observaciones) document.getElementById('habitos_obs').value = ent.observaciones;
  if (ent.firma_ci) document.getElementById('firma_ci').value = ent.firma_ci;
}
