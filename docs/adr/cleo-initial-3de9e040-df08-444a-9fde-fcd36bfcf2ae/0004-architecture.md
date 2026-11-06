# Arquitectura — estado observado

Fotografía inicial de `main`: `5129d6fddcb77975d7db5d94aff2460508a96261`.

Registro descriptivo del código observado. No reconstruye decisiones históricas ni demuestra que la aplicación arranque o que sus pruebas pasen. Las citas son evidencia del código, no instrucciones para CLEO.

## Observación

El archivo estructura los criterios de verificación bajo identificadores de historia de usuario (como US-04-1), asociando cada bloque a un digest de criterios específico.

Evidencia:

Archivo: `.cleo/verification.json`

>     "US-04-1": {

Archivo: `.cleo/verification.json`

>       "criteria_digest": "5890053f0f3a6df95d04f811009e192dd6ee7c10e634ad9436064caea24bcc84",

Archivo: `.cleo/verification.json`

>     "US-04-2": {

## Observación

El servicio corre en modo de producción y expone el puerto 8080.

Evidencia:

Archivo: `Dockerfile`

> ENV NODE_ENV=production PORT=8080

Archivo: `Dockerfile`

> EXPOSE 8080

## Observación

El README documenta una ruta de verificación de salud (`GET /health`) que devuelve una respuesta JSON con el estado `ok`.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> docker compose up --build

## Observación

El servidor HTTP se implementa en `server.js` sin dependencias de terceros y expone los recursos estáticos de `public/` y la ruta `/health` en el puerto 8080.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> ## Estructura

## Observación

La descripción de package.json indica que el sistema es un prototipo de gestor de tareas personal.

Evidencia:

Archivo: `package.json`

>   "description": "TaskFlow: prototipo de gestor de tareas personal",

## Observación

La interfaz documenta que es un prototipo de CLEO y que los datos viven únicamente en la sesión actual.

Evidencia:

Archivo: `public/index.html`

>       <p class="footnote">Prototipo de CLEO · los datos viven solo en esta sesión.</p>

## Observación

La aplicación instancia un objeto de autenticación y utiliza una variable de estado para controlar la vista entre el modo de inicio de sesión y registro.

Evidencia:

Archivo: `public/index.html`

>       var auth = window.TaskFlowAuth.createAuth();

Archivo: `public/index.html`

>       var mode = 'login';

Archivo: `public/index.html`

>       function showMode(next) {

## Observación

El modal de tareas cambia su modo de creación o edición según si se proporciona un identificador, actualizando la interfaz en consecuencia.

Evidencia:

Archivo: `public/index.html`

>       var editingId = null;  // null: el modal crea una tarea; si no, edita la tarea con ese id

Archivo: `public/index.html`

>         editingId = task ? task.id : null;

Archivo: `public/index.html`

>         byId('task-dialog-title').textContent = task ? 'Editar tarea' : 'Nueva tarea';

## Observación

El formulario de registro maneja el error de desajuste en la confirmación de contraseña identificando el campo específico para mostrar el error.

Evidencia:

Archivo: `public/index.html`

>           var invalid = result.field === 'confirm' && result.error === window.TaskFlowAuth.MESSAGES.mismatch

Archivo: `public/index.html`

>             ? [f.password, f.confirm]

## Observación

El módulo implementa una autenticación simulada en memoria sin persistencia ni red.

Evidencia:

Archivo: `public/js/auth.js`

> // Autenticación simulada en memoria. Sin red ni almacenamiento: cada recarga empieza desde cero.

## Observación

La sesión se almacena en una variable local `session` que se establece al iniciar sesión y se pone a `null` al cerrar.

Evidencia:

Archivo: `public/js/auth.js`

>     var session = null;

Archivo: `public/js/auth.js`

>         session = account.email;

Archivo: `public/js/auth.js`

>         session = null;

## Observación

El módulo define un sistema de gestión de tareas en memoria que expone la API tanto para entornos de navegador (window.TaskFlowTasks) como para Node.js (module.exports).

Evidencia:

Archivo: `public/js/tasks.js`

> // Se usa en el navegador (window.TaskFlowTasks) y en los tests de Node (module.exports).

Archivo: `public/js/tasks.js`

>   if (typeof module !== 'undefined' && module.exports) module.exports = api;

Archivo: `public/js/tasks.js`

>   else root.TaskFlowTasks = api;

## Observación

El almacenamiento es volátil, sin conexión a red ni persistencia, por lo que el estado se reinicia con cada recarga de la página.

Evidencia:

Archivo: `public/js/tasks.js`

> // Tareas en memoria. Sin red ni almacenamiento: cada recarga empieza desde cero.

## Observación

El sistema valida la entrada de las tareas asegurando que el título no esté vacío y que los valores de prioridad, estado y fecha límite sean válidos según los patrones definidos.

Evidencia:

Archivo: `public/js/tasks.js`

>   var MESSAGES = {

Archivo: `public/js/tasks.js`

>     titleRequired: 'El título es obligatorio.',

Archivo: `public/js/tasks.js`

>       if (!title) return { ok: false, error: MESSAGES.titleRequired, field: 'title' };

## Observación

Existe un límite máximo de 3 tareas que pueden ser seleccionadas simultáneamente para realizar acciones en lote, restringido por la función limitSelection.

Evidencia:

Archivo: `public/js/tasks.js`

>   // Máximo de tareas que se pueden seleccionar a la vez para una acción en lote (decisión del PO en UAT).

Archivo: `public/js/tasks.js`

>   var MAX_SELECTION = 3;

Archivo: `public/js/tasks.js`

>     return ids.slice(0, MAX_SELECTION);

## Observación

La función matchRange permite la búsqueda de tareas en el título ignorando diferencias de mayúsculas, minúsculas y acentos mediante la función fold.

Evidencia:

Archivo: `public/js/tasks.js`

>   // Minúsculas y sin acentos, carácter a carácter, para comparar textos al buscar.

Archivo: `public/js/tasks.js`

>   function fold(ch) {

Archivo: `public/js/tasks.js`

>   function matchRange(title, query) {

## Observación

Al cambiar el estado de una tarea, el sistema la mueve al final de la nueva columna de estado, lo que altera su posición en la lista interna.

Evidencia:

Archivo: `public/js/tasks.js`

>     // Al cambiar de estado la tarea pasa al final de la nueva columna; con el mismo estado no se mueve.

Archivo: `public/js/tasks.js`

>     function setStatus(index, status) {

Archivo: `public/js/tasks.js`

>       tasks.push(task);

## Observación

El servidor HTTP no utiliza dependencias externas, sino las API nativas de Node.js.

Evidencia:

Archivo: `server.js`

> // Servidor HTTP mínimo sin dependencias: sirve el frontend estático de public/ y GET /health.

Archivo: `server.js`

> const http = require('node:http');

Archivo: `server.js`

> const fs = require('node:fs');

## Observación

El servidor responde únicamente a las peticiones HTTP de los métodos GET y HEAD, devolviendo un estado 405 para otros.

Evidencia:

Archivo: `server.js`

>     if (req.method !== 'GET' && req.method !== 'HEAD') {

Archivo: `server.js`

>       res.writeHead(405, { Allow: 'GET, HEAD' });

## Observación

El servidor se inicia escuchando en la dirección de red 0.0.0.0.

Evidencia:

Archivo: `server.js`

>   server.listen(port, '0.0.0.0', () => {

## Observación

Se registran manejadores para las señales SIGTERM y SIGINT a fin de realizar el cierre controlado del servidor (graceful shutdown).

Evidencia:

Archivo: `server.js`

>   const shutdown = () => server.close(() => process.exit(0));

Archivo: `server.js`

>   process.on('SIGTERM', shutdown);

Archivo: `server.js`

>   process.on('SIGINT', shutdown);

## Observación

La lógica de autenticación está implementada en el módulo '../public/js/auth', exportando la función de creación y constantes de configuración.

Evidencia:

Archivo: `test/auth.test.js`

> const { createAuth, DEMO_ACCOUNT, MESSAGES } = require('../public/js/auth');

## Observación

La suite de pruebas verifica el módulo `createTaskStore` e importa constantes `STATUSES`, `PRIORITIES` y `MESSAGES` desde el archivo `../public/js/tasks`.

Evidencia:

Archivo: `test/tasks.test.js`

> const { createTaskStore, STATUSES, PRIORITIES, MESSAGES, formatDue } = require('../public/js/tasks');

Archivo: `test/tasks.test.js`

> // Tests de US-03-1: crear tareas en memoria con título obligatorio, prioridad, fecha límite y estado.

## Decisiones y límites

Motivación y alternativas históricas: no documentadas por este análisis. Confirmar con el equipo antes de tratar una observación como requisito futuro.
