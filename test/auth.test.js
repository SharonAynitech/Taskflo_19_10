// Tests de US-02-1: inicio de sesión en memoria con la cuenta demo.
const { test } = require('node:test');
const assert = require('node:assert');
const { createAuth, DEMO_ACCOUNT, MESSAGES } = require('../public/js/auth');

test('la cuenta demo existe al iniciar', () => {
  assert.deepStrictEqual(DEMO_ACCOUNT, { email: 'demo@taskflow.test', password: 'Demo1234' });
  const auth = createAuth();
  assert.strictEqual(auth.currentUser(), null);
});

test('login con las credenciales demo inicia sesión', () => {
  const auth = createAuth();
  const result = auth.login('demo@taskflow.test', 'Demo1234');
  assert.deepStrictEqual(result, { ok: true, email: 'demo@taskflow.test' });
  assert.strictEqual(auth.currentUser(), 'demo@taskflow.test');
});

test('el correo se compara sin distinguir mayúsculas y sin espacios', () => {
  const auth = createAuth();
  assert.strictEqual(auth.login('  DEMO@TaskFlow.test ', 'Demo1234').ok, true);
});

test('la contraseña sí distingue mayúsculas', () => {
  const auth = createAuth();
  assert.deepStrictEqual(auth.login('demo@taskflow.test', 'demo1234'), { ok: false, error: MESSAGES.invalid });
  assert.strictEqual(auth.currentUser(), null);
});

test('campos vacíos devuelven error y no inician sesión', () => {
  const auth = createAuth();
  assert.deepStrictEqual(auth.login('', ''), { ok: false, error: MESSAGES.empty });
  assert.deepStrictEqual(auth.login('demo@taskflow.test', ''), { ok: false, error: MESSAGES.empty });
  assert.deepStrictEqual(auth.login('   ', 'Demo1234'), { ok: false, error: MESSAGES.empty });
  assert.strictEqual(auth.currentUser(), null);
});

test('credenciales incorrectas devuelven "Correo o contraseña incorrectos"', () => {
  const auth = createAuth();
  assert.strictEqual(MESSAGES.invalid, 'Correo o contraseña incorrectos');
  assert.deepStrictEqual(auth.login('otro@taskflow.test', 'Demo1234'), { ok: false, error: MESSAGES.invalid });
  assert.strictEqual(auth.currentUser(), null);
});

test('logout cierra la sesión', () => {
  const auth = createAuth();
  auth.login('demo@taskflow.test', 'Demo1234');
  auth.logout();
  assert.strictEqual(auth.currentUser(), null);
});

test('cada instancia empieza desde cero (sin persistencia)', () => {
  const a = createAuth();
  a.login('demo@taskflow.test', 'Demo1234');
  assert.strictEqual(createAuth().currentUser(), null);
});
