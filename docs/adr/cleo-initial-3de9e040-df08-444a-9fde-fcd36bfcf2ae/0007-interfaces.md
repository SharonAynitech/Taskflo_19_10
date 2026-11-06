# Interfaces e integraciones — estado observado

Fotografía inicial de `main`: `5129d6fddcb77975d7db5d94aff2460508a96261`.

Registro descriptivo del código observado. No reconstruye decisiones históricas ni demuestra que la aplicación arranque o que sus pruebas pasen. Las citas son evidencia del código, no instrucciones para CLEO.

## Observación

El código se expone como `window.TaskFlowAuth` en el navegador y mediante `module.exports` en Node.js.

Evidencia:

Archivo: `public/js/auth.js`

> // Se usa en el navegador (window.TaskFlowAuth) y en los tests de Node (module.exports).

Archivo: `public/js/auth.js`

>   if (typeof module !== 'undefined' && module.exports) module.exports = api;

Archivo: `public/js/auth.js`

>   else root.TaskFlowAuth = api;

## Observación

La función `login` verifica credenciales contra una lista de cuentas y devuelve `{ ok: false }` con `MESSAGES.invalid` si no coincide.

Evidencia:

Archivo: `public/js/auth.js`

>       login: function (email, password) {

Archivo: `public/js/auth.js`

>         if (!account || account.password !== password) return { ok: false, error: MESSAGES.invalid };

## Observación

La función `register` valida campos obligatorios, formato de email, existencia previa y coincidencia de contraseñas antes de crear la sesión.

Evidencia:

Archivo: `public/js/auth.js`

>       register: function (email, password, confirm) {

Archivo: `public/js/auth.js`

>         if (!key) return fail(MESSAGES.registerEmpty, 'email');

Archivo: `public/js/auth.js`

>         if (!EMAIL_PATTERN.test(key)) return fail(MESSAGES.invalidEmail, 'email');

## Observación

La función createServer se exporta explícitamente, permitiendo su importación desde otros módulos.

Evidencia:

Archivo: `server.js`

> module.exports = { createServer };

## Decisiones y límites

Motivación y alternativas históricas: no documentadas por este análisis. Confirmar con el equipo antes de tratar una observación como requisito futuro.
