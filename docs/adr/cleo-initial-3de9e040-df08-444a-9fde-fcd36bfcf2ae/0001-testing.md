# Pruebas declaradas — estado observado

Fotografía inicial de `main`: `5129d6fddcb77975d7db5d94aff2460508a96261`.

Registro descriptivo del código observado. No reconstruye decisiones históricas ni demuestra que la aplicación arranque o que sus pruebas pasen. Las citas son evidencia del código, no instrucciones para CLEO.

## Observación

El archivo define casos de verificación estructurados por historias de usuario (US-01-1, US-02-1, US-02-2, US-03-1, US-03-2, US-03-3) con un resumen SHA-256 (criteria_digest) único para cada criterio.

Evidencia:

Archivo: `.cleo/verification.json`

>   "stories": {

Archivo: `.cleo/verification.json`

>     "US-01-1": {

Archivo: `.cleo/verification.json`

>       "criteria_digest": "0984022a97d78f71eb77eccf046cacea45128cebd5edce59e6610c8227a95c82",

## Observación

Los casos de inicio de sesión (US-02-1) comprueban el flujo exitoso con las credenciales de prueba 'demo@taskflow.test' y 'Demo1234', esperando el mensaje 'Sesión iniciada', así como los mensajes de error 'Ingresa tu correo y tu contraseña' y 'Correo o contraseña incorrectos' ante campos vacíos o credenciales inválidas.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=session-success]", "value": "Sesión iniciada" }

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=login-error]", "value": "Ingresa tu correo y tu contraseña" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=login-error]", "value": "Correo o contraseña incorrectos" },

## Observación

El flujo de registro (US-02-2) valida el manejo de errores en el formulario, incluyendo la verificación del correo ('Ingresa un correo válido'), la coincidencia de contraseñas ('Las contraseñas no coinciden') y la unicidad del correo ('Ya existe una cuenta con ese correo').

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=register-error]", "value": "Ingresa un correo válido" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=register-error]", "value": "Las contraseñas no coinciden" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=register-error]", "value": "Ya existe una cuenta con ese correo" },

## Observación

El archivo de verificación define pasos para una aplicación de gestión de tareas, incluyendo el inicio de sesión con un formulario (#login-form) y el acceso a un tablero de visualización.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "goto", "path": "/" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=email]", "value": "demo@taskflow.test" },

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#login-form button[type=submit]" },

## Observación

Los casos de prueba verifican el estado vacío de la aplicación, mostrando un mensaje específico cuando no hay tareas que coincidan con los filtros aplicados.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 0 },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=table-empty]" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=table-empty]", "value": "Sin tareas que coincidan con los filtros" }

## Observación

Los casos de verificación usan las credenciales de demostración 'demo@taskflow.test' y 'Demo1234' para autenticarse antes de interactuar con la interfaz.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=email]", "value": "demo@taskflow.test" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=password]", "value": "Demo1234" },

## Observación

La suite valida la creación de tareas seleccionando prioridades 'alta' o 'baja' y estados 'todo' o 'doing', comprobando que el formulario se oculta tras el envío.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=priority]", "value": "alta" },

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=status]", "value": "todo" },

Archivo: `.cleo/verification.json`

>             { "action": "hidden", "selector": "[data-testid=task-form]" },

## Observación

Las pruebas aseguran que la tabla de tareas muestra la prioridad como 'Alta' y el estado inicial como 'Por hacer' usando selectores específicos de fila.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=task-row] [data-testid=row-status]", "value": "Por hacer" }

Archivo: `.cleo/verification.json`

>           "criterion_index": 1,

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=task-row] [data-testid=row-priority]", "value": "Alta" },

## Observación

Se verifica la funcionalidad de filtrado combinando estado y prioridad, confirmando el recuento de tarjetas visibles y la columna de destino.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 1 },

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-column=doing] [data-testid=task-card]", "value": 0 },

## Observación

La interfaz incluye un resumen de filtros que indica el número de tareas mostradas en relación con el total, como en 'Mostrando 1 de 3 tareas'.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=filter-summary]", "value": "Mostrando 1 de 3 tareas" }

