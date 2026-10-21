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

// Tests de US-03-2: mover una tarea a otra columna.
test('move cambia el estado y la tarea aparece en la nueva columna', () => {
  const store = createTaskStore();
  const { task } = store.add({ title: 'A', priority: 'alta', due: '2026-10-25' });
  const r = store.move(task.id, 'doing');
  assert.deepStrictEqual(r, { ok: true, task: { id: task.id, title: 'A', priority: 'alta', status: 'doing', due: '2026-10-25' } });
  assert.deepStrictEqual(store.byStatus('todo'), []);
  assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['A']);
});

test('la tarea movida queda al final de la columna de destino', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'A' }).task;
  store.add({ title: 'B', status: 'doing' });
  store.add({ title: 'C', status: 'doing' });
  store.move(a.id, 'doing');
  assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['B', 'C', 'A']);
});

test('mover a la misma columna no cambia el orden', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'A' }).task;
  store.add({ title: 'B' });
  assert.strictEqual(store.move(a.id, 'todo').ok, true);
  assert.deepStrictEqual(store.byStatus('todo').map((t) => t.title), ['A', 'B']);
});

test('mover a un estado inválido o una tarea inexistente falla sin cambios', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'A' }).task;
  assert.deepStrictEqual(store.move(a.id, 'archivada'), { ok: false, error: MESSAGES.invalidStatus, field: 'status' });
  assert.deepStrictEqual(store.move(99, 'doing'), { ok: false, error: MESSAGES.notFound });
  assert.deepStrictEqual(store.list().map((t) => t.status), ['todo']);
});

// Tests de US-03-3: editar y eliminar tareas.
test('update cambia título, prioridad, fecha y estado validando igual que al crear', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'Informe', priority: 'media' }).task;
  const r = store.update(a.id, { title: '  Informe final  ', priority: 'alta', due: '2026-11-02', status: 'todo' });
  assert.deepStrictEqual(r, { ok: true, task: { id: a.id, title: 'Informe final', priority: 'alta', status: 'todo', due: '2026-11-02' } });
  assert.deepStrictEqual(store.list(), [r.task]);
});

test('update sin título falla y no cambia la tarea', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'Informe' }).task;
  assert.deepStrictEqual(store.update(a.id, { title: '   ' }), { ok: false, error: MESSAGES.titleRequired, field: 'title' });
  assert.strictEqual(store.list()[0].title, 'Informe');
});

test('update mantiene la posición si no cambia el estado y la mueve al final si cambia', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'A' }).task;
  store.add({ title: 'B' });
  store.add({ title: 'C', status: 'doing' });
  store.update(a.id, { title: 'A2', status: 'todo' });
  assert.deepStrictEqual(store.byStatus('todo').map((t) => t.title), ['A2', 'B']);
  store.update(a.id, { title: 'A3', status: 'doing' });
  assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['C', 'A3']);
});

test('update de una tarea inexistente falla', () => {
  assert.deepStrictEqual(createTaskStore().update(7, { title: 'X' }), { ok: false, error: MESSAGES.notFound });
});

test('remove elimina solo la tarea indicada', () => {
  const store = createTaskStore();
  const a = store.add({ title: 'A' }).task;
  store.add({ title: 'B' });
  assert.deepStrictEqual(store.remove(a.id), { ok: true, task: a });
  assert.deepStrictEqual(store.list().map((t) => t.title), ['B']);
  assert.deepStrictEqual(store.remove(a.id), { ok: false, error: MESSAGES.notFound });
  assert.strictEqual(store.list().length, 1);
});

// Tests de US-04-1: ordenar la tabla por columna.
const { sortTasks } = require('../public/js/tasks');

function sample() {
  const store = createTaskStore();
  store.add({ title: 'Comprar pan', priority: 'baja', due: '2026-11-05' });
  store.add({ title: 'abrir cuenta', priority: 'alta', status: 'done' });
  store.add({ title: 'Llamar al banco', priority: 'media', status: 'doing', due: '2026-10-25' });
  store.add({ title: 'Enviar informe', priority: 'alta', due: '2026-10-30' });
  return store;
}
const titles = (list) => list.map((t) => t.title);

test('sin columna de orden se listan por creación, aunque se hayan movido', () => {
  const store = sample();
  store.move(1, 'done');
  assert.deepStrictEqual(titles(sortTasks(store.list())), ['Comprar pan', 'abrir cuenta', 'Llamar al banco', 'Enviar informe']);
});

