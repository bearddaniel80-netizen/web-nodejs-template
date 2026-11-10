# syntax=docker/dockerfile:1.7

# ---------- build the Express API ----------
FROM node:20-bookworm-slim AS api-build
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# ---------- Python tooling stages: keep your existing deps / link / aql / compliance
# stages unchanged from the current Dockerfile ----------

# ---------- runtime ----------
FROM node:20-bookworm-slim AS runtime

WORKDIR /app
COPY --from=api-build /src/dist ./dist
COPY --from=api-build /src/node_modules ./node_modules
COPY package.json .

CMD ["node", "dist/server.js"]