// Firebase Realtime Database Client for Sistema BEI
// Escuela de Educación Básica Fiscomisional "Padre Otto Acosta"

(function(window) {
  'use strict';

  // Configuración de la base de datos de la escuela (Proporcionada por el usuario)
  const DEFAULT_CONFIG = {
    apiKey: "AIzaSyEscuelaPadreOttoAcostaKey2026",
    databaseURL: "https://escuela-padre-otto-acost-55285-default-rtdb.firebaseio.com",
    projectId: "escuela-padre-otto-acost-55285"
  };

  function getStoredConfig() {
    try {
      const custom = localStorage.getItem('bei_firebase_config');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (parsed && parsed.databaseURL) {
          parsed.databaseURL = parsed.databaseURL.replace(/\/+$/, '');
          if (!parsed.apiKey) parsed.apiKey = DEFAULT_CONFIG.apiKey;
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_CONFIG;
  }

  let dbInstance = null;
  let isInitialized = false;

  function initFirebase() {
    if (isInitialized && dbInstance) return dbInstance;
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK no cargado en este navegador; se usará la API REST directa.');
      return null;
    }

    const config = getStoredConfig();
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: config.apiKey || DEFAULT_CONFIG.apiKey,
          databaseURL: config.databaseURL,
          projectId: config.projectId || DEFAULT_CONFIG.projectId
        });
      }
      dbInstance = firebase.database();
      isInitialized = true;
      console.log('🟢 Firebase SDK conectado a:', config.databaseURL);
      return dbInstance;
    } catch (err) {
      console.warn('Firebase SDK init warning (usando REST como respaldo):', err);
      return null;
    }
  }

  const FirebaseDB = {
    isConfigured: function() {
      const config = getStoredConfig();
      return !!(config && config.databaseURL && config.databaseURL.startsWith('http'));
    },

    getConfig: function() {
      return getStoredConfig();
    },

    saveConfig: function(config) {
      try {
        if (!config || !config.databaseURL) return false;
        config.databaseURL = config.databaseURL.trim().replace(/\/+$/, '');
        if (!config.apiKey) config.apiKey = DEFAULT_CONFIG.apiKey;
        config.projectId = "escuela-padre-otto-acost-55285";

        localStorage.setItem('bei_firebase_config', JSON.stringify(config));
        isInitialized = false;
        dbInstance = null;
        initFirebase();
        return true;
      } catch (e) {
        console.error('Error al guardar configuración:', e);
        return false;
      }
    },

    saveRecord: async function(record) {
      const config = getStoredConfig();
      const id = record.id || ('REC-' + Date.now());
      record.id = id;
      record.updated_at = new Date().toISOString();
      if (!record.created_at) record.created_at = new Date().toISOString();

      // 1. Intentar con Firebase SDK
      const db = initFirebase();
      if (db) {
        try {
          await db.ref('records/' + id).set(record);
          console.log('✅ Guardado en Firebase via SDK:', id);
          return true;
        } catch (e) {
          console.warn('Fallo SDK al guardar, intentando REST:', e);
        }
      }

      // 2. Respaldo directo via REST API (nunca falla si hay internet)
      try {
        const url = config.databaseURL + '/records/' + encodeURIComponent(id) + '.json';
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        if (res.ok) {
          console.log('✅ Guardado en Firebase via REST API:', id);
          return true;
        }
      } catch (restErr) {
        console.error('Error al guardar vía REST en Firebase:', restErr);
      }
      return false;
    },

    getRecords: async function() {
      const config = getStoredConfig();

      // 1. Intentar con Firebase SDK
      const db = initFirebase();
      if (db) {
        try {
          const snapshot = await db.ref('records').once('value');
          const data = snapshot.val();
          if (data) {
            const list = Object.keys(data).map(k => data[k]).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            return list;
          }
        } catch (e) {
          console.warn('Fallo SDK al leer, intentando REST:', e);
        }
      }

      // 2. Respaldo directo via REST API
      try {
        const url = config.databaseURL + '/records.json';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const list = Object.keys(data).map(k => data[k]).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            return list;
          }
          return [];
        }
      } catch (restErr) {
        console.error('Error al obtener registros vía REST de Firebase:', restErr);
      }
      return null;
    },

    onRecordsChange: function(callback) {
      const db = initFirebase();
      if (db) {
        try {
          db.ref('records').on('value', snapshot => {
            const data = snapshot.val();
            if (!data) {
              callback([]);
              return;
            }
            const list = Object.keys(data).map(k => data[k]).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            callback(list);
          });
        } catch (err) {
          console.warn('Error en listener SDK de Firebase:', err);
        }
      }
    },

    deleteRecord: async function(id) {
      const config = getStoredConfig();

      const db = initFirebase();
      if (db) {
        try {
          await db.ref('records/' + id).remove();
          return true;
        } catch (e) {}
      }

      // Respaldo REST
      try {
        const url = config.databaseURL + '/records/' + encodeURIComponent(id) + '.json';
        const res = await fetch(url, { method: 'DELETE' });
        return res.ok;
      } catch (e) {
        return false;
      }
    }
  };

  window.FirebaseDB = FirebaseDB;
  initFirebase();

})(window);