test('por prioridad ascendente va alta primero y descendente baja primero; empates por creación', () => {
  const list = sample().list();
  assert.deepStrictEqual(titles(sortTasks(list, 'priority', 'asc')), ['abrir cuenta', 'Enviar informe', 'Llamar al banco', 'Comprar pan']);
  assert.deepStrictEqual(titles(sortTasks(list, 'priority', 'desc')), ['Comprar pan', 'Llamar al banco', 'abrir cuenta', 'Enviar informe']);
});

test('por título ignora mayúsculas y acentos', () => {
  assert.deepStrictEqual(titles(sortTasks(sample().list(), 'title', 'asc')), ['abrir cuenta', 'Comprar pan', 'Enviar informe', 'Llamar al banco']);
});

test('por estado sigue el orden de las columnas', () => {
  assert.deepStrictEqual(titles(sortTasks(sample().list(), 'status', 'asc')), ['Comprar pan', 'Enviar informe', 'Llamar al banco', 'abrir cuenta']);
});

test('por fecha límite las tareas sin fecha van al final en ambos sentidos', () => {
  const list = sample().list();
  assert.deepStrictEqual(titles(sortTasks(list, 'due', 'asc')), ['Llamar al banco', 'Enviar informe', 'Comprar pan', 'abrir cuenta']);
  assert.deepStrictEqual(titles(sortTasks(list, 'due', 'desc')), ['Comprar pan', 'Enviar informe', 'Llamar al banco', 'abrir cuenta']);
});

test('sortTasks no modifica la lista recibida', () => {
  const list = sample().list();
  sortTasks(list, 'priority', 'asc');
  assert.deepStrictEqual(titles(list), ['Comprar pan', 'abrir cuenta', 'Llamar al banco', 'Enviar informe']);
});

// Tests de US-04-2: filtrar por estado y prioridad.
const { filterTasks } = require('../public/js/tasks');

function mixed() {
  const store = createTaskStore();
  store.add({ title: 'A', priority: 'alta', status: 'todo' });
  store.add({ title: 'B', priority: 'baja', status: 'todo' });
  store.add({ title: 'C', priority: 'alta', status: 'doing' });
  store.add({ title: 'D', priority: 'media', status: 'done' });
  return store.list();
}

test('sin filtros (o con valores vacíos) devuelve todas las tareas', () => {
  assert.deepStrictEqual(titles(filterTasks(mixed())), ['A', 'B', 'C', 'D']);
  assert.deepStrictEqual(titles(filterTasks(mixed(), { status: '', priority: '' })), ['A', 'B', 'C', 'D']);
});

test('filtra por estado', () => {
  assert.deepStrictEqual(titles(filterTasks(mixed(), { status: 'todo' })), ['A', 'B']);
});

test('filtra por prioridad', () => {
  assert.deepStrictEqual(titles(filterTasks(mixed(), { priority: 'alta' })), ['A', 'C']);
});

test('estado y prioridad se combinan (ambos deben cumplirse)', () => {
  assert.deepStrictEqual(titles(filterTasks(mixed(), { status: 'todo', priority: 'alta' })), ['A']);
  assert.deepStrictEqual(filterTasks(mixed(), { status: 'done', priority: 'alta' }), []);
});

// Tests de US-04-3: buscar por título.
const { matchRange } = require('../public/js/tasks');

function shopping() {
  const store = createTaskStore();
  store.add({ title: 'Comprar pan', priority: 'baja' });
  store.add({ title: 'Lavar auto', priority: 'alta', status: 'doing' });
  store.add({ title: 'Pagar teléfono', priority: 'alta' });
  return store.list();
}

test('la búsqueda filtra por título', () => {
  assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'pan' })), ['Comprar pan']);
});

test('la búsqueda no distingue mayúsculas, acentos ni espacios en los extremos', () => {
  assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'PAN' })), ['Comprar pan']);
  assert.deepStrictEqual(titles(filterTasks(shopping(), { query: '  Telefono ' })), ['Pagar teléfono']);
});

test('una búsqueda vacía no restringe y se combina con los demás filtros', () => {
  assert.strictEqual(filterTasks(shopping(), { query: '   ' }).length, 3);
  assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'ar', priority: 'alta' })), ['Lavar auto', 'Pagar teléfono']);
  assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'ar', priority: 'alta', status: 'todo' })), ['Pagar teléfono']);
  assert.deepStrictEqual(filterTasks(shopping(), { query: 'xyz' }), []);
});

test('matchRange da la posición de la coincidencia en el título original', () => {
  assert.deepStrictEqual(matchRange('Comprar pan', 'PAN'), [8, 11]);
  assert.deepStrictEqual(matchRange('Pagar teléfono', 'telefono'), [6, 14]);
  assert.strictEqual(matchRange('Comprar pan', 'xyz'), null);
  assert.strictEqual(matchRange('Comprar pan', '  '), null);
});
