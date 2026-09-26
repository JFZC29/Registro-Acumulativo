window.handleAdminLogout = async function() {
  const confirmed = await window.showAppConfirm({
    title: 'Cerrar Sesión',
    message: '¿Está seguro de que desea cerrar la sesión del panel administrativo?',
    confirmText: 'Cerrar Sesión',
    cancelText: 'Cancelar',
    isWarning: true
  });
  if (confirmed) {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('dece_admin_token');
    localStorage.removeItem('dece_admin_user');
    window.location.href = '/login.html';
  }
};

﻿// Admin Panel Management Script
let adminCroquis = null;
let currentRecord = null;
let currentPage = 1;
let currentSearch = '';
let currentCourse = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Verify Authentication
  await checkAuth();

  // Initialize Croquis in Modal
  adminCroquis = new CroquisEditor('adminCroquisCanvas');
  setupAdminCroquisTools();

  // Load Dashboard Data
  loadStats();
  loadRecords();

  // Search & Filter Listeners
  setupSearchAndFilters();

  // Action Buttons
  setupAdminButtons();

  // Age Auto-calculation
  setupAdminAgeCalculation();
});

function getLocalRecords() {
  try {
    return JSON.parse(localStorage.getItem('dece_saved_records') || '[]');
  } catch (e) {
    return [];
  }
}

function setLocalRecords(recs) {
  localStorage.setItem('dece_saved_records', JSON.stringify(recs));
}

// Auth Check
async function checkAuth() {
  const token = localStorage.getItem('dece_admin_token');
  if (!token) {
    window.location.href = './login.html';
    return;
  }
  try {
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const display = document.getElementById('admin-user-display');
      if (display && data.user) display.textContent = data.user.name || data.user.username;
    } else {
      throw new Error('Unauthenticated');
    }
  } catch (err) {
    const savedUser = JSON.parse(localStorage.getItem('dece_admin_user') || '{}');
    const display = document.getElementById('admin-user-display');
    if (display) display.textContent = savedUser.name || savedUser.username || 'Administrador';
  }
}

