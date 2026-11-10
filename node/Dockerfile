# syntax=docker/dockerfile:1.7
# ---------- deps ----------
FROM node:22-alpine AS deps

# ---------- Common Git Stage ----------
FROM deps AS git-base

RUN --mount=type=cache,target=/var/cache/apt \
    apk update && \
    apk add git

# ----------- bff -------------

FROM git-base AS bff

WORKDIR /downloads

RUN git clone --depth=1 https://github.com/bearddaniel80-netizen/web-template.git

# ---------- runtime ----------
FROM deps AS runtime

WORKDIR /app

COPY --from=bff /downloads/web-template/node .

RUN --mount=type=cache,target=/root/.npm \
    npm install

CMD ["npm", "run", "dev"]