const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dece_registro_acumulativo_secret_key_2026_2027';

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  let token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Inicie sesión.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sesión expirada o token inválido.' });
  }
}

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const user = db.findUserByUsername(username);
  if (!user || !db.verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: false, // Accessible by JS for token check if needed
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  return res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username, name: user.name, role: user.role }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Sesión cerrada correctamente' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  return res.json({ success: true, user: req.user });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Debe ingresar contraseña actual y nueva' });
  }

  const user = db.findUserByUsername(req.user.username);
  if (!user || !db.verifyPassword(currentPassword, user.password)) {
    return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
  }

  db.updateAdminPassword(req.user.username, newPassword);
  return res.json({ success: true, message: 'Contraseña actualizada con éxito' });
});

// ---------------- RECORDS ROUTES ----------------

// Public & Admin: Submit new record
app.post('/api/records', (req, res) => {
  try {
    const recordData = req.body;
    if (!recordData.identificacion?.estudiante) {
      return res.status(400).json({ error: 'El nombre del estudiante es obligatorio' });
    }

    const created = db.createRecord(recordData);
    return res.status(201).json({
      success: true,
      message: 'Registro acumulativo guardado exitosamente',
      record: created
    });
  } catch (error) {
    console.error('Error saving record:', error);
    return res.status(500).json({ error: 'Error interno al guardar el registro' });
  }
});

// Admin: Get all records with filter & pagination
app.get('/api/records', authenticateToken, (req, res) => {
  try {
    const { search, curso, sort, order, page, limit } = req.query;
    const result = db.getAllRecords({ search, curso, sort, order, page, limit });
    return res.json(result);
  } catch (error) {
    console.error('Error listing records:', error);
    return res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// Get single record by ID (used for PDF download or editing)
app.get('/api/records/:id', (req, res) => {
  try {
    const record = db.getRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return res.json({ success: true, record });
  } catch (error) {
    console.error('Error getting record:', error);
    return res.status(500).json({ error: 'Error al recuperar registro' });
  }
});

// Admin: Update record
app.put('/api/records/:id', authenticateToken, (req, res) => {
  try {
    const updated = db.updateRecord(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return res.json({
      success: true,
      message: 'Registro actualizado correctamente',
      record: updated
    });
  } catch (error) {
    console.error('Error updating record:', error);
    return res.status(500).json({ error: 'Error al actualizar registro' });
  }
});

// Admin: Delete record
app.delete('/api/records/:id', authenticateToken, (req, res) => {
  try {
    const deleted = db.deleteRecord(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return res.json({
      success: true,
      message: 'Registro eliminado correctamente'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return res.status(500).json({ error: 'Error al eliminar registro' });
  }
});

// Admin: Stats
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const stats = db.getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Admin: Export to CSV
app.get('/api/export-csv', authenticateToken, (req, res) => {
  try {
    const { records } = db.getAllRecords({ limit: 10000 });
    
    // Create CSV Header
    const headers = [
      'ID', 'Fecha Registro', 'Estudiante', 'Cédula/Identificación', 'Nacionalidad',
      'Fecha Nacimiento', 'Edad', 'Curso', 'Domicilio', 'Teléfono', 'Celular',
      'Grupo Étnico', 'Madre Nombre', 'Madre Teléfono', 'Padre Nombre', 'Padre Teléfono',
      'Representante Nombre', 'Representante Teléfono', 'Total Ingresos', 'Total Egresos',
      'Discapacidad'
    ];

    const rows = records.map(r => [
      r.id,
      r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      `"${(r.identificacion?.estudiante || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.num_identificacion || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.nacionalidad || '').replace(/"/g, '""')}"`,
      r.identificacion?.fecha_nacimiento || '',
      r.identificacion?.edad || '',
      `"${(r.identificacion?.curso || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.domicilio || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.telefono || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.celular || '').replace(/"/g, '""')}"`,
      `"${(r.identificacion?.grupo_etnico || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.madre?.nombre || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.madre?.telefonos || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.padre?.nombre || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.padre?.telefonos || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.representante?.nombre || '').replace(/"/g, '""')}"`,
      `"${(r.datos_familiares?.representante?.telefonos || '').replace(/"/g, '""')}"`,
      r.referencias_socioeconomicas?.ingresos?.total || 0,
      r.referencias_socioeconomicas?.egresos?.total || 0,
      `"${(r.datos_salud?.discapacidad || 'No').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=registros_acumulativos_${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).json({ error: 'Error al exportar registros' });
  }
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`?? SERVIDOR DE REGISTRO ACUMULATIVO EN LÍNEA`);
  console.log(`?? Acceso Público (Llenado): http://localhost:${PORT}`);
  console.log(`??? Panel Administrador:     http://localhost:${PORT}/admin.html`);
  console.log(`?? Login Admin por defecto: Usuario: admin | Clave: admin123`);
  console.log(`====================================================`);
});