// Load Stats
async function loadStats() {
  const token = localStorage.getItem('dece_admin_token');
  let stats = null;
  try {
    const res = await fetch('/api/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.stats) stats = data.stats;
  } catch (err) {
    // Fallback local
    const recs = getLocalRecords();
    const byCourse = {};
    let withDisability = 0;
    recs.forEach(r => {
      const c = r.identificacion?.curso || 'Sin especificar';
      byCourse[c] = (byCourse[c] || 0) + 1;
      if (r.datos_salud?.discapacidad === 'Sí' || r.datos_salud?.discapacidad === 'SI') withDisability++;
    });
    stats = {
      totalRecords: recs.length,
      withDisability,
      byCourse
    };
  }

  if (stats) {
    const totEl = document.getElementById('stat-total');
    const disEl = document.getElementById('stat-disability');
    const couEl = document.getElementById('stat-courses');
    if (totEl) totEl.textContent = stats.totalRecords || 0;
    if (disEl) disEl.textContent = stats.withDisability || 0;
    if (couEl) couEl.textContent = Object.keys(stats.byCourse || {}).length;

    const courseSelect = document.getElementById('admin-filter-curso');
    if (courseSelect) {
      courseSelect.innerHTML = '<option value="">Todos los cursos</option>';
      Object.keys(stats.byCourse || {}).sort().forEach(c => {
        if (c && c !== 'Sin especificar') {
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = `${c} (${stats.byCourse[c]})`;
          courseSelect.appendChild(opt);
        }
      });
    }
  }
}

// Load Records Table
async function loadRecords(page = 1) {
  currentPage = page;
  const token = localStorage.getItem('dece_admin_token');
  const tbody = document.getElementById('records-table-body');
  tbody.innerHTML = '<tr><td colspan="7" class="text-center py-10 text-slate-400 font-medium">Cargando registros...</td></tr>';

  let records = [];
  let total = 0;
  let totalPages = 1;
  const limit = 15;

  try {
    const params = new URLSearchParams({
      page,
      limit,
      search: currentSearch,
      curso: currentCourse
    });

    const res = await fetch(`/api/records?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.records) {
      records = data.records;
      total = data.total;
      totalPages = data.totalPages;
    } else {
      throw new Error('No records returned');
    }
  } catch (fetchErr) {
    let all = getLocalRecords();
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      all = all.filter(r => 
        (r.identificacion?.estudiante || '').toLowerCase().includes(q) ||
        (r.identificacion?.num_identificacion || '').toLowerCase().includes(q) ||
        (r.datos_familiares?.representante?.nombre || '').toLowerCase().includes(q)
      );
    }
    if (currentCourse) {
      all = all.filter(r => (r.identificacion?.curso || '').includes(currentCourse));
    }
    total = all.length;
    totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    records = all.slice(start, start + limit);
  }

  if (!records || records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-2">&#128237;</div>
          <p class="font-bold text-sm text-slate-600">No se encontraron registros</p>
          <p class="text-xs text-slate-400 mt-0.5">Intente con otros términos de búsqueda o cree un nuevo registro.</p>
        </td>
      </tr>
    `;
    document.getElementById('pagination-info').textContent = 'Mostrando 0 registros';
    return;
  }

  tbody.innerHTML = '';
  records.forEach(record => {
      const ident = record.identificacion || {};
      const rep = record.datos_familiares?.representante || {};
      const regDate = record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A';
      const hasDisc = record.datos_salud?.discapacidad === 'Sí' || record.datos_salud?.discapacidad === 'SI';
      const studentName = ident.estudiante || 'Sin nombre';
      const initial = studentName.charAt(0).toUpperCase() || 'E';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-blue-50/40 transition border-b border-slate-100 group';
      tr.innerHTML = `
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
              ${initial}
            </div>
            <div>
              <div class="font-bold text-slate-900 leading-tight">${studentName}</div>
              ${hasDisc ? '<span class="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">&#9855; Discapacidad</span>' : ''}
            </div>
          </div>
        </td>
        <td class="py-3.5 px-3 font-mono font-medium text-slate-700">${ident.num_identificacion || '—'}</td>
        <td class="py-3.5 px-3">
          <span class="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
            ${ident.curso || '—'}
          </span>
        </td>
        <td class="py-3.5 px-3 text-slate-700 font-medium">${rep.nombre || '—'}</td>
        <td class="py-3.5 px-3 text-slate-600 font-mono text-[11px]">${ident.celular || ident.telefono || rep.telefonos || '—'}</td>
        <td class="py-3.5 px-3 text-slate-500 text-[11px]">${regDate}</td>
        <td class="py-3.5 px-4 text-center">
          <div class="inline-flex items-center gap-1.5">
            <button type="button" class="btn-pdf-row px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 transition shadow-sm" title="Descargar PDF">
              &#128229; PDF
            </button>
            <button type="button" class="btn-preview-row p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition" title="Ver Vista Previa">
              &#128065;
            </button>
            <button type="button" class="btn-edit-row p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs border border-amber-100 transition" title="Editar">
              &#9998;
            </button>
            <button type="button" class="btn-delete-row p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs border border-rose-100 transition" title="Eliminar">
              &#128465;&#65039;
            </button>
          </div>
        </td>
      `;

      // Event listeners for row buttons
      tr.querySelector('.btn-pdf-row').onclick = () => PDFEngine.download(record);
      tr.querySelector('.btn-preview-row').onclick = () => PDFEngine.preview(record);
      tr.querySelector('.btn-edit-row').onclick = () => openEditModal(record);
      tr.querySelector('.btn-delete-row').onclick = () => deleteRecord(record.id, ident.estudiante);

      tbody.appendChild(tr);
    });

    // Pagination Controls
    document.getElementById('pagination-info').textContent = `Mostrando ${data.records.length} de ${data.total} registros (Página ${data.page} de ${data.totalPages})`;
    document.getElementById('page-indicator').textContent = `Página ${data.page} de ${data.totalPages}`;

    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');
    prevBtn.disabled = data.page <= 1;
    nextBtn.disabled = data.page >= data.totalPages;

    prevBtn.onclick = () => loadRecords(data.page - 1);
    nextBtn.onclick = () => loadRecords(data.page + 1);

  } catch (err) {
    console.error('Error loading records:', err);
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-6 text-red-500 font-semibold">Error al cargar registros</td></tr>';
  }
}
// Search & Filter listeners
function setupSearchAndFilters() {
  const searchInput = document.getElementById('admin-search-input');
  const courseFilter = document.getElementById('admin-filter-curso');
  const refreshBtn = document.getElementById('btn-admin-refresh');

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentSearch = searchInput.value;
      loadRecords(1);
    }, 400);
  });

  courseFilter.addEventListener('change', () => {
    currentCourse = courseFilter.value;
    loadRecords(1);
  });

  refreshBtn.addEventListener('click', () => {
    loadStats();
    loadRecords(currentPage);
  });
}