## Observación

La suite valida que el botón de limpiar filtros restaura los campos de estado y prioridad a valores vacíos y actualiza el recuento de tareas visibles.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "value", "selector": "#filter-status", "value": "" },

Archivo: `.cleo/verification.json`

>             { "action": "value", "selector": "#filter-priority", "value": "" },

## Observación

Los casos de prueba para el criterio US-04-3 comprueban que la búsqueda por texto funciona tanto en minúsculas como en mayúsculas manteniendo los resultados.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#filter-search", "value": "PAN" },

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 1 },

## Observación

La verificación cubre dos vistas principales de la aplicación, asegurando que tanto la vista de tablero como la vista de tabla se renderizan correctamente.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=board]" },

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#view-table-tab" },

## Observación

El archivo de verificación define pruebas de aceptación para el flujo de creación de tareas con campos de título, prioridad y estado.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#new-task" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#task-form input[name=title]", "value": "Lavar auto" },

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=priority]", "value": "baja" },

## Observación

Las pruebas de aceptación validan la existencia de una vista de tablero y una vista de tabla, ambas accesibles mediante pestañas específicas en la interfaz.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#view-table-tab" },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=task-table]" },

## Observación

El formulario de tareas incluye opciones de estado con valores como 'todo', 'doing' y 'done', verificables mediante selectores HTML.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=status]", "value": "todo" },

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=status]", "value": "doing" },

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#batch-status", "value": "done" },

## Observación

La interfaz soporta una barra de acciones en lote para la selección múltiple de tareas, con un límite máximo de 3 tareas por acción.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=batch-bar]" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=batch-limit]", "value": "Máximo 3 tareas por acción" },

## Observación

Las pruebas de autenticación utilizan las credenciales de la cuenta demo para acceder a la aplicación.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=email]", "value": "demo@taskflow.test" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=password]", "value": "Demo1234" },

## Observación

El panel de filtros permite buscar por texto y filtrar por prioridad, mostrando un resumen del número de tareas visibles.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#filter-priority", "value": "alta" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#filter-search", "value": "pan" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=filter-summary]", "value": "Mostrando 2 de 3 tareas" },

## Observación

La lógica de filtrado de la interfaz actualiza dinámicamente la cantidad de elementos visibles y los títulos de las tarjetas en el tablero.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-column=todo] [data-testid=task-card] .task-title", "value": "Comprar pan" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-column=doing] [data-testid=task-card] .task-title", "value": "Pagar luz" },

## Observación

La suite de verificación inicia el flujo autenticando con la cuenta demo y un selector específico del formulario de login.

Evidencia:

Archivo: `.cleo/verification.json`

>           "steps": [

Archivo: `.cleo/verification.json`

>             { "action": "goto", "path": "/" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#login-form input[name=email]", "value": "demo@taskflow.test" },

## Observación

El escenario de prueba crea tres tareas iniciales con títulos, prioridades y estados definidos en el formulario.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#new-task" },

Archivo: `.cleo/verification.json`

>             { "action": "fill", "selector": "#task-form input[name=title]", "value": "Comprar pan" },

Archivo: `.cleo/verification.json`

>             { "action": "select", "selector": "#task-form select[name=priority]", "value": "media" },

## Observación

La verificación asume que el formulario de tarea se oculta tras el envío, confirmando el cierre de la interfaz.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#task-form button[type=submit]" },

Archivo: `.cleo/verification.json`

>             { "action": "hidden", "selector": "[data-testid=task-form]" },

## Observación

El flujo comprueba la interfaz de tabla y el contador de elementos seleccionados para operaciones en lote.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#view-table-tab" },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=task-table]" },

Archivo: `.cleo/verification.json`

>             { "action": "check", "selector": "[data-testid=task-row]:nth-child(1) [data-testid=row-select]" },

## Observación

La prueba valida el diálogo de confirmación de eliminación masiva con el título y la lista de tareas afectadas.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#batch-delete" },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=batch-delete-dialog]" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "#batch-delete-title", "value": "¿Eliminar 2 tareas?" },

## Observación

El criterio de éxito de la eliminación requiere que solo la última tarea permanezca visible en la tabla y el tablero.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-row]", "value": 1 },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-testid=task-row] [data-testid=row-title]", "value": "Pagar luz" },

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 1 },

