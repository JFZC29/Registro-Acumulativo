// Firebase Realtime Database Client for Sistema BEI
// Escuela de Educación Básica Fiscomisional "Padre Otto Acosta"

(function(window) {
  'use strict';

  // Configuración oficial de la base de datos de la escuela
  const OFFICIAL_CONFIG = {
    apiKey: "AIzaSyEscuelaPadreOttoAcostaKey2026",
    databaseURL: "https://escuela-padre-otto-acost-55285-default-rtdb.firebaseio.com",
    projectId: "escuela-padre-otto-acost-55285"
  };

  function getStoredConfig() {
    try {
      const custom = localStorage.getItem('bei_firebase_config');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (parsed && typeof parsed.databaseURL === 'string' && parsed.databaseURL.startsWith('http')) {
          parsed.databaseURL = parsed.databaseURL.replace(/\/+$/, '');
          if (!parsed.apiKey) parsed.apiKey = OFFICIAL_CONFIG.apiKey;
          return parsed;
        }
      }
    } catch (e) {}
    return OFFICIAL_CONFIG;
  }

  let dbInstance = null;
  let isInitialized = false;

  function initFirebase() {
    if (isInitialized && dbInstance) return dbInstance;
    if (typeof firebase === 'undefined') {
      return null;
    }

    const config = getStoredConfig();
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: config.apiKey || OFFICIAL_CONFIG.apiKey,
          databaseURL: config.databaseURL,
          projectId: config.projectId || OFFICIAL_CONFIG.projectId
        });
      }
      dbInstance = firebase.database();
      isInitialized = true;
      console.log('🟢 Firebase Realtime Database conectado exitosamente a:', config.databaseURL);
      return dbInstance;
    } catch (err) {
      console.warn('Firebase SDK init warning (utilizando REST como respaldo de alta velocidad):', err);
      return null;
    }
  }

  const FirebaseDB = {
    isConfigured: function() {
      return true; // Siempre activo y configurado con la base de datos de la escuela
    },

    getConfig: function() {
      return getStoredConfig();
    },

    saveConfig: function(config) {
      try {
        if (!config || !config.databaseURL) return false;
        config.databaseURL = config.databaseURL.trim().replace(/\/+$/, '');
        if (!config.apiKey) config.apiKey = OFFICIAL_CONFIG.apiKey;
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

      // 1. Guardar vía REST API directamente (ultra-rápido, sin dependencias)
      let restSaved = false;
      try {
        const url = config.databaseURL + '/records/' + encodeURIComponent(id) + '.json';
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        if (res.ok) {
          console.log('✅ Guardado en Firebase Cloud via REST:', id);
          restSaved = true;
        }
      } catch (restErr) {
        console.warn('Error al guardar vía REST:', restErr);
      }

      // 2. También enviar vía SDK si está activo para disparar eventos en tiempo real
      const db = initFirebase();
      if (db) {
        try {
          await db.ref('records/' + id).set(record);
          console.log('✅ Sincronizado vía Firebase SDK en vivo:', id);
          return true;
        } catch (e) {}
      }

      return restSaved;
    },

    getRecords: async function() {
      const config = getStoredConfig();

      // 1. Obtener vía REST API (directo y confiable)
      try {
        const url = config.databaseURL + '/records.json';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            const list = Object.keys(data).map(k => {
              const item = data[k];
              if (item && !item.id) item.id = k;
              return item;
            }).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            return list;
          }
          return [];
        }
      } catch (restErr) {
        console.warn('Fallo REST al leer, intentando SDK:', restErr);
      }

      // 2. Respaldo vía SDK
      const db = initFirebase();
      if (db) {
        try {
          const snapshot = await db.ref('records').once('value');
          const data = snapshot.val();
          if (data) {
            const list = Object.keys(data).map(k => {
              const item = data[k];
              if (item && !item.id) item.id = k;
              return item;
            }).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            return list;
          }
        } catch (e) {}
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
            const list = Object.keys(data).map(k => {
              const item = data[k];
              if (item && !item.id) item.id = k;
              return item;
            }).filter(Boolean);
            list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
            callback(list);
          });
        } catch (err) {
          console.warn('Error en listener de Firebase SDK:', err);
        }
      }
    },

    deleteRecord: async function(id) {
      const config = getStoredConfig();
      let ok = false;
      try {
        const url = config.databaseURL + '/records/' + encodeURIComponent(id) + '.json';
        const res = await fetch(url, { method: 'DELETE' });
        ok = res.ok;
      } catch (e) {}

      const db = initFirebase();
      if (db) {
        try {
          await db.ref('records/' + id).remove();
          ok = true;
        } catch (e) {}
      }
      return ok;
    }
  };

  window.FirebaseDB = FirebaseDB;
  initFirebase();

})(window);
