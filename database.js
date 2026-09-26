const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file, defaultData = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultData;
  }
}

function writeJSON(file, data) {
  const tempFile = `${file}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, file);
}

// Initialize Admin User if not present
function initDB() {
  const users = readJSON(USERS_FILE, []);
  if (users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    const defaultAdmin = {
      id: uuidv4(),
      username: 'admin',
      password: hashedPassword,
      name: 'Administrador DECE',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    users.push(defaultAdmin);
    writeJSON(USERS_FILE, users);
    console.log('Admin user initialized (Username: admin, Password: admin123)');
  }

  if (!fs.existsSync(RECORDS_FILE)) {
    writeJSON(RECORDS_FILE, []);
  }
}

initDB();

const db = {
  // Records
  getAllRecords({ search = '', curso = '', sort = 'createdAt', order = 'desc', page = 1, limit = 50 } = {}) {
    let records = readJSON(RECORDS_FILE, []);

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      records = records.filter(r => {
        const est = (r.identificacion?.estudiante || '').toLowerCase();
        const numId = (r.identificacion?.num_identificacion || '').toLowerCase();
        const rep = (r.datos_familiares?.representante?.nombre || '').toLowerCase();
        const cur = (r.identificacion?.curso || '').toLowerCase();
        return est.includes(q) || numId.includes(q) || rep.includes(q) || cur.includes(q);
      });
    }

    if (curso && curso.trim() !== '') {
      const c = curso.trim().toLowerCase();
      records = records.filter(r => (r.identificacion?.curso || '').toLowerCase().includes(c));
    }

    // Sort
    records.sort((a, b) => {
      let valA = a[sort] || a.identificacion?.[sort] || '';
      let valB = b[sort] || b.identificacion?.[sort] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = records.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedRecords = records.slice(startIndex, startIndex + limitNum);

    return {
      records: paginatedRecords,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    };
  },

  getRecordById(id) {
    const records = readJSON(RECORDS_FILE, []);
    return records.find(r => r.id === id) || null;
  },

  createRecord(data) {
    const records = readJSON(RECORDS_FILE, []);
    const newRecord = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    records.unshift(newRecord);
    writeJSON(RECORDS_FILE, records);
    return newRecord;
  },

  updateRecord(id, data) {
    const records = readJSON(RECORDS_FILE, []);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    records[index] = {
      ...records[index],
      ...data,
      id, // ensure ID is preserved
      updatedAt: new Date().toISOString()
    };
    writeJSON(RECORDS_FILE, records);
    return records[index];
  },

  deleteRecord(id) {
    let records = readJSON(RECORDS_FILE, []);
    const beforeLen = records.length;
    records = records.filter(r => r.id !== id);
    if (records.length === beforeLen) return false;
    writeJSON(RECORDS_FILE, records);
    return true;
  },

  getStats() {
    const records = readJSON(RECORDS_FILE, []);
    const total = records.length;

    const byCourse = {};
    records.forEach(r => {
      const c = (r.identificacion?.curso || 'Sin especificar').trim();
      byCourse[c] = (byCourse[c] || 0) + 1;
    });

    const withDisability = records.filter(r => 
      (r.datos_salud?.discapacidad === 'Sí' || r.datos_salud?.discapacidad === 'SI' || r.datos_salud?.discapacidad_tipo)
    ).length;

    const recent = records.slice(0, 5).map(r => ({
      id: r.id,
      estudiante: r.identificacion?.estudiante || 'Sin nombre',
      num_identificacion: r.identificacion?.num_identificacion || '',
      curso: r.identificacion?.curso || '',
      createdAt: r.createdAt
    }));

    return {
      totalRecords: total,
      byCourse,
      withDisability,
      recent
    };
  },

  // Auth / Users
  findUserByUsername(username) {
    const users = readJSON(USERS_FILE, []);
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  verifyPassword(inputPassword, storedHash) {
    return bcrypt.compareSync(inputPassword, storedHash);
  },

  updateAdminPassword(username, newPassword) {
    const users = readJSON(USERS_FILE, []);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return false;
    user.password = bcrypt.hashSync(newPassword, 10);
    user.updatedAt = new Date().toISOString();
    writeJSON(USERS_FILE, users);
    return true;
  }
};

module.exports = db;
