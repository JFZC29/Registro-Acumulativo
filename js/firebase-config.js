// Firebase Realtime Database Client for Sistema BEI
// Escuela de Educación Básica Fiscomisional "Padre Otto Acosta"

(function(window) {
  'use strict';

  // Configuración predeterminada (puede ser editada aquí o guardada desde el Panel de Admin)
  const FALLBACK_CONFIG = {
    apiKey: "",
    databaseURL: "",
    projectId: ""
  };

  function getStoredConfig() {
    try {
      const custom = localStorage.getItem('bei_firebase_config');
      if (custom) return JSON.parse(custom);
    } catch (e) {}
    return window.BEI_FIREBASE_CONFIG || FALLBACK_CONFIG;
  }

  let dbInstance = null;
  let isInitialized = false;

  function initFirebase() {
    if (isInitialized && dbInstance) return dbInstance;
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK no está cargado en esta página.');
      return null;
    }

    const config = getStoredConfig();
    if (!config || !config.databaseURL) {
      return null;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      dbInstance = firebase.database();
      isInitialized = true;
      console.log('🟢 Firebase Realtime Database inicializado correctamente.');
      return dbInstance;
    } catch (err) {
      console.error('Error al inicializar Firebase:', err);
      return null;
    }
  }

  const FirebaseDB = {
    isConfigured: function() {
      const config = getStoredConfig();
      return !!(config && config.databaseURL && config.databaseURL.trim().length > 10);
    },

    getConfig: function() {
      return getStoredConfig();
    },

    saveConfig: function(config) {
      try {
        localStorage.setItem('bei_firebase_config', JSON.stringify(config));
        isInitialized = false;
        dbInstance = null;
        return initFirebase() !== null;
      } catch (e) {
        console.error('Error al guardar configuración de Firebase:', e);
        return false;
      }
    },

    saveRecord: async function(record) {
      const db = initFirebase();
      if (!db) return false;
      try {
        const id = record.id || ('REC-' + Date.now());
        record.id = id;
        record.updated_at = new Date().toISOString();
        if (!record.created_at) record.created_at = new Date().toISOString();

        await db.ref('records/' + id).set(record);
        console.log('Registro guardado exitosamente en la nube Firebase:', id);
        return true;
      } catch (err) {
        console.error('Error al guardar en Firebase:', err);
        return false;
      }
    },

    getRecords: async function() {
      const db = initFirebase();
      if (!db) return null;
      try {
        const snapshot = await db.ref('records').once('value');
        const data = snapshot.val();
        if (!data) return [];
        const list = Object.keys(data).map(k => data[k]);
        // Ordenar por fecha descendente (más recientes primero)
        list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
        return list;
      } catch (err) {
        console.error('Error al obtener registros de Firebase:', err);
        return null;
      }
    },

    onRecordsChange: function(callback) {
      const db = initFirebase();
      if (!db) return;
      try {
        db.ref('records').on('value', snapshot => {
          const data = snapshot.val();
          if (!data) {
            callback([]);
            return;
          }
          const list = Object.keys(data).map(k => data[k]);
          list.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
          callback(list);
        });
      } catch (err) {
        console.error('Error en listener de Firebase:', err);
      }
    },

    deleteRecord: async function(id) {
      const db = initFirebase();
      if (!db) return false;
      try {
        await db.ref('records/' + id).remove();
        return true;
      } catch (err) {
        console.error('Error al eliminar en Firebase:', err);
        return false;
      }
    }
  };

  window.FirebaseDB = FirebaseDB;
  // Intentar inicialización automática
  initFirebase();

})(window);
