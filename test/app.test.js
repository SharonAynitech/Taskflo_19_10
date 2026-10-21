// Tests de US-01-1: la app levanta, responde /health y sirve la página con marca TaskFlow.
const { test, before, after } = require('node:test');
const assert = require('node:assert');

let server;
let base;

before(async () => {
  const { createServer } = require('../server');
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server && server.close());

test('GET /health responde 200 con {"status":"ok"}', async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });
});

test('GET / sirve la página con el nombre TaskFlow', async () => {
  const res = await fetch(`${base}/`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const html = await res.text();
  assert.match(html, /<title>TaskFlow<\/title>/);
  assert.match(html, /data-testid="app-name"[^>]*>TaskFlow</);
});

test('la página es responsive (meta viewport)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
});

test('la página define y usa las variables CSS de la marca', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /--color-primary:\s*#4F46E5/i);
  assert.match(html, /--color-bg:\s*#F5F6F8/i);
  assert.match(html, /--color-text:\s*#111827/i);
  assert.match(html, /background:\s*var\(--color-bg\)/);
  assert.match(html, /color:\s*var\(--color-text\)/);
  assert.match(html, /background:\s*var\(--color-primary\)/);
});

test('GET / muestra el formulario de inicio de sesión (US-02-1)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<form[^>]*id="login-form"[^>]*novalidate/);
  assert.match(html, /<input[^>]*name="email"/);
  assert.match(html, /<input[^>]*name="password"[^>]*type="password"|<input[^>]*type="password"[^>]*name="password"/);
  assert.match(html, /<script src="\/js\/auth\.js"><\/script>/);
});

test('GET / incluye el formulario de registro (US-02-2)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<form[^>]*id="register-form"[^>]*novalidate/);
  assert.match(html, /<input[^>]*name="confirm"/);
  assert.match(html, /id="show-register"/);
  assert.match(html, /id="show-login"/);
});

test('GET / incluye el tablero y el modal de nueva tarea (US-03-1)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<script src="\/js\/tasks\.js"><\/script>/);
  assert.match(html, /<dialog[^>]*id="task-dialog"/);
  assert.match(html, /<form[^>]*id="task-form"[^>]*novalidate/);
  for (const status of ['todo', 'doing', 'done']) assert.match(html, new RegExp(`data-column="${status}"`));
  assert.match(html, />Por hacer</);
  assert.match(html, />En progreso</);
  assert.match(html, />Hecho</);
});

test('GET /js/tasks.js se sirve como JavaScript', async () => {
  const res = await fetch(`${base}/js/tasks.js`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/javascript/);
});

test('GET /js/auth.js se sirve como JavaScript', async () => {
  const res = await fetch(`${base}/js/auth.js`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/javascript/);
  assert.match(await res.text(), /demo@taskflow\.test/);
});

test('rutas desconocidas devuelven 404', async () => {
  const res = await fetch(`${base}/no-existe`);
  assert.strictEqual(res.status, 404);
});

test('GET / explica cómo arrastrar tarjetas entre columnas (US-03-2)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /Arrastra una tarjeta a otra columna para actualizar su estado\. Suelta fuera de cualquier columna y volverá a su lugar\./);
  assert.match(html, /<\/svg>\s*Arrastra para mover\s*<\/span>/);
  assert.match(html, /id="board-status"[^>]*aria-live="polite"/);
});

test('GET / incluye el modal de confirmación para eliminar (US-03-3)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<dialog[^>]*id="delete-dialog"/);
  assert.match(html, /<h2 id="delete-dialog-title">Eliminar tarea<\/h2>/);
  assert.match(html, /id="delete-confirm"[^>]*>Eliminar</);
  assert.match(html, /id="delete-cancel"[^>]*>Cancelar</);
  assert.match(html, /Cada tarjeta tiene acciones para editar o eliminar\. La eliminación pide confirmación explícita antes de ejecutarse\./);
});

test('GET / incluye las pestañas Tablero/Tabla y la tabla ordenable (US-04-1)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /role="tablist"/);
  assert.match(html, /id="view-board-tab"[^>]*role="tab"[^>]*>Tablero</);
  assert.match(html, /id="view-table-tab"[^>]*role="tab"[^>]*>Tabla</);
  assert.match(html, /<table[^>]*data-testid="task-table"/);
  assert.match(html, />Lista de tareas</);
  for (const key of ['title', 'priority', 'status', 'due']) assert.match(html, new RegExp(`data-sort="${key}"`));
  assert.match(html, /Sin tareas que coincidan con los filtros/);
  assert.match(html, /Revisa todas tus tareas en lista y ordena por cualquier columna\./);
});

test('GET / incluye los filtros por estado y prioridad (US-04-2)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<select[^>]*id="filter-status"/);
  assert.match(html, /<select[^>]*id="filter-priority"/);
  assert.match(html, /<option value="">Todos<\/option>/);
  assert.match(html, /<option value="">Todas<\/option>/);
  assert.match(html, /id="filter-clear"[^>]*>Limpiar filtros</);
  assert.match(html, /data-testid="filter-summary"/);
  assert.match(html, /Los filtros se aplican en la vista de tablero y en la de tabla\./);
});

test('GET / incluye la búsqueda por título (US-04-3)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<input[^>]*id="filter-search"[^>]*type="search"/);
  assert.match(html, /<label[^>]*for="filter-search"[^>]*>Buscar tareas por título</);
  assert.match(html, /<kbd[^>]*>\/<\/kbd>/);
});

test('GET / incluye la selección múltiple y la barra de acciones en lote (US-04-4)', async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.match(html, /<input[^>]*type="checkbox"[^>]*id="select-all"/);
  assert.match(html, /data-testid="batch-bar"[^>]*hidden/);
  assert.match(html, /<span id="batch-count">0<\/span> <span id="batch-noun">seleccionadas<\/span>/);
  assert.match(html, /<label for="batch-status">Cambiar estado a<\/label>/);
  assert.match(html, /<option value="">Elegir estado…<\/option>/);
  assert.match(html, /id="batch-apply"[^>]*>Aplicar</);
  assert.match(html, /id="batch-clear"[^>]*>Deseleccionar todo</);
  assert.match(html, /Usa las casillas para seleccionar varias tareas\./);
});
