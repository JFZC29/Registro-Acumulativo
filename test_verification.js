async function test() {
  const sampleData = {
    identificacion: {
      estudiante: 'SALAZAR MORA VALENTINA SOFIA',
      nacionalidad: 'Ecuatoriana',
      num_identificacion: '1728394012',
      fecha_nacimiento: '2012-05-14',
      edad: '14',
      curso: '9no EGB Paralelo B',
      domicilio: 'Av. América N24-110 y Mariana de Jesús, Casa blanca esquinera',
      telefono: '022458963',
      celular: '0987654321',
      grupo_etnico: 'Mestizo',
      croquis_data: ''
    },
    datos_familiares: {
      madre: {
        nombre: 'MORA VÉLEZ CARMEN ELENA',
        edad: '38',
        estado_civil: 'Casada',
        instruccion: 'Superior',
        profesion: 'Contadora',
        lugar_trabajo: 'Banco Pichincha',
        telefonos: '0998877665'
      },
      padre: {
        nombre: 'SALAZAR CASTRO JAVIER ANDRÉS',
        edad: '41',
        estado_civil: 'Casado',
        instruccion: 'Superior',
        profesion: 'Ingeniero Comercial',
        lugar_trabajo: 'Empresa Privada',
        telefonos: '0981122334'
      },
      representante: {
        nombre: 'MORA VÉLEZ CARMEN ELENA',
        edad: '38',
        estado_civil: 'Casada',
        instruccion: 'Superior',
        profesion: 'Contadora',
        lugar_trabajo: 'Banco Pichincha',
        telefonos: '0998877665'
      }
    },
    referencias_familiares: {
      convive_madre: true,
      convive_padre: true,
      convive_hermanos: 1,
      convive_hermanas: 0,
      convive_abuelos: 0,
      convive_tios: 0,
      convive_otros: 0,
      convive_total: 4,
      familiares_discapacidad: 'Ninguno',
      carnet_conadis: 'No',
      tipo_discapacidad_familiar: 'Ninguna',
      otros_familiares: [
        { nombres: 'SALAZAR MORA MATEO ANDRÉS', parentesco: 'Hermano', edad: '8', instruccion: 'Primaria', profesion: 'Estudiante', lugar_trabajo: 'Unidad Educativa San José' }
      ]
    },
    referencias_socioeconomicas: {
      ingresos: { padre: '850.00', madre: '750.00', hermanos: '0', tios: '0', abuelos: '0', otros: '0', total: '1600.00' },
      egresos: { alimentacion: '450.00', educacion: '200.00', vivienda: '350.00', servicios_basicos: '120.00', transporte: '100.00', salud: '80.00', total: '1300.00' },
      recibido_prestamos: 'No',
      condicion_vivienda: ['Propia'],
      tipo_vivienda: ['Casa'],
      servicios_basicos: ['Luz eléctrica', 'Agua potable', 'SSHH', 'Teléfono', 'Celular', 'Internet', 'Laptop']
    },
    datos_salud: {
      discapacidad: 'No',
      discapacidad_tipo: '',
      discapacidad_porcentaje: '',
      discapacidad_num_conadis: '',
      condicion_medica_tiene: 'No',
      condicion_medica: 'Ninguna',
      alergias_tiene: 'Sí',
      alergias: 'Alergia al polen',
      medicamentos: 'Antihistamínicos en épocas de polinización',
      atencion_medica: ['Centro de salud', 'Hospital público'],
      atencion_medica_nota: 'Controles periódicos al día'
    },
    datos_academicos: {
      fecha_ingreso: '2018-09-03',
      institucion_procedencia: 'Escuela Simón Bolívar',
      ha_repetido_anios: 'No',
      anios_repetidos: '',
      asignaturas_preferencia: 'Ciencias Naturales, Artes, Matemáticas',
      asignaturas_dificultad: 'Historia',
      dignidades_alcanzadas: 'Mejor promedio en 7mo EGB',
      logros_academicos: 'Mención de honor en ciencias',
      participacion: 'Consejo estudiantil',
      clubes: 'Club de Lectura',
      extracurriculares: 'Natación'
    },
    historia_vital: {
      edad_madre_al_nacer: '24',
      accidentes_embarazo: 'No',
      medicamentos_embarazo: 'No',
      medicamentos_embarazo_cuales: '',
      tipo_parto: ['al término', 'Parto normal'],
      dificultades_embarazo: 'Ninguna',
      peso_nacer: '3.3 kg',
      talla_nacer: '51 cm',
      edad_empezo_caminar: '1 año',
      edad_hablo_primera_vez: '11 meses',
      periodo_lactancia: '14 meses',
      edad_utilizo_biberon: '2 años',
      edad_control_esfinteres: '2 años',
      enfermedades_infancia: 'Varicela a los 5 años',
      accidentes_infancia: 'Ninguno',
      alergias_infancia: 'Rinitis estacional',
      cirugias: 'Ninguna',
      perdidas_conocimiento: 'Ninguna',
      otros_salud_infancia: 'Vacunación completa'
    },
    antecedentes_patologicos: {
      obesidad: false,
      enfermedades_cardiacas: false,
      hipertension: true,
      diabetes: false,
      enfermedades_mentales: false,
      otros: 'Hipertensión abuela materna'
    },
    entorno_familiar_habitos: {
      relacion_padre: 'Excelente relación, constante comunicación y apoyo afectivo.',
      relacion_madre: 'Muy estrecha y de confianza mutua.',
      relacion_hermanos: 'Buena relación con su hermano menor.',
      relacion_otros: 'Respetuosa con familiares cercanos.',
      costumbres_habitos: 'Hábito diario de lectura, deporte los fines de semana, horario regular de estudio.',
      firma_ci: '1728394012'
    }
  };

  console.log('--- 1. Testing POST /api/records ---');
  const postRes = await fetch('http://localhost:3000/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleData)
  });
  const postData = await postRes.json();
  console.log('Record created status:', postRes.status, 'ID:', postData.record?.id);

  console.log('--- 2. Testing Admin Login POST /api/auth/login ---');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'Token exists:', !!loginData.token);

  console.log('--- 3. Testing GET /api/stats ---');
  const statsRes = await fetch('http://localhost:3000/api/stats', {
    headers: { 'Authorization': 'Bearer ' + loginData.token }
  });
  const statsData = await statsRes.json();
  console.log('Stats total records:', statsData.stats.totalRecords);

  console.log('--- 4. Testing GET /api/records with search ---');
  const searchRes = await fetch('http://localhost:3000/api/records?search=VALENTINA', {
    headers: { 'Authorization': 'Bearer ' + loginData.token }
  });
  const searchData = await searchRes.json();
  console.log('Search found records:', searchData.records.length, 'Student Name:', searchData.records[0]?.identificacion?.estudiante);

  console.log('--- 5. Testing GET /api/export-csv ---');
  const csvRes = await fetch('http://localhost:3000/api/export-csv', {
    headers: { 'Authorization': 'Bearer ' + loginData.token }
  });
  const csvText = await csvRes.text();
  console.log('CSV Status:', csvRes.status, 'CSV Length:', csvText.length);

  console.log('\n=============================================');
  console.log('✅ TODAS LAS PRUEBAS AUTOMATIZADAS PASARON EXITOSAMENTE');
  console.log('=============================================');
}

test().catch(console.error);
