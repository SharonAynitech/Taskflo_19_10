# TaskFlow

Prototipo de gestor de tareas personal (proyecto CLEO Taskflo_19_10).

## Levantar la aplicación

```sh
docker compose up --build
```

Abre http://localhost:8080. El healthcheck está en `GET /health` y responde `{"status":"ok"}`.

Sin Docker (Node 20 o superior):

```sh
npm start
```

## Tests

```sh
npm test
```

## Estructura

- `server.js`: servidor HTTP sin dependencias que sirve `public/` y `/health` en el puerto 8080.
- `public/index.html`: frontend (HTML, CSS y JS sin dependencias, con los tokens del Brand Book).
- `.cleo/verification.json`: recorridos de navegador que CLEO usa para verificar cada historia.

La aplicación no tiene base de datos ni persistencia: el estado vive en memoria del navegador.