// Admin Action Buttons
function setupAdminButtons() {
  // New Record
  document.getElementById('btn-admin-new').onclick = () => {
    openEditModal(null); // Create new
  };

  // Logout
  const logoutBtn = document.getElementById('btn-logout'); if (logoutBtn) logoutBtn.onclick = () => window.handleAdminLogout();

  // Change Password Modal
  document.getElementById('btn-change-pass').onclick = () => {
    document.getElementById('modalChangePass').classList.remove('hidden');
    document.getElementById('cp_current').value = '';
    document.getElementById('cp_new').value = '';
    document.getElementById('cp_error').classList.add('hidden');
  };

  document.getElementById('formChangePass').onsubmit = async (e) => {
    e.preventDefault();
    const cur = document.getElementById('cp_current').value;
    const nw = document.getElementById('cp_new').value;
    const token = localStorage.getItem('dece_admin_token');
    const errDiv = document.getElementById('cp_error');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar contraseña');

      await window.showAppAlert('Contraseña Actualizada', 'La contraseña de administrador ha sido actualizada con éxito.', 'success');
      document.getElementById('modalChangePass').classList.add('hidden');
    } catch (err) {
      errDiv.textContent = err.message;
      errDiv.classList.remove('hidden');
    }
  };

  // Form Save in Editor Modal
  document.getElementById('adminRecordForm').onsubmit = async (e) => {
    e.preventDefault();
    await saveEditorRecord();
  };
}

// Automatic Age Calculation for Admin Record Editor
function setupAdminAgeCalculation() {
  const birthInput = document.getElementById('a_est_fecha_nac');
  const ageInput = document.getElementById('a_est_edad');
  if (!birthInput || !ageInput) return;

  const updateAge = () => {
    const val = birthInput.value;
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const birthDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age < 120) {
        ageInput.value = `${age} años`;
      }
    }
  };

  birthInput.addEventListener('input', updateAge);
  birthInput.addEventListener('change', updateAge);
}

// Croquis Tools for Admin Modal
function setupAdminCroquisTools() {
  const toolBtns = document.querySelectorAll('#modalRecordEditor .croquis-tool-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('apple-btn-primary'));
      toolBtns.forEach(b => b.classList.add('apple-btn-secondary'));
      btn.classList.remove('apple-btn-secondary');
      btn.classList.add('apple-btn-primary');
      if (adminCroquis) adminCroquis.tool = btn.dataset.tool;
    });
  });

  const undoBtn = document.getElementById('a-btn-undo');
  if (undoBtn) undoBtn.onclick = () => { if (adminCroquis) adminCroquis.undo(); };

  const clearBtn = document.getElementById('a-btn-clear');
  if (clearBtn) clearBtn.onclick = () => { if (adminCroquis) adminCroquis.clear(); };

  const fileInp = document.getElementById('a-croquis-file');
  if (fileInp) {
    fileInp.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0] && adminCroquis) {
        adminCroquis.loadImage(e.target.files[0]);
      }
    });
  }
}

// Open Editor Modal (Create or Edit)
function openEditModal(record) {
  currentRecord = record;
  const modal = document.getElementById('modalRecordEditor');
  const title = document.getElementById('editor-modal-title');
  const subtitle = document.getElementById('editor-modal-subtitle');
  const pdfBtn = document.getElementById('editor-btn-pdf');
  const previewBtn = document.getElementById('editor-btn-preview');

  if (record) {
    title.textContent = `Editar Registro: ${record.identificacion?.estudiante || ''}`;
    subtitle.textContent = `ID: ${record.id} · Cédula: ${record.identificacion?.num_identificacion || ''}`;
    pdfBtn.style.display = 'inline-flex';
    previewBtn.style.display = 'inline-flex';
    pdfBtn.onclick = () => PDFEngine.download(currentRecord);
    previewBtn.onclick = () => PDFEngine.preview(currentRecord);

    document.getElementById('edit_record_id').value = record.id;
    fillEditorValues(record);
  } else {
    title.textContent = 'Crear Nuevo Registro Acumulativo';
    subtitle.textContent = 'Ingrese la información completa para registrar al estudiante';
    pdfBtn.style.display = 'none';
    previewBtn.style.display = 'none';
    document.getElementById('edit_record_id').value = '';
    document.getElementById('adminRecordForm').reset();
    adminCroquis.clear();
  }

  modal.classList.remove('hidden');
}

