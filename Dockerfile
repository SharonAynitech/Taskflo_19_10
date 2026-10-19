# TaskFlow: servidor Node sin dependencias que sirve public/ y /health en 0.0.0.0:8080.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY package.json ./
COPY server.js ./
COPY public ./public
EXPOSE 8080
USER node
HEALTHCHECK --interval=5s --timeout=3s --retries=15 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
CMD ["node", "server.js"]
