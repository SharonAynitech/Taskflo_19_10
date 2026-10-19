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

// ---------- US-02-2: registro ----------

test('registro válido crea la cuenta e inicia sesión', () => {
  const auth = createAuth();
  const result = auth.register('nueva@correo.pe', 'Clave123', 'Clave123');
  assert.deepStrictEqual(result, { ok: true, email: 'nueva@correo.pe' });
  assert.strictEqual(auth.currentUser(), 'nueva@correo.pe');
});

test('la cuenta registrada puede volver a iniciar sesión', () => {
  const auth = createAuth();
  auth.register('Nueva@Correo.pe', 'Clave123', 'Clave123');
  auth.logout();
  assert.strictEqual(auth.login('nueva@correo.pe', 'Clave123').ok, true);
});

test('registro con campos vacíos devuelve error', () => {
  const auth = createAuth();
  assert.deepStrictEqual(auth.register('', '', ''), { ok: false, error: MESSAGES.registerEmpty, field: 'email' });
  assert.deepStrictEqual(auth.register('a@b.pe', '', ''), { ok: false, error: MESSAGES.registerEmpty, field: 'password' });
  assert.deepStrictEqual(auth.register('a@b.pe', 'Clave123', ''), { ok: false, error: MESSAGES.registerEmpty, field: 'confirm' });
  assert.strictEqual(auth.currentUser(), null);
});

test('registro con correo inválido devuelve "Ingresa un correo válido"', () => {
  const auth = createAuth();
  assert.strictEqual(MESSAGES.invalidEmail, 'Ingresa un correo válido');
  for (const bad of ['sin-arroba', 'a@b', '@dominio.pe', 'a b@c.pe', 'a@b.']) {
    assert.deepStrictEqual(auth.register(bad, 'Clave123', 'Clave123'), { ok: false, error: MESSAGES.invalidEmail, field: 'email' }, bad);
  }
  assert.strictEqual(auth.currentUser(), null);
});

test('registro con contraseñas distintas devuelve "Las contraseñas no coinciden"', () => {
  const auth = createAuth();
  assert.strictEqual(MESSAGES.mismatch, 'Las contraseñas no coinciden');
  assert.deepStrictEqual(auth.register('nueva@correo.pe', 'Clave123', 'Clave124'), { ok: false, error: MESSAGES.mismatch, field: 'confirm' });
  assert.strictEqual(auth.currentUser(), null);
});

test('registro con correo existente (sin distinguir mayúsculas) devuelve "Ya existe una cuenta con ese correo"', () => {
  const auth = createAuth();
  assert.strictEqual(MESSAGES.exists, 'Ya existe una cuenta con ese correo');
  assert.deepStrictEqual(auth.register('DEMO@taskflow.test', 'Clave123', 'Clave123'), { ok: false, error: MESSAGES.exists, field: 'email' });
  auth.register('nueva@correo.pe', 'Clave123', 'Clave123');
  auth.logout();
  assert.deepStrictEqual(auth.register('nueva@correo.pe', 'Otra1234', 'Otra1234'), { ok: false, error: MESSAGES.exists, field: 'email' });
  assert.strictEqual(auth.currentUser(), null);
});

test('un registro fallido no agrega la cuenta', () => {
  const auth = createAuth();
  auth.register('nueva@correo.pe', 'Clave123', 'Distinta1');
  assert.deepStrictEqual(auth.login('nueva@correo.pe', 'Clave123'), { ok: false, error: MESSAGES.invalid });
});

test('cada instancia empieza desde cero (sin persistencia)', () => {
  const a = createAuth();
  a.login('demo@taskflow.test', 'Demo1234');
  assert.strictEqual(createAuth().currentUser(), null);
});