function closeEditorModal() {
  document.getElementById('modalRecordEditor').classList.add('hidden');
  currentRecord = null;
}

function fillEditorValues(r) {
  const ident = r.identificacion || {};
  document.getElementById('a_est_nombre').value = ident.estudiante || '';
  document.getElementById('a_est_nacionalidad').value = ident.nacionalidad || '';
  document.getElementById('a_est_identificacion').value = ident.num_identificacion || '';
  document.getElementById('a_est_fecha_nac').value = ident.fecha_nacimiento || '';
  document.getElementById('a_est_edad').value = ident.edad || '';
  
  const cursoEl = document.getElementById('a_est_curso');
  const parEl = document.getElementById('a_est_paralelo');
  if (cursoEl && ident.curso) {
    for (let opt of cursoEl.options) {
      if (ident.curso.toUpperCase().includes(opt.value.toUpperCase())) {
        cursoEl.value = opt.value;
        break;
      }
    }
  }
  if (parEl && ident.curso) {
    for (let opt of parEl.options) {
      if (ident.curso.toUpperCase().includes(`"${opt.value}"`) || ident.curso.toUpperCase().endsWith(` ${opt.value}`)) {
        parEl.value = opt.value;
        break;
      }
    }
  }

  document.getElementById('a_est_etnico').value = ident.grupo_etnico || '';
  document.getElementById('a_est_tel').value = ident.telefono || '';
  document.getElementById('a_est_cel').value = ident.celular || '';
  document.getElementById('a_est_domicilio').value = ident.domicilio || '';

  if (ident.croquis_data) {
    adminCroquis.loadImage(ident.croquis_data);
  } else {
    adminCroquis.clear();
  }

  const m = r.datos_familiares?.madre || {};
  document.getElementById('a_m_nom').value = m.nombre || '';
  document.getElementById('a_m_edad').value = m.edad || '';
  document.getElementById('a_m_ec').value = m.estado_civil || '';
  document.getElementById('a_m_inst').value = m.instruccion || '';
  document.getElementById('a_m_prof').value = m.profesion || '';
  document.getElementById('a_m_trab').value = m.lugar_trabajo || '';
  document.getElementById('a_m_tel').value = m.telefonos || '';

  const p = r.datos_familiares?.padre || {};
  document.getElementById('a_p_nom').value = p.nombre || '';
  document.getElementById('a_p_edad').value = p.edad || '';
  document.getElementById('a_p_ec').value = p.estado_civil || '';
  document.getElementById('a_p_inst').value = p.instruccion || '';
  document.getElementById('a_p_prof').value = p.profesion || '';
  document.getElementById('a_p_trab').value = p.lugar_trabajo || '';
  document.getElementById('a_p_tel').value = p.telefonos || '';

  const rep = r.datos_familiares?.representante || {};
  document.getElementById('a_r_nom').value = rep.nombre || '';
  document.getElementById('a_r_edad').value = rep.edad || '';
  document.getElementById('a_r_ec').value = rep.estado_civil || '';
  document.getElementById('a_r_inst').value = rep.instruccion || '';
  document.getElementById('a_r_prof').value = rep.profesion || '';
  document.getElementById('a_r_trab').value = rep.lugar_trabajo || '';
  document.getElementById('a_r_tel').value = rep.telefonos || '';

  document.getElementById('a_ing_total').value = r.referencias_socioeconomicas?.ingresos?.total || '0';
  document.getElementById('a_egr_total').value = r.referencias_socioeconomicas?.egresos?.total || '0';
  document.getElementById('a_socio_prestamos').value = r.referencias_socioeconomicas?.recibido_prestamos || '';

  const s = r.datos_salud || {};
  document.getElementById('a_salud_disc').value = s.discapacidad || 'No';
  document.getElementById('a_salud_disc_tipo').value = s.discapacidad_tipo || '';
  document.getElementById('a_salud_cond').value = s.condicion_medica || '';
  document.getElementById('a_salud_alergias').value = s.alergias || '';
  document.getElementById('a_salud_meds').value = s.medicamentos || '';

  const ac = r.datos_academicos || {};
  document.getElementById('a_acad_inst').value = ac.institucion_procedencia || '';
  document.getElementById('a_acad_rep').value = ac.ha_repetido_anios || 'No';
  document.getElementById('a_acad_pref').value = ac.asignaturas_preferencia || '';
  document.getElementById('a_acad_dif').value = ac.asignaturas_dificultad || '';

  document.getElementById('a_habitos').value = r.entorno_familiar_habitos?.costumbres_habitos || '';
  document.getElementById('a_firma_ci').value = r.entorno_familiar_habitos?.firma_ci || '';
}

