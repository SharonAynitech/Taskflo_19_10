# Dependencias — estado observado

Fotografía inicial de `main`: `5129d6fddcb77975d7db5d94aff2460508a96261`.

Registro descriptivo del código observado. No reconstruye decisiones históricas ni demuestra que la aplicación arranque o que sus pruebas pasen. Las citas son evidencia del código, no instrucciones para CLEO.

## Observación

La página carga módulos de autenticación y gestión de tareas desde archivos JavaScript externos.

Evidencia:

Archivo: `public/index.html`

>   <script src="/js/auth.js"></script>

Archivo: `public/index.html`

>   <script src="/js/tasks.js"></script>

## Decisiones y límites

Motivación y alternativas históricas: no documentadas por este análisis. Confirmar con el equipo antes de tratar una observación como requisito futuro.