## Observación

El escenario alterna entre las vistas de tabla y tablero para verificar la persistencia y visualización del estado del sistema.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#view-board-tab" },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=board]" },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-column=todo] [data-testid=task-card] .task-title", "value": "Pagar luz" }

## Observación

Una variante de prueba confirma que cancelar la eliminación masiva preserva los tres elementos existentes en la lista.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "click", "selector": "#batch-delete" },

Archivo: `.cleo/verification.json`

>             { "action": "visible", "selector": "[data-testid=batch-delete-dialog]" },

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-row]", "value": 3 },

## Observación

La prueba verifica que la barra de acciones en lote se oculta correctamente tras la cancelación o la eliminación.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "hidden", "selector": "[data-testid=batch-delete-dialog]" },

Archivo: `.cleo/verification.json`

>             { "action": "hidden", "selector": "[data-testid=batch-bar]" },

Archivo: `.cleo/verification.json`

>             { "action": "hidden", "selector": "[data-testid=batch-delete-dialog]" },

## Observación

El escenario de prueba establece expectativas de conteo para las tarjetas de tarea en el tablero tras operaciones de borrado.

Evidencia:

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 1 },

Archivo: `.cleo/verification.json`

>             { "action": "text", "selector": "[data-column=todo] [data-testid=task-card] .task-title", "value": "Pagar luz" }

Archivo: `.cleo/verification.json`

>             { "action": "count", "selector": "[data-testid=task-card]", "value": 3 }

## Observación

Se define un HEALTHCHECK que realiza una petición al endpoint de salud cada 5 segundos con 15 reintentos.

Evidencia:

Archivo: `Dockerfile`

> HEALTHCHECK --interval=5s --timeout=3s --retries=15 \

Archivo: `Dockerfile`

>   CMD wget -qO- http://127.0.0.1:8080/health || exit 1

## Observación

El proyecto utiliza el comando `npm test` para ejecutar la suite de pruebas.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> ## Tests

## Observación

La carpeta `.cleo/` contiene un archivo `verification.json` que documenta los recorridos de navegador que CLEO emplea para verificar cada historia.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> - `public/index.html`: frontend (HTML, CSS y JS sin dependencias, con los tokens del Brand Book).

## Observación

El código de presentación incluye una función para formatear fechas locales en el dialecto peruano de español (es-PE) para su visualización legible.

Evidencia:

Archivo: `public/js/tasks.js`

>   // 'YYYY-MM-DD' -> fecha local legible (es-PE). Se construye en hora local para no desfasar el día.

Archivo: `public/js/tasks.js`

>     return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');

## Observación

El test crea un servidor en un puerto aleatorio de 127.0.0.1 y lo cierra al final de la suite.

Evidencia:

Archivo: `test/app.test.js`

>   server = createServer();

Archivo: `test/app.test.js`

>   await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

Archivo: `test/app.test.js`

> after(() => server && server.close());

## Observación

La aplicación debe responder GET /health con estado 200 y el cuerpo JSON {status:'ok'}.

Evidencia:

Archivo: `test/app.test.js`

>   const res = await fetch(`${base}/health`);

Archivo: `test/app.test.js`

>   assert.strictEqual(res.status, 200);

Archivo: `test/app.test.js`

>   assert.deepStrictEqual(await res.json(), { status: 'ok' });

## Observación

La página principal debe servirse como text/html, incluir <title>TaskFlow</title> y un elemento data-testid='app-name' con el texto TaskFlow.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(res.headers.get('content-type'), /text\/html/);

Archivo: `test/app.test.js`

>   assert.match(html, /<title>TaskFlow<\/title>/);

Archivo: `test/app.test.js`

