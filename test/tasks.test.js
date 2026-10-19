// Tests de US-03-1: crear tareas en memoria con título obligatorio, prioridad, fecha límite y estado.
const { test } = require('node:test');
const assert = require('node:assert');
const { createTaskStore, STATUSES, PRIORITIES, MESSAGES, formatDue } = require('../public/js/tasks');

test('estados y prioridades fijos', () => {
  assert.deepStrictEqual(STATUSES.map((s) => [s.id, s.label]), [['todo', 'Por hacer'], ['doing', 'En progreso'], ['done', 'Hecho']]);
  assert.deepStrictEqual(PRIORITIES.map((p) => [p.id, p.label]), [['alta', 'Alta'], ['media', 'Media'], ['baja', 'Baja']]);
});

test('el tablero empieza vacío', () => {
  assert.deepStrictEqual(createTaskStore().list(), []);
});

test('crear sin título falla con "El título es obligatorio."', () => {
  const store = createTaskStore();
  assert.strictEqual(MESSAGES.titleRequired, 'El título es obligatorio.');
  assert.deepStrictEqual(store.add({ title: '' }), { ok: false, error: MESSAGES.titleRequired, field: 'title' });
  assert.deepStrictEqual(store.add({ title: '    ' }), { ok: false, error: MESSAGES.titleRequired, field: 'title' });
  assert.deepStrictEqual(store.list(), []);
});

test('crear con solo título usa los valores por defecto (media, Por hacer, sin fecha)', () => {
  const store = createTaskStore();
  const r = store.add({ title: '  Preparar informe  ' });
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.task, { id: 1, title: 'Preparar informe', priority: 'media', status: 'todo', due: '' });
  assert.deepStrictEqual(store.list(), [r.task]);
});

test('crear con prioridad, fecha y estado los conserva', () => {
  const store = createTaskStore();
  const r = store.add({ title: 'Llamar al banco', priority: 'alta', due: '2026-10-25', status: 'todo' });
  assert.deepStrictEqual(r.task, { id: 1, title: 'Llamar al banco', priority: 'alta', status: 'todo', due: '2026-10-25' });
});

test('los ids son incrementales', () => {
  const store = createTaskStore();
  store.add({ title: 'A' });
  assert.strictEqual(store.add({ title: 'B' }).task.id, 2);
});

test('prioridad, estado o fecha inválidos se rechazan', () => {
  const store = createTaskStore();
  assert.strictEqual(store.add({ title: 'X', priority: 'urgente' }).ok, false);
  assert.strictEqual(store.add({ title: 'X', status: 'archivada' }).ok, false);
  assert.strictEqual(store.add({ title: 'X', due: '25/10/2026' }).ok, false);
  assert.deepStrictEqual(store.list(), []);
});

test('byStatus agrupa las tareas por columna', () => {
  const store = createTaskStore();
  store.add({ title: 'A' });
  store.add({ title: 'B', status: 'doing' });
  store.add({ title: 'C' });
  assert.deepStrictEqual(store.byStatus('todo').map((t) => t.title), ['A', 'C']);
  assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['B']);
  assert.deepStrictEqual(store.byStatus('done'), []);
});

test('list devuelve copias: modificar el resultado no altera el estado', () => {
  const store = createTaskStore();
  store.add({ title: 'A' });
  store.list()[0].title = 'cambiado';
  assert.strictEqual(store.list()[0].title, 'A');
});

test('formatDue muestra la fecha local sin desfase de zona horaria', () => {
  assert.strictEqual(formatDue(''), '');
  assert.match(formatDue('2026-10-25'), /^25 .*oct.* 2026$/);
  assert.match(formatDue('2026-01-01'), /^1 .*ene.* 2026$|^01 .*ene.* 2026$/);
});
