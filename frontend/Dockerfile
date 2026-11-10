# syntax=docker/dockerfile:1.7
# ---------- deps ----------
FROM node:22-alpine AS deps

# ---------- Common Git Stage ----------
FROM deps AS git-base

RUN --mount=type=cache,target=/var/cache/apt \
    apk update && \
    apk add git

# ----------- frontend -------------

FROM git-base AS frontend

WORKDIR /downloads

RUN git clone --depth=1 https://github.com/bearddaniel80-netizen/web-template.git

# ----------- lib -------------

FROM git-base AS lib

WORKDIR /components

RUN git clone --depth=1 https://github.com/bearddaniel80-netizen/react-component-lib.git

# ---------- runtime ----------
FROM deps AS runtime

WORKDIR /app

COPY --from=frontend /downloads/web-template/frontend .

# To generate docs
# RUN npm run docs
RUN mkdir -p src/components

COPY --from=lib /components/react-component-lib src/components

RUN --mount=type=cache,target=/root/.npm \
    npm install

CMD ["npm", "run", "dev"]