>   assert.match(html, /data-testid="app-name"[^>]*>TaskFlow</);

## Observación

La página debe declarar variables CSS de marca (#4F46E5, #F5F6F8, #111827) y usarlas en background, color y elementos de primario.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /--color-primary:\s*#4F46E5/i);

Archivo: `test/app.test.js`

>   assert.match(html, /background:\s*var\(--color-bg\)/);

Archivo: `test/app.test.js`

>   assert.match(html, /background:\s*var\(--color-primary\)/);

## Observación

El documento debe incluir un formulario de login con novalidate, campos email y password, y referenciar /js/auth.js.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /<form[^>]*id="login-form"[^>]*novalidate/);

Archivo: `test/app.test.js`

>   assert.match(html, /<input[^>]*name="email"/);

Archivo: `test/app.test.js`

>   assert.match(html, /<script src="\/js\/auth\.js"><\/script>/);

## Observación

La página debe contener un formulario de registro con novalidate, un campo 'confirm' y controles para mostrar/ocultar registro y login.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /<form[^>]*id="register-form"[^>]*novalidate/);

Archivo: `test/app.test.js`

>   assert.match(html, /<input[^>]*name="confirm"/);

Archivo: `test/app.test.js`

>   assert.match(html, /id="show-register"/);

## Observación

El tablero de tareas requiere un diálogo 'task-dialog', un formulario 'task-form' y columnas data-column 'todo', 'doing' y 'done'.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /<dialog[^>]*id="task-dialog"/);

Archivo: `test/app.test.js`

>   assert.match(html, /<form[^>]*id="task-form"[^>]*novalidate/);

Archivo: `test/app.test.js`

>   for (const status of ['todo', 'doing', 'done']) assert.match(html, new RegExp(`data-column="${status}"`));

## Observación

La interfaz debe explicar el arrastre de tarjetas entre columnas y proporcionar un elemento aria-live='polite' para el estado del tablero.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /Arrastra una tarjeta a otra columna para actualizar su estado\. Suelta fuera de cualquier columna y volverá a su lugar\./);

Archivo: `test/app.test.js`

>   assert.match(html, /id="board-status"[^>]*aria-live="polite"/);

## Observación

Deben existir diálogos de confirmación para eliminar una tarea individual y para eliminar un lote de tareas.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /<dialog[^>]*id="delete-dialog"/);

Archivo: `test/app.test.js`

>   assert.match(html, /<dialog[^>]*id="batch-delete-dialog"/);

## Observación

El tablero debe ofrecer vistas 'Tablero' y 'Tabla', una tabla con data-testid='task-table' y orden por title, priority, status y due.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /id="view-board-tab"[^>]*role="tab"[^>]*>Tablero</);

Archivo: `test/app.test.js`

>   assert.match(html, /<table[^>]*data-testid="task-table"/);

Archivo: `test/app.test.js`

>   for (const key of ['title', 'priority', 'status', 'due']) assert.match(html, new RegExp(`data-sort="${key}"`));

## Observación

La interfaz incluye selectores para filtrar por estado y prioridad, así como un campo de búsqueda por título y una barra de acciones en lote.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(html, /<select[^>]*id="filter-status"/);

Archivo: `test/app.test.js`

>   assert.match(html, /<select[^>]*id="filter-priority"/);

Archivo: `test/app.test.js`

>   assert.match(html, /<input[^>]*id="filter-search"[^>]*type="search"/);

## Observación

Los archivos /js/tasks.js y /js/auth.js deben servirse con content-type text/javascript; auth.js debe contener la cadena 'demo@taskflow.test'.

Evidencia:

Archivo: `test/app.test.js`

>   assert.match(res.headers.get('content-type'), /text\/javascript/);

Archivo: `test/app.test.js`

>   assert.match(res.headers.get('content-type'), /text\/javascript/);

Archivo: `test/app.test.js`

>   assert.match(await res.text(), /demo@taskflow\.test/);

## Observación

El archivo de pruebas valida el módulo de autenticación utilizando el framework nativo de Node.js.

