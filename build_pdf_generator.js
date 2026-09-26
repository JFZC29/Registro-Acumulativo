const fs = require('fs');
let s = '';
function add(x) { s += x; }

add(`// PDF Generator Module for 4-Page Cumulative Record

function esc(val) {
  if (val === undefined || val === null) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCheck(isChecked, label) {
  return '<span class="pdf-check-item"><span class="pdf-check-box ' + (isChecked ? 'checked' : '') + '"></span> ' + esc(label) + '</span>';
}

function hasVal(arrOrStr, target) {
  if (!arrOrStr) return false;
  if (Array.isArray(arrOrStr)) {
    return arrOrStr.some(item => String(item).toLowerCase().trim() === String(target).toLowerCase().trim());
  }
  return String(arrOrStr).toLowerCase().includes(String(target).toLowerCase());
}

function buildPDFPagesHTML(record) {
  const ident = record.identificacion || {};
  const fam = record.datos_familiares || {};
  const madre = fam.madre || {};
  const padre = fam.padre || {};
  const rep = fam.representante || {};
  const refFam = record.referencias_familiares || {};
  const otrosFam = refFam.otros_familiares || [];
  const socio = record.referencias_socioeconomicas || {};
  const ing = socio.ingresos || {};
  const egr = socio.egresos || {};
  const salud = record.datos_salud || {};
  const acad = record.datos_academicos || {};
  const hist = record.historia_vital || {};
  const patol = record.antecedentes_patologicos || {};
  const entorno = record.entorno_familiar_habitos || {};

  const famRows = [...otrosFam];
  while (famRows.length < 4) {
    famRows.push({ nombres: '', parentesco: '', edad: '', instruccion: '', profesion: '', lugar_trabajo: '' });
  }

  return '<div class="pdf-preview-root" id="pdf-doc-content">' +
`);add(`
    '<!-- PAGE 1 -->' +
    '<div class="pdf-page-pdf" id="pdf-page-1">' +
      '<div class="dece-header">' +
        '<img src="/assets/logo.svg" class="dece-logo" alt="Logo" />' +
        '<div class="dece-header-line"></div>' +
        '<h1>DEPARTAMENTO DE CONSEJER\\u00cdA ESTUDIANTIL</h1>' +
        '<h2>REGISTRO ACUMULATIVO GENERAL</h2>' +
        '<h3>Periodo acad\\u00e9mico 2026 - 2027</h3>' +
      '</div>' +

      '<div class="pdf-section-title">1. DATOS DE IDENTIFICACI\\u00d3N / INFORMACI\\u00d3N</div>' +
      '<table class="pdf-table">' +
        '<tr>' +
          '<td class="field-label" style="width: 18%;">ESTUDIANTE:</td>' +
          '<td colspan="3" class="pdf-val">' + esc(ident.estudiante) + '</td>' +
          '<td class="field-label" style="width: 18%;">NACIONALIDAD:</td>' +
          '<td style="width: 20%;" class="pdf-val">' + esc(ident.nacionalidad) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="field-label">N\\u00b0 IDENTIFICACI\\u00d3N:</td>' +
          '<td style="width: 22%;" class="pdf-val">' + esc(ident.num_identificacion) + '</td>' +
          '<td class="field-label" style="width: 22%;">FECHA DE NACIMIENTO:</td>' +
          '<td style="width: 15%;" class="pdf-val">' + esc(ident.fecha_nacimiento) + '</td>' +
          '<td class="field-label">EDAD:</td>' +
          '<td class="pdf-val">' + esc(ident.edad) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="field-label">CURSO:</td>' +
          '<td colspan="5" class="pdf-val">' + esc(ident.curso) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="3" style="vertical-align: top; height: 105px; padding: 3px;">' +
            '<div style="margin-bottom: 3px;"><strong>DOMICILIO:</strong> <span class="pdf-val">' + esc(ident.domicilio) + '</span></div>' +
            '<div style="margin-top: 10px; margin-bottom: 3px;"><strong>TEL\\u00c9FONO:</strong> <span class="pdf-val">' + esc(ident.telefono) + '</span></div>' +
            '<div style="margin-bottom: 3px;"><strong>CELULAR:</strong> <span class="pdf-val">' + esc(ident.celular) + '</span></div>' +
          '</td>' +
          '<td colspan="3" style="vertical-align: top; padding: 2px;">' +
            '<div style="font-weight: bold; font-size: 7.2pt; text-align: center; margin-bottom: 2px;">CROQUIS UBICACI\\u00d3N DE LA CASA</div>' +
            '<div class="croquis-box">' +
              (ident.croquis_data ? '<img src="' + ident.croquis_data + '" alt="Croquis" />' : '<span class="croquis-empty">(Sin croquis adjunto)</span>') +
            '</div>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="field-label">GRUPO \\u00c9TNICO:</td>' +
          '<td colspan="5" class="pdf-val">' + esc(ident.grupo_etnico) + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class="pdf-section-title">2. DATOS FAMILIARES:</div>' +
      
      '<!-- Madre -->' +
      '<table class="pdf-table" style="margin-bottom: 3px;">' +
        '<thead>' +
          '<tr>' +
            '<th style="width: 28%;">Nombre de la madre</th>' +
            '<th style="width: 10%;">Edad</th>' +
            '<th style="width: 14%;">Estado civil</th>' +
            '<th style="width: 16%;">Instrucci\\u00f3n</th>' +
            '<th style="width: 18%;">Profesi\\u00f3n / Ocupaci\\u00f3n</th>' +
            '<th style="width: 14%;">Lugar de trabajo</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr style="height: 19px;">' +
            '<td class="pdf-val">' + esc(madre.nombre) + '</td>' +
            '<td class="pdf-val" style="text-align: center;">' + esc(madre.edad) + '</td>' +
            '<td class="pdf-val">' + esc(madre.estado_civil) + '</td>' +
            '<td class="pdf-val">' + esc(madre.instruccion) + '</td>' +
            '<td class="pdf-val">' + esc(madre.profesion) + '</td>' +
            '<td class="pdf-val">' + esc(madre.lugar_trabajo) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="6"><strong>Tel\\u00e9fonos de contacto:</strong> <span class="pdf-val">' + esc(madre.telefonos) + '</span></td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +

      '<!-- Padre -->' +
      '<table class="pdf-table" style="margin-bottom: 3px;">' +
        '<thead>' +
          '<tr>' +
            '<th style="width: 28%;">Nombre del padre</th>' +
            '<th style="width: 10%;">Edad</th>' +
            '<th style="width: 14%;">Estado civil</th>' +
            '<th style="width: 16%;">Instrucci\\u00f3n</th>' +
            '<th style="width: 18%;">Profesi\\u00f3n / Ocupaci\\u00f3n</th>' +
            '<th style="width: 14%;">Lugar de trabajo</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr style="height: 19px;">' +
            '<td class="pdf-val">' + esc(padre.nombre) + '</td>' +
            '<td class="pdf-val" style="text-align: center;">' + esc(padre.edad) + '</td>' +
            '<td class="pdf-val">' + esc(padre.estado_civil) + '</td>' +
            '<td class="pdf-val">' + esc(padre.instruccion) + '</td>' +
            '<td class="pdf-val">' + esc(padre.profesion) + '</td>' +
            '<td class="pdf-val">' + esc(padre.lugar_trabajo) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="6"><strong>Tel\\u00e9fonos de contacto:</strong> <span class="pdf-val">' + esc(padre.telefonos) + '</span></td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +

      '<!-- Representante -->' +
      '<table class="pdf-table">' +
        '<thead>' +
          '<tr>' +
            '<th style="width: 28%;">Nombre Representante Legal / Cuidador / Tutor</th>' +
            '<th style="width: 10%;">Edad</th>' +
            '<th style="width: 14%;">Estado civil</th>' +
            '<th style="width: 16%;">Instrucci\\u00f3n</th>' +
            '<th style="width: 18%;">Profesi\\u00f3n / Ocupaci\\u00f3n</th>' +
            '<th style="width: 14%;">Lugar de trabajo</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr style="height: 19px;">' +
            '<td class="pdf-val">' + esc(rep.nombre) + '</td>' +
            '<td class="pdf-val" style="text-align: center;">' + esc(rep.edad) + '</td>' +
            '<td class="pdf-val">' + esc(rep.estado_civil) + '</td>' +
            '<td class="pdf-val">' + esc(rep.instruccion) + '</td>' +
            '<td class="pdf-val">' + esc(rep.profesion) + '</td>' +
            '<td class="pdf-val">' + esc(rep.lugar_trabajo) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan="6"><strong>Tel\\u00e9fonos de contacto:</strong> <span class="pdf-val">' + esc(rep.telefonos) + '</span></td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +

      '<div class="pdf-section-title">3. REFERENCIAS FAMILIARES DE LA ESTUDIANTE:</div>' +
      '<div style="font-size: 7.5pt; margin-bottom: 2px;">' +
        'Personas con quien vive el estudiante bajo el mismo techo (s\\u00f3lo las personas que conforman la estructura familiar con quien vive normalmente)::' +
      '</div>' +
      '<div style="font-size: 7.8pt; margin-bottom: 3px; padding: 2px 0;">' +
        'Madre (' + (refFam.convive_madre ? 'X' : '&nbsp;&nbsp;') + ') &nbsp;' +
        'Padre (' + (refFam.convive_padre ? 'X' : '&nbsp;&nbsp;') + ') &nbsp;' +
        'Hermanos (' + (refFam.convive_hermanos || 0) + ') &nbsp;' +
        'Hermanas (' + (refFam.convive_hermanas || 0) + ') &nbsp;' +
        'Abuelos (' + (refFam.convive_abuelos || 0) + ') &nbsp;' +
        'T\\u00edos (' + (refFam.convive_tios || 0) + ') &nbsp;' +
        'Otros (' + (refFam.convive_otros || 0) + ') &nbsp;' +
        '<strong>Total (incluido el estudiante):</strong> <span class="pdf-val">' + esc(refFam.convive_total || '') + '</span>' +
      '</div>' +

      '<table class="pdf-table">' +
        '<tr>' +
          '<td style="width: 50%;"><strong>Familiares con alg\\u00fan tipo de discapacidad:</strong> <span class="pdf-val">' + esc(refFam.familiares_discapacidad) + '</span></td>' +
          '<td style="width: 50%;"><strong>Tiene carnet del CONADIS:</strong> <span class="pdf-val">' + esc(refFam.carnet_conadis) + '</span></td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2"><strong>Tipo de discapacidad:</strong> <span class="pdf-val">' + esc(refFam.tipo_discapacidad_familiar) + '</span></td>' +
        '</tr>' +
      '</table>' +
    '</div>' +

    '<!-- PAGE 2 -->' +
    '<div class="pdf-page-pdf" id="pdf-page-2">' +
      '<div style="font-size: 7.6pt; font-weight: bold; margin-bottom: 3px;">' +
        'OTROS FAMILIARES: <span style="font-weight: normal;">(Miembros del grupo familiar que viven bajo el mismo techo y que no se nombraron arriba. Para los hermanos/as que estudian se especifica el centro educativo)</span>' +
      '</div>' +
      '<table class="pdf-table" style="margin-bottom: 5px;">' +
        '<thead>' +
          '<tr>' +
            '<th style="width: 28%;">Nombres y Apellidos</th>' +
            '<th style="width: 14%;">Parentesco</th>' +
            '<th style="width: 8%;">Edad</th>' +
            '<th style="width: 16%;">Instrucci\\u00f3n</th>' +
            '<th style="width: 18%;">Profesi\\u00f3n / Ocupaci\\u00f3n</th>' +
            '<th style="width: 16%;">Lugar de trabajo</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          famRows.map(f =>
            '<tr style="height: 19px;">' +
              '<td class="pdf-val">' + esc(f.nombres) + '</td>' +
              '<td class="pdf-val">' + esc(f.parentesco) + '</td>' +
              '<td class="pdf-val" style="text-align: center;">' + esc(f.edad) + '</td>' +
              '<td class="pdf-val">' + esc(f.instruccion) + '</td>' +
              '<td class="pdf-val">' + esc(f.profesion) + '</td>' +
              '<td class="pdf-val">' + esc(f.lugar_trabajo) + '</td>' +
            '</tr>'
          ).join('') +
        '</tbody>' +
      '</table>' +

      '<div class="pdf-section-title">4. REFERENCIAS SOCIOECONOMICAS GENERALES :</div>' +
      '<div class="pdf-section-subtitle">Ingresos / Egresos mensuales del hogar :</div>' +
      '<table class="pdf-table" style="margin-bottom: 5px;">' +
        '<thead>' +
          '<tr>' +
            '<th colspan="2" style="width: 50%;">INGRESOS</th>' +
            '<th colspan="2" style="width: 50%;">EGRESOS</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr>' +
            '<td style="width: 25%;" class="field-label">Padre:</td>' +
            '<td style="width: 25%; text-align: right;" class="pdf-val">' + esc(ing.padre || '') + '</td>' +
            '<td style="width: 25%;" class="field-label">Alimentaci\\u00f3n:</td>' +
            '<td style="width: 25%; text-align: right;" class="pdf-val">' + esc(egr.alimentacion || '') + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="field-label">Madre:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.madre || '') + '</td>' +
            '<td class="field-label">Educaci\\u00f3n:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.educacion || '') + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="field-label">Hermanos / as:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.hermanos || '') + '</td>' +
            '<td class="field-label">Vivienda:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.vivienda || '') + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="field-label">T\\u00edos / as:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.tios || '') + '</td>' +
            '<td class="field-label">Servicios b\\u00e1sicos:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.servicios_basicos || '') + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="field-label">Abuelos:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.abuelos || '') + '</td>' +
            '<td class="field-label">Transporte:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.transporte || '') + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="field-label">Otros:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.otros || '') + '</td>' +
            '<td class="field-label">Salud:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.salud || '') + '</td>' +
          '</tr>' +
          '<tr style="font-weight: bold; background-color: #fafafa;">' +
            '<td>Total:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(ing.total || '') + '</td>' +
            '<td>Total:</td>' +
            '<td style="text-align: right;" class="pdf-val">' + esc(egr.total || '') + '</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +

      '<div style="font-size: 6.5pt; color: #666; margin-bottom: 2px;">533_uegs-2023/10/24</div>' +
      
      '<div class="pdf-section-subtitle">Prestamos</div>' +
      '<table class="pdf-table" style="margin-bottom: 4px;">' +
        '<tr>' +
          '<td style="width: 80%;">\\u00bfDurante los \\u00faltimos 12 meses, usted u otro miembro del hogar, ha recibido pr\\u00e9stamos?</td>' +
          '<td style="width: 20%; text-align: center;" class="pdf-val">' + esc(socio.recibido_prestamos || '') + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class="pdf-section-subtitle">Condiciones de vivienda:</div>' +
      '<table class="pdf-table" style="margin-bottom: 4px;">' +
        '<tr>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'propia'), 'Propia') + '</td>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'arrendada'), 'Arrendada') + '</td>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'anticresis'), 'Anticresis') + '</td>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'prestada'), 'Prestada') + '</td>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'compartida'), 'Compartida') + '</td>' +
          '<td style="width: 16.6%; text-align: center;">' + renderCheck(hasVal(socio.condicion_vivienda, 'con pr\\u00e9stamo') || hasVal(socio.condicion_vivienda, 'con prestamo'), 'Con pr\\u00e9stamo') + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class="pdf-section-subtitle">Tipo de vivienda:</div>' +
      '<table class="pdf-table" style="margin-bottom: 4px;">' +
        '<tr>' +
          '<td style="width: 33.3%; text-align: center;">' + renderCheck(hasVal(socio.tipo_vivienda, 'casa'), 'Casa') + '</td>' +
          '<td style="width: 33.3%; text-align: center;">' + renderCheck(hasVal(socio.tipo_vivienda, 'departamento'), 'Departamento') + '</td>' +
          '<td style="width: 33.3%; text-align: center;">' + renderCheck(hasVal(socio.tipo_vivienda, 'cuarto'), 'Cuarto') + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class="pdf-section-subtitle">Servicios b\\u00e1sicos:</div>' +
      '<table class="pdf-table" style="margin-bottom: 5px;">' +
        '<tr>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'luz'), 'Luz el\\u00e9ctrica') + '</td>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'agua'), 'Agua potable') + '</td>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'sshh'), 'SSHH') + '</td>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'pozo'), 'Pozo s\\u00e9ptico') + '</td>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'tel\\u00e9fono') || hasVal(socio.servicios_basicos, 'telefono'), 'Tel\\u00e9fono') + '</td>' +
          '<td style="width: 16.6%;">' + renderCheck(hasVal(socio.servicios_basicos, 'celular'), 'Celular') + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'internet'), 'Internet') + '</td>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'cable'), 'Cable') + '</td>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'computador'), 'Computador') + '</td>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'laptop'), 'Laptop') + '</td>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'tablet'), 'Tablet') + '</td>' +
          '<td>' + renderCheck(hasVal(socio.servicios_basicos, 'video juegos') || hasVal(socio.servicios_basicos, 'videojuegos'), 'Video juegos') + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class="pdf-section-title">5. DATOS DE SALUD:</div>' +
      '<table class="pdf-table">' +
        '<tr>' +
          '<td style="width: 15%;" class="field-label">Discapacidad:</td>' +
          '<td style="width: 15%;" class="pdf-val">' + esc(salud.discapacidad) + '</td>' +
          '<td style="width: 8%;" class="field-label">Tipo:</td>' +
          '<td style="width: 22%;" class="pdf-val">' + esc(salud.discapacidad_tipo) + '</td>' +
          '<td style="width: 12%;" class="field-label">Porcentaje:</td>' +
          '<td style="width: 10%;" class="pdf-val">' + esc(salud.discapacidad_porcentaje) + '</td>' +
          '<td style="width: 10%;" class="field-label">N\\u00b0 CONADIS:</td>' +
          '<td style="width: 18%;" class="pdf-val">' + esc(salud.discapacidad_num_conadis) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" class="field-label">\\u00bfTiene alguna condici\\u00f3n m\\u00e9dica espec\\u00edfica?</td>' +
          '<td colspan="2" class="pdf-val">' + esc(salud.condicion_medica_tiene || '') + '</td>' +
          '<td colspan="2" class="field-label">Determine cual:</td>' +
          '<td colspan="2" class="pdf-val">' + esc(salud.condicion_medica) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" class="field-label">\\u00bfPadece alergias?</td>' +
          '<td colspan="2" class="pdf-val">' + esc(salud.alergias_tiene || '') + '</td>' +
          '<td colspan="2" class="field-label">Determine cual:</td>' +
          '<td colspan="2" class="pdf-val">' + esc(salud.alergias) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" class="field-label">Especif\\u00edque los medicamentos que utiliza:</td>' +
          '<td colspan="6" class="pdf-val">' + esc(salud.medicamentos) + '</td>' +
        '</tr>' +
      '</table>' +
    '</div>' +
`);add(`
    '<!-- PAGE 3 -->' +
    '<div class="pdf-page-pdf" id="pdf-page-3">' +
      '<div style="font-size: 7.8pt; font-weight: bold; margin-bottom: 2px;">El estudiante recibe atenci\\u00f3n m\\u00e9dica en:</div>' +
      '<table class="pdf-table" style="margin-bottom: 3px;">' +
        '<tr>' +
          '<td style="width: 25%; text-align: center;">' + renderCheck(hasVal(salud.atencion_medica, 'centro de salud'), 'Centro de salud') + '</td>' +
          '<td style="width: 25%; text-align: center;">' + renderCheck(hasVal(salud.atencion_medica, 'subcentro'), 'Subcentro de salud') + '</td>' +
          '<td style="width: 25%; text-align: center;">' + renderCheck(hasVal(salud.atencion_medica, 'hospital p\\u00fablico') || hasVal(salud.atencion_medica, 'hospital publico'), 'Hospital p\\u00fablico') + '</td>' +
          '<td style="width: 25%; text-align: center;">' + renderCheck(hasVal(salud.atencion_medica, 'cl\\u00ednica privada') || hasVal(salud.atencion_medica, 'clinica privada'), 'Cl\\u00ednica privada') + '</td>' +
        '</tr>' +
      '</table>' +
      '<div style="font-size: 7.5pt; margin-bottom: 4px;"><strong>NOTA:</strong> <span class="pdf-val">' + esc(salud.atencion_medica_nota) + '</span></div>' +

      '<div class="pdf-section-title">6. DATOS ACAD\\u00c9MICOS / RENDIMIENTO ESCOLAR:</div>' +
      '<table class="pdf-table" style="margin-bottom: 3px;">' +
        '<tr>' +
          '<td style="width: 32%;" class="field-label">Fecha de ingreso a la instituci\\u00f3n:</td>' +
          '<td colspan=\"3\" class=\"pdf-val\">' + esc(acad.fecha_ingreso) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Instituci\\u00f3n educativa de la que procede:</td>' +
          '<td colspan=\"3\" class=\"pdf-val\">' + esc(acad.institucion_procedencia) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">\\u00bfHa repetido a\\u00f1os?</td>' +
          '<td style=\"width: 18%;\" class=\"pdf-val\">' + esc(acad.ha_repetido_anios) + '</td>' +
          '<td style=\"width: 15%;\" class=\"field-label\">\\u00bfCuales?</td>' +
          '<td style=\"width: 35%;\" class=\"pdf-val\">' + esc(acad.anios_repetidos) + '</td>' +
        '</tr>' +
      '</table>' +

      '<table class=\"pdf-table\" style=\"margin-bottom: 5px;\">' +
        '<tr>' +
          '<td style=\"width: 38%;\" class=\"field-label\">Asignaturas de preferencia:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.asignaturas_preferencia) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Asignaturas en las que ha tenido dificultad:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.asignaturas_dificultad) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Dignidades alcanzadas:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.dignidades_alcanzadas) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Logros acad\\u00e9micos:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.logros_academicos) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Participaci\\u00f3n en:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.participacion) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Clubes:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.clubes) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Extracurriculares:</td>' +
          '<td class=\"pdf-val\">' + esc(acad.extracurriculares) + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-title\">7. HISTORIA VITAL</div>' +
      '<div class=\"pdf-section-subtitle\">Embarazo y parto</div>' +
      '<table class=\"pdf-table\" style=\"margin-bottom: 4px;\">' +
        '<tr>' +
          '<td style=\"width: 25%;\" class=\"field-label\">\\u00bfEdad de la madre al nacer?</td>' +
          '<td style=\"width: 25%;\" class=\"pdf-val\">' + esc(hist.edad_madre_al_nacer) + '</td>' +
          '<td style=\"width: 25%;\" class=\"field-label\">\\u00bfAccidentes en el embarazo?</td>' +
          '<td style=\"width: 25%;\" class=\"pdf-val\">' + esc(hist.accidentes_embarazo) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">\\u00bfMedicamentos durante el embarazo?</td>' +
          '<td class=\"pdf-val\">' + esc(hist.medicamentos_embarazo) + '</td>' +
          '<td class=\"field-label\">\\u00bfCu\\u00e1les?</td>' +
          '<td class=\"pdf-val\">' + esc(hist.medicamentos_embarazo_cuales) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan=\"4\">' +
            '<span style=\"font-weight: bold; margin-right: 8px;\">Parto:</span>' +
            renderCheck(hasVal(hist.tipo_parto, 'al t\\u00e9rmino') || hasVal(hist.tipo_parto, 'al termino'), 'al t\\u00e9rmino') + ' &nbsp;&nbsp;' +
            renderCheck(hasVal(hist.tipo_parto, 'prematuro'), 'Prematuro') + ' &nbsp;&nbsp;' +
            renderCheck(hasVal(hist.tipo_parto, 'ces\\u00e1rea') || hasVal(hist.tipo_parto, 'cesarea'), 'Ces\\u00e1rea') + ' &nbsp;&nbsp;' +
            renderCheck(hasVal(hist.tipo_parto, 'parto normal') || hasVal(hist.tipo_parto, 'normal'), 'Parto normal') +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Especificar cualquier otra dificultad en el embarazo</td>' +
          '<td colspan=\"3\" class=\"pdf-val\">' + esc(hist.dificultades_embarazo) + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-subtitle\">Datos de la recién nacida</div>' +
      '<table class=\"pdf-table\" style=\"margin-bottom: 4px;\">' +
        '<tr>' +
          '<td style=\"width: 25%;\" class=\"field-label\">Peso al nacer:</td>' +
          '<td style=\"width: 25%;\" class=\"pdf-val\">' + esc(hist.peso_nacer) + '</td>' +
          '<td style=\"width: 25%;\" class=\"field-label\">Talla al nacer:</td>' +
          '<td style=\"width: 25%;\" class=\"pdf-val\">' + esc(hist.talla_nacer) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Edad en que empez\\u00f3 a caminar:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.edad_empezo_caminar) + '</td>' +
          '<td class=\"field-label\">Edad a la que habl\\u00f3 por primera vez:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.edad_hablo_primera_vez) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Periodo de lactancia:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.periodo_lactancia) + '</td>' +
          '<td class=\"field-label\">Edad hasta la cual utiliz\\u00f3 biber\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.edad_utilizo_biberon) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\" colspan=\"2\">Edad en que aprendi\\u00f3 a controlar esf\\u00ednteres</td>' +
          '<td colspan=\"2\" class=\"pdf-val\">' + esc(hist.edad_control_esfinteres) + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-subtitle\">Enfermedades (desde la infancia hasta la actualidad):</div>' +
      '<table class=\"pdf-table\">' +
        '<tr>' +
          '<td style=\"width: 26%;\" class=\"field-label\">Enfermedades:</td>' +
          '<td class=\"field-label\" style=\"width: 14%;\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.enfermedades_infancia) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Accidentes:</td>' +
          '<td class=\"field-label\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.accidentes_infancia) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Alergias:</td>' +
          '<td class=\"field-label\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.alergias_infancia) + '</td>' +
        '</tr>' +
      '</table>' +
    '</div>' +

    '<!-- PAGE 4 -->' +
    '<div class=\"pdf-page-pdf\" id=\"pdf-page-4\">' +
      '<table class=\"pdf-table\" style=\"margin-bottom: 7px;\">' +
        '<tr>' +
          '<td style=\"width: 26%;\" class=\"field-label\">Cirug\\u00edas:</td>' +
          '<td class=\"field-label\" style=\"width: 14%;\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.cirugias) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">P\\u00e9rdidas de conocimiento:</td>' +
          '<td class=\"field-label\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.perdidas_conocimiento) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td class=\"field-label\">Otros:</td>' +
          '<td class=\"field-label\">Descripci\\u00f3n:</td>' +
          '<td class=\"pdf-val\">' + esc(hist.otros_salud_infancia) + '</td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-subtitle\">Antecedentes patol\\u00f3gicos familiares</div>' +
      '<table class=\"pdf-table\" style=\"margin-bottom: 8px;\">' +
        '<tr>' +
          '<td style=\"width: 33.3%;\">' + renderCheck(patol.obesidad, 'Obesidad') + '</td>' +
          '<td style=\"width: 33.3%;\">' + renderCheck(patol.enfermedades_cardiacas, 'Enfermedades cardiacas') + '</td>' +
          '<td style=\"width: 33.3%;\">' + renderCheck(patol.hipertension, 'Hipertensi\\u00f3n') + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td>' + renderCheck(patol.diabetes, 'Diabetes') + '</td>' +
          '<td>' + renderCheck(patol.enfermedades_mentales, 'Enfermedades mentales') + '</td>' +
          '<td><strong>Otros:</strong> <span class=\"pdf-val\">' + esc(patol.otros) + '</span></td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-subtitle\">Relaci\\u00f3n de la estudiante con su entorno familiar</div>' +
      '<table class=\"pdf-table\" style=\"margin-bottom: 8px;\">' +
        '<tr>' +
          '<td style=\"width: 50%;\">' +
            '<strong>Padre:</strong><br/>' +
            '<span class=\"pdf-val\">' + esc(entorno.relacion_padre) + '</span>' +
          '</td>' +
          '<td style=\"width: 50%;\">' +
            '<strong>Madre:</strong><br/>' +
            '<span class=\"pdf-val\">' + esc(entorno.relacion_madre) + '</span>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td>' +
            '<strong>Hermanos:</strong><br/>' +
            '<span class=\"pdf-val\">' + esc(entorno.relacion_hermanos) + '</span>' +
          '</td>' +
          '<td>' +
            '<strong>Otros en el hogar:</strong><br/>' +
            '<span class=\"pdf-val\">' + esc(entorno.relacion_otros) + '</span>' +
          '</td>' +
        '</tr>' +
      '</table>' +

      '<div class=\"pdf-section-subtitle\">Costumbres, h\\u00e1bitos:</div>' +
      '<div style=\"border: 1px solid #000; min-height: 42px; padding: 4px; margin-bottom: 30px; font-size: 7.8pt;\" class=\"pdf-val\">' +
        (esc(entorno.costumbres_habitos) || '&nbsp;') +
      '</div>' +

      '<div class=\"signature-area\">' +
        '<div class=\"signature-line\"></div>' +
        '<div style=\"font-size: 8.2pt;\"><strong>C.I.:</strong> <span class=\"pdf-val\">' + esc(entorno.firma_ci || rep.telefonos || '') + '</span></div>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// Download PDF
async function downloadRecordPDF(record) {
  const studentName = (record.identificacion?.estudiante || 'estudiante').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = 'REGISTRO_ACUMULATIVO_' + studentName + '.pdf';

  const printWrapper = document.createElement('div');
  printWrapper.id = 'pdf-render-temp';
  printWrapper.style.position = 'absolute';
  printWrapper.style.left = '-9999px';
  printWrapper.style.top = '0';
  printWrapper.style.width = '210mm';
  printWrapper.style.margin = '0';
  printWrapper.style.padding = '0';
  printWrapper.style.background = '#ffffff';

  printWrapper.innerHTML = buildPDFPagesHTML(record);
  
  const root = printWrapper.querySelector('.pdf-preview-root');
  if (root) {
    root.style.background = 'transparent';
    root.style.padding = '0';
    root.style.margin = '0';
    root.style.gap = '0';
  }

  document.body.appendChild(printWrapper);

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    if (window.html2pdf) {
      await html2pdf().set(opt).from(root || printWrapper).save();
    } else {
      previewRecordPDF(record);
    }
  } catch (err) {
    console.error('Error in html2pdf:', err);
    previewRecordPDF(record);
  } finally {
    if (document.body.contains(printWrapper)) {
      document.body.removeChild(printWrapper);
    }
  }
}

// Preview PDF
function previewRecordPDF(record) {
  const studentName = (record.identificacion?.estudiante || 'estudiante').replace(/[^a-zA-Z0-9_-]/g, '_');
  const win = window.open('', '_blank');
  win.document.write(
    '<!DOCTYPE html>' +
    '<html lang="es">' +
      '<head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Imprimir Registro - ' + studentName + '</title>' +
        '<link rel="stylesheet" href="/css/pdf-format.css">' +
        '<style>' +
          '.print-toolbar {' +
            'position: fixed;' +
            'top: 15px;' +
            'right: 20px;' +
            'background: #0f172a;' +
            'padding: 10px 16px;' +
            'border-radius: 10px;' +
            'box-shadow: 0 10px 25px rgba(0,0,0,0.4);' +
            'display: flex;' +
            'align-items: center;' +
            'gap: 10px;' +
            'z-index: 9999;' +
          '}' +
          '.print-btn {' +
            'background: #2563eb;' +
            'color: white;' +
            'border: none;' +
            'padding: 8px 16px;' +
            'border-radius: 6px;' +
            'cursor: pointer;' +
            'font-weight: bold;' +
            'font-size: 13px;' +
          '}' +
          '.print-btn:hover { background: #1d4ed8; }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="print-toolbar no-print">' +
          '<button class="print-btn" onclick="window.print()">\\uD83D\\uDDA8\\uFE0F Imprimir / Guardar como PDF</button>' +
          '<button class="print-btn" style="background:#475569;" onclick="window.close()">Cerrar</button>' +
        '</div>' +
        buildPDFPagesHTML(record) +
      '</body>' +
    '</html>'
  );
  win.document.close();
}

window.PDFEngine = {
  buildPagesHTML: buildPDFPagesHTML,
  download: downloadRecordPDF,
  preview: previewRecordPDF
};
`);

fs.writeFileSync('public/js/pdf-generator.js', s, 'utf8');
console.log('public/js/pdf-generator.js successfully written!');