// Save Editor Record (PUT or POST)
async function saveEditorRecord() {
  const token = localStorage.getItem('dece_admin_token');
  const id = document.getElementById('edit_record_id').value;

  // Collect Housing Conditions
  const condVivienda = [];
  if (document.getElementById('a_cond_propia')?.checked) condVivienda.push('Propia');
  if (document.getElementById('a_cond_arrendada')?.checked) condVivienda.push('Arrendada');
  if (document.getElementById('a_cond_anticresis')?.checked) condVivienda.push('Anticresis');
  if (document.getElementById('a_cond_prestada')?.checked) condVivienda.push('Prestada');
  if (document.getElementById('a_cond_compartida')?.checked) condVivienda.push('Compartida');
  if (document.getElementById('a_cond_prestamo')?.checked) condVivienda.push('Con préstamo');

  // Collect Basic Services
  const servBasicos = [];
  if (document.getElementById('a_serv_luz')?.checked) servBasicos.push('Luz eléctrica');
  if (document.getElementById('a_serv_agua')?.checked) servBasicos.push('Agua potable');
  if (document.getElementById('a_serv_sshh')?.checked) servBasicos.push('SSHH');
  if (document.getElementById('a_serv_pozo')?.checked) servBasicos.push('Pozo séptico');
  if (document.getElementById('a_serv_tel')?.checked) servBasicos.push('Teléfono');
  if (document.getElementById('a_serv_cel')?.checked) servBasicos.push('Celular');
  if (document.getElementById('a_serv_net')?.checked) servBasicos.push('Internet');
  if (document.getElementById('a_serv_cable')?.checked) servBasicos.push('Cable');
  if (document.getElementById('a_serv_comp')?.checked) servBasicos.push('Computador');
  if (document.getElementById('a_serv_lap')?.checked) servBasicos.push('Laptop');
  if (document.getElementById('a_serv_tab')?.checked) servBasicos.push('Tablet');
  if (document.getElementById('a_serv_juegos')?.checked) servBasicos.push('Video juegos');

  // Collect Medical Attendance
  const medAtencion = [];
  if (document.getElementById('a_med_centro')?.checked) medAtencion.push('Centro de salud');
  if (document.getElementById('a_med_subcentro')?.checked) medAtencion.push('Subcentro de salud');
  if (document.getElementById('a_med_hospital')?.checked) medAtencion.push('Hospital público');
  if (document.getElementById('a_med_clinica')?.checked) medAtencion.push('Clínica privada');

  // Collect Tipo de Parto
  const tipoParto = [];
  if (document.getElementById('a_parto_termino')?.checked) tipoParto.push('al término');
  if (document.getElementById('a_parto_prematuro')?.checked) tipoParto.push('Prematuro');
  if (document.getElementById('a_parto_cesarea')?.checked) tipoParto.push('Cesárea');
  if (document.getElementById('a_parto_normal')?.checked) tipoParto.push('Parto normal');

  const cursoVal = document.getElementById('a_est_curso')?.value || '';
  const parVal = document.getElementById('a_est_paralelo')?.value || '';
  const fullCurso = cursoVal ? (parVal ? `${cursoVal} "${parVal}"` : cursoVal) : '';

  const payload = {
    identificacion: {
      estudiante: document.getElementById('a_est_nombre').value.trim(),
      nacionalidad: document.getElementById('a_est_nacionalidad').value.trim() || 'ECUATORIANA',
      num_identificacion: document.getElementById('a_est_identificacion').value.trim(),
      fecha_nacimiento: document.getElementById('a_est_fecha_nac').value,
      edad: document.getElementById('a_est_edad').value,
      curso: fullCurso,
      grupo_etnico: document.getElementById('a_est_etnico').value.trim() || 'MESTIZO',
      telefono: document.getElementById('a_est_tel').value.trim(),
      celular: document.getElementById('a_est_cel').value.trim(),
      domicilio: document.getElementById('a_est_domicilio').value.trim(),
      croquis_data: adminCroquis ? adminCroquis.getDataURL() : ''
    },
    datos_familiares: {
      madre: {
        nombre: document.getElementById('a_m_nom').value.trim(),
        edad: document.getElementById('a_m_edad').value,
        estado_civil: document.getElementById('a_m_ec').value.trim(),
        instruccion: document.getElementById('a_m_inst').value.trim(),
        profesion: document.getElementById('a_m_prof').value.trim(),
        lugar_trabajo: document.getElementById('a_m_trab').value.trim(),
        telefonos: document.getElementById('a_m_tel').value.trim()
      },
      padre: {
        nombre: document.getElementById('a_p_nom').value.trim(),
        edad: document.getElementById('a_p_edad').value,
        estado_civil: document.getElementById('a_p_ec').value.trim(),
        instruccion: document.getElementById('a_p_inst').value.trim(),
        profesion: document.getElementById('a_p_prof').value.trim(),
        lugar_trabajo: document.getElementById('a_p_trab').value.trim(),
        telefonos: document.getElementById('a_p_tel').value.trim()
      },
      representante: {
        nombre: document.getElementById('a_r_nom').value.trim(),
        parentesco: document.getElementById('a_r_par')?.value.trim() || 'MADRE',
        edad: document.getElementById('a_r_edad').value,
        estado_civil: document.getElementById('a_r_ec').value.trim(),
        instruccion: document.getElementById('a_r_inst').value.trim(),
        profesion: document.getElementById('a_r_prof').value.trim(),
        lugar_trabajo: document.getElementById('a_r_trab').value.trim(),
        telefonos: document.getElementById('a_r_tel').value.trim()
      },
      otros_familiares: currentRecord?.datos_familiares?.otros_familiares || []
    },
    referencias_socioeconomicas: {
      ingresos: {
        total: document.getElementById('a_ing_total').value || '0.00'
      },
      egresos: {
        total: document.getElementById('a_egr_total').value || '0.00'
      },
      condicion_vivienda: condVivienda,
      recibido_prestamos: document.getElementById('a_socio_prestamos').value.trim(),
      servicios_basicos: servBasicos
    },
    datos_salud: {
      discapacidad: document.getElementById('a_salud_disc').value,
      discapacidad_tipo: document.getElementById('a_salud_disc_tipo').value.trim(),
      condicion_medica: document.getElementById('a_salud_cond').value.trim(),
      alergias: document.getElementById('a_salud_alergias').value.trim(),
      medicamentos: document.getElementById('a_salud_meds').value.trim(),
      atencion_medica: medAtencion
    },
    datos_academicos: {
      fecha_ingreso: document.getElementById('a_acad_fecha_ingreso').value,
      institucion_procedencia: document.getElementById('a_acad_inst').value.trim(),
      ha_repetido_anios: document.getElementById('a_acad_rep').value,
      anios_repetidos: document.getElementById('a_acad_anios_rep').value.trim(),
      asignaturas_preferencia: document.getElementById('a_acad_pref').value.trim(),
      asignaturas_dificultad: document.getElementById('a_acad_dif').value.trim(),
      dignidades_alcanzadas: document.getElementById('a_acad_dignidades').value.trim(),
      logros_academicos: document.getElementById('a_acad_logros').value.trim(),
      participacion: document.getElementById('a_acad_participacion').value.trim(),
      clubes: document.getElementById('a_acad_clubes').value.trim(),
      extracurriculares: document.getElementById('a_acad_extracurriculares').value.trim()
    },
    historia_vital: {
      edad_madre_al_nacer: document.getElementById('a_hist_edad_madre').value,
      accidentes_embarazo: document.getElementById('a_hist_acc_embarazo').value.trim(),
      medicamentos_embarazo: document.getElementById('a_hist_meds_embarazo').value.trim(),
      medicamentos_embarazo_cuales: document.getElementById('a_hist_meds_cuales').value.trim(),
      tipo_parto: tipoParto,
      dificultades_embarazo: document.getElementById('a_hist_dif_embarazo').value.trim(),
      peso_nacer: document.getElementById('a_hist_peso_nacer').value.trim(),
      talla_nacer: document.getElementById('a_hist_talla_nacer').value.trim(),
      edad_empezo_caminar: document.getElementById('a_hist_edad_caminar').value.trim(),
      edad_hablo_primera_vez: document.getElementById('a_hist_edad_hablo').value.trim(),
      periodo_lactancia: document.getElementById('a_hist_lactancia').value.trim(),
      edad_utilizo_biberon: document.getElementById('a_hist_edad_biberon').value.trim(),
      edad_control_esfinteres: document.getElementById('a_hist_edad_esfinteres').value.trim(),
      enfermedades_infancia: document.getElementById('a_hist_enf_desc').value.trim(),
      accidentes_infancia: document.getElementById('a_hist_acc_desc').value.trim(),
      alergias_infancia: document.getElementById('a_hist_alergias_desc').value.trim(),
      cirugias: document.getElementById('a_hist_cirugias_desc').value.trim(),
      perdidas_conocimiento: document.getElementById('a_hist_perdidas_desc').value.trim(),
      otros_salud_infancia: document.getElementById('a_hist_otros_salud_desc').value.trim()
    },
    antecedentes_patologicos: {
      obesidad: document.getElementById('a_patol_obesidad')?.checked || false,
      enfermedades_cardiacas: document.getElementById('a_patol_cardiacas')?.checked || false,
      hipertension: document.getElementById('a_patol_hipertension')?.checked || false,
      diabetes: document.getElementById('a_patol_diabetes')?.checked || false,
      enfermedades_mentales: document.getElementById('a_patol_mentales')?.checked || false,
      otros: document.getElementById('a_patol_otros').value.trim()
    },
    entorno_familiar_habitos: {
      relacion_padre: document.getElementById('a_entorno_rel_padre').value.trim(),
      relacion_madre: document.getElementById('a_entorno_rel_madre').value.trim(),
      relacion_hermanos: document.getElementById('a_entorno_rel_hermanos').value.trim(),
      relacion_otros: document.getElementById('a_entorno_rel_otros').value.trim(),
      costumbres_habitos: document.getElementById('a_habitos').value.trim(),
      firma_ci: document.getElementById('a_firma_ci').value.trim(),
      firma_representante: document.getElementById('a_firma_ci').value.trim()
    }
  };

  const btn = document.getElementById('btn-save-edit');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  try {
    const url = id ? `/api/records/${id}` : '/api/records';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('API save failed');
    } catch (fetchErr) {
      // Local storage fallback for GitHub Pages
      let recs = getLocalRecords();
      if (id) {
        const idx = recs.findIndex(r => r.id === id);
        if (idx !== -1) {
          recs[idx] = { ...recs[idx], ...payload, id, updated_at: new Date().toISOString() };
        } else {
          recs.unshift({ ...payload, id, updated_at: new Date().toISOString() });
        }
      } else {
        payload.id = 'REC-' + Date.now();
        payload.created_at = new Date().toISOString();
        payload.updated_at = new Date().toISOString();
        recs.unshift(payload);
      }
      setLocalRecords(recs);
    }

    window.showToast('Registro guardado exitosamente', 'success');
    closeEditorModal();
    loadStats();
    loadRecords(currentPage);
  } catch (err) {
    window.showToast(err.message || 'Error al guardar', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '💾 Guardar Cambios';
  }
}

// Delete Record
async function deleteRecord(id, studentName) {
  const confirmed = await window.showAppConfirm({
    title: 'Eliminar Registro',
    message: '¿Está seguro de eliminar permanentemente el registro de <b>' + (studentName || 'este estudiante') + '</b>?<br><br><span class="text-red-500 font-semibold">Esta acción no se puede deshacer.</span>',
    confirmText: 'Eliminar Registro',
    cancelText: 'Cancelar',
    isDanger: true
  });

  if (!confirmed) return;

  const token = localStorage.getItem('dece_admin_token');
  try {
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API delete failed');
    } catch (fetchErr) {
      let recs = getLocalRecords();
      recs = recs.filter(r => r.id !== id);
      setLocalRecords(recs);
    }

    window.showToast('Registro eliminado correctamente', 'success');
    loadStats();
    loadRecords(currentPage);
  } catch (err) {
    window.showToast(err.message || 'Error al eliminar', 'error');
  }
}