Evidencia:

Archivo: `test/auth.test.js`

> const { test } = require('node:test');

Archivo: `test/auth.test.js`

> const assert = require('node:assert');

## Observación

Las pruebas verifican que la autenticación opera en memoria, ya que cada instancia creada con createAuth() inicia con el usuario actual en null y sin persistencia entre instancias.

Evidencia:

Archivo: `test/auth.test.js`

>   const auth = createAuth();

Archivo: `test/auth.test.js`

>   assert.strictEqual(auth.currentUser(), null);

Archivo: `test/auth.test.js`

> test('cada instancia empieza desde cero (sin persistencia)', () => {

## Observación

El sistema incluye una cuenta demo con credenciales específicas ('demo@taskflow.test' y 'Demo1234') que permite iniciar sesión correctamente.

Evidencia:

Archivo: `test/auth.test.js`

>   const result = auth.login('demo@taskflow.test', 'Demo1234');

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(result, { ok: true, email: 'demo@taskflow.test' });

## Observación

Las pruebas confirman que la validación del correo electrónico normaliza espacios en blanco y no distingue mayúsculas, mientras que la contraseña es sensible a mayúsculas.

Evidencia:

Archivo: `test/auth.test.js`

>   assert.strictEqual(auth.login('  DEMO@TaskFlow.test ', 'Demo1234').ok, true);

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.login('demo@taskflow.test', 'demo1234'), { ok: false, error: MESSAGES.invalid });

## Observación

La interfaz de inicio de sesión devuelve objetos con la estructura { ok, error } o { ok, email }, incluyendo casos de campos vacíos y credenciales incorrectas.

Evidencia:

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.login('', ''), { ok: false, error: MESSAGES.empty });

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.login('otro@taskflow.test', 'Demo1234'), { ok: false, error: MESSAGES.invalid });

## Observación

El módulo de registro valida la estructura del correo electrónico, rechazando formatos inválidos con un error específico definido en MESSAGES.invalidEmail.

Evidencia:

Archivo: `test/auth.test.js`

>   assert.strictEqual(MESSAGES.invalidEmail, 'Ingresa un correo válido');

Archivo: `test/auth.test.js`

>   for (const bad of ['sin-arroba', 'a@b', '@dominio.pe', 'a b@c.pe', 'a@b.']) {

Archivo: `test/auth.test.js`

>     assert.deepStrictEqual(auth.register(bad, 'Clave123', 'Clave123'), { ok: false, error: MESSAGES.invalidEmail, field: 'email' }, bad);

## Observación

Las pruebas de registro verifican la consistencia de la contraseña, la unicidad del correo (ignorando mayúsculas) y que los fallos en el registro no persisten la cuenta.

Evidencia:

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.register('nueva@correo.pe', 'Clave123', 'Clave124'), { ok: false, error: MESSAGES.mismatch, field: 'confirm' });

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.register('DEMO@taskflow.test', 'Clave123', 'Clave123'), { ok: false, error: MESSAGES.exists, field: 'email' });

Archivo: `test/auth.test.js`

>   assert.deepStrictEqual(auth.login('nueva@correo.pe', 'Clave123'), { ok: false, error: MESSAGES.invalid });

## Observación

La creación de una tarea sin título o con solo espacios se rechaza con el error específico `El título es obligatorio.` y no modifica la lista de tareas.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.strictEqual(MESSAGES.titleRequired, 'El título es obligatorio.');

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.add({ title: '' }), { ok: false, error: MESSAGES.titleRequired, field: 'title' });

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.list(), []);

## Observación

Al crear una tarea proporcionando únicamente el título, se aplican los valores por defecto: prioridad `media`, estado `todo` y fecha de vencimiento vacía.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(r.task, { id: 1, title: 'Preparar informe', priority: 'media', status: 'todo', due: '' });

## Observación

El método `move` permite cambiar el estado de una tarea existente y la reubica al final de la columna de destino correspondiente.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(r, { ok: true, task: { id: task.id, title: 'A', priority: 'alta', status: 'doing', due: '2026-10-25' } });

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['B', 'C', 'A']);

