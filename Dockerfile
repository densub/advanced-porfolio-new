# Multi-stage build for Vite + React → static files on Cloud Run (listens on $PORT).
# Cloud Build: source location /Dockerfile (repo root).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Vite build-time env: pass with `docker build --build-arg VITE_*=...` or Cloud Build substitutions if needed
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Tiny static server; `-s` = SPA fallback for react-router
RUN npm install -g serve@14
COPY --from=build /app/dist ./dist

# Cloud Run injects PORT; default matches typical local preview
ENV PORT=8080
EXPOSE 8080

USER node
# serve defaults to 0.0.0.0; Cloud Run sets PORT
CMD ["sh", "-c", "exec serve -s dist -p ${PORT:-8080}"]
