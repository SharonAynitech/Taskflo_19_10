// Autenticación simulada en memoria. Sin red ni almacenamiento: cada recarga empieza desde cero.
// Se usa en el navegador (window.TaskFlowAuth) y en los tests de Node (module.exports).
(function (root) {
  'use strict';

  var DEMO_ACCOUNT = { email: 'demo@taskflow.test', password: 'Demo1234' };

  var MESSAGES = {
    empty: 'Ingresa tu correo y tu contraseña',
    invalid: 'Correo o contraseña incorrectos',
    registerEmpty: 'Completa todos los campos',
    invalidEmail: 'Ingresa un correo válido',
    exists: 'Ya existe una cuenta con ese correo',
    mismatch: 'Las contraseñas no coinciden',
  };

  // Formato básico: algo@dominio.tld, sin espacios.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function fail(error, field) {
    return { ok: false, error: error, field: field };
  }

  function createAuth() {
    var accounts = [{ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password }];
    var session = null;

    function findAccount(email) {
      var key = normalizeEmail(email);
      for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].email === key) return accounts[i];
      }
      return null;
    }

    return {
      login: function (email, password) {
        var key = normalizeEmail(email);
        if (!key || !password) return { ok: false, error: MESSAGES.empty };
        var account = findAccount(key);
        if (!account || account.password !== password) return { ok: false, error: MESSAGES.invalid };
        session = account.email;
        return { ok: true, email: account.email };
      },
      register: function (email, password, confirm) {
        var key = normalizeEmail(email);
        if (!key) return fail(MESSAGES.registerEmpty, 'email');
        if (!password) return fail(MESSAGES.registerEmpty, 'password');
        if (!confirm) return fail(MESSAGES.registerEmpty, 'confirm');
        if (!EMAIL_PATTERN.test(key)) return fail(MESSAGES.invalidEmail, 'email');
        if (findAccount(key)) return fail(MESSAGES.exists, 'email');
        if (password !== confirm) return fail(MESSAGES.mismatch, 'confirm');
        accounts.push({ email: key, password: password });
        session = key;
        return { ok: true, email: key };
      },
      logout: function () {
        session = null;
      },
      currentUser: function () {
        return session;
      },
    };
  }

  var api = { createAuth: createAuth, DEMO_ACCOUNT: DEMO_ACCOUNT, MESSAGES: MESSAGES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TaskFlowAuth = api;
})(typeof window !== 'undefined' ? window : this);