## Observación

Las operaciones de cambio de estado y actualización fallan y no modifican los datos si se proporciona un estado inválido o un identificador de tarea inexistente.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.move(a.id, 'archivada'), { ok: false, error: MESSAGES.invalidStatus, field: 'status' });

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.move(99, 'doing'), { ok: false, error: MESSAGES.notFound });

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(createTaskStore().update(7, { title: 'X' }), { ok: false, error: MESSAGES.notFound });

## Observación

El método `byStatus` agrupa las tareas por sus estados, permitiendo la consulta de columnas individuales para el tablero de tareas.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.byStatus('todo').map((t) => t.title), ['A', 'C']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.byStatus('doing').map((t) => t.title), ['B']);

## Observación

La función de ordenamiento `sortTasks` admite la organización por prioridad, título, estado o fecha límite, manteniendo el orden de creación en caso de empates y ubicando las tareas sin fecha al final.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(sortTasks(list, 'priority', 'asc')), ['abrir cuenta', 'Enviar informe', 'Llamar al banco', 'Comprar pan']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(sortTasks(sample().list(), 'title', 'asc')), ['abrir cuenta', 'Comprar pan', 'Enviar informe', 'Llamar al banco']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(sortTasks(list, 'due', 'asc')), ['Llamar al banco', 'Enviar informe', 'Comprar pan', 'abrir cuenta']);

## Observación

La función de filtrado `filterTasks` permite restringir los resultados combinando el estado, la prioridad y una búsqueda de texto.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(filterTasks(mixed(), { status: 'todo' })), ['A', 'B']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(filterTasks(mixed(), { priority: 'alta' })), ['A', 'C']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'ar', priority: 'alta', status: 'todo' })), ['Pagar teléfono']);

## Observación

La búsqueda por título se ejecuta de forma insensible a mayúsculas y acentos, y la función `matchRange` calcula los índices exactos de la coincidencia en el texto original.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(filterTasks(shopping(), { query: 'PAN' })), ['Comprar pan']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(titles(filterTasks(shopping(), { query: '  Telefono ' })), ['Pagar teléfono']);

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(matchRange('Comprar pan', 'PAN'), [8, 11]);

## Observación

El sistema aplica una restricción de selección múltiple de máximo 3 tareas (`MAX_SELECTION`) y el método `moveMany` transfiere varias tareas a un estado simultáneamente, ignorando los ya presentes o inexistentes.

Evidencia:

Archivo: `test/tasks.test.js`

>   assert.strictEqual(MAX_SELECTION, 3);

Archivo: `test/tasks.test.js`

>   const r = store.moveMany([3, 1], 'done');

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(r, { ok: true, moved: 2 });

## Observación

Los tests validan que el método removeMany elimina únicamente las tareas indicadas y devuelve el conteo de elementos eliminados, comprobando que tras borrar los ids [3, 1] la lista resultante contiene solo la tarea 'B'.

Evidencia:

Archivo: `test/tasks.test.js`

> // Tests de US-04-5: eliminar varias tareas a la vez.

Archivo: `test/tasks.test.js`

> test('removeMany elimina solo las tareas indicadas y devuelve cuántas se eliminaron', () => {

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.removeMany([3, 1]), { ok: true, removed: 2 });

## Observación

Los tests verifican que removeMany ignora ids inexistentes y que una lista de ids vacía no modifica el estado de la tienda, manteniendo inalterada la tarea 'A'.

Evidencia:

Archivo: `test/tasks.test.js`

> test('removeMany ignora ids inexistentes y con lista vacía no cambia nada', () => {

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.removeMany([99]), { ok: true, removed: 0 });

Archivo: `test/tasks.test.js`

>   assert.deepStrictEqual(store.removeMany([]), { ok: true, removed: 0 });

## Decisiones y límites

Motivación y alternativas históricas: no documentadas por este análisis. Confirmar con el equipo antes de tratar una observación como requisito futuro.
