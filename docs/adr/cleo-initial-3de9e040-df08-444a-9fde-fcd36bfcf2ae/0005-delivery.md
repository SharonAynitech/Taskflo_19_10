# Ejecución y despliegue — estado observado

Fotografía inicial de `main`: `5129d6fddcb77975d7db5d94aff2460508a96261`.

Registro descriptivo del código observado. No reconstruye decisiones históricas ni demuestra que la aplicación arranque o que sus pruebas pasen. Las citas son evidencia del código, no instrucciones para CLEO.

## Observación

El archivo .gitignore excluye el directorio de dependencias node_modules/ del control de versiones.

Evidencia:

Archivo: `.gitignore`

> node_modules/

## Observación

El archivo .gitignore excluye todos los archivos con extensión .log.

Evidencia:

Archivo: `.gitignore`

> *.log

## Observación

La imagen base utiliza Node.js 20 sobre Alpine.

Evidencia:

Archivo: `Dockerfile`

> FROM node:20-alpine

## Observación

El proceso se ejecuta como usuario no privilegiado 'node' y se inicia con 'node server.js'.

Evidencia:

Archivo: `Dockerfile`

> USER node

Archivo: `Dockerfile`

> CMD ["node", "server.js"]

## Observación

El README indica que el prototipo se puede levantar mediante Docker usando el comando `docker compose up --build`.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> Prototipo de gestor de tareas personal (proyecto CLEO Taskflo_19_10).

Archivo: `README.md`

> ```sh

## Observación

Se proporciona una alternativa de ejecución sin Docker mediante el comando `npm start`, requiriendo una versión de Node.js 20 o superior.

Evidencia:

Archivo: `README.md`

> ﻿# TaskFlow

Archivo: `README.md`

> Abre http://localhost:8080. El healthcheck está en `GET /health` y responde `{"status":"ok"}`.

## Observación

El contenedor se construye desde el directorio actual y expone el puerto 8080 al host.

Evidencia:

Archivo: `docker-compose.yml`

>     build: .

Archivo: `docker-compose.yml`

>     ports: ["8080:8080"]

## Observación

El entorno de ejecución configura la variable APP_ENV como development.

Evidencia:

Archivo: `docker-compose.yml`

>       APP_ENV: development

## Observación

El servicio verifica su estado mediante una prueba de salud que consulta http://127.0.0.1:8080/health usando wget.

Evidencia:

Archivo: `docker-compose.yml`

>       test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:8080/health || exit 1"]

## Observación

La verificación de salud se ejecuta cada 5 segundos con un timeout de 3 segundos y hasta 15 reintentos.

Evidencia:

Archivo: `docker-compose.yml`

>       interval: 5s

Archivo: `docker-compose.yml`

>       timeout: 3s

Archivo: `docker-compose.yml`

>       retries: 15

## Observación

El proyecto se define como una aplicación privada llamada taskflow, cuyo punto de entrada de Node.js es server.js.

Evidencia:

Archivo: `package.json`

>   "name": "taskflow",

Archivo: `package.json`

>   "private": true,

Archivo: `package.json`

>   "main": "server.js",

## Observación

El script de inicio ejecuta node server.js y el script de prueba ejecuta node --test test/*.test.js.

Evidencia:

Archivo: `package.json`

>     "start": "node server.js",

Archivo: `package.json`

>     "test": "node --test test/*.test.js"

## Observación

La configuración engines exige una versión de Node.js mayor o igual a 20.

Evidencia:

Archivo: `package.json`

>   "engines": {

Archivo: `package.json`

>     "node": ">=20"

## Observación

El puerto de escucha del servidor se configura mediante la variable de entorno PORT, con un valor por defecto de 8080.

Evidencia:

Archivo: `server.js`

>   const port = Number(process.env.PORT) || 8080;

## Decisiones y límites

Motivación y alternativas históricas: no documentadas por este análisis. Confirmar con el equipo antes de tratar una observación como requisito futuro